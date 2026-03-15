/**
 * BattleScene.ts - 战斗场景控制器（Cocos Creator 3.x 组件）
 * 包含普通答题 + FEVER 配对消除
 */
import {
  _decorator, Component, Node, Label, ProgressBar,
  Button, tween, Vec3, director, Color, UIOpacity, Sprite
} from 'cc';
import { GameData } from './GameData';
import { WordBank, WordEntry } from './WordBank';
import { BattleSystem, BATTLE_CONFIG } from './BattleSystem';
import { DUNGEON_CONFIGS } from './GameData';

const { ccclass, property } = _decorator;

@ccclass('BattleScene')
export class BattleScene extends Component {
  // ---- 敌人区 ----
  @property(Label) monsterNameLabel: Label = null!;
  @property(ProgressBar) monsterHpBar: ProgressBar = null!;
  @property(Label) monsterHpLabel: Label = null!;
  @property(Node) monsterNode: Node = null!;

  // ---- 倒计时 ----
  @property(Label) timerLabel: Label = null!;
  @property(ProgressBar) timerBar: ProgressBar = null!;

  // ---- 普通答题区 ----
  @property(Node) normalPanel: Node = null!;
  @property(Label) questionLabel: Label = null!;
  @property(Button[]) optionBtns: Button[] = [];
  @property(Label[]) optionLabels: Label[] = [];

  // ---- FEVER 区 ----
  @property(Node) feverPanel: Node = null!;
  @property(Label) feverLabel: Label = null!;
  @property(Node[]) leftItems: Node[] = [];   // 左侧中文词
  @property(Node[]) rightItems: Node[] = [];  // 右侧英文词
  @property(Label[]) leftLabels: Label[] = [];
  @property(Label[]) rightLabels: Label[] = [];

  // ---- 己方区 ----
  @property(Label) petNameLabel: Label = null!;
  @property(ProgressBar) playerHpBar: ProgressBar = null!;
  @property(Label) playerHpLabel: Label = null!;

  // ---- 连击 & 加载 ----
  @property(Label) comboLabel: Label = null!;
  @property(Node) loadingNode: Node = null!;

  // ---- 内部状态 ----
  private _battle: BattleSystem | null = null;
  private _timerScheduled = false;
  private _currentCorrect: WordEntry | null = null;
  private _currentOptions: WordEntry[] = [];
  private _feverPairs: WordEntry[] = [];
  private _feverRemoved: boolean[] = []; // 哪些对已被消除
  private _feverTimer = 0;
  private _dungeonId = 'forest';

  onLoad() {
    // 从全局取副本 ID（由副本站页面写入）
    const stored = (window as any).__selectedDungeonId || 'forest';
    this._dungeonId = stored;
  }

  async start() {
    if (this.loadingNode) this.loadingNode.active = true;
    if (this.normalPanel) this.normalPanel.active = false;
    if (this.feverPanel) this.feverPanel.active = false;

    // 加载词库
    await WordBank.inst.load();

    if (this.loadingNode) this.loadingNode.active = false;

    // 初始化战斗
    const dungeonCfg = DUNGEON_CONFIGS.find(d => d.id === this._dungeonId) || DUNGEON_CONFIGS[0];
    const gd = GameData.inst;
    this._battle = new BattleSystem(
      dungeonCfg.monsterName,
      dungeonCfg.monsterHp,
      gd.player.hp,
      gd.player.maxHp
    );

    this.updateBattleUI();
    this.nextQuestion();
    this.startTimer();
  }

  // ============ 普通答题 ============

  private nextQuestion() {
    if (!this._battle || this._battle.state.isOver) return;
    if (this._battle.state.phase !== 'normal') return;

    if (this.normalPanel) this.normalPanel.active = true;
    if (this.feverPanel) this.feverPanel.active = false;

    const gd = GameData.inst;
    const { correct, options } = WordBank.inst.generateQuestion(gd.wordLevel);
    this._currentCorrect = correct;
    this._currentOptions = options;

    if (this.questionLabel) this.questionLabel.string = correct.cn;
    this.optionLabels.forEach((lbl, i) => {
      if (lbl) lbl.string = options[i]?.en || '';
    });
    this.optionBtns.forEach(btn => {
      if (btn) btn.interactable = true;
    });

    // 重置倒计时
    this._battle.state.timeLeft = BATTLE_CONFIG.NORMAL_TIMER;
    this.updateTimerUI();
  }

  /** 点击选项（customData = 选项序号 0~3） */
  onSelectOption(event: Event, customData: string) {
    if (!this._battle || this._battle.state.isOver) return;
    const idx = parseInt(customData);
    const chosen = this._currentOptions[idx];
    const isCorrect = chosen?.en === this._currentCorrect?.en;

    // 禁用所有选项按钮（防双击）
    this.optionBtns.forEach(btn => { if (btn) btn.interactable = false; });

    const result = this._battle.answerQuestion(isCorrect);
    this.updateBattleUI();
    this.showAnswerFeedback(idx, isCorrect);

    if (result.gameOver) {
      this.scheduleOnce(() => this.endBattle(result.win), 0.8);
      return;
    }

    if (result.feverTriggered) {
      this.scheduleOnce(() => this.enterFever(), 0.5);
    } else {
      this.scheduleOnce(() => this.nextQuestion(), 0.5);
    }
  }

  private showAnswerFeedback(selectedIdx: number, correct: boolean) {
    // 颜色反馈：正确绿/错误红（实际 Cocos 中操作 Sprite color）
    // 此处逻辑体现
    if (this.comboLabel && this._battle) {
      const combo = this._battle.state.combo;
      this.comboLabel.string = combo > 1 ? `🔥 ${combo} 连击!` : '';
    }
  }

  // ============ FEVER 模式 ============

  private enterFever() {
    if (!this._battle) return;
    if (this.normalPanel) this.normalPanel.active = false;
    if (this.feverPanel) this.feverPanel.active = true;
    if (this.feverLabel) this.feverLabel.string = '⚡ FEVER! 快速配对消除!';

    this.loadFeverPairs();
    this._feverTimer = BATTLE_CONFIG.FEVER_DURATION;
  }

  private loadFeverPairs() {
    const gd = GameData.inst;
    this._feverPairs = WordBank.inst.generateFeverPairs(gd.wordLevel, BATTLE_CONFIG.FEVER_PAIRS_COUNT);
    this._feverRemoved = new Array(this._feverPairs.length).fill(false);

    // 更新左侧（中文）与右侧（英文，打乱）
    const shuffledRight = [...this._feverPairs].sort(() => Math.random() - 0.5);
    this.leftLabels.forEach((lbl, i) => {
      if (lbl) lbl.string = this._feverPairs[i]?.cn || '';
      if (this.leftItems[i]) this.leftItems[i].active = true;
    });
    this.rightLabels.forEach((lbl, i) => {
      if (lbl) lbl.string = shuffledRight[i]?.en || '';
      if (this.rightItems[i]) this.rightItems[i].active = true;
    });

    // 存储右侧打乱顺序（用于匹配）
    (this as any)._shuffledRight = shuffledRight;

    if (this._battle) this._battle.state.feverPairs = this._feverPairs;
  }

  /** 点击左侧词（customData = 序号） */
  onSelectLeft(event: Event, customData: string) {
    if (!this._battle) return;
    const idx = parseInt(customData);
    this._battle.selectLeft(idx);
    // 高亮选中
    this.leftItems.forEach((item, i) => {
      // 实际 Cocos 中改 Sprite color
    });
  }

  /** 点击右侧词（customData = 序号） */
  onSelectRight(event: Event, customData: string) {
    if (!this._battle) return;
    const idx = parseInt(customData);
    const shuffledRight: WordEntry[] = (this as any)._shuffledRight || [];

    // 将右侧词映射回左侧配对（找对应的 feverPairs index）
    const rightWord = shuffledRight[idx];
    const leftIdx = this._battle.state.selectedLeft;
    if (leftIdx < 0) return;

    const leftWord = this._feverPairs[leftIdx];
    const isMatch = leftWord && rightWord && leftWord.en === rightWord.en;

    if (isMatch) {
      // 找右侧原本的索引
      const rightOrigIdx = idx;
      const result = this._battle.matchRight(rightOrigIdx, shuffledRight);
      this.onFeverMatch(leftIdx, rightOrigIdx, true, result.damage, result.allCleared);

      if (result.gameOver) {
        this.scheduleOnce(() => this.endBattle(result.win), 0.5);
      } else if (result.allCleared) {
        this.scheduleOnce(() => this.loadFeverPairs(), 0.6);
      }
    } else {
      // 错误：震动反馈
      this.shakeNode(this.rightItems[idx]);
      this._battle.state.selectedLeft = -1;
    }

    this.updateBattleUI();
  }

  private onFeverMatch(leftIdx: number, rightIdx: number, correct: boolean, damage: number, allCleared: boolean) {
    if (correct) {
      // 消除动画
      const doRemove = (node: Node | undefined) => {
        if (!node) return;
        tween(node)
          .to(0.15, { scale: new Vec3(1.1, 1.1, 1) })
          .to(0.15, { scale: new Vec3(0, 0, 0) })
          .call(() => { node.active = false; })
          .start();
      };
      this.scheduleOnce(() => {
        doRemove(this.leftItems[leftIdx]);
        doRemove(this.rightItems[rightIdx]);
      }, 0.2);

      // 显示伤害
      if (this.feverLabel) this.feverLabel.string = `⚡ FEVER! -${damage} 💥`;
    }
  }

  private shakeNode(node: Node | undefined) {
    if (!node) return;
    const origin = node.position.clone();
    tween(node)
      .by(0.05, { position: new Vec3(8, 0, 0) })
      .by(0.05, { position: new Vec3(-16, 0, 0) })
      .by(0.05, { position: new Vec3(16, 0, 0) })
      .by(0.05, { position: new Vec3(-8, 0, 0) })
      .call(() => { node.setPosition(origin); })
      .start();
  }

  // ============ 定时器 ============

  private startTimer() {
    this.schedule(this.onTick, 1);
  }

  private onTick() {
    if (!this._battle || this._battle.state.isOver) {
      this.unschedule(this.onTick);
      return;
    }

    if (this._battle.state.phase === 'normal') {
      this._battle.state.timeLeft -= 1;
      this.updateTimerUI();
      if (this._battle.state.timeLeft <= 0) {
        const result = this._battle.onTimeout();
        this.updateBattleUI();
        if (result.gameOver) {
          this.endBattle(result.win);
        } else {
          this.scheduleOnce(() => this.nextQuestion(), 0.3);
        }
      }
    } else if (this._battle.state.phase === 'fever') {
      this._feverTimer -= 1;
      this._battle.state.feverTimeLeft = this._feverTimer;
      this.updateTimerUI();
      if (this._feverTimer <= 0) {
        this._battle.exitFever();
        this.scheduleOnce(() => this.nextQuestion(), 0.3);
      }
    }
  }

  private updateTimerUI() {
    if (!this._battle) return;
    const phase = this._battle.state.phase;
    if (phase === 'normal') {
      const t = this._battle.state.timeLeft;
      if (this.timerLabel) this.timerLabel.string = String(t);
      if (this.timerBar) this.timerBar.progress = t / BATTLE_CONFIG.NORMAL_TIMER;
    } else if (phase === 'fever') {
      const t = this._feverTimer;
      if (this.timerLabel) this.timerLabel.string = String(t);
      if (this.timerBar) this.timerBar.progress = t / BATTLE_CONFIG.FEVER_DURATION;
    }
  }

  // ============ UI 更新 ============

  private updateBattleUI() {
    if (!this._battle) return;
    const s = this._battle.state;

    if (this.monsterNameLabel) this.monsterNameLabel.string = s.monsterName;
    if (this.monsterHpBar) this.monsterHpBar.progress = this._battle.getMonsterHpPercent();
    if (this.monsterHpLabel) this.monsterHpLabel.string = `${s.monsterHp}/${s.monsterMaxHp}`;
    if (this.playerHpBar) this.playerHpBar.progress = this._battle.getPlayerHpPercent();
    if (this.playerHpLabel) this.playerHpLabel.string = `HP ${s.playerHp}/${s.playerMaxHp}`;

    const gd = GameData.inst;
    if (this.petNameLabel) this.petNameLabel.string = `${gd.player.petIcon} ${gd.player.petName}`;
  }

  // ============ 结算 ============

  private endBattle(win: boolean) {
    this.unschedule(this.onTick);
    const battle = this._battle!;

    // 写入 GameData
    GameData.inst.settleWithHp(battle.state.playerHp, win, battle.state.correctCount);

    // 存储结果到全局
    (window as any).__battleWin = win;

    director.loadScene('ResultScene');
  }
}
