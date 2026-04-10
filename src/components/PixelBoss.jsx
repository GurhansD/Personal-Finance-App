// Procedural pixel-art boss sprites rendered as SVGs
// Each boss has a unique palette and shape grammar

const PIXEL = 8 // px per pixel-art cell

function px(n) { return n * PIXEL }

/* ─── DEBT DRAGON ─────────────────────────────────────────────────────── */
function DebtDragonSprite({ palette, frame = 0 }) {
  const bob = frame % 2 === 0 ? 0 : 2
  // Grid is 18×20 cells
  const W = 18, H = 20
  const rects = []
  const p = palette

  const grid = [
    // row 0-1: horns
    { x:4,  y:0, c: p.accent },   { x:13, y:0, c: p.accent },
    { x:4,  y:1, c: p.bodyLight },{ x:5,  y:1, c: p.accent }, { x:12,y:1,c:p.accent},{ x:13,y:1,c:p.bodyLight},
    // row 2-4: head
    { x:5, y:2, c: p.bodyDark },  { x:6,  y:2, c: p.body },  { x:7,  y:2, c: p.body },
    { x:8, y:2, c: p.body },      { x:9,  y:2, c: p.body },  { x:10, y:2, c: p.body },
    { x:11,y:2, c: p.body },      { x:12, y:2, c: p.bodyDark },
    { x:4, y:3, c: p.bodyDark },  { x:5,  y:3, c: p.body },  { x:6,  y:3, c: p.body },
    { x:7, y:3, c: p.eye },       { x:8,  y:3, c: p.eyeGlow},{ x:9,  y:3, c: p.bodyLight },
    { x:10,y:3, c: p.eye },       { x:11, y:3, c: p.eyeGlow},{ x:12, y:3, c: p.body },
    { x:13,y:3, c: p.bodyDark },
    { x:4, y:4, c: p.body },      { x:5,  y:4, c: p.body },  { x:6,  y:4, c: p.bodyLight },
    { x:7, y:4, c: p.bodyLight }, { x:8,  y:4, c: p.accent },{ x:9,  y:4, c: p.accent },
    { x:10,y:4, c: p.bodyLight }, { x:11, y:4, c: p.bodyLight},{ x:12,y:4,c:p.body},
    { x:13,y:4, c: p.body },
    // row 5: snout
    { x:6, y:5, c: p.bodyDark },  { x:7,  y:5, c: p.fire },  { x:8,  y:5, c: p.fireMid },
    { x:9, y:5, c: p.fireMid },   { x:10, y:5, c: p.fire },  { x:11, y:5, c: p.bodyDark },
    // row 6-8: neck / wings
    { x:6, y:6, c: p.body },      { x:7,  y:6, c: p.body },  { x:8,  y:6, c: p.body },
    { x:9, y:6, c: p.body },      { x:10, y:6, c: p.body },  { x:11, y:6, c: p.body },
    { x:2, y:7, c: p.wing },      { x:3,  y:7, c: p.wingDark},{ x:5, y:7, c: p.body},
    { x:6, y:7, c: p.bodyLight }, { x:7,  y:7, c: p.body },  { x:8,  y:7, c: p.bodyDark },
    { x:9, y:7, c: p.bodyDark },  { x:10, y:7, c: p.body },  { x:11, y:7, c: p.bodyLight },
    { x:12,y:7, c: p.body },      { x:14, y:7, c: p.wingDark},{ x:15,y:7,c:p.wing},
    { x:1, y:8, c: p.wing },      { x:2,  y:8, c: p.wingDark},{ x:3, y:8, c: p.wing},
    { x:4, y:8, c: p.wingDark },  { x:5,  y:8, c: p.body },  { x:6,  y:8, c: p.body },
    { x:7, y:8, c: p.bodyDark },  { x:8,  y:8, c: p.body },  { x:9,  y:8, c: p.body },
    { x:10,y:8, c: p.bodyDark },  { x:11, y:8, c: p.body },  { x:12, y:8, c: p.body },
    { x:13,y:8, c: p.wingDark },  { x:14, y:8, c: p.wing },  { x:15, y:8, c: p.wingDark },
    { x:16,y:8, c: p.wing },
    // row 9-12: body
    { x:0, y:9, c: p.wing },      { x:1,  y:9, c: p.wingDark},{ x:4, y:9, c: p.body},
    { x:5, y:9, c: p.bodyLight }, { x:6,  y:9, c: p.body },  { x:7,  y:9, c: p.body },
    { x:8, y:9, c: p.bodyDark },  { x:9,  y:9, c: p.body },  { x:10, y:9, c: p.body },
    { x:11,y:9, c: p.bodyLight }, { x:12, y:9, c: p.body },  { x:16, y:9, c: p.wingDark },
    { x:17,y:9, c: p.wing },
    { x:5, y:10,c: p.bodyDark },  { x:6,  y:10,c: p.body },  { x:7,  y:10,c: p.bodyLight },
    { x:8, y:10,c: p.accent },    { x:9,  y:10,c: p.accent }, { x:10, y:10,c: p.bodyLight },
    { x:11,y:10,c: p.body },      { x:12, y:10,c: p.bodyDark},
    { x:5, y:11,c: p.body },      { x:6,  y:11,c: p.bodyDark},{ x:7, y:11,c: p.body},
    { x:8, y:11,c: p.body },      { x:9,  y:11,c: p.body },  { x:10, y:11,c: p.body },
    { x:11,y:11,c: p.bodyDark },  { x:12, y:11,c: p.body },
    { x:5, y:12,c: p.bodyDark },  { x:6,  y:12,c: p.body },  { x:7,  y:12,c: p.body },
    { x:8, y:12,c: p.bodyLight }, { x:9,  y:12,c: p.bodyLight},{ x:10,y:12,c:p.body},
    { x:11,y:12,c: p.body },      { x:12, y:12,c: p.bodyDark},
    // row 13-16: legs
    { x:5, y:13,c: p.body },      { x:6,  y:13,c: p.bodyDark},{ x:9, y:13,c: p.bodyDark},
    { x:10,y:13,c: p.body },      { x:11, y:13,c: p.bodyDark},
    { x:5, y:14,c: p.bodyDark },  { x:6,  y:14,c: p.body },  { x:9,  y:14,c: p.body },
    { x:10,y:14,c: p.bodyDark },
    { x:5, y:15,c: p.body },      { x:6,  y:15,c: p.bodyDark},{ x:9, y:15,c: p.bodyDark},
    { x:10,y:15,c: p.body },
    // row 16-18: claws
    { x:4, y:16,c: p.accent },    { x:5,  y:16,c: p.accent }, { x:6,  y:16,c: p.bodyDark },
    { x:8, y:16,c: p.bodyDark },  { x:9,  y:16,c: p.accent }, { x:10, y:16,c: p.accent },
    { x:11,y:16,c: p.bodyDark },
    { x:4, y:17,c: p.bodyLight }, { x:5,  y:17,c: p.bodyLight},{ x:9, y:17,c: p.bodyLight},
    { x:10,y:17,c: p.bodyLight },
    // tail
    { x:11,y:11,c: p.body },      { x:12, y:12,c: p.bodyDark},{ x:13,y:13,c:p.body},
    { x:14,y:14,c: p.bodyDark },  { x:15, y:15,c: p.accent }, { x:16, y:15,c: p.bodyDark},
  ]

  return (
    <svg width={px(W)} height={px(H + 2)} style={{ imageRendering: 'pixelated' }}>
      <g transform={`translate(0,${bob})`}>
        {grid.map((cell, i) => (
          <rect key={i} x={px(cell.x)} y={px(cell.y)} width={PIXEL} height={PIXEL} fill={cell.c} />
        ))}
      </g>
    </svg>
  )
}

/* ─── BUDGET BUSTER (slime ghost) ────────────────────────────────────── */
function BudgetBusterSprite({ palette, frame = 0 }) {
  const bob = frame % 2 === 0 ? 0 : 3
  const p = palette
  const W = 16, H = 18

  const grid = [
    // top blob
    { x:5,y:0,c:p.slimeDark},{ x:6,y:0,c:p.slime},{ x:7,y:0,c:p.slime},
    { x:8,y:0,c:p.slime},{ x:9,y:0,c:p.slimeDark},
    { x:3,y:1,c:p.slimeDark},{ x:4,y:1,c:p.slime},{ x:5,y:1,c:p.body},
    { x:6,y:1,c:p.bodyLight},{ x:7,y:1,c:p.bodyLight},{ x:8,y:1,c:p.bodyLight},
    { x:9,y:1,c:p.body},{ x:10,y:1,c:p.slime},{ x:11,y:1,c:p.slimeDark},
    { x:2,y:2,c:p.slime},{ x:3,y:2,c:p.body},{ x:4,y:2,c:p.bodyLight},
    { x:5,y:2,c:p.bodyLight},{ x:6,y:2,c:p.bodyLight},{ x:7,y:2,c:p.bodyLight},
    { x:8,y:2,c:p.bodyLight},{ x:9,y:2,c:p.bodyLight},{ x:10,y:2,c:p.bodyLight},
    { x:11,y:2,c:p.body},{ x:12,y:2,c:p.slime},
    // eyes row
    { x:1,y:3,c:p.slime},{ x:2,y:3,c:p.body},{ x:3,y:3,c:p.bodyLight},
    { x:4,y:3,c:p.eye},{ x:5,y:3,c:p.eyeGlow},{ x:6,y:3,c:p.bodyLight},
    { x:7,y:3,c:p.bodyLight},{ x:8,y:3,c:p.bodyLight},{ x:9,y:3,c:p.eye},
    { x:10,y:3,c:p.eyeGlow},{ x:11,y:3,c:p.bodyLight},{ x:12,y:3,c:p.body},
    { x:13,y:3,c:p.slime},
    { x:1,y:4,c:p.body},{ x:2,y:4,c:p.bodyLight},{ x:3,y:4,c:p.bodyLight},
    { x:4,y:4,c:p.eye},{ x:5,y:4,c:p.eye},{ x:6,y:4,c:p.bodyLight},
    { x:7,y:4,c:p.bodyDark},{ x:8,y:4,c:p.bodyLight},{ x:9,y:4,c:p.eye},
    { x:10,y:4,c:p.eye},{ x:11,y:4,c:p.bodyLight},{ x:12,y:4,c:p.bodyLight},
    { x:13,y:4,c:p.body},
    // mouth
    { x:1,y:5,c:p.body},{ x:2,y:5,c:p.bodyLight},{ x:3,y:5,c:p.bodyLight},
    { x:4,y:5,c:p.bodyLight},{ x:5,y:5,c:p.bodyDark},{ x:6,y:5,c:p.accent},
    { x:7,y:5,c:p.accent},{ x:8,y:5,c:p.accent},{ x:9,y:5,c:p.bodyDark},
    { x:10,y:5,c:p.bodyLight},{ x:11,y:5,c:p.bodyLight},{ x:12,y:5,c:p.bodyLight},
    { x:13,y:5,c:p.body},
    // body
    { x:1,y:6,c:p.slime},{ x:2,y:6,c:p.body},{ x:3,y:6,c:p.bodyLight},
    { x:4,y:6,c:p.bodyLight},{ x:5,y:6,c:p.bodyLight},{ x:6,y:6,c:p.bodyLight},
    { x:7,y:6,c:p.slime},{ x:8,y:6,c:p.bodyLight},{ x:9,y:6,c:p.bodyLight},
    { x:10,y:6,c:p.bodyLight},{ x:11,y:6,c:p.bodyLight},{ x:12,y:6,c:p.body},
    { x:13,y:6,c:p.slime},
    { x:0,y:7,c:p.slimeDark},{ x:1,y:7,c:p.body},{ x:2,y:7,c:p.bodyLight},
    { x:7,y:7,c:p.accent},{ x:8,y:7,c:p.accent},{ x:9,y:7,c:p.bodyLight},
    { x:13,y:7,c:p.body},{ x:14,y:7,c:p.slimeDark},
    { x:0,y:8,c:p.slime},{ x:1,y:8,c:p.bodyLight},
    { x:13,y:8,c:p.bodyLight},{ x:14,y:8,c:p.slime},
    // tentacles
    { x:0,y:9,c:p.slimeDark},{ x:1,y:9,c:p.tentacle},{ x:2,y:9,c:p.bodyLight},
    { x:6,y:9,c:p.bodyLight},{ x:7,y:9,c:p.tentacleDark},{ x:8,y:9,c:p.bodyLight},
    { x:12,y:9,c:p.bodyLight},{ x:13,y:9,c:p.tentacle},{ x:14,y:9,c:p.slimeDark},
    { x:0,y:10,c:p.tentacle},{ x:1,y:10,c:p.tentacleDark},{ x:2,y:10,c:p.slime},
    { x:5,y:10,c:p.slime},{ x:6,y:10,c:p.tentacleDark},{ x:7,y:10,c:p.tentacle},
    { x:8,y:10,c:p.tentacleDark},{ x:9,y:10,c:p.slime},
    { x:12,y:10,c:p.slime},{ x:13,y:10,c:p.tentacleDark},{ x:14,y:10,c:p.tentacle},
    { x:0,y:11,c:p.slime},{ x:1,y:11,c:p.tentacle},
    { x:6,y:11,c:p.tentacle},{ x:7,y:11,c:p.slime},
    { x:13,y:11,c:p.tentacle},{ x:14,y:11,c:p.slime},
    { x:1,y:12,c:p.slimeDark},{ x:7,y:12,c:p.slimeDark},{ x:13,y:12,c:p.slimeDark},
  ]

  return (
    <svg width={px(W)} height={px(H)} style={{ imageRendering: 'pixelated' }}>
      <g transform={`translate(0,${bob})`}>
        {grid.map((cell, i) => (
          <rect key={i} x={px(cell.x)} y={px(cell.y)} width={PIXEL} height={PIXEL} fill={cell.c} />
        ))}
      </g>
    </svg>
  )
}

/* ─── INFLATION IMP ───────────────────────────────────────────────────── */
function InflationImpSprite({ palette, frame = 0 }) {
  const bob = frame % 2 === 0 ? 0 : 2
  const p = palette
  const W = 14, H = 18

  const grid = [
    // horns
    { x:2,y:0,c:p.horn},{ x:3,y:0,c:p.hornDark},{ x:9,y:0,c:p.hornDark},{ x:10,y:0,c:p.horn},
    { x:2,y:1,c:p.hornDark},{ x:3,y:1,c:p.horn},{ x:9,y:1,c:p.horn},{ x:10,y:1,c:p.hornDark},
    { x:3,y:2,c:p.hornDark},{ x:9,y:2,c:p.hornDark},
    // head
    { x:3,y:3,c:p.bodyDark},{ x:4,y:3,c:p.body},{ x:5,y:3,c:p.body},
    { x:6,y:3,c:p.body},{ x:7,y:3,c:p.body},{ x:8,y:3,c:p.body},{ x:9,y:3,c:p.bodyDark},
    { x:2,y:4,c:p.bodyDark},{ x:3,y:4,c:p.body},{ x:4,y:4,c:p.eye},
    { x:5,y:4,c:p.eyeGlow},{ x:6,y:4,c:p.bodyLight},{ x:7,y:4,c:p.eye},
    { x:8,y:4,c:p.eyeGlow},{ x:9,y:4,c:p.body},{ x:10,y:4,c:p.bodyDark},
    { x:2,y:5,c:p.body},{ x:3,y:5,c:p.bodyLight},{ x:4,y:5,c:p.eye},
    { x:5,y:5,c:p.eye},{ x:6,y:5,c:p.bodyDark},{ x:7,y:5,c:p.eye},
    { x:8,y:5,c:p.eye},{ x:9,y:5,c:p.bodyLight},{ x:10,y:5,c:p.body},
    { x:2,y:6,c:p.body},{ x:3,y:6,c:p.body},{ x:4,y:6,c:p.bodyLight},
    { x:5,y:6,c:p.flame},{ x:6,y:6,c:p.accent},{ x:7,y:6,c:p.accent},
    { x:8,y:6,c:p.flame},{ x:9,y:6,c:p.bodyLight},{ x:10,y:6,c:p.body},
    // body
    { x:3,y:7,c:p.bodyDark},{ x:4,y:7,c:p.body},{ x:5,y:7,c:p.bodyLight},
    { x:6,y:7,c:p.bodyLight},{ x:7,y:7,c:p.bodyLight},{ x:8,y:7,c:p.bodyLight},
    { x:9,y:7,c:p.body},{ x:10,y:7,c:p.bodyDark},
    { x:2,y:8,c:p.bodyDark},{ x:3,y:8,c:p.body},{ x:4,y:8,c:p.body},
    { x:5,y:8,c:p.flame},{ x:6,y:8,c:p.flameDark},{ x:7,y:8,c:p.flame},
    { x:8,y:8,c:p.body},{ x:9,y:8,c:p.body},{ x:10,y:8,c:p.bodyDark},
    { x:2,y:9,c:p.body},{ x:3,y:9,c:p.bodyDark},{ x:4,y:9,c:p.bodyLight},
    { x:5,y:9,c:p.bodyLight},{ x:6,y:9,c:p.bodyLight},{ x:7,y:9,c:p.bodyLight},
    { x:8,y:9,c:p.bodyLight},{ x:9,y:9,c:p.bodyDark},{ x:10,y:9,c:p.body},
    // wings/arms
    { x:0,y:8,c:p.flameDark},{ x:1,y:8,c:p.flame},
    { x:11,y:8,c:p.flame},{ x:12,y:8,c:p.flameDark},
    { x:0,y:9,c:p.flame},{ x:1,y:9,c:p.flameDark},
    { x:11,y:9,c:p.flameDark},{ x:12,y:9,c:p.flame},
    // legs
    { x:3,y:10,c:p.bodyDark},{ x:4,y:10,c:p.body},{ x:5,y:10,c:p.body},
    { x:8,y:10,c:p.body},{ x:9,y:10,c:p.body},{ x:10,y:10,c:p.bodyDark},
    { x:3,y:11,c:p.body},{ x:4,y:11,c:p.bodyDark},
    { x:9,y:11,c:p.bodyDark},{ x:10,y:11,c:p.body},
    { x:3,y:12,c:p.bodyDark},{ x:4,y:12,c:p.body},
    { x:9,y:12,c:p.body},{ x:10,y:12,c:p.bodyDark},
    // feet
    { x:2,y:13,c:p.accent},{ x:3,y:13,c:p.accent},{ x:4,y:13,c:p.bodyDark},
    { x:9,y:13,c:p.bodyDark},{ x:10,y:13,c:p.accent},{ x:11,y:13,c:p.accent},
    { x:2,y:14,c:p.bodyLight},{ x:3,y:14,c:p.bodyLight},
    { x:10,y:14,c:p.bodyLight},{ x:11,y:14,c:p.bodyLight},
    // tail
    { x:8,y:11,c:p.body},{ x:9,y:12,c:p.bodyDark},{ x:10,y:13,c:p.body},
    { x:11,y:13,c:p.accent},{ x:12,y:12,c:p.bodyDark},{ x:12,y:11,c:p.accent},
  ]

  return (
    <svg width={px(W)} height={px(H)} style={{ imageRendering: 'pixelated' }}>
      <g transform={`translate(0,${bob})`}>
        {grid.map((cell, i) => (
          <rect key={i} x={px(cell.x)} y={px(cell.y)} width={PIXEL} height={PIXEL} fill={cell.c} />
        ))}
      </g>
    </svg>
  )
}

/* ─── TAX TITAN (armored giant) ──────────────────────────────────────── */
function TaxTitanSprite({ palette, frame = 0 }) {
  const bob = frame % 2 === 0 ? 0 : 1
  const p = palette
  const W = 16, H = 22

  const grid = [
    // helmet
    { x:4,y:0,c:p.armor},{ x:5,y:0,c:p.armor},{ x:6,y:0,c:p.accent},
    { x:7,y:0,c:p.accent},{ x:8,y:0,c:p.accent},{ x:9,y:0,c:p.armor},{ x:10,y:0,c:p.armor},
    { x:3,y:1,c:p.armor},{ x:4,y:1,c:p.armorDark},{ x:5,y:1,c:p.armor},
    { x:6,y:1,c:p.accent},{ x:7,y:1,c:p.accent},{ x:8,y:1,c:p.accent},
    { x:9,y:1,c:p.armor},{ x:10,y:1,c:p.armorDark},{ x:11,y:1,c:p.armor},
    { x:3,y:2,c:p.armorDark},{ x:4,y:2,c:p.armor},{ x:5,y:2,c:p.armor},
    { x:6,y:2,c:p.body},{ x:7,y:2,c:p.body},{ x:8,y:2,c:p.body},
    { x:9,y:2,c:p.armor},{ x:10,y:2,c:p.armor},{ x:11,y:2,c:p.armorDark},
    // face visor
    { x:3,y:3,c:p.armor},{ x:4,y:3,c:p.eye},{ x:5,y:3,c:p.eyeGlow},
    { x:6,y:3,c:p.eyeGlow},{ x:7,y:3,c:p.body},{ x:8,y:3,c:p.body},
    { x:9,y:3,c:p.eyeGlow},{ x:10,y:3,c:p.eyeGlow},{ x:11,y:3,c:p.eye},{ x:12,y:3,c:p.armor},
    { x:3,y:4,c:p.armorDark},{ x:4,y:4,c:p.body},{ x:5,y:4,c:p.body},
    { x:6,y:4,c:p.body},{ x:7,y:4,c:p.bodyDark},{ x:8,y:4,c:p.bodyDark},
    { x:9,y:4,c:p.body},{ x:10,y:4,c:p.body},{ x:11,y:4,c:p.body},{ x:12,y:4,c:p.armorDark},
    // shoulders + chest
    { x:1,y:5,c:p.armor},{ x:2,y:5,c:p.armorDark},{ x:3,y:5,c:p.armor},
    { x:4,y:5,c:p.body},{ x:5,y:5,c:p.bodyDark},{ x:6,y:5,c:p.body},
    { x:7,y:5,c:p.body},{ x:8,y:5,c:p.body},{ x:9,y:5,c:p.bodyDark},
    { x:10,y:5,c:p.body},{ x:11,y:5,c:p.armor},{ x:12,y:5,c:p.armorDark},{ x:13,y:5,c:p.armor},
    { x:0,y:6,c:p.armorDark},{ x:1,y:6,c:p.armor},{ x:2,y:6,c:p.armor},
    { x:3,y:6,c:p.armorDark},{ x:4,y:6,c:p.armor},{ x:5,y:6,c:p.body},
    { x:6,y:6,c:p.accent},{ x:7,y:6,c:p.accent},{ x:8,y:6,c:p.body},
    { x:9,y:6,c:p.armor},{ x:10,y:6,c:p.armorDark},{ x:11,y:6,c:p.armor},
    { x:12,y:6,c:p.armor},{ x:13,y:6,c:p.armorDark},{ x:14,y:6,c:p.armor},
    { x:0,y:7,c:p.armor},{ x:1,y:7,c:p.armorDark},{ x:2,y:7,c:p.weapon},
    { x:3,y:7,c:p.armor},{ x:4,y:7,c:p.armorDark},{ x:5,y:7,c:p.body},
    { x:6,y:7,c:p.body},{ x:7,y:7,c:p.bodyDark},{ x:8,y:7,c:p.body},
    { x:9,y:7,c:p.body},{ x:10,y:7,c:p.armorDark},{ x:11,y:7,c:p.armor},
    { x:12,y:7,c:p.weapon},{ x:13,y:7,c:p.armorDark},{ x:14,y:7,c:p.armor},
    // waist
    { x:3,y:8,c:p.armorDark},{ x:4,y:8,c:p.armor},{ x:5,y:8,c:p.armorDark},
    { x:6,y:8,c:p.body},{ x:7,y:8,c:p.body},{ x:8,y:8,c:p.body},
    { x:9,y:8,c:p.armorDark},{ x:10,y:8,c:p.armor},{ x:11,y:8,c:p.armorDark},
    { x:3,y:9,c:p.armor},{ x:4,y:9,c:p.armorDark},{ x:5,y:9,c:p.armor},
    { x:6,y:9,c:p.armorDark},{ x:7,y:9,c:p.armor},{ x:8,y:9,c:p.armorDark},
    { x:9,y:9,c:p.armor},{ x:10,y:9,c:p.armorDark},{ x:11,y:9,c:p.armor},
    // weapon arm
    { x:0,y:8,c:p.armor},{ x:1,y:8,c:p.weapon},
    { x:0,y:9,c:p.weaponGlow},{ x:1,y:9,c:p.weapon},
    { x:0,y:10,c:p.weapon},{ x:1,y:10,c:p.weaponGlow},
    { x:0,y:11,c:p.weaponGlow},
    // legs
    { x:4,y:10,c:p.armorDark},{ x:5,y:10,c:p.armor},{ x:6,y:10,c:p.body},
    { x:7,y:10,c:p.body},{ x:8,y:10,c:p.body},{ x:9,y:10,c:p.armor},{ x:10,y:10,c:p.armorDark},
    { x:4,y:11,c:p.armor},{ x:5,y:11,c:p.armorDark},{ x:6,y:11,c:p.body},
    { x:7,y:11,c:p.bodyDark},{ x:8,y:11,c:p.body},{ x:9,y:11,c:p.armorDark},{ x:10,y:11,c:p.armor},
    { x:4,y:12,c:p.armorDark},{ x:5,y:12,c:p.armor},{ x:6,y:12,c:p.body},
    { x:7,y:12,c:p.body},{ x:8,y:12,c:p.body},{ x:9,y:12,c:p.armor},{ x:10,y:12,c:p.armorDark},
    // knee armor
    { x:4,y:13,c:p.accent},{ x:5,y:13,c:p.accent},{ x:9,y:13,c:p.accent},{ x:10,y:13,c:p.accent},
    // lower legs
    { x:4,y:14,c:p.armorDark},{ x:5,y:14,c:p.armor},
    { x:9,y:14,c:p.armor},{ x:10,y:14,c:p.armorDark},
    { x:4,y:15,c:p.armor},{ x:5,y:15,c:p.armorDark},
    { x:9,y:15,c:p.armorDark},{ x:10,y:15,c:p.armor},
    // boots
    { x:3,y:16,c:p.bodyDark},{ x:4,y:16,c:p.body},{ x:5,y:16,c:p.armorDark},
    { x:8,y:16,c:p.armorDark},{ x:9,y:16,c:p.body},{ x:10,y:16,c:p.bodyDark},
    { x:3,y:17,c:p.body},{ x:4,y:17,c:p.bodyDark},{ x:5,y:17,c:p.body},
    { x:8,y:17,c:p.body},{ x:9,y:17,c:p.bodyDark},{ x:10,y:17,c:p.body},
  ]

  return (
    <svg width={px(W)} height={px(H)} style={{ imageRendering: 'pixelated' }}>
      <g transform={`translate(0,${bob})`}>
        {grid.map((cell, i) => (
          <rect key={i} x={px(cell.x)} y={px(cell.y)} width={PIXEL} height={PIXEL} fill={cell.c} />
        ))}
      </g>
    </svg>
  )
}

/* ─── CRYPTO CHAOS (digital entity) ──────────────────────────────────── */
function CryptoChaosSprite({ palette, frame = 0 }) {
  const bob = frame % 2 === 0 ? 0 : 2
  const p = palette
  const W = 16, H = 20
  // Glitch offset for digital effect
  const glitch = frame % 4 === 0 ? 2 : 0

  const grid = [
    // core body — angular digital form
    { x:5,y:1,c:p.data},{ x:6,y:1,c:p.bodyLight},{ x:7,y:1,c:p.bodyLight},
    { x:8,y:1,c:p.bodyLight},{ x:9,y:1,c:p.data},
    { x:3,y:2,c:p.data},{ x:4,y:2,c:p.bodyLight},{ x:5,y:2,c:p.body},
    { x:6,y:2,c:p.body},{ x:7,y:2,c:p.body},{ x:8,y:2,c:p.body},
    { x:9,y:2,c:p.body},{ x:10,y:2,c:p.bodyLight},{ x:11,y:2,c:p.data},
    { x:2,y:3,c:p.dataDark},{ x:3,y:3,c:p.body},{ x:4,y:3,c:p.body},
    { x:5,y:3,c:p.eye},{ x:6,y:3,c:p.eyeGlow},{ x:7,y:3,c:p.bodyLight},
    { x:8,y:3,c:p.eye},{ x:9,y:3,c:p.eyeGlow},{ x:10,y:3,c:p.body},
    { x:11,y:3,c:p.body},{ x:12,y:3,c:p.dataDark},
    { x:2,y:4,c:p.body},{ x:3,y:4,c:p.bodyLight},{ x:4,y:4,c:p.eye},
    { x:5,y:4,c:p.eye},{ x:6,y:4,c:p.bodyLight},{ x:7,y:4,c:p.circuit},
    { x:8,y:4,c:p.eye},{ x:9,y:4,c:p.eye},{ x:10,y:4,c:p.bodyLight},
    { x:11,y:4,c:p.bodyLight},{ x:12,y:4,c:p.body},
    // circuit pattern
    { x:2,y:5,c:p.dataDark},{ x:3,y:5,c:p.circuit},{ x:4,y:5,c:p.body},
    { x:5,y:5,c:p.circuit},{ x:6,y:5,c:p.circuitGlow},{ x:7,y:5,c:p.circuit},
    { x:8,y:5,c:p.circuitGlow},{ x:9,y:5,c:p.circuit},{ x:10,y:5,c:p.body},
    { x:11,y:5,c:p.circuit},{ x:12,y:5,c:p.dataDark},
    { x:2,y:6,c:p.body},{ x:3,y:6,c:p.bodyLight},{ x:4,y:6,c:p.body},
    { x:5,y:6,c:p.body},{ x:6,y:6,c:p.accent},{ x:7,y:6,c:p.accent},
    { x:8,y:6,c:p.body},{ x:9,y:6,c:p.body},{ x:10,y:6,c:p.bodyLight},
    { x:11,y:6,c:p.body},{ x:12,y:6,c:p.body},
    { x:1,y:7,c:p.dataDark},{ x:2,y:7,c:p.data},{ x:3,y:7,c:p.body},
    { x:4,y:7,c:p.bodyLight},{ x:5,y:7,c:p.body},{ x:6,y:7,c:p.body},
    { x:7,y:7,c:p.body},{ x:8,y:7,c:p.body},{ x:9,y:7,c:p.bodyLight},
    { x:10,y:7,c:p.body},{ x:11,y:7,c:p.data},{ x:12,y:7,c:p.dataDark},
    { x:1,y:8,c:p.data},{ x:2,y:8,c:p.circuit},{ x:3,y:8,c:p.body},
    { x:5,y:8,c:p.circuit},{ x:6,y:8,c:p.circuitGlow},{ x:7,y:8,c:p.circuit},
    { x:8,y:8,c:p.circuitGlow},{ x:9,y:8,c:p.circuit},{ x:11,y:8,c:p.circuit},
    { x:12,y:8,c:p.data},
    // glitch arms
    { x:0+glitch,y:6,c:p.bodyLight},{ x:0+glitch,y:7,c:p.data},
    { x:13-glitch,y:6,c:p.bodyLight},{ x:13-glitch,y:7,c:p.data},
    // lower body
    { x:3,y:9,c:p.dataDark},{ x:4,y:9,c:p.body},{ x:5,y:9,c:p.body},
    { x:6,y:9,c:p.bodyDark},{ x:7,y:9,c:p.body},{ x:8,y:9,c:p.body},
    { x:9,y:9,c:p.bodyDark},{ x:10,y:9,c:p.body},{ x:11,y:9,c:p.dataDark},
    { x:4,y:10,c:p.body},{ x:5,y:10,c:p.bodyDark},{ x:6,y:10,c:p.body},
    { x:7,y:10,c:p.body},{ x:8,y:10,c:p.body},{ x:9,y:10,c:p.bodyDark},
    { x:10,y:10,c:p.body},
    // legs/tendrils
    { x:4,y:11,c:p.dataDark},{ x:5,y:11,c:p.data},
    { x:8,y:11,c:p.data},{ x:9,y:11,c:p.dataDark},
    { x:4,y:12,c:p.data},{ x:5,y:12,c:p.circuit},
    { x:8,y:12,c:p.circuit},{ x:9,y:12,c:p.data},
    { x:3,y:13,c:p.dataDark},{ x:4,y:13,c:p.data},
    { x:9,y:13,c:p.data},{ x:10,y:13,c:p.dataDark},
    { x:3,y:14,c:p.data},{ x:4,y:14,c:p.circuitGlow},
    { x:9,y:14,c:p.circuitGlow},{ x:10,y:14,c:p.data},
  ]

  return (
    <svg width={px(W)} height={px(H)} style={{ imageRendering: 'pixelated' }}>
      <g transform={`translate(0,${bob})`}>
        {grid.map((cell, i) => (
          <rect key={i} x={px(cell.x)} y={px(cell.y)} width={PIXEL} height={PIXEL} fill={cell.c} />
        ))}
      </g>
    </svg>
  )
}

/* ─── MAIN EXPORT ─────────────────────────────────────────────────────── */
export default function PixelBoss({ bossId, palette, frame = 0, scale = 1.5 }) {
  const sprites = {
    'debt-dragon':   <DebtDragonSprite palette={palette} frame={frame} />,
    'budget-buster': <BudgetBusterSprite palette={palette} frame={frame} />,
    'inflation-imp': <InflationImpSprite palette={palette} frame={frame} />,
    'tax-titan':     <TaxTitanSprite palette={palette} frame={frame} />,
    'crypto-chaos':  <CryptoChaosSprite palette={palette} frame={frame} />,
  }

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'center bottom', imageRendering: 'pixelated' }}>
      {sprites[bossId] || null}
    </div>
  )
}
