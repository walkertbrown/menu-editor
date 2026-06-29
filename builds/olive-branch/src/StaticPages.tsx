// Cover & Back: editable text + reorderable ("move up/down") blocks.
// Page-3 fixed blocks (Build Your Own). Rendered inside <div class="menu v-b">.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { type BuildData, type CoverData, type BackData } from './data';
import { Editable } from './Editable';

// Wraps a page block with a centered grab handle; drag it up/down to nudge the
// piece's vertical position. Offset is committed on release.
function DragBlock({
  offset,
  onCommit,
  children,
}: {
  offset: number;
  onCommit: (v: number) => void;
  children: ReactNode;
}) {
  const [live, setLive] = useState(offset);
  const liveRef = useRef(offset);
  const drag = useRef<{ y: number; base: number } | null>(null);
  useEffect(() => { setLive(offset); liveRef.current = offset; }, [offset]);
  const down = (e: any) => {
    drag.current = { y: e.clientY, base: liveRef.current };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: any) => {
    if (!drag.current) return;
    const v = drag.current.base + (e.clientY - drag.current.y);
    liveRef.current = v;
    setLive(v);
  };
  const up = () => {
    if (drag.current) { drag.current = null; onCommit(liveRef.current); }
  };
  return (
    <div className="dblock" style={{ transform: live ? `translateY(${live}px)` : undefined }}>
      <button
        className="dgrip"
        title="Drag to move up/down"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
      >
        ⠿
      </button>
      {children}
    </div>
  );
}

export function Cover({
  data,
  onEdit,
  onMove,
}: {
  data: CoverData;
  onEdit: (field: string, v: string) => void;
  onOffset: (key: string, v: number) => void;
}) {
  const blocks: Record<string, ReactNode> = {
    est: (
      <div className="est">
        <Editable value={data.est} onChange={(v) => onEdit('est', v)} />
      </div>
    ),
    center: (
      <div className="cover-center">
        <img className="cover-logo" src="/olive-branch-logo.png" alt="The Olive Branch Café" />
        <div className="tagline">
          <Editable value={data.tagline} onChange={(v) => onEdit('tagline', v)} />
        </div>
        <div className="cover-blurb">
          <Editable value={data.blurb} onChange={(v) => onEdit('blurb', v)} />
        </div>
      </div>
    ),
    foot: (
      <div className="cover-foot">
        <div className="loc">
          <div className="loc-city"><Editable value={data.marreroCity} onChange={(v) => onEdit('marreroCity', v)} /></div>
          <div className="loc-addr"><Editable value={data.marreroAddr} onChange={(v) => onEdit('marreroAddr', v)} /></div>
        </div>
        <div className="loc-mid">
          <div className="hours"><Editable value={data.hours} onChange={(v) => onEdit('hours', v)} /></div>
          <div className="serve"><Editable value={data.serve} onChange={(v) => onEdit('serve', v)} /></div>
        </div>
        <div className="loc">
          <div className="loc-city"><Editable value={data.algiersCity} onChange={(v) => onEdit('algiersCity', v)} /></div>
          <div className="loc-addr"><Editable value={data.algiersAddr} onChange={(v) => onEdit('algiersAddr', v)} /></div>
        </div>
      </div>
    ),
  };
  return (
    <div className="page cover">
      {data.order.map((key) => (
        <DragBlock key={key} offset={data.offsets?.[key] ?? 0} onCommit={(v) => onOffset(key, v)}>
          {blocks[key]}
        </DragBlock>
      ))}
    </div>
  );
}

export function Back({
  data,
  onEdit,
  onMove,
}: {
  data: BackData;
  onEdit: (field: string, v: string) => void;
  onOffset: (key: string, v: number) => void;
}) {
  const blocks: Record<string, ReactNode> = {
    wine: (
      <div className="back-wine">
        <div className="byow">
          <div className="byow-l"><Editable value={data.byowL} onChange={(v) => onEdit('byowL', v)} /></div>
          <div className="byow-r">
            <div className="byow-wine"><Editable value={data.byowWine} onChange={(v) => onEdit('byowWine', v)} /></div>
            <div className="byow-sub"><Editable value={data.byowSub} onChange={(v) => onEdit('byowSub', v)} /></div>
          </div>
        </div>
        <div className="byow-tag"><Editable value={data.byowTag} onChange={(v) => onEdit('byowTag', v)} /></div>
      </div>
    ),
    about: (
      <div className="about">
        <h2 className="about-h"><Editable value={data.aboutH} onChange={(v) => onEdit('aboutH', v)} /></h2>
        <div className="about-rule" />
        <p><Editable value={data.p1} onChange={(v) => onEdit('p1', v)} /></p>
        <p><Editable value={data.p2} onChange={(v) => onEdit('p2', v)} /></p>
        <p><Editable value={data.p3} onChange={(v) => onEdit('p3', v)} /></p>
      </div>
    ),
    cater: (
      <div className="cater">
        <svg className="sprig" viewBox="0 0 200 46">
          <line x1="8" y1="23" x2="192" y2="23" />
          <ellipse cx="58" cy="13" rx="11" ry="4.5" transform="rotate(-22 58 13)" />
          <ellipse cx="84" cy="11" rx="11" ry="4.5" transform="rotate(-22 84 11)" />
          <ellipse cx="110" cy="13" rx="11" ry="4.5" transform="rotate(-22 110 13)" />
          <ellipse cx="71" cy="33" rx="11" ry="4.5" transform="rotate(22 71 33)" />
          <ellipse cx="97" cy="35" rx="11" ry="4.5" transform="rotate(22 97 35)" />
          <ellipse cx="123" cy="33" rx="11" ry="4.5" transform="rotate(22 123 33)" />
          <circle cx="146" cy="23" r="5" />
          <circle cx="160" cy="23" r="5" />
        </svg>
        <h2 className="cater-h"><Editable value={data.caterH} onChange={(v) => onEdit('caterH', v)} /></h2>
        <div className="cater-list"><Editable value={data.caterList} onChange={(v) => onEdit('caterList', v)} /></div>
        <div className="cater-quote"><Editable value={data.caterQuote} onChange={(v) => onEdit('caterQuote', v)} /></div>
        <div className="cater-sign"><Editable value={data.caterSign} onChange={(v) => onEdit('caterSign', v)} /></div>
        <div className="cater-web"><Editable value={data.caterWeb} onChange={(v) => onEdit('caterWeb', v)} /></div>
        <div className="gluten"><Editable value={data.gluten} onChange={(v) => onEdit('gluten', v)} /></div>
      </div>
    ),
  };
  return (
    <div className="page back">
      {data.order.map((key) => (
        <DragBlock key={key} offset={data.offsets?.[key] ?? 0} onCommit={(v) => onOffset(key, v)}>
          {blocks[key]}
        </DragBlock>
      ))}
    </div>
  );
}

// Page-3 fixed block: Build Your Own (editable prices / toppings / lists).
export function Page3Extras({
  gaps,
  build,
  onCell,
  onLabel,
  onAddTopping,
  onRemoveTopping,
  onText,
}: {
  gaps?: Record<string, number>;
  build: BuildData;
  onCell: (row: number, col: number, v: string) => void;
  onLabel: (row: number, v: string) => void;
  onAddTopping: () => void;
  onRemoveTopping: (row: number) => void;
  onText: (field: 'sauces' | 'proteins' | 'classicToppings' | 'note', v: string) => void;
}) {
  const g = (id: string): CSSProperties | undefined =>
    gaps?.[id] != null ? { marginBottom: gaps[id] } : undefined;
  const cheese = build.rows[0];
  const premium = build.rows.slice(1);

  return (
    <div className="section build" data-sid="build" style={g('build')}>
      <div className="sec-head">
        <span className="sec-title">Build Your Own Pizza or Calzone</span>
        <span className="sec-line" />
      </div>
      <div className="byo-grid">
        <div className="bh lead" />
        {build.sizes.map((s, i) => (
          <div className="bh" key={i}>{s}</div>
        ))}

        <div className="br"><Editable value={cheese.label} onChange={(v) => onLabel(0, v)} /></div>
        {cheese.prices.map((p, ci) => (
          <div className="bc" key={ci}><Editable value={p} onChange={(v) => onCell(0, ci, v)} /></div>
        ))}

        <div className="bsep">Premium Toppings</div>

        {premium.map((row, i) => {
          const rowIndex = i + 1;
          return (
            <BuildRowCells
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              onCell={onCell}
              onLabel={onLabel}
              onRemove={() => onRemoveTopping(rowIndex)}
            />
          );
        })}
      </div>
      <button className="add-topping" onClick={onAddTopping}>+ Add topping</button>

      <div className="topcols">
        <div>
          <div className="tl">Sauces</div>
          <div className="tbody"><Editable value={build.sauces} onChange={(v) => onText('sauces', v)} /></div>
        </div>
        <div>
          <div className="tl">Proteins</div>
          <div className="tbody"><Editable value={build.proteins} onChange={(v) => onText('proteins', v)} /></div>
        </div>
        <div className="wide">
          <div className="tl">Classic Toppings</div>
          <div className="tbody">
            <Editable value={build.classicToppings} onChange={(v) => onText('classicToppings', v)} />
          </div>
        </div>
      </div>
      <div className="byo-note"><Editable value={build.note} onChange={(v) => onText('note', v)} /></div>
    </div>
  );
}

function BuildRowCells({
  row,
  rowIndex,
  onCell,
  onLabel,
  onRemove,
}: {
  row: { label: string; prices: string[] };
  rowIndex: number;
  onCell: (row: number, col: number, v: string) => void;
  onLabel: (row: number, v: string) => void;
  onRemove: () => void;
}) {
  return (
    <>
      <div className="br byo-row">
        <button className="byo-rm" title="Remove topping" onClick={onRemove}>×</button>
        <Editable value={row.label} onChange={(v) => onLabel(rowIndex, v)} />
      </div>
      {row.prices.map((p, ci) => (
        <div className="bc" key={ci}><Editable value={p} onChange={(v) => onCell(rowIndex, ci, v)} /></div>
      ))}
    </>
  );
}
