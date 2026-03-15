/**
 * PlayerController.ts - 玩家角色控制器（探索地图）
 *
 * 功能：
 * - 8 方向键盘/虚拟摇杆移动
 * - 扁平 2D 俯视角（Cocos Canvas UI 坐标系）
 * - 发布 onMove 事件供地图检测碰撞
 * - 支持移动端虚拟方向键
 */
import { _decorator, Component, Node, Vec2, Vec3, input, Input, EventKeyboard, KeyCode, EventTouch, UITransform, tween, Tween } from 'cc';
import { EventTarget } from 'cc';

const { ccclass, property } = _decorator;

/** 玩家控制器事件总线（地图系统监听） */
export const playerEvents = new EventTarget();
export const PLAYER_MOVED = 'player-moved';   // 携带新的世界坐标 Vec2

@ccclass('PlayerController')
export class PlayerController extends Component {

  // ---- 可配置属性 ----
  @property({ displayName: '移动速度 (px/s)', min: 50, max: 400 })
  moveSpeed: number = 160;

  @property({ displayName: '虚拟摇杆节点（可选）' })
  joystickNode: Node | null = null;

  // ---- 私有状态 ----
  private _dir = new Vec2(0, 0);       // 当前移动方向（归一化）
  private _keysDown = new Set<KeyCode>();
  private _mapBounds = { minX: -600, maxX: 600, minY: -500, maxY: 500 };

  // ---- 移步动画 ----
  private _walkTween: Tween<Node> | null = null;
  private _lastFacing: 'left' | 'right' | 'up' | 'down' = 'down';

  // ---- 公开 API ----
  /** 外部设置地图边界（由 ExploreMapScene 调用） */
  setMapBounds(minX: number, maxX: number, minY: number, maxY: number) {
    this._mapBounds = { minX, maxX, minY, maxY };
  }

  // ============================
  //  生命周期
  // ============================
  protected onEnable(): void {
    input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this._onKeyUp, this);
  }

  protected onDisable(): void {
    input.off(Input.EventType.KEY_DOWN, this._onKeyDown, this);
    input.off(Input.EventType.KEY_UP, this._onKeyUp, this);
    Tween.stopAllByTarget(this.node);
  }

  protected update(dt: number): void {
    this._calcDirection();
    if (this._dir.length() < 0.01) return;

    const spd = this.moveSpeed * dt;
    const pos = this.node.position;
    const nx = Math.max(this._mapBounds.minX, Math.min(this._mapBounds.maxX, pos.x + this._dir.x * spd));
    const ny = Math.max(this._mapBounds.minY, Math.min(this._mapBounds.maxY, pos.y + this._dir.y * spd));

    this.node.setPosition(nx, ny, 0);

    // 通知地图层检测碰撞
    playerEvents.emit(PLAYER_MOVED, new Vec2(nx, ny));

    // 扁平 2D 纵深层级：y 越小（越靠下）z-index 越高（在前景）
    const uitr = this.node.getComponent(UITransform);
    if (uitr) {
      // 设置 priority（伪造深度感）
    }
  }

  // ============================
  //  键盘输入
  // ============================
  private _onKeyDown(e: EventKeyboard) {
    this._keysDown.add(e.keyCode);
  }

  private _onKeyUp(e: EventKeyboard) {
    this._keysDown.delete(e.keyCode);
  }

  private _calcDirection() {
    let dx = 0, dy = 0;
    if (this._keysDown.has(KeyCode.ARROW_LEFT)  || this._keysDown.has(KeyCode.KEY_A)) dx -= 1;
    if (this._keysDown.has(KeyCode.ARROW_RIGHT) || this._keysDown.has(KeyCode.KEY_D)) dx += 1;
    if (this._keysDown.has(KeyCode.ARROW_UP)    || this._keysDown.has(KeyCode.KEY_W)) dy += 1;
    if (this._keysDown.has(KeyCode.ARROW_DOWN)  || this._keysDown.has(KeyCode.KEY_S)) dy -= 1;

    this._dir.set(dx, dy);
    if (this._dir.length() > 0) this._dir.normalize();

    // 更新面朝方向（用于动画帧切换）
    if (dx < 0) this._lastFacing = 'left';
    else if (dx > 0) this._lastFacing = 'right';
    else if (dy > 0) this._lastFacing = 'up';
    else if (dy < 0) this._lastFacing = 'down';
  }

  // ============================
  //  虚拟摇杆（移动端）
  //  由 ExploreMapScene 通过 setJoystickInput() 调用
  // ============================
  setJoystickInput(dx: number, dy: number) {
    // dx/dy 已归一化（-1 ~ 1），直接替换 _dir
    this._dir.set(dx, dy);
    if (this._dir.length() > 0) this._dir.normalize();
  }

  stopJoystick() {
    this._dir.set(0, 0);
  }

  get facing() { return this._lastFacing; }
}
