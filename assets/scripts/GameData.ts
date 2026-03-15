/**
 * GameData.ts - 全局游戏状态管理（单例）
 * 对应 H5 原型中的 gd / bs / dailyTasks 全局对象
 */

export interface PetConfig {
  index: number;
  name: string;
  icon: string;
  type: string;
  desc: string;
  maxHp: number;
  atk: number;
  def: number;
}

export interface PlayerData {
  petIndex: number;
  petName: string;
  petIcon: string;
  petType: string;
  level: number;
  exp: number;
  vocab: number;
  hp: number;
  maxHp: number;
  coins: number;
  stamina: number;
  maxStamina: number;
  settings: { sound: boolean; lang: string };
}

export interface DailyTask {
  id: string;
  name: string;
  desc: string;
  reward: string;
  progress: number;
  target: number;
  done: boolean;
}

export interface BattleResult {
  win: boolean;
  correctCount: number;
  expGained: number;
  coinsGained: number;
}

/** 宠物配置表 */
export const PET_CONFIGS: PetConfig[] = [
  { index: 0, name: '小火球', icon: '⚔️', type: '攻击型', desc: '高攻击/低血量，适合词汇量丰富的玩家', maxHp: 80, atk: 15, def: 5 },
  { index: 1, name: '护盾龟', icon: '🛡️', type: '防御型', desc: '高血量/高防御，容错率高，适合初学者', maxHp: 120, atk: 8, def: 15 },
  { index: 2, name: '闪电狐', icon: '⚡', type: '速度型', desc: '速度快/抢先手，考验手速与反应力', maxHp: 100, atk: 12, def: 8 },
];

/** 副本配置 */
export const DUNGEON_CONFIGS = [
  { id: 'forest', name: '森林冒险', icon: '🌲', desc: '适合初学者，Lv.1~10', levelMin: 1, levelMax: 10, staminaCost: 10, monsterName: '野生史莱姆', monsterHp: 150 },
  { id: 'cave', name: '洞穴探险', icon: '⛰️', desc: '中等难度，Lv.5~20', levelMin: 5, levelMax: 20, staminaCost: 10, monsterName: '岩石哥布林', monsterHp: 180 },
  { id: 'volcano', name: '火山试炼', icon: '🌋', desc: '高难度，Lv.15+', levelMin: 15, levelMax: 99, staminaCost: 10, monsterName: '熔岩巨龙', monsterHp: 220 },
];

/** 每日任务默认配置 */
export const DAILY_TASK_CONFIGS = [
  { id: 'battle', name: '击败怪物', desc: '击败 3 只怪物', reward: '🪙×30', target: 3 },
  { id: 'correct', name: '答对题目', desc: '答对 10 道英语题', reward: '⭐×20', target: 10 },
  { id: 'interact', name: '宠物互动', desc: '与宠物互动 3 次', reward: '⚡×15', target: 3 },
  { id: 'levelup', name: '宠物升级', desc: '宠物升一级', reward: '🪙×50', target: 1 },
];

/** 主游戏数据管理器（单例） */
export class GameData {
  private static _inst: GameData | null = null;

  static get inst(): GameData {
    if (!GameData._inst) {
      GameData._inst = new GameData();
      GameData._inst.init();
    }
    return GameData._inst;
  }

  /** 玩家数据 */
  player: PlayerData = {
    petIndex: -1,
    petName: '',
    petIcon: '',
    petType: '',
    level: 1,
    exp: 0,
    vocab: 0,
    hp: 100,
    maxHp: 100,
    coins: 0,
    stamina: 100,
    maxStamina: 100,
    settings: { sound: true, lang: 'zh' },
  };

  /** 每日任务 */
  dailyTasks: DailyTask[] = [];

  /** 最近一场战斗结果 */
  lastBattleResult: BattleResult | null = null;

  /** 是否已领养宠物 */
  get hasPet(): boolean {
    return this.player.petIndex >= 0;
  }

  /** 当前词库段 */
  get wordLevel(): number {
    return Math.min(4, Math.floor(this.player.level / 10) + 1);
  }

  private init() {
    this.loadFromStorage();
    this.initDailyTasks();
  }

  /** 领养宠物 */
  adoptPet(petIndex: number) {
    const cfg = PET_CONFIGS[petIndex];
    if (!cfg) return;
    this.player.petIndex = petIndex;
    this.player.petName = cfg.name;
    this.player.petIcon = cfg.icon;
    this.player.petType = cfg.type;
    this.player.maxHp = cfg.maxHp;
    this.player.hp = cfg.maxHp;
    this.saveToStorage();
  }

  /** 与宠物互动 */
  interact() {
    this.player.stamina = Math.min(this.player.stamina + 5, this.player.maxStamina);
    this.progressTask('interact', 1);
    this.saveToStorage();
  }

  /** 扣除体力（进入战斗） */
  consumeStamina(amount: number): boolean {
    if (this.player.stamina < amount) return false;
    this.player.stamina -= amount;
    this.saveToStorage();
    return true;
  }

  /** 结算战斗结果 */
  settleBattle(win: boolean, correctCount: number) {
    let expGained = 0;
    let coinsGained = 0;

    if (win) {
      expGained = 20 + correctCount * 5;
      coinsGained = 15 + correctCount * 3;
      this.player.exp += expGained;
      this.player.coins += coinsGained;
      this.player.vocab += correctCount;

      // 升级检测
      const expNeeded = 50;
      while (this.player.exp >= expNeeded) {
        this.player.exp -= expNeeded;
        this.player.level += 1;
        this.player.maxHp += 10;
        this.player.hp = this.player.maxHp;
        this.progressTask('levelup', 1);
      }

      this.progressTask('battle', 1);
      this.progressTask('correct', correctCount);
    }

    this.lastBattleResult = { win, correctCount, expGained, coinsGained };
    this.saveToStorage();
  }

  /** 战斗结束时同步 HP 并结算（BattleScene 调用） */
  settleWithHp(finalHp: number, win: boolean, correctCount: number) {
    this.player.hp = Math.max(0, finalHp);
    this.settleBattle(win, correctCount);
  }

  /** 受到伤害 */
  takeDamage(amount: number) {
    this.player.hp = Math.max(0, this.player.hp - amount);
    this.saveToStorage();
  }

  /** 回满 HP */
  healFull() {
    this.player.hp = this.player.maxHp;
    this.saveToStorage();
  }

  /** 失败后扣血（不回血） */
  onBattleLose() {
    this.lastBattleResult = { win: false, correctCount: 0, expGained: 0, coinsGained: 0 };
  }

  // ---- 每日任务 ----
  private initDailyTasks() {
    if (this.dailyTasks.length === 0) {
      this.dailyTasks = DAILY_TASK_CONFIGS.map(cfg => ({
        ...cfg,
        progress: 0,
        done: false,
      }));
    }
  }

  progressTask(id: string, delta: number) {
    const task = this.dailyTasks.find(t => t.id === id);
    if (task && !task.done) {
      task.progress = Math.min(task.progress + delta, task.target);
      if (task.progress >= task.target) task.done = true;
    }
  }

  // ---- 持久化 ----
  saveToStorage() {
    try {
      const data = JSON.stringify({ player: this.player, dailyTasks: this.dailyTasks });
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordgame_save', data);
      }
    } catch (e) { /* ignore */ }
  }

  loadFromStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('wordgame_save');
        if (raw) {
          const data = JSON.parse(raw);
          if (data.player) Object.assign(this.player, data.player);
          if (data.dailyTasks) this.dailyTasks = data.dailyTasks;
        }
      }
    } catch (e) { /* ignore */ }
  }

  /** 重置存档（调试用） */
  resetSave() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('wordgame_save');
    }
    GameData._inst = null;
  }
}
