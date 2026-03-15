/**
 * ResultScene.ts - 结算场景控制器（Cocos Creator 3.x）
 */
import { _decorator, Component, Label, director } from 'cc';
import { GameData } from './GameData';

const { ccclass, property } = _decorator;

@ccclass('ResultScene')
export class ResultScene extends Component {
  @property(Label) titleLabel: Label = null!;
  @property(Label) subLabel: Label = null!;
  @property(Label) correctLabel: Label = null!;
  @property(Label) expLabel: Label = null!;
  @property(Label) coinsLabel: Label = null!;
  @property(Label) vocabLabel: Label = null!;

  start() {
    this.showResult();
  }

  private showResult() {
    const res = GameData.inst.lastBattleResult;
    if (!res) { director.loadScene('HomeScene'); return; }

    if (this.titleLabel) {
      this.titleLabel.string = res.win ? '🏆 胜利!' : '💔 失败…';
    }
    if (this.subLabel) {
      this.subLabel.string = res.win ? '太棒了！继续加油！' : '再努力一下，你可以的！';
    }
    if (this.correctLabel) this.correctLabel.string = `${res.correctCount} 题`;
    if (this.expLabel) this.expLabel.string = res.win ? `+${res.expGained} EXP` : '—';
    if (this.coinsLabel) this.coinsLabel.string = res.win ? `+${res.coinsGained} 🪙` : '—';
    if (this.vocabLabel) this.vocabLabel.string = res.win ? `+${res.correctCount}` : '—';
  }

  onBack() {
    director.loadScene('HomeScene');
  }
}
