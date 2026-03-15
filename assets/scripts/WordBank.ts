/**
 * WordBank.ts - 词库管理模块
 * 负责加载 wordbank.json，并按玩家等级段随机出题
 */

export interface WordEntry {
  cn: string;
  en: string;
}

export interface WordLevel {
  name: string;
  minLevel: number;
  maxLevel: number;
  words: WordEntry[];
}

export interface WordBankData {
  version: string;
  description: string;
  levels: { [key: string]: WordLevel };
}

/** 内联兜底词库（加载失败时使用） */
const FALLBACK_WORDBANK: WordBankData = {
  version: '1.0',
  description: '兜底词库',
  levels: {
    '1': {
      name: '小学基础', minLevel: 1, maxLevel: 10,
      words: [
        { cn: '火', en: 'Fire' }, { cn: '水', en: 'Water' }, { cn: '草', en: 'Grass' },
        { cn: '电', en: 'Electric' }, { cn: '冰', en: 'Ice' }, { cn: '风', en: 'Wind' },
        { cn: '攻击', en: 'Attack' }, { cn: '防御', en: 'Defend' }, { cn: '治疗', en: 'Heal' },
        { cn: '跑', en: 'Run' }, { cn: '跳', en: 'Jump' }, { cn: '走', en: 'Walk' },
        { cn: '大', en: 'Big' }, { cn: '小', en: 'Small' }, { cn: '快', en: 'Fast' },
        { cn: '慢', en: 'Slow' }, { cn: '好', en: 'Good' }, { cn: '坏', en: 'Bad' },
        { cn: '红', en: 'Red' }, { cn: '蓝', en: 'Blue' },
      ]
    },
    '2': {
      name: '初中基础', minLevel: 11, maxLevel: 20,
      words: [
        { cn: '力量', en: 'Power' }, { cn: '速度', en: 'Speed' }, { cn: '雷电', en: 'Thunder' },
        { cn: '火焰', en: 'Flame' }, { cn: '风暴', en: 'Storm' }, { cn: '治愈', en: 'Cure' },
        { cn: '学习', en: 'Learn' }, { cn: '朋友', en: 'Friend' }, { cn: '城市', en: 'City' },
        { cn: '医生', en: 'Doctor' }, { cn: '老师', en: 'Teacher' }, { cn: '学生', en: 'Student' },
        { cn: '太阳', en: 'Sun' }, { cn: '月亮', en: 'Moon' }, { cn: '星星', en: 'Star' },
        { cn: '森林', en: 'Forest' }, { cn: '海', en: 'Sea' }, { cn: '山', en: 'Mountain' },
        { cn: '希望', en: 'Hope' }, { cn: '帮助', en: 'Help' },
      ]
    },
    '3': {
      name: '高中四级', minLevel: 21, maxLevel: 30,
      words: [
        { cn: '爆炸', en: 'Explosion' }, { cn: '毁灭', en: 'Destruction' }, { cn: '冲刺', en: 'Sprint' },
        { cn: '屏障', en: 'Barrier' }, { cn: '地震', en: 'Earthquake' }, { cn: '火山', en: 'Volcano' },
        { cn: '决定', en: 'Decide' }, { cn: '理解', en: 'Understand' }, { cn: '发现', en: 'Discover' },
        { cn: '创造', en: 'Create' }, { cn: '成功', en: 'Success' }, { cn: '努力', en: 'Effort' },
        { cn: '目标', en: 'Goal' }, { cn: '选择', en: 'Choice' }, { cn: '计划', en: 'Plan' },
        { cn: '勇气', en: 'Courage' }, { cn: '智慧', en: 'Wisdom' }, { cn: '知识', en: 'Knowledge' },
        { cn: '技能', en: 'Skill' }, { cn: '能力', en: 'Ability' },
      ]
    },
    '4': {
      name: '进阶挑战', minLevel: 31, maxLevel: 99,
      words: [
        { cn: '系统', en: 'System' }, { cn: '过程', en: 'Process' }, { cn: '方法', en: 'Method' },
        { cn: '原则', en: 'Principle' }, { cn: '分析', en: 'Analysis' }, { cn: '研究', en: 'Research' },
        { cn: '影响', en: 'Influence' }, { cn: '效果', en: 'Effect' }, { cn: '证据', en: 'Evidence' },
        { cn: '观点', en: 'Perspective' }, { cn: '技术', en: 'Technology' }, { cn: '信息', en: 'Information' },
        { cn: '网络', en: 'Network' }, { cn: '合作', en: 'Cooperation' }, { cn: '竞争', en: 'Competition' },
        { cn: '战略', en: 'Strategy' }, { cn: '质量', en: 'Quality' }, { cn: '效率', en: 'Efficiency' },
        { cn: '安全', en: 'Security' }, { cn: '挑战', en: 'Challenge' },
      ]
    }
  }
};

export class WordBank {
  private static _inst: WordBank | null = null;
  private _data: WordBankData | null = null;
  private _loaded = false;

  static get inst(): WordBank {
    if (!WordBank._inst) WordBank._inst = new WordBank();
    return WordBank._inst;
  }

  get isLoaded(): boolean { return this._loaded; }

  /** 加载词库（Cocos 中可传入 asset，H5 可通过 fetch） */
  async load(jsonData?: WordBankData): Promise<void> {
    if (jsonData) {
      this._data = jsonData;
      this._loaded = true;
      return;
    }
    // 尝试 fetch（H5 环境）
    try {
      const res = await fetch('wordbank.json');
      if (res.ok) {
        this._data = await res.json();
        this._loaded = true;
        return;
      }
    } catch (e) { /* fallback */ }
    this._data = FALLBACK_WORDBANK;
    this._loaded = true;
  }

  /** 根据词库段随机取出 n 个词 */
  getWords(wordLevel: number, count: number): WordEntry[] {
    const data = this._data || FALLBACK_WORDBANK;
    const levelKey = String(Math.min(4, Math.max(1, wordLevel)));
    const levelData = data.levels[levelKey];
    if (!levelData || levelData.words.length === 0) return [];
    const shuffled = [...levelData.words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /** 
   * 生成一道选择题：返回正确词条 + 3 个干扰项 
   * @param wordLevel 词库段
   * @param correctWord 指定正确词（可选，不传则随机）
   */
  generateQuestion(wordLevel: number, correctWord?: WordEntry): {
    correct: WordEntry;
    options: WordEntry[]; // 4 个选项（已打乱）
  } {
    const data = this._data || FALLBACK_WORDBANK;
    const levelKey = String(Math.min(4, Math.max(1, wordLevel)));
    const pool = data.levels[levelKey]?.words || FALLBACK_WORDBANK.levels['1'].words;

    if (!correctWord) {
      correctWord = pool[Math.floor(Math.random() * pool.length)];
    }

    // 选 3 个干扰项（不同于正确答案）
    const distractors = pool
      .filter(w => w.en !== correctWord!.en)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = [...distractors, correctWord].sort(() => Math.random() - 0.5);
    return { correct: correctWord, options };
  }

  /** 生成 FEVER 用的配对组（n 对中英文） */
  generateFeverPairs(wordLevel: number, count: number = 4): WordEntry[] {
    return this.getWords(wordLevel, count);
  }

  /** 使用兜底词库（确保始终可用） */
  useFallback() {
    this._data = FALLBACK_WORDBANK;
    this._loaded = true;
  }
}
