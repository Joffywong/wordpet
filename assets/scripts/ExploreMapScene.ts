/**
 * ExploreMapScene.ts - 副本探索地图场景控制器
 *
 * 功能：
 * - 扁平 2D 俯视角地图（程序生成，无 TileMap 依赖）
 * - 管理玩家控制器 + 多只怪物 AI
 * - 监听怪物遭遇事件 → 触发转场 → 跳转战斗
 * - 地图主题（森林/洞穴/火山）对应不同背景色与装饰物
 * - 虚拟摇杆（移动端）
 *
 * 场景节点结构（Cocos 编辑器中搭建）：
 * ┌── Canvas
 * │   ├── MapBackground        ← 地图底色（Sprite/Graphics 节点）
 * │   ├── MapDecorations       ← 地图装饰（树/石块等扁平图形）
 * │   ├── MonsterLayer         ← 所有怪物节点的父节点
 * │   ├── PlayerNode           ← 玩家角色节点（挂 PlayerController）
 * │   ├── UILayer              ← HUD（右上角信息、返回按钮）
 * │   │   ├── DungeonNameLabel
 * │   │   ├── MonsterCountLabel
 * │   │   └── BackButton
 * │   ├── JoystickArea         ← 移动端虚拟摇杆区域
 * │   ├── BlackOverlay         ← 遭遇转场黑幕
 * │   ├── FlashOverlay         ← 遭遇转场白光
 * │   └── EncounterTransitionNode  ← 挂 EncounterTransition 组件
 */
import {
  _decorator, Component, Node, Label, director, Vec2, Vec3,
  tween, Tween, UIOpacity, EventTouch, input, Input
} from 'cc';
import { GameData, DUNGEON_CONFIGS } from './GameData';
import { PlayerController } from './PlayerController';
import { MonsterAgent, MonsterConfig, MONSTER_CONFIGS, monsterEvents, MONSTER_ENCOUNTER } from './MonsterAgent';
import { EncounterTransition } from './EncounterTransition';

const { ccclass, property } = _decorator;

// ---- 地图主题配置 ----
interface MapTheme {
  bgColor: string;      // 地图底色（扁平风格）
  groundColor: string;  // 地面颜色
  treeColor: string;    // 装饰物颜色
  ambientName: string;  // BGM 标识
  decorIcon: string;    // 装饰物图标（H5 备用）
}

const MAP_THEMES: { [dungeonId: string]: MapTheme } = {
  forest: {
    bgColor: '#e8f5e9',       // 浅绿背景
    groundColor: '#a5d6a7',   // 草地绿
    treeColor: '#2e7d32',     // 深绿树
    ambientName: 'bgm_forest',
    decorIcon: '🌲',
  },
  cave: {
    bgColor: '#263238',       // 深灰背景
    groundColor: '#37474f',   // 石板灰
    treeColor: '#546e7a',     // 岩石蓝灰
    ambientName: 'bgm_cave',
    decorIcon: '🪨',
  },
  volcano: {
    bgColor: '#3e1c00',       // 深褐背景
    groundColor: '#bf360c',   // 熔岩红
    treeColor: '#d84315',     // 火焰橙
    ambientName: 'bgm_volcano',
    decorIcon: '🌋',
  },
};

// ---- 地图怪物布局（每个副本的初始位置） ----
const MONSTER_SPAWN_POINTS: { [dungeonId: string]: { x: number; y: number; configId: string }[] } = {
  forest: [
    { x: -250, y:  150, configId: 'slime_green' },
    { x:  200, y:  200, configId: 'slime_blue'  },
    { x: -100, y: -180, configId: 'mushroom'    },
    { x:  300, y: -100, configId: 'slime_green' },
    { x: -300, y:  -50, configId: 'slime_blue'  },
    { x:   50, y:  280, configId: 'mushroom'    },
  ],
  cave: [
    { x: -200, y:  100, configId: 'goblin'      },
    { x:  250, y:  150, configId: 'bat'         },
    { x: -100, y: -200, configId: 'golem_small' },
    { x:  300, y:  -80, configId: 'goblin'      },
    { x: -280, y: -150, configId: 'bat'         },
    { x:   80, y:  220, configId: 'golem_small' },
  ],
  volcano: [
    { x: -230, y:  120, configId: 'lava_lizard' },
    { x:  220, y:  180, configId: 'fire_imp'    },
    { x: -80,  y: -190, configId: 'magma_golem' },
    { x:  280, y: -120, configId: 'lava_lizard' },
    { x: -300, y: -200, configId: 'fire_imp'    },
    { x:   60, y:  260, configId: 'magma_golem' },
  ],
};

@ccclass('ExploreMapScene')
export class ExploreMapScene extends Component {

  // ---- 场景节点绑定 ----
  @property(Node) mapBackground: Node = null!;
  @property(Node) mapDecorations: Node = null!;
  @property(Node) monsterLayer: Node = null!;
  @property(Node) playerNode: Node = null!;
  @property(Node) uiLayer: Node = null!;
  @property(Label) dungeonNameLabel: Label = null!;
  @property(Label) monsterCountLabel: Label = null!;
  @property(Node) joystickArea: Node = null!;
  @property(Node) blackOverlay: Node = null!;
  @property(Node) flashOverlay: Node = null!;
  @property(Node) encounterTransitionNode: Node = null!;

  /** 怪物 Prefab（由编辑器绑定；如果没有则程序生成占位节点） */
  @property(Node) monsterPrefab: Node | null = null;

  // ---- 运行时状态 ----
  private _dungeonId: string = 'forest';
  private _theme: MapTheme = MAP_THEMES['forest'];
  private _playerCtrl: PlayerController | null = null;
  private _transition: EncounterTransition | null = null;
  private _monsters: MonsterAgent[] = [];
  private _defeatedCount = 0;
  private _totalMonsters = 0;
  private _inTransition = false;

  // 虚拟摇杆
  private _joystickActive = false;
  private _joystickCenter = new Vec2(0, 0);
  private _joystickCurrent = new Vec2(0, 0);

  // ============================
  //  生命周期
  // ============================
  protected onLoad(): void {
    // 读取副本 ID
    this._dungeonId = (globalThis as any).__selectedDungeonId ?? 'forest';
    this._theme = MAP_THEMES[this._dungeonId] ?? MAP_THEMES['forest'];

    // 绑定组件
    this._playerCtrl = this.playerNode?.getComponent(PlayerController) ?? null;
    this._transition = this.encounterTransitionNode?.getComponent(EncounterTransition) ?? null;
  }

  protected start(): void {
    this._setupMap();
    this._setupUI();
    this._spawnMonsters();
    this._setupJoystick();

    // 监听怪物遭遇
    monsterEvents.on(MONSTER_ENCOUNTER, this._onEncounter, this);

    // 入场淡入
    this._transition?.playReturnTransition();
  }

  protected onDestroy(): void {
    monsterEvents.off(MONSTER_ENCOUNTER, this._onEncounter, this);
  }

  // ============================
  //  地图初始化
  // ============================
  private _setupMap() {
    // 设置地图边界
    this._playerCtrl?.setMapBounds(-540, 540, -460, 460);
  }

  private _setupUI() {
    const cfg = DUNGEON_CONFIGS.find(d => d.id === this._dungeonId);
    if (cfg && this.dungeonNameLabel) {
      this.dungeonNameLabel.string = cfg.name;
    }
    this._updateMonsterCount();
  }

  private _updateMonsterCount() {
    const alive = this._monsters.filter(m => m.node.active).length;
    if (this.monsterCountLabel) {
      this.monsterCountLabel.string = `怪物 ${alive}/${this._totalMonsters}`;
    }
  }

  // ============================
  //  怪物生成
  // ============================
  private _spawnMonsters() {
    const spawns = MONSTER_SPAWN_POINTS[this._dungeonId] ?? [];
    this._totalMonsters = spawns.length;

    spawns.forEach(spawn => {
      // 实例化怪物节点（如有 Prefab 则用 instantiate，否则创建占位）
      let monsterNode: Node;
      if (this.monsterPrefab) {
        const { instantiate } = require('cc');
        monsterNode = instantiate(this.monsterPrefab);
      } else {
        monsterNode = new Node(`Monster_${spawn.configId}`);
      }

      monsterNode.setPosition(spawn.x, spawn.y, 0);
      this.monsterLayer?.addChild(monsterNode);

      // 挂载或获取 MonsterAgent 组件
      let agent = monsterNode.getComponent(MonsterAgent);
      if (!agent) {
        agent = monsterNode.addComponent(MonsterAgent);
      }
      agent.configId = spawn.configId;
      agent.dungeonId = this._dungeonId;

      this._monsters.push(agent);
    });
  }

  // ============================
  //  遭遇处理
  // ============================
  private _onEncounter(agent: MonsterAgent) {
    if (this._inTransition) return;
    this._inTransition = true;

    const cfg = agent.config;
    if (!cfg) return;

    // 设置战斗参数到全局，BattleScene 读取
    (globalThis as any).__selectedDungeonId = this._dungeonId;
    (globalThis as any).__encounterMonsterId = cfg.id;
    (globalThis as any).__encounterMonsterConfig = cfg;

    // 播放转场
    this._transition?.playEncounterTransition(() => {
      // 转场黑屏时记录怪物被击败（乐观处理：进战斗=算打过）
      this._defeatedCount++;
      agent.node.active = false;
      this._updateMonsterCount();
    });

    // 备用：无 EncounterTransition 组件时直接跳场景
    if (!this._transition) {
      setTimeout(() => director.loadScene('BattleScene'), 400);
    }
  }

  // ============================
  //  虚拟摇杆（移动端）
  // ============================
  private _setupJoystick() {
    if (!this.joystickArea) return;

    this.joystickArea.on(Node.EventType.TOUCH_START, (e: EventTouch) => {
      this._joystickActive = true;
      const loc = e.getUILocation();
      this._joystickCenter.set(loc.x, loc.y);
      this._joystickCurrent.set(loc.x, loc.y);
    }, this);

    this.joystickArea.on(Node.EventType.TOUCH_MOVE, (e: EventTouch) => {
      if (!this._joystickActive) return;
      const loc = e.getUILocation();
      this._joystickCurrent.set(loc.x, loc.y);

      const dx = this._joystickCurrent.x - this._joystickCenter.x;
      const dy = this._joystickCurrent.y - this._joystickCenter.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const maxLen = 60; // 摇杆最大偏移

      if (len > 0) {
        const nx = Math.min(len, maxLen) / maxLen * (dx / len);
        const ny = Math.min(len, maxLen) / maxLen * (dy / len);
        this._playerCtrl?.setJoystickInput(nx, ny);
      }
    }, this);

    const stopJoystick = () => {
      this._joystickActive = false;
      this._playerCtrl?.stopJoystick();
    };
    this.joystickArea.on(Node.EventType.TOUCH_END, stopJoystick, this);
    this.joystickArea.on(Node.EventType.TOUCH_CANCEL, stopJoystick, this);
  }

  // ============================
  //  按钮回调
  // ============================
  onBackToDungeon() {
    director.loadScene('DungeonScene');
  }
}
