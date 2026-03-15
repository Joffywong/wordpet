/**
 * WordPet 宠物 SVG 素材库 v1.0
 * 
 * 规范：
 * - 每个 SVG defs 内的 id 使用 "KEY_suffix" 格式，全局唯一，避免多个 inline SVG 同时渲染时的 gradient ID 冲突
 * - viewBox 统一 "0 0 100 100"
 * - 替换美术资源时直接修改对应 key 的字符串即可
 * 
 * Key 说明：
 *   fire     → 小火球（Lv.1）
 *   fire2    → 烈焰狐妖（Lv.15）
 *   fire3    → 焰龙王（Lv.30）
 *   shield   → 护盾龟（Lv.1）
 *   shield2  → 重甲古龟（Lv.15）
 *   shield3  → 神盾玄武（Lv.30）
 *   thunder  → 闪电狐（Lv.1）
 *   thunder2 → 雷霆九尾（Lv.15）
 *   thunder3 → 雷神天狐（Lv.30）
 */
const SVG_PETS = {

  /* ══════ 火系 ══════ */
  fire: `
    <defs>
      <radialGradient id="fire_b0" cx="50%" cy="60%" r="50%"><stop offset="0%" stop-color="#fbbf24"/><stop offset="60%" stop-color="#ef4444"/><stop offset="100%" stop-color="#7f1d1d"/></radialGradient>
      <radialGradient id="fire_b1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fef08a"/><stop offset="100%" stop-color="#f97316"/></radialGradient>
      <filter id="fire_glow"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <ellipse cx="50" cy="88" rx="20" ry="5" fill="rgba(0,0,0,0.3)"/>
    <path d="M46 78 C40 88 30 92 28 84 C26 76 34 70 40 74Z" fill="#f97316" opacity=".7"/>
    <path d="M54 78 C60 88 70 92 72 84 C74 76 66 70 60 74Z" fill="#f97316" opacity=".7"/>
    <path d="M50 82 C30 82 18 68 18 52 C18 36 30 20 50 14 C70 20 82 36 82 52 C82 68 70 82 50 82Z" fill="url(#fire_b0)"/>
    <ellipse cx="50" cy="54" rx="18" ry="20" fill="url(#fire_b1)" opacity=".8"/>
    <ellipse cx="40" cy="48" rx="6" ry="7" fill="#1c1917"/>
    <ellipse cx="60" cy="48" rx="6" ry="7" fill="#1c1917"/>
    <ellipse cx="41.5" cy="46.5" rx="2.5" ry="3" fill="#fff" opacity=".9"/>
    <ellipse cx="61.5" cy="46.5" rx="2.5" ry="3" fill="#fff" opacity=".9"/>
    <circle cx="42" cy="47" r="1" fill="#ff6b35"/>
    <circle cx="62" cy="47" r="1" fill="#ff6b35"/>
    <path d="M44 62 Q50 68 56 62" stroke="#7f1d1d" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M38 22 C36 14 40 8 44 13 C42 7 48 4 50 10 C52 4 58 7 56 13 C60 8 64 14 62 22" fill="#f97316" filter="url(#fire_glow)"/>
    <path d="M42 19 C41 13 44 9 46 14 C47 10 50 8 52 13 C54 9 57 13 58 19" fill="#fbbf24"/>
    <ellipse cx="32" cy="58" rx="5" ry="3" fill="#f97316" opacity=".3"/>
    <ellipse cx="68" cy="58" rx="5" ry="3" fill="#f97316" opacity=".3"/>`,

  fire2: `
    <defs>
      <radialGradient id="fire2_b0" cx="50%" cy="55%" r="52%"><stop offset="0%" stop-color="#fed7aa"/><stop offset="50%" stop-color="#f97316"/><stop offset="100%" stop-color="#7c2d12"/></radialGradient>
      <radialGradient id="fire2_b1" cx="50%" cy="40%" r="50%"><stop offset="0%" stop-color="#fff7ed"/><stop offset="100%" stop-color="#fb923c"/></radialGradient>
      <filter id="fire2_glow"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <ellipse cx="50" cy="88" rx="24" ry="6" fill="rgba(0,0,0,0.3)"/>
    <path d="M40 76 C28 88 14 94 12 82 C10 70 24 62 36 68Z" fill="#ef4444" opacity=".85"/>
    <path d="M60 76 C72 88 86 94 88 82 C90 70 76 62 64 68Z" fill="#ef4444" opacity=".85"/>
    <path d="M18 52 C8 44 4 34 10 30 C16 26 24 34 22 44Z" fill="#fb923c" opacity=".6"/>
    <path d="M82 52 C92 44 96 34 90 30 C84 26 76 34 78 44Z" fill="#fb923c" opacity=".6"/>
    <path d="M50 84 C26 84 14 66 14 50 C14 32 28 14 50 10 C72 14 86 32 86 50 C86 66 74 84 50 84Z" fill="url(#fire2_b0)"/>
    <ellipse cx="50" cy="52" rx="20" ry="22" fill="url(#fire2_b1)" opacity=".75"/>
    <ellipse cx="39" cy="47" rx="7" ry="8" fill="#1c1917"/>
    <ellipse cx="61" cy="47" rx="7" ry="8" fill="#1c1917"/>
    <ellipse cx="40.5" cy="45.5" rx="3" ry="3.5" fill="#fff" opacity=".95"/>
    <ellipse cx="62.5" cy="45.5" rx="3" ry="3.5" fill="#fff" opacity=".95"/>
    <circle cx="41" cy="46" r="1.2" fill="#ff6b35"/>
    <circle cx="63" cy="46" r="1.2" fill="#ff6b35"/>
    <path d="M34 40 L44 43" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M56 43 L66 40" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M43 62 Q50 70 57 62" stroke="#7c2d12" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M34 20 C30 10 34 4 38 10 C36 3 42 -1 44 6 C46 -1 50 -3 50 5 C50 -3 54 -1 56 6 C58 -1 64 3 62 10 C66 4 70 10 66 20" fill="#ef4444" filter="url(#fire2_glow)"/>
    <path d="M38 17 C36 9 40 5 42 10 C43 6 46 4 48 8 C49 4 51 4 53 8 C55 4 57 6 58 10 C60 5 64 9 62 17" fill="#fbbf24"/>
    <ellipse cx="32" cy="56" rx="6" ry="3.5" fill="#f97316" opacity=".3"/>
    <ellipse cx="68" cy="56" rx="6" ry="3.5" fill="#f97316" opacity=".3"/>`,

  fire3: `
    <defs>
      <radialGradient id="fire3_b0" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#fef3c7"/><stop offset="35%" stop-color="#f59e0b"/><stop offset="75%" stop-color="#dc2626"/><stop offset="100%" stop-color="#450a0a"/></radialGradient>
      <radialGradient id="fire3_b1" cx="50%" cy="35%" r="45%"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/></radialGradient>
      <filter id="fire3_glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <ellipse cx="50" cy="90" rx="28" ry="7" fill="rgba(0,0,0,0.35)"/>
    <path d="M18 55 C4 42 0 26 8 20 C16 14 28 24 26 40Z" fill="#dc2626" opacity=".9"/>
    <path d="M82 55 C96 42 100 26 92 20 C84 14 72 24 74 40Z" fill="#dc2626" opacity=".9"/>
    <path d="M38 80 C22 94 8 96 6 84 C4 72 18 64 32 72Z" fill="#ef4444" opacity=".9"/>
    <path d="M62 80 C78 94 92 96 94 84 C96 72 82 64 68 72Z" fill="#ef4444" opacity=".9"/>
    <path d="M50 86 C20 86 8 64 8 47 C8 26 24 8 50 6 C76 8 92 26 92 47 C92 64 80 86 50 86Z" fill="url(#fire3_b0)"/>
    <ellipse cx="50" cy="47" rx="30" ry="32" fill="url(#fire3_b1)" opacity=".5"/>
    <path d="M36 36 L32 52 L36 68 L50 74 L64 68 L68 52 L64 36 L50 30Z" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity=".4"/>
    <ellipse cx="36" cy="46" rx="8.5" ry="9.5" fill="#1c1917"/>
    <ellipse cx="64" cy="46" rx="8.5" ry="9.5" fill="#1c1917"/>
    <ellipse cx="37.5" cy="44.5" rx="3.5" ry="4" fill="#fef08a" opacity=".95" filter="url(#fire3_glow)"/>
    <ellipse cx="65.5" cy="44.5" rx="3.5" ry="4" fill="#fef08a" opacity=".95" filter="url(#fire3_glow)"/>
    <path d="M28 36 L38 41" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
    <path d="M62 41 L72 36" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
    <path d="M41 65 Q50 76 59 65" stroke="#7f1d1d" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M30 20 C22 6 26 -2 32 4 C28 -4 36 -8 38 2 C40 -6 46 -8 46 2 C46 -8 50 -10 50 0 C50 -10 54 -8 54 2 C54 -8 60 -4 58 2 C62 -8 68 -4 66 4 C72 -2 76 6 68 20" fill="#ef4444" filter="url(#fire3_glow)"/>
    <path d="M34 16 C28 6 32 0 36 6 C37 0 40 -2 42 4 C43 0 46 -2 48 4 C49 0 51 0 53 4 C55 -2 57 0 58 4 C60 -2 63 6 66 16" fill="#fbbf24"/>
    <circle cx="50" cy="47" r="14" fill="none" stroke="#fbbf24" stroke-width="2" opacity=".3" filter="url(#fire3_glow)"/>`,

  /* ══════ 水系（盾龟） ══════ */
  shield: `
    <defs>
      <radialGradient id="shield_b0" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="70%" stop-color="#10b981"/><stop offset="100%" stop-color="#064e3b"/></radialGradient>
      <linearGradient id="shield_b1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#34d399"/><stop offset="100%" stop-color="#059669"/></linearGradient>
    </defs>
    <ellipse cx="50" cy="88" rx="26" ry="6" fill="rgba(0,0,0,0.3)"/>
    <ellipse cx="26" cy="72" rx="10" ry="8" fill="#10b981"/>
    <ellipse cx="74" cy="72" rx="10" ry="8" fill="#10b981"/>
    <ellipse cx="32" cy="80" rx="8" ry="6" fill="#10b981"/>
    <ellipse cx="68" cy="80" rx="8" ry="6" fill="#10b981"/>
    <ellipse cx="50" cy="54" rx="34" ry="30" fill="url(#shield_b0)"/>
    <path d="M34 30 L28 52 L34 72 L50 78 L66 72 L72 52 L66 30 L50 24Z" fill="url(#shield_b1)" opacity=".55"/>
    <line x1="50" y1="24" x2="50" y2="78" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
    <line x1="28" y1="52" x2="72" y2="52" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
    <line x1="34" y1="30" x2="66" y2="72" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <line x1="66" y1="30" x2="34" y2="72" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <ellipse cx="50" cy="32" rx="16" ry="14" fill="#10b981"/>
    <ellipse cx="50" cy="30" rx="14" ry="12" fill="#34d399"/>
    <ellipse cx="43" cy="29" rx="5.5" ry="6" fill="#064e3b"/>
    <ellipse cx="57" cy="29" rx="5.5" ry="6" fill="#064e3b"/>
    <ellipse cx="44" cy="28" rx="2.5" ry="3" fill="#fff" opacity=".9"/>
    <ellipse cx="58" cy="28" rx="2.5" ry="3" fill="#fff" opacity=".9"/>
    <ellipse cx="36" cy="34" rx="5" ry="3" fill="#059669" opacity=".4"/>
    <ellipse cx="64" cy="34" rx="5" ry="3" fill="#059669" opacity=".4"/>
    <path d="M45 39 Q50 44 55 39" stroke="#064e3b" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M42 48 L38 56 L42 64 L50 68 L58 64 L62 56 L58 48 L50 44Z" fill="rgba(255,255,255,0.15)" stroke="#6ee7b7" stroke-width="1.5" opacity=".7"/>`,

  shield2: `
    <defs>
      <radialGradient id="shield2_b0" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#a7f3d0"/><stop offset="60%" stop-color="#059669"/><stop offset="100%" stop-color="#022c22"/></radialGradient>
      <linearGradient id="shield2_b1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#047857"/></linearGradient>
    </defs>
    <ellipse cx="50" cy="89" rx="28" ry="6" fill="rgba(0,0,0,0.3)"/>
    <ellipse cx="22" cy="70" rx="12" ry="10" fill="#059669"/>
    <ellipse cx="78" cy="70" rx="12" ry="10" fill="#059669"/>
    <ellipse cx="28" cy="82" rx="10" ry="7" fill="#047857"/>
    <ellipse cx="72" cy="82" rx="10" ry="7" fill="#047857"/>
    <ellipse cx="50" cy="55" rx="36" ry="32" fill="url(#shield2_b0)"/>
    <path d="M34 28 L26 52 L34 74 L50 80 L66 74 L74 52 L66 28 L50 22Z" fill="url(#shield2_b1)" opacity=".5"/>
    <path d="M50 22 L42 30 L38 52 L42 74 L50 80 L58 74 L62 52 L58 30Z" fill="rgba(255,255,255,0.1)"/>
    <line x1="50" y1="22" x2="50" y2="80" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
    <line x1="26" y1="52" x2="74" y2="52" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
    <line x1="34" y1="28" x2="66" y2="74" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
    <line x1="66" y1="28" x2="34" y2="74" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
    <ellipse cx="50" cy="30" rx="18" ry="16" fill="#059669"/>
    <ellipse cx="50" cy="28" rx="16" ry="14" fill="#34d399"/>
    <path d="M34 38 L32 42 L50 44 L68 42 L66 38Z" fill="#047857" opacity=".7"/>
    <ellipse cx="42" cy="27" rx="7" ry="7.5" fill="#022c22"/>
    <ellipse cx="58" cy="27" rx="7" ry="7.5" fill="#022c22"/>
    <ellipse cx="43.5" cy="25.5" rx="3" ry="3.5" fill="#fff" opacity=".92"/>
    <ellipse cx="59.5" cy="25.5" rx="3" ry="3.5" fill="#fff" opacity=".92"/>
    <path d="M36 21 L44 24" stroke="#022c22" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M56 24 L64 21" stroke="#022c22" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M44 37 Q50 43 56 37" stroke="#022c22" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M40 48 L36 58 L40 68 L50 72 L60 68 L64 58 L60 48 L50 44Z" fill="rgba(255,255,255,0.1)" stroke="#6ee7b7" stroke-width="2" opacity=".8"/>
    <path d="M44 52 L42 58 L44 64 L50 66 L56 64 L58 58 L56 52 L50 50Z" fill="none" stroke="#a7f3d0" stroke-width="1" opacity=".5"/>`,

  shield3: `
    <defs>
      <radialGradient id="shield3_b0" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#d1fae5"/><stop offset="40%" stop-color="#10b981"/><stop offset="80%" stop-color="#065f46"/><stop offset="100%" stop-color="#022c22"/></radialGradient>
      <linearGradient id="shield3_b1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a7f3d0"/><stop offset="100%" stop-color="#059669"/></linearGradient>
      <filter id="shield3_glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <ellipse cx="50" cy="91" rx="32" ry="7" fill="rgba(0,0,0,0.35)"/>
    <circle cx="50" cy="50" r="44" fill="none" stroke="#10b981" stroke-width="1.5" opacity=".2" filter="url(#shield3_glow)"/>
    <ellipse cx="18" cy="68" rx="14" ry="12" fill="#065f46"/>
    <ellipse cx="82" cy="68" rx="14" ry="12" fill="#065f46"/>
    <ellipse cx="24" cy="82" rx="12" ry="8" fill="#022c22"/>
    <ellipse cx="76" cy="82" rx="12" ry="8" fill="#022c22"/>
    <ellipse cx="50" cy="55" rx="40" ry="36" fill="url(#shield3_b0)"/>
    <path d="M30 24 L22 52 L30 76 L50 84 L70 76 L78 52 L70 24 L50 18Z" fill="url(#shield3_b1)" opacity=".45"/>
    <path d="M50 18 L40 28 L36 52 L40 76 L50 84 L60 76 L64 52 L60 28Z" fill="rgba(255,255,255,0.12)"/>
    <line x1="50" y1="18" x2="50" y2="84" stroke="rgba(255,255,255,0.2)" stroke-width="2.5"/>
    <line x1="22" y1="52" x2="78" y2="52" stroke="rgba(255,255,255,0.2)" stroke-width="2.5"/>
    <line x1="30" y1="24" x2="70" y2="76" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
    <line x1="70" y1="24" x2="30" y2="76" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
    <path d="M42 48 L38 58 L42 68 L50 72 L58 68 L62 58 L58 48 L50 44Z" fill="none" stroke="#bbf7d0" stroke-width="2.5" opacity=".9" filter="url(#shield3_glow)"/>
    <ellipse cx="50" cy="28" rx="20" ry="18" fill="#065f46"/>
    <ellipse cx="50" cy="26" rx="18" ry="16" fill="#10b981"/>
    <path d="M44 12 C42 4 46 0 50 6 C54 0 58 4 56 12" fill="#059669"/>
    <path d="M47 11 C46 5 48 2 50 6 C52 2 54 5 53 11" fill="#a7f3d0" opacity=".8"/>
    <ellipse cx="40" cy="25" rx="8.5" ry="9" fill="#022c22"/>
    <ellipse cx="60" cy="25" rx="8.5" ry="9" fill="#022c22"/>
    <ellipse cx="41.5" cy="23.5" rx="3.5" ry="4" fill="#bbf7d0" opacity=".95" filter="url(#shield3_glow)"/>
    <ellipse cx="61.5" cy="23.5" rx="3.5" ry="4" fill="#bbf7d0" opacity=".95" filter="url(#shield3_glow)"/>
    <path d="M32 17 L42 21" stroke="#022c22" stroke-width="3" stroke-linecap="round"/>
    <path d="M58 21 L68 17" stroke="#022c22" stroke-width="3" stroke-linecap="round"/>
    <path d="M43 37 Q50 44 57 37" stroke="#022c22" stroke-width="3" fill="none" stroke-linecap="round"/>`,

  /* ══════ 雷系（狐） ══════ */
  thunder: `
    <defs>
      <radialGradient id="thunder_b0" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#fde68a"/><stop offset="60%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#78350f"/></radialGradient>
      <filter id="thunder_glow"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <ellipse cx="50" cy="88" rx="22" ry="6" fill="rgba(0,0,0,0.3)"/>
    <path d="M50 78 C44 86 36 90 38 82 C34 86 28 82 32 74 C28 76 26 70 32 68 L50 72Z" fill="#f59e0b" opacity=".8"/>
    <ellipse cx="50" cy="52" rx="28" ry="30" fill="url(#thunder_b0)"/>
    <ellipse cx="50" cy="56" rx="18" ry="20" fill="#fef9c3" opacity=".5"/>
    <path d="M34 28 C30 16 36 10 40 18Z" fill="#f59e0b"/>
    <path d="M66 28 C70 16 64 10 60 18Z" fill="#f59e0b"/>
    <path d="M35 26 C32 18 36 13 39 19Z" fill="#fde68a"/>
    <path d="M65 26 C68 18 64 13 61 19Z" fill="#fde68a"/>
    <path d="M52 22 L44 38 L52 38 L42 58 L58 34 L50 34Z" fill="#fff" opacity=".85" filter="url(#thunder_glow)"/>
    <path d="M52 22 L44 38 L52 38 L42 58 L58 34 L50 34Z" fill="#fbbf24"/>
    <ellipse cx="41" cy="50" rx="5.5" ry="6.5" fill="#78350f"/>
    <ellipse cx="59" cy="50" rx="5.5" ry="6.5" fill="#78350f"/>
    <ellipse cx="42" cy="48.5" rx="2.5" ry="3" fill="#fff" opacity=".9"/>
    <ellipse cx="60" cy="48.5" rx="2.5" ry="3" fill="#fff" opacity=".9"/>
    <circle cx="42.5" cy="49" r="1" fill="#facc15" filter="url(#thunder_glow)"/>
    <circle cx="60.5" cy="49" r="1" fill="#facc15" filter="url(#thunder_glow)"/>
    <ellipse cx="32" cy="56" rx="5" ry="3" fill="#fbbf24" opacity=".35"/>
    <ellipse cx="68" cy="56" rx="5" ry="3" fill="#fbbf24" opacity=".35"/>
    <path d="M44 63 Q50 68 56 63" stroke="#78350f" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M28 38 Q22 32 24 40" stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9" filter="url(#thunder_glow)"/>
    <path d="M72 38 Q78 32 76 40" stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9" filter="url(#thunder_glow)"/>`,

  thunder2: `
    <defs>
      <radialGradient id="thunder2_b0" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#fef9c3"/><stop offset="55%" stop-color="#eab308"/><stop offset="100%" stop-color="#713f12"/></radialGradient>
      <filter id="thunder2_glow"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <ellipse cx="50" cy="88" rx="26" ry="6" fill="rgba(0,0,0,0.3)"/>
    <path d="M50 76 C36 90 18 96 16 82 C14 70 28 60 40 68Z" fill="#eab308" opacity=".7"/>
    <path d="M50 76 C42 94 26 98 26 84 C26 74 38 66 44 72Z" fill="#fbbf24" opacity=".6"/>
    <path d="M50 76 C52 96 38 100 36 88 C34 78 44 70 48 74Z" fill="#eab308" opacity=".65"/>
    <path d="M50 76 C64 90 82 96 84 82 C86 70 72 60 60 68Z" fill="#eab308" opacity=".7"/>
    <path d="M50 76 C58 94 74 98 74 84 C74 74 62 66 56 72Z" fill="#fbbf24" opacity=".6"/>
    <ellipse cx="50" cy="50" rx="32" ry="34" fill="url(#thunder2_b0)"/>
    <ellipse cx="50" cy="54" rx="22" ry="22" fill="#fef9c3" opacity=".45"/>
    <path d="M32 24 C26 10 32 2 38 12Z" fill="#eab308"/>
    <path d="M68 24 C74 10 68 2 62 12Z" fill="#eab308"/>
    <path d="M33 22 C28 12 33 6 37 14Z" fill="#fde68a"/>
    <path d="M67 22 C72 12 67 6 63 14Z" fill="#fde68a"/>
    <path d="M56 14 L44 36 L54 36 L40 60 L62 30 L52 30Z" fill="#fff" opacity=".9" filter="url(#thunder2_glow)"/>
    <path d="M56 14 L44 36 L54 36 L40 60 L62 30 L52 30Z" fill="#fbbf24"/>
    <path d="M44 14 L34 32 L42 32 L30 52 L50 26 L42 26Z" fill="#fde68a" opacity=".6"/>
    <ellipse cx="39" cy="49" rx="6.5" ry="7.5" fill="#713f12"/>
    <ellipse cx="61" cy="49" rx="6.5" ry="7.5" fill="#713f12"/>
    <ellipse cx="40.5" cy="47.5" rx="3" ry="3.5" fill="#fff" opacity=".95"/>
    <ellipse cx="62.5" cy="47.5" rx="3" ry="3.5" fill="#fff" opacity=".95"/>
    <circle cx="41" cy="48" r="1.2" fill="#facc15" filter="url(#thunder2_glow)"/>
    <circle cx="63" cy="48" r="1.2" fill="#facc15" filter="url(#thunder2_glow)"/>
    <path d="M43 63 Q50 70 57 63" stroke="#713f12" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M22 36 Q14 28 16 38" stroke="#fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round" filter="url(#thunder2_glow)"/>
    <path d="M78 36 Q86 28 84 38" stroke="#fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round" filter="url(#thunder2_glow)"/>
    <path d="M18 48 Q10 42 12 50" stroke="#fde68a" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M82 48 Q90 42 88 50" stroke="#fde68a" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".7"/>`,

  thunder3: `
    <defs>
      <radialGradient id="thunder3_b0" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#fefce8"/><stop offset="30%" stop-color="#facc15"/><stop offset="70%" stop-color="#b45309"/><stop offset="100%" stop-color="#431407"/></radialGradient>
      <filter id="thunder3_glow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <ellipse cx="50" cy="91" rx="30" ry="7" fill="rgba(0,0,0,0.35)"/>
    <circle cx="50" cy="48" r="42" fill="none" stroke="#facc15" stroke-width="2" opacity=".2" filter="url(#thunder3_glow)"/>
    <path d="M50 76 C30 94 8 100 6 84 C4 70 22 60 36 68Z" fill="#b45309" opacity=".8" filter="url(#thunder3_glow)"/>
    <path d="M50 76 C38 98 18 100 18 84 C18 72 34 62 42 70Z" fill="#eab308" opacity=".7"/>
    <path d="M50 76 C46 98 30 100 30 86 C30 76 42 68 46 74Z" fill="#b45309" opacity=".75"/>
    <path d="M50 76 C70 94 92 100 94 84 C96 70 78 60 64 68Z" fill="#b45309" opacity=".8" filter="url(#thunder3_glow)"/>
    <path d="M50 76 C62 98 82 100 82 84 C82 72 66 62 58 70Z" fill="#eab308" opacity=".7"/>
    <path d="M50 76 C54 98 70 100 70 86 C70 76 58 68 54 74Z" fill="#b45309" opacity=".75"/>
    <ellipse cx="50" cy="48" rx="36" ry="36" fill="url(#thunder3_b0)"/>
    <ellipse cx="50" cy="52" rx="24" ry="24" fill="#fefce8" opacity=".35"/>
    <path d="M30 22 C22 4 28 -4 36 8Z" fill="#b45309"/>
    <path d="M70 22 C78 4 72 -4 64 8Z" fill="#b45309"/>
    <path d="M31 20 C25 6 30 0 35 10Z" fill="#fde68a"/>
    <path d="M69 20 C75 6 70 0 65 10Z" fill="#fde68a"/>
    <path d="M62 8 L46 36 L58 36 L36 72 L72 28 L58 28Z" fill="#fff" opacity=".92" filter="url(#thunder3_glow)"/>
    <path d="M62 8 L46 36 L58 36 L36 72 L72 28 L58 28Z" fill="#fbbf24"/>
    <path d="M48 8 L32 32 L44 32 L24 62 L56 24 L44 24Z" fill="#fde68a" opacity=".7"/>
    <path d="M38 12 L26 30 L36 30 L20 52 L44 22 L34 22Z" fill="#fff" opacity=".3"/>
    <ellipse cx="37" cy="47" rx="8.5" ry="9.5" fill="#431407"/>
    <ellipse cx="63" cy="47" rx="8.5" ry="9.5" fill="#431407"/>
    <ellipse cx="38.5" cy="45.5" rx="3.5" ry="4" fill="#fef9c3" opacity=".95" filter="url(#thunder3_glow)"/>
    <ellipse cx="64.5" cy="45.5" rx="3.5" ry="4" fill="#fef9c3" opacity=".95" filter="url(#thunder3_glow)"/>
    <path d="M42 64 Q50 73 58 64" stroke="#431407" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M16 30 Q4 20 6 32" stroke="#facc15" stroke-width="3.5" fill="none" stroke-linecap="round" filter="url(#thunder3_glow)"/>
    <path d="M84 30 Q96 20 94 32" stroke="#facc15" stroke-width="3.5" fill="none" stroke-linecap="round" filter="url(#thunder3_glow)"/>
    <path d="M10 46 Q0 38 2 48" stroke="#fde68a" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M90 46 Q100 38 98 48" stroke="#fde68a" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>`,

  /* ══════ 宠物蛋 ══════ */

  /* 火系蛋：橙红色，有火纹 */
  egg_fire: `
    <defs>
      <radialGradient id="eggf_bg" cx="42%" cy="38%" r="60%">
        <stop offset="0%" stop-color="#fed7aa"/>
        <stop offset="55%" stop-color="#f97316"/>
        <stop offset="100%" stop-color="#7c2d12"/>
      </radialGradient>
      <radialGradient id="eggf_shine" cx="38%" cy="30%" r="30%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.55)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
      <filter id="eggf_glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <!-- 阴影 -->
    <ellipse cx="50" cy="91" rx="22" ry="6" fill="rgba(0,0,0,0.28)"/>
    <!-- 蛋身 -->
    <path d="M50 18 C72 18 82 38 82 58 C82 76 68 88 50 88 C32 88 18 76 18 58 C18 38 28 18 50 18Z"
          fill="url(#eggf_bg)"/>
    <!-- 高光 -->
    <ellipse cx="42" cy="36" rx="12" ry="16" fill="url(#eggf_shine)" opacity=".8"/>
    <!-- 火纹路 -->
    <path d="M40 62 Q44 54 42 48 Q50 56 48 44 Q56 54 54 48 Q60 58 56 68 Q52 72 46 70 Q42 68 40 62Z"
          fill="#fef08a" opacity=".85" filter="url(#eggf_glow)"/>
    <path d="M36 72 Q38 66 36 62 Q41 66 40 60 Q44 66 42 72Z"
          fill="#fbbf24" opacity=".6"/>
    <!-- 裂纹（即将孵化感）-->
    <path d="M50 26 L52 32 L49 36 L53 42" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,

  /* 水系蛋：蓝绿色，有六角龟纹 */
  egg_shield: `
    <defs>
      <radialGradient id="eggs_bg" cx="42%" cy="38%" r="60%">
        <stop offset="0%" stop-color="#a7f3d0"/>
        <stop offset="55%" stop-color="#10b981"/>
        <stop offset="100%" stop-color="#064e3b"/>
      </radialGradient>
      <radialGradient id="eggs_shine" cx="38%" cy="30%" r="30%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.55)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="91" rx="22" ry="6" fill="rgba(0,0,0,0.28)"/>
    <path d="M50 18 C72 18 82 38 82 58 C82 76 68 88 50 88 C32 88 18 76 18 58 C18 38 28 18 50 18Z"
          fill="url(#eggs_bg)"/>
    <ellipse cx="42" cy="36" rx="12" ry="16" fill="url(#eggs_shine)" opacity=".8"/>
    <!-- 六角纹 -->
    <polygon points="50,42 56,46 56,54 50,58 44,54 44,46" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
    <polygon points="50,50 54,52 54,56 50,58 46,56 46,52" fill="rgba(255,255,255,0.12)"/>
    <polygon points="36,54 40,56 40,62 36,64 32,62 32,56" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
    <polygon points="64,54 68,56 68,62 64,64 60,62 60,56" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
    <polygon points="43,68 47,70 47,76 43,78 39,76 39,70" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <polygon points="57,68 61,70 61,76 57,78 53,76 53,70" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <path d="M50 26 L52 32 L49 36 L53 42" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,

  /* 雷系蛋：金黄色，有闪电纹 */
  egg_thunder: `
    <defs>
      <radialGradient id="eggt_bg" cx="42%" cy="38%" r="60%">
        <stop offset="0%" stop-color="#fef9c3"/>
        <stop offset="55%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#78350f"/>
      </radialGradient>
      <radialGradient id="eggt_shine" cx="38%" cy="30%" r="30%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.6)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
      <filter id="eggt_glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <ellipse cx="50" cy="91" rx="22" ry="6" fill="rgba(0,0,0,0.28)"/>
    <path d="M50 18 C72 18 82 38 82 58 C82 76 68 88 50 88 C32 88 18 76 18 58 C18 38 28 18 50 18Z"
          fill="url(#eggt_bg)"/>
    <ellipse cx="42" cy="36" rx="12" ry="16" fill="url(#eggt_shine)" opacity=".8"/>
    <!-- 闪电纹 -->
    <path d="M54 38 L46 56 L52 56 L44 74" stroke="#fff7ed" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#eggt_glow)" opacity=".9"/>
    <path d="M54 38 L46 56 L52 56 L44 74" stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>
    <!-- 小闪电装饰 -->
    <path d="M64 44 L61 51 L64 51 L60 60" stroke="rgba(255,251,235,0.5)" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M36 48 L33 55 L36 55 L32 64" stroke="rgba(255,251,235,0.4)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M50 26 L52 32 L49 36 L53 42" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,

  /* 通用神秘蛋（未选宠物时主页显示） */
  egg_mystery: `
    <defs>
      <radialGradient id="eggm_bg" cx="42%" cy="38%" r="60%">
        <stop offset="0%" stop-color="#e9d5ff"/>
        <stop offset="55%" stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#2e1065"/>
      </radialGradient>
      <radialGradient id="eggm_shine" cx="38%" cy="30%" r="30%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.6)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
      <filter id="eggm_glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <ellipse cx="50" cy="91" rx="22" ry="6" fill="rgba(0,0,0,0.3)"/>
    <path d="M50 18 C72 18 82 38 82 58 C82 76 68 88 50 88 C32 88 18 76 18 58 C18 38 28 18 50 18Z"
          fill="url(#eggm_bg)"/>
    <ellipse cx="42" cy="36" rx="12" ry="16" fill="url(#eggm_shine)" opacity=".85"/>
    <!-- 星光纹 -->
    <circle cx="50" cy="55" r="4" fill="#c4b5fd" filter="url(#eggm_glow)" opacity=".9"/>
    <circle cx="40" cy="62" r="2.5" fill="#a78bfa" filter="url(#eggm_glow)" opacity=".7"/>
    <circle cx="62" cy="58" r="2" fill="#ddd6fe" opacity=".6"/>
    <path d="M50 44 L51.2 48.6 L56 48.6 L52.4 51.4 L53.6 56 L50 53.2 L46.4 56 L47.6 51.4 L44 48.6 L48.8 48.6Z"
          fill="rgba(255,255,255,0.35)" filter="url(#eggm_glow)"/>
    <!-- ??? 文字 -->
    <text x="50" y="76" text-anchor="middle" font-size="12" font-weight="bold" fill="rgba(255,255,255,0.4)" font-family="sans-serif">???</text>
    <path d="M50 26 L52 32 L49 36 L53 42" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none" stroke-linecap="round"/>`

};
