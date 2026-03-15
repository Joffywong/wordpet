/**
 * EncounterTransition.ts - 遭遇战转场控制器
 *
 * 时序（总 ≤ 1s）：
 *   0ms   → 黑色遮罩淡入（100ms）
 *   100ms → 停留（100ms，等待感叹号动画结束）
 *   200ms → 战斗闪光（50ms 白色 overlay）
 *   250ms → 跳转到 BattleScene
 *
 * 扁平2D视觉风格：
 *   - 纯黑色遮罩（无渐变，干净利落）
 *   - 白色闪光一帧（模拟转场冲击感）
 */
import { _decorator, Component, Node, UIOpacity, tween, Tween, director, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('EncounterTransition')
export class EncounterTransition extends Component {

  /** 黑色全屏遮罩节点（需在场景中提前创建，UIOpacity 初始 opacity=0） */
  @property(Node)
  blackOverlay: Node | null = null;

  /** 白色全屏闪光节点（UIOpacity 初始 opacity=0） */
  @property(Node)
  flashOverlay: Node | null = null;

  private _playing = false;

  /**
   * 触发遭遇转场，完成后自动跳到 BattleScene
   * @param onMidpoint 遮罩完全黑后的回调（可用于设置战斗参数）
   */
  playEncounterTransition(onMidpoint?: () => void) {
    if (this._playing) return;
    this._playing = true;

    const blackOp = this.blackOverlay?.getComponent(UIOpacity);
    const flashOp = this.flashOverlay?.getComponent(UIOpacity);

    // 确保遮罩层在最顶层
    if (this.blackOverlay) this.blackOverlay.setSiblingIndex(9999);
    if (this.flashOverlay) this.flashOverlay.setSiblingIndex(10000);

    const seq = tween(this.node)
      // Step 1: 黑幕淡入
      .call(() => {
        if (blackOp) blackOp.opacity = 0;
        if (this.blackOverlay) this.blackOverlay.active = true;
        tween(blackOp ?? this.node)
          .to(0.1, blackOp ? { opacity: 255 } : {})
          .start();
      })
      .delay(0.15)

      // Step 2: 回调（此时画面全黑，设置战斗场景参数）
      .call(() => {
        onMidpoint?.();
      })
      .delay(0.05)

      // Step 3: 白色闪光一帧
      .call(() => {
        if (flashOp && this.flashOverlay) {
          this.flashOverlay.active = true;
          flashOp.opacity = 255;
          tween(flashOp)
            .to(0.12, { opacity: 0 })
            .call(() => { if (this.flashOverlay) this.flashOverlay.active = false; })
            .start();
        }
      })
      .delay(0.08)

      // Step 4: 跳转战斗场景
      .call(() => {
        director.loadScene('BattleScene');
      })
      .start();
  }

  /** 战斗返回探索地图时的淡入（遮罩淡出） */
  playReturnTransition(onComplete?: () => void) {
    const blackOp = this.blackOverlay?.getComponent(UIOpacity);
    if (!blackOp) {
      onComplete?.();
      return;
    }

    blackOp.opacity = 255;
    if (this.blackOverlay) this.blackOverlay.active = true;

    tween(blackOp)
      .to(0.3, { opacity: 0 })
      .call(() => {
        if (this.blackOverlay) this.blackOverlay.active = false;
        onComplete?.();
      })
      .start();
  }
}
