# 英语对战宠物 · Cocos Creator 项目

## 项目结构

```
wordgame-cc/
├── index.html              ← ✅ 完整可运行 H5 版本（直接浏览器打开）
├── assets/
│   └── scripts/            ← Cocos Creator TypeScript 组件
│       ├── GameData.ts     ← 全局游戏状态（单例）
│       ├── WordBank.ts     ← 词库管理（内联兜底 + JSON 加载）
│       ├── BattleSystem.ts ← 战斗核心逻辑（伤害/FEVER计算）
│       ├── SelectScene.ts  ← 领养宠物场景
│       ├── HomeScene.ts    ← 宠物主页场景
│       ├── DungeonScene.ts ← 副本站场景
│       ├── BattleScene.ts  ← 战斗场景（答题+FEVER）
│       ├── ResultScene.ts  ← 结算场景
│       └── MineScene.ts    ← 「我的」场景
├── tsconfig.json
└── package.json
```

## 快速运行（H5 版）

直接用浏览器打开 `index.html` 即可完整体验所有玩法。

```bash
# 或者用本地服务（推荐）
npx serve wordgame-cc
```

## 在 Cocos Creator 中使用

1. 安装 **Cocos Creator 3.8**
2. 新建项目，把 `assets/scripts/` 中的 `.ts` 文件拷入对应目录
3. 在编辑器中创建场景（SelectScene、HomeScene、DungeonScene、BattleScene、ResultScene、MineScene）
4. 将对应脚本组件挂载到场景根节点
5. 按照各脚本 `@property` 注释在编辑器中绑定 UI 节点
6. 配置好 `director.loadScene` 的场景名与编辑器一致

## 核心玩法数值（来自设计文档04）

| 数值 | 设定 |
|------|------|
| 普通题基础伤害 | 12 |
| 连击加成 | +15%/次 |
| 答错/超时扣血 | 15 |
| 怪物初始HP | 150~220（按副本） |
| FEVER触发条件 | 连续答对3题 |
| FEVER持续时间 | 5秒 |
| FEVER单对伤害 | 15 × 1.2^n |
| 升级所需经验 | 50（固定） |
| 升级HP增量 | +10 |
| 胜利基础经验 | 20 + 答对数×5 |
| 胜利金币 | 15 + 答对数×3 |

## 场景说明

| 场景 | 功能 |
|------|------|
| SelectScene | 三选一领养宠物（小火球/护盾龟/闪电狐）|
| HomeScene | 宠物展示、HP/EXP/体力、每日任务折叠 |
| DungeonScene | 副本列表，消耗体力进战斗 |
| BattleScene | 普通四选一 + FEVER左右配对消除 |
| ResultScene | 胜负结算，展示奖励 |
| MineScene | 个人信息、成就、设置 |
