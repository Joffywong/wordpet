/**
 * SelectScene.ts - 领养宠物场景控制器（Cocos Creator 3.x 组件）
 */
import { _decorator, Component, Node, Label, Button, Sprite, Color, tween, Vec3 } from 'cc';
import { GameData, PET_CONFIGS } from './GameData';

const { ccclass, property } = _decorator;

@ccclass('SelectScene')
export class SelectScene extends Component {
  @property(Node) petCards: Node[] = [];       // 3 张宠物卡
  @property(Label) petNameLabels: Label[] = []; // 3 个名称标签
  @property(Label) petTypeLabels: Label[] = []; // 3 个类型标签
  @property(Label) petDescLabels: Label[] = []; // 3 个描述标签
  @property(Label) petHpLabels: Label[] = [];   // 3 个 HP 标签
  @property(Button) startBtn: Button = null!;

  private _selectedIndex = -1;

  start() {
    this.initCards();
    this.updateStartBtn();
  }

  private initCards() {
    PET_CONFIGS.forEach((cfg, i) => {
      if (this.petNameLabels[i]) this.petNameLabels[i].string = cfg.icon + ' ' + cfg.name;
      if (this.petTypeLabels[i]) this.petTypeLabels[i].string = cfg.type;
      if (this.petDescLabels[i]) this.petDescLabels[i].string = cfg.desc;
      if (this.petHpLabels[i]) this.petHpLabels[i].string = `HP: ${cfg.maxHp}`;
    });
  }

  /** 点击宠物卡（绑定 Button 事件，传入 customEventData=0/1/2） */
  onSelectPet(event: Event, customData: string) {
    const idx = parseInt(customData);
    this._selectedIndex = idx;
    this.petCards.forEach((card, i) => {
      if (card) {
        // 选中卡片放大，其余恢复
        const scale = i === idx ? 1.08 : 1.0;
        tween(card).to(0.1, { scale: new Vec3(scale, scale, 1) }).start();
      }
    });
    this.updateStartBtn();
  }

  private updateStartBtn() {
    if (this.startBtn) {
      this.startBtn.interactable = this._selectedIndex >= 0;
    }
  }

  /** 点击「开始冒险」 */
  onStartAdventure() {
    if (this._selectedIndex < 0) return;
    GameData.inst.adoptPet(this._selectedIndex);
    // 跳转主页
    const { director } = require('cc');
    director.loadScene('HomeScene');
  }
}
