/**
 * BattleSystem.ts - 战斗核心逻辑
 * 管理战斗状态、伤害计算、FEVER 模式
 */

import { WordEntry } from './WordBank';

export interface BattleState {
  phase: 'normal' | 'fever' | 'result';
  monsterHp: number;
  monsterMaxHp: number;
  monsterName: string;
  playerHp: number;
  playerMaxHp: number;
  combo: number;           // 连对数
  correctCount: number;    // 本场答对题数
  timeLeft: number;        // 当前题目剩余时间
  feverTimeLeft: number;   // FEVER 剩余时间
  feverTotalMatched: number; // FEVER 本场已消除对数
  feverPairs: WordEntry[]; // 当前 FEVER 一组词对
  selectedLeft: number;    // FEVER 中选中的左侧序号（-1=未选）
  isOver: boolean;
  win: boolean;
}

/** 战斗数值常量（见文档04） */
export const BATTLE_CONFIG = {
  NORMAL_ANSWER_DAMAGE: 12,    // 单题基础伤害
  COMBO_BONUS_RATE: 0.15,      // 连击加成 15%/次
  WRONG_PENALTY_HP: 15,        // 答错/超时扣己方血量
  FEVER_TRIGGER_COMBO: 3,      // 连对多少次触发 FEVER
  FEVER_DURATION: 5,           // FEVER 持续秒数
  FEVER_PAIR_DAMAGE: 15,       // FEVER 单对基础伤害
  FEVER_MULTIPLIER: 1.2,       // FEVER 每对额外倍率（累乘）
  NORMAL_TIMER: 15,            // 普通题倒计时（秒）
  FEVER_PAIRS_COUNT: 4,        // FEVER 一组词对数量
};

export class BattleSystem {
  state: BattleState;

  constructor(monsterName: string, monsterHp: number, playerHp: number, playerMaxHp: number) {
    this.state = {
      phase: 'normal',
      monsterHp,
      monsterMaxHp: monsterHp,
      monsterName,
      playerHp,
      playerMaxHp,
      combo: 0,
      correctCount: 0,
      timeLeft: BATTLE_CONFIG.NORMAL_TIMER,
      feverTimeLeft: BATTLE_CONFIG.FEVER_DURATION,
      feverTotalMatched: 0,
      feverPairs: [],
      selectedLeft: -1,
      isOver: false,
      win: false,
    };
  }

  /** 是否处于战斗中 */
  get isActive(): boolean {
    return !this.state.isOver;
  }

  // ============ 普通答题 ============

  /** 玩家选择答案 */
  answerQuestion(isCorrect: boolean): {
    damage: number;
    feverTriggered: boolean;
    gameOver: boolean;
    win: boolean;
  } {
    let damage = 0;
    let feverTriggered = false;

    if (isCorrect) {
      this.state.combo += 1;
      this.state.correctCount += 1;

      // 计算伤害（含连击加成）
      damage = Math.floor(
        BATTLE_CONFIG.NORMAL_ANSWER_DAMAGE * (1 + BATTLE_CONFIG.COMBO_BONUS_RATE * this.state.combo)
      );
      this.dealDamageToMonster(damage);

      // 检测 FEVER 触发
      if (this.state.combo >= BATTLE_CONFIG.FEVER_TRIGGER_COMBO) {
        feverTriggered = true;
        this.state.combo = 0;
        this.state.phase = 'fever';
        this.state.feverTimeLeft = BATTLE_CONFIG.FEVER_DURATION;
      }
    } else {
      this.state.combo = 0;
      this.playerTakeDamage(BATTLE_CONFIG.WRONG_PENALTY_HP);
    }

    this.checkGameOver();
    return { damage, feverTriggered, gameOver: this.state.isOver, win: this.state.win };
  }

  /** 答题超时（视为答错） */
  onTimeout(): { gameOver: boolean; win: boolean } {
    this.state.combo = 0;
    this.playerTakeDamage(BATTLE_CONFIG.WRONG_PENALTY_HP);
    this.checkGameOver();
    return { gameOver: this.state.isOver, win: this.state.win };
  }

  // ============ FEVER 模式 ============

  /** 选中左侧词 */
  selectLeft(index: number) {
    this.state.selectedLeft = index;
  }

  /** 尝试与右侧词配对 */
  matchRight(rightIndex: number, feverPairs: WordEntry[]): {
    correct: boolean;
    damage: number;
    allCleared: boolean;
    gameOver: boolean;
    win: boolean;
  } {
    const leftIndex = this.state.selectedLeft;
    if (leftIndex < 0) return { correct: false, damage: 0, allCleared: false, gameOver: false, win: false };

    const leftWord = feverPairs[leftIndex];
    const rightWord = feverPairs[rightIndex];
    const isMatch = leftWord && rightWord && leftWord.en === rightWord.en;

    this.state.selectedLeft = -1;

    if (isMatch) {
      this.state.feverTotalMatched += 1;
      const damage = Math.floor(
        BATTLE_CONFIG.FEVER_PAIR_DAMAGE * Math.pow(BATTLE_CONFIG.FEVER_MULTIPLIER, this.state.feverTotalMatched)
      );
      this.dealDamageToMonster(damage);
      this.checkGameOver();

      // 检查是否全部消除
      const allCleared = this.state.feverTotalMatched % BATTLE_CONFIG.FEVER_PAIRS_COUNT === 0;
      return { correct: true, damage, allCleared, gameOver: this.state.isOver, win: this.state.win };
    } else {
      return { correct: false, damage: 0, allCleared: false, gameOver: this.state.isOver, win: this.state.win };
    }
  }

  /** FEVER 倒计时结束 → 回普通题 */
  exitFever() {
    this.state.phase = 'normal';
    this.state.timeLeft = BATTLE_CONFIG.NORMAL_TIMER;
    this.state.selectedLeft = -1;
  }

  // ============ 内部方法 ============

  private dealDamageToMonster(damage: number) {
    this.state.monsterHp = Math.max(0, this.state.monsterHp - damage);
  }

  private playerTakeDamage(damage: number) {
    this.state.playerHp = Math.max(0, this.state.playerHp - damage);
  }

  private checkGameOver() {
    if (this.state.monsterHp <= 0) {
      this.state.isOver = true;
      this.state.win = true;
      this.state.phase = 'result';
    } else if (this.state.playerHp <= 0) {
      this.state.isOver = true;
      this.state.win = false;
      this.state.phase = 'result';
    }
  }

  /** 获取 HP 百分比 */
  getMonsterHpPercent(): number {
    return this.state.monsterMaxHp > 0 ? this.state.monsterHp / this.state.monsterMaxHp : 0;
  }

  getPlayerHpPercent(): number {
    return this.state.playerMaxHp > 0 ? this.state.playerHp / this.state.playerMaxHp : 0;
  }
}
