/**
 * MineScene.ts - 「我的」场景控制器（Cocos Creator 3.x）
 */
import { _decorator, Component, Label, Toggle, director } from 'cc';
import { GameData } from './GameData';

const { ccclass, property } = _decorator;

@ccclass('MineScene')
export class MineScene extends Component {
  @property(Label) petAvatarLabel: Label = null!;
  @property(Label) petNameLabel: Label = null!;
  @property(Label) levelLabel: Label = null!;
  @property(Label) coinsLabel: Label = null!;
  @property(Label) vocabLabel: Label = null!;
  @property(Label) staminaLabel: Label = null!;
  @property(Toggle) soundToggle: Toggle = null!;

  start() {
    this.updateUI();
  }

  onEnable() {
    this.updateUI();
  }

  updateUI() {
    const p = GameData.inst.player;
    if (this.petAvatarLabel) this.petAvatarLabel.string = p.petIcon;
    if (this.petNameLabel) this.petNameLabel.string = p.petName || '冒险者';
    if (this.levelLabel) this.levelLabel.string = `Lv.${p.level} · ${p.petType}`;
    if (this.coinsLabel) this.coinsLabel.string = String(p.coins);
    if (this.vocabLabel) this.vocabLabel.string = String(p.vocab);
    if (this.staminaLabel) this.staminaLabel.string = String(p.stamina);
    if (this.soundToggle) this.soundToggle.isChecked = p.settings.sound;
  }

  onSoundToggle(toggle: Toggle) {
    GameData.inst.player.settings.sound = toggle.isChecked;
    GameData.inst.saveToStorage();
  }

  onTabHome() { director.loadScene('HomeScene'); }
  onTabDungeon() { director.loadScene('DungeonScene'); }
  onTabMine() { /* 当前页 */ }
}
