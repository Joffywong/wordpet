/**
 * DungeonScene.ts - 副本站场景控制器（Cocos Creator 3.x）
 */
import { _decorator, Component, Node, Label, Button, director } from 'cc';
import { GameData, DUNGEON_CONFIGS } from './GameData';

const { ccclass, property } = _decorator;

@ccclass('DungeonScene')
export class DungeonScene extends Component {
  @property(Node) dungeonListNode: Node = null!;
  @property(Node) dungeonItemPrefab: Node = null!;

  start() {
    this.buildList();
  }

  private buildList() {
    // 实际 Cocos 中：遍历 DUNGEON_CONFIGS，实例化 dungeonItemPrefab 并设置文本
    DUNGEON_CONFIGS.forEach(cfg => {
      // const item = instantiate(this.dungeonItemPrefab);
      // item.getComponent(DungeonItem).setup(cfg);
      // this.dungeonListNode.addChild(item);
    });
  }

  /** 进入副本（Cocos 按钮回调，customData = dungeonId） */
  onEnterDungeon(event: Event, customData: string) {
    const dungeonId = customData;
    const cfg = DUNGEON_CONFIGS.find(d => d.id === dungeonId);
    if (!cfg) return;

    const gd = GameData.inst;
    if (gd.player.stamina < cfg.staminaCost) {
      // 弹出提示
      return;
    }

    if (!gd.consumeStamina(cfg.staminaCost)) return;

    // 传递副本 ID，跳到探索地图（而非直接跳战斗）
    (globalThis as any).__selectedDungeonId = dungeonId;
    director.loadScene('ExploreMapScene');
  }

  // ---- Tab ----
  onTabHome() { director.loadScene('HomeScene'); }
  onTabDungeon() { /* 当前页 */ }
  onTabMine() { director.loadScene('MineScene'); }
}
