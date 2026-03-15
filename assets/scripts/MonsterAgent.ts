/**
 * MonsterAgent.ts - 怪物 AI 代理（明雷、随机巡逻）
 *
 * 特性：
 * - 明雷（在地图上可见，不触发随机遭遇）
 * - 随机巡逻游走（在指定范围内随机选点移动）
 * - 玩家主动碰撞（走入怪物碰撞圆内）才触发战斗
 * - 接触后播放感叹号动画，通知 ExploreMapScene 进入战斗
 * - 扁平2D风格：简洁圆形+颜色区分怪物类型
 */
import { _decorator, Component, Node, Vec2, Vec3, tween, Tween, Label, UIOpacity, EventTarget } from 'cc';
import { playerEvents, PLAYER_MOVED } from './PlayerController';

const { ccclass, property } = _decorator;

/** 怪物遭遇事件总线 */
export const monsterEvents = new EventTarget();
export const MONSTER_ENCOUNTER = 'monster-encounter';   // 携带 MonsterAgent 实例

export interface MonsterConfig {
  id: string;
  name: string;
  hp: number;
  color: string;       // 扁平2D颜色标识（CSS 颜色字符串，用于H5预览）
  emoji: string;       // 怪物图标（备用）
  roamRadius: number;  // 巡逻半径（px）
  speed: number;       // 移动速度（px/s）
  triggerRadius: number; // 触碰触发战斗半径（px）
  level: number;       // 怪物等级
}

export const MONSTER_CONFIGS: { [dungeonId: string]: MonsterConfig[] } = {
  forest: [
    { id: 'slime_green', name: '绿色史莱姆', hp: 150, color: '#52c41a', emoji: '🟢', roamRadius: 100, speed: 55, triggerRadius: 40, level: 1 },
    { id: 'slime_blue',  name: '蓝色史莱姆', hp: 130, color: '#1677ff', emoji: '🔵', roamRadius: 80,  speed: 45, triggerRadius: 40, level: 1 },
    { id: 'mushroom',    name: '小蘑菇怪',   hp: 160, color: '#d4380d', emoji: '🍄', roamRadius: 60,  speed: 35, triggerRadius: 38, level: 2 },
  ],
  cave: [
    { id: 'goblin',      name: '岩石哥布林', hp: 180, color: '#722ed1', emoji: '👺', roamRadius: 120, speed: 65, triggerRadius: 42, level: 5 },
    { id: 'bat',         name: '洞穴蝙蝠',   hp: 140, color: '#8c8c8c', emoji: '🦇', roamRadius: 150, speed: 80, triggerRadius: 36, level: 4 },
    { id: 'golem_small', name: '小石傀儡',   hp: 200, color: '#7c3aed', emoji: '🪨', roamRadius: 50,  speed: 30, triggerRadius: 50, level: 6 },
  ],
  volcano: [
    { id: 'lava_lizard', name: '熔岩蜥蜴',   hp: 200, color: '#f5222d', emoji: '🦎', roamRadius: 130, speed: 75, triggerRadius: 44, level: 15 },
    { id: 'fire_imp',    name: '火焰小鬼',   hp: 170, color: '#fa8c16', emoji: '😈', roamRadius: 160, speed: 90, triggerRadius: 38, level: 14 },
    { id: 'magma_golem', name: '岩浆傀儡',   hp: 250, color: '#a8071a', emoji: '🌋', roamRadius: 70,  speed: 25, triggerRadius: 55, level: 16 },
  ],
};

@ccclass('MonsterAgent')
export class MonsterAgent extends Component {

  @property({ displayName: '怪物配置 ID（填入 MonsterConfig.id）' })
  configId: string = 'slime_green';

  @property({ displayName: '所属副本 ID' })
  dungeonId: string = 'forest';

  @property({ displayName: '感叹号节点（子节点）' })
  exclamationNode: Node | null = null;

  // ---- 运行时配置 ----
  config: MonsterConfig | null = null;
  private _origin = new Vec2(0, 0);       // 出生点（巡逻中心）
  private _target = new Vec2(0, 0);       // 当前目标点
  private _moving = false;
  private _encountered = false;           // 已触发遭遇，防止重复触发
  private _waitTimer = 0;                 // 到达目标后等待时间

  // ============================
  //  生命周期
  // ============================
  protected onLoad(): void {
    // 初始化配置
    const cfgs = MONSTER_CONFIGS[this.dungeonId];
    if (cfgs) {
      this.config = cfgs.find(c => c.id === this.configId) ?? cfgs[0];
    }

    // 记录出生位置作为巡逻中心
    this._origin.set(this.node.position.x, this.node.position.y);
    this._pickNewTarget();
  }

  protected onEnable(): void {
    playerEvents.on(PLAYER_MOVED, this._onPlayerMoved, this);
  }

  protected onDisable(): void {
    playerEvents.off(PLAYER_MOVED, this._onPlayerMoved, this);
    Tween.stopAllByTarget(this.node);
  }

  protected update(dt: number): void {
    if (this._encountered || !this.config) return;

    if (this._moving) {
      // 朝目标移动
      const pos = this.node.position;
      const dx = this._target.x - pos.x;
      const dy = this._target.y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const step = this.config.speed * dt;

      if (dist < step + 1) {
        // 到达目标，等待再随机
        this.node.setPosition(this._target.x, this._target.y, 0);
        this._moving = false;
        this._waitTimer = 0.5 + Math.random() * 1.5; // 0.5~2s 随机等待
      } else {
        const nx = pos.x + (dx / dist) * step;
        const ny = pos.y + (dy / dist) * step;
        this.node.setPosition(nx, ny, 0);
      }
    } else {
      // 等待计时
      this._waitTimer -= dt;
      if (this._waitTimer <= 0) {
        this._pickNewTarget();
      }
    }
  }

  // ============================
  //  巡逻逻辑
  // ============================
  private _pickNewTarget() {
    if (!this.config) return;
    const r = this.config.roamRadius;
    const angle = Math.random() * Math.PI * 2;
    const dist  = Math.random() * r;
    this._target.set(
      this._origin.x + Math.cos(angle) * dist,
      this._origin.y + Math.sin(angle) * dist,
    );
    this._moving = true;
  }

  // ============================
  //  遭遇检测
  // ============================
  private _onPlayerMoved(playerPos: Vec2) {
    if (this._encountered || !this.config) return;

    const pos = this.node.position;
    const dx = playerPos.x - pos.x;
    const dy = playerPos.y - pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.config.triggerRadius) {
      this._triggerEncounter();
    }
  }

  private _triggerEncounter() {
    this._encountered = true;
    this._moving = false;
    Tween.stopAllByTarget(this.node);

    // 显示感叹号动画
    if (this.exclamationNode) {
      const opacity = this.exclamationNode.getComponent(UIOpacity);
      this.exclamationNode.active = true;
      this.exclamationNode.setScale(0.5, 0.5, 1);

      tween(this.exclamationNode)
        .to(0.12, { scale: new Vec3(1.3, 1.3, 1) })
        .to(0.08, { scale: new Vec3(1, 1, 1) })
        .delay(0.35)
        .call(() => {
          // 感叹号消失后通知场景进入遭遇转场
          monsterEvents.emit(MONSTER_ENCOUNTER, this);
        })
        .start();
    } else {
      // 无感叹号节点，直接触发
      setTimeout(() => {
        monsterEvents.emit(MONSTER_ENCOUNTER, this);
      }, 300);
    }
  }

  /** 重置怪物状态（战斗返回后用） */
  resetEncounter() {
    this._encountered = false;
    this._pickNewTarget();
  }

  /** 怪物被击败，播放消失动画后销毁 */
  playDefeatAnimation(onComplete?: () => void) {
    tween(this.node)
      .to(0.15, { scale: new Vec3(1.3, 1.3, 1) })
      .to(0.3, { scale: new Vec3(0, 0, 0) })
      .call(() => {
        this.node.active = false;
        onComplete?.();
      })
      .start();
  }
}
