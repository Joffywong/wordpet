/**
 * HomeScene.ts - 宠物主页场景控制器（Cocos Creator 3.x 组件）
 */
import { _decorator, Component, Node, Label, ProgressBar, Button, tween, Vec3, director } from 'cc';
import { GameData } from './GameData';

const { ccclass, property } = _decorator;

@ccclass('HomeScene')
export class HomeScene extends Component {
  // ---- 顶部 Header ----
  @property(Label) levelLabel: Label = null!;
  @property(Label) vocabLabel: Label = null!;
  @property(Label) coinsLabel: Label = null!;
  @property(Label) staminaLabel: Label = null!;
  @property(ProgressBar) staminaBar: ProgressBar = null!;

  // ---- 宠物区 ----
  @property(Node) petAvatar: Node = null!;
  @property(Label) petNameLabel: Label = null!;
  @property(Label) petLevelLabel: Label = null!;
  @property(ProgressBar) petHpBar: ProgressBar = null!;
  @property(Label) petHpLabel: Label = null!;
  @property(ProgressBar) expBar: ProgressBar = null!;
  @property(Label) expLabel: Label = null!;

  // ---- 每日任务 ----
  @property(Node) taskList: Node = null!;
  @property(Node) taskItemPrefab: Node = null!;
  @property(Node) taskToggleBtn: Node = null!;

  private _taskExpanded = false;

  onLoad() {
    // 如果没有宠物，跳回领养页
    if (!GameData.inst.hasPet) {
      director.loadScene('SelectScene');
      return;
    }
  }

  start() {
    this.updateUI();
    this.startPetIdleAnim();
  }

  onEnable() {
    this.updateUI();
  }

  updateUI() {
    const gd = GameData.inst;
    const p = gd.player;

    // Header
    if (this.levelLabel) this.levelLabel.string = `Lv.${p.level}`;
    if (this.vocabLabel) this.vocabLabel.string = `词汇: ${p.vocab}`;
    if (this.coinsLabel) this.coinsLabel.string = `🪙 ${p.coins}`;
    if (this.staminaLabel) this.staminaLabel.string = `⚡ ${p.stamina}/${p.maxStamina}`;
    if (this.staminaBar) this.staminaBar.progress = p.stamina / p.maxStamina;

    // 宠物区
    if (this.petNameLabel) this.petNameLabel.string = `${p.petIcon} ${p.petName}`;
    if (this.petLevelLabel) this.petLevelLabel.string = `Lv.${p.level}`;
    if (this.petHpBar) this.petHpBar.progress = p.maxHp > 0 ? p.hp / p.maxHp : 0;
    if (this.petHpLabel) this.petHpLabel.string = `HP ${p.hp}/${p.maxHp}`;
    if (this.expBar) this.expBar.progress = p.exp / 50;
    if (this.expLabel) this.expLabel.string = `EXP ${p.exp}/50`;

    // 任务列表
    this.refreshTaskList();
  }

  /** 宠物待机浮动动画 */
  private startPetIdleAnim() {
    if (!this.petAvatar) return;
    tween(this.petAvatar)
      .by(1.2, { position: new Vec3(0, 8, 0) }, { easing: 'sineInOut' })
      .by(1.2, { position: new Vec3(0, -8, 0) }, { easing: 'sineInOut' })
      .union()
      .repeatForever()
      .start();
  }

  /** 点击宠物互动 */
  onInteract() {
    GameData.inst.interact();
    this.updateUI();
    // 宠物放大反馈
    if (this.petAvatar) {
      tween(this.petAvatar)
        .to(0.1, { scale: new Vec3(1.2, 1.2, 1) })
        .to(0.1, { scale: new Vec3(1, 1, 1) })
        .start();
    }
  }

  /** 展开/收起每日任务 */
  onToggleTasks() {
    this._taskExpanded = !this._taskExpanded;
    if (this.taskList) {
      this.taskList.active = this._taskExpanded;
    }
  }

  private refreshTaskList() {
    if (!this.taskList) return;
    // 实际 Cocos 场景中此处会根据 prefab 动态生成 task item
    // 此处仅更新逻辑，具体 UI 绑定在编辑器中完成
  }

  // ---- 底部 Tab 切换 ----
  onTabHome() { /* 当前页 */ }
  onTabDungeon() { director.loadScene('DungeonScene'); }
  onTabMine() { director.loadScene('MineScene'); }
}
