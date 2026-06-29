// To-Go trifold — INSIDE (Sheet 2): the full menu in 3 panels.
// Reads the SAME section data as the dine-in menu (edits stay in sync).
import { Fragment, type CSSProperties } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './trifold.css';
import { type BuildData, type Item, type Section, type TrifoldOutsideData } from './data';
import { Editable } from './Editable';

// Compact mirror of the dine-in Build Your Own grid: size headers + per-size
// prices for cheese & every premium topping, plus sauces / proteins / classic
// toppings. Edits route through the shared build handlers (sync with page 3).
function TriBuild({
  build,
  onCell,
  onLabel,
  onText,
}: {
  build: BuildData;
  onCell: (row: number, col: number, v: string) => void;
  onLabel: (row: number, v: string) => void;
  onText: (field: 'sauces' | 'proteins' | 'classicToppings' | 'note', v: string) => void;
}) {
  const cheese = build.rows[0];
  const premium = build.rows.slice(1);
  return (
    <>
      <div className="ph ph2">
        Build Your Own <small>pizza or calzone</small>
      </div>
      <div className="tbyo-grid">
        <div className="tbh lead" />
        {build.sizes.map((s, i) => (
          <div className="tbh" key={i}>{s}</div>
        ))}
        <div className="tbr"><Editable value={cheese.label} onChange={(v) => onLabel(0, v)} /></div>
        {cheese.prices.map((p, ci) => (
          <div className="tbc" key={ci}><Editable value={p} onChange={(v) => onCell(0, ci, v)} /></div>
        ))}
      </div>
      <div className="tbsep">Premium Toppings</div>
      <div className="tbyo-grid">
        {premium.map((row, i) => {
          const ri = i + 1;
          return (
            <Fragment key={ri}>
              <div className="tbr"><Editable value={row.label} onChange={(v) => onLabel(ri, v)} /></div>
              {row.prices.map((p, ci) => (
                <div className="tbc" key={ci}><Editable value={p} onChange={(v) => onCell(ri, ci, v)} /></div>
              ))}
            </Fragment>
          );
        })}
      </div>
      <div className="byo-l"><span className="byo-k">Sauces</span><Editable value={build.sauces} onChange={(v) => onText('sauces', v)} /></div>
      <div className="byo-l"><span className="byo-k">Proteins</span><Editable value={build.proteins} onChange={(v) => onText('proteins', v)} /></div>
      <div className="byo-l"><span className="byo-k">Classic</span><Editable value={build.classicToppings} onChange={(v) => onText('classicToppings', v)} /></div>
      <div className="note"><Editable value={build.note} onChange={(v) => onText('note', v)} /></div>
    </>
  );
}

// One draggable trifold item: grip + remove, editable name/price/note.
function TriItem({
  it,
  sid,
  onEdit,
  onRemove,
}: {
  it: Item;
  sid: string;
  onEdit: (id: string, patch: Partial<Item>) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: it.id as string,
    data: { type: 'item', container: sid },
  });
  const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 };
  const id = it.id as string;
  return (
    <div className="ti" ref={setNodeRef} style={style} {...attributes}>
      <div className="item-tools">
        <button className="grip" title="Drag" {...listeners}>⠿</button>
        <button className="rm" title="Remove" onPointerDown={(e) => e.stopPropagation()} onClick={onRemove}>×</button>
      </div>
      <div className="tih">
        <Editable className="tin" value={it.n} onChange={(v) => onEdit(id, { n: v })} />
        <Editable className="tip" value={it.p} onChange={(v) => onEdit(id, { p: v })} />
      </div>
      <Editable className="tid" value={it.d ?? ''} onChange={(v) => onEdit(id, { d: v })} />
    </div>
  );
}

function TriSection({
  s,
  onEdit,
  onEditSection,
  onRemove,
}: {
  s: Section;
  onEdit: (id: string, patch: Partial<Item>) => void;
  onEditSection: (sid: string, patch: Partial<Section>) => void;
  onRemove: (sid: string, itemId: string) => void;
}) {
  const drop = useDroppable({ id: s.id, data: { type: 'container' } });
  return (
    <>
      <div className="ph ph2">
        <Editable value={s.title} onChange={(v) => onEditSection(s.id, { title: v })} />
        {s.note != null ? (
          <small><Editable value={s.note} onChange={(v) => onEditSection(s.id, { note: v })} /></small>
        ) : null}
      </div>
      <div className="ti-list" ref={drop.setNodeRef}>
        <SortableContext items={s.items.map((i) => i.id as string)} strategy={verticalListSortingStrategy}>
          {s.items.map((it) => (
            <TriItem key={it.id} it={it} sid={s.id} onEdit={onEdit} onRemove={() => onRemove(s.id, it.id as string)} />
          ))}
        </SortableContext>
      </div>
    </>
  );
}

// To-Go trifold — OUTSIDE (Sheet 1): Visit Us · We Cater · Cover.
// Editable text only (no items). Prints back-to-back with the inside.
export function TrifoldOutside({
  data,
  onEdit,
}: {
  data: TrifoldOutsideData;
  onEdit: (field: keyof TrifoldOutsideData, v: string) => void;
}) {
  const E = (field: keyof TrifoldOutsideData) => (
    <Editable value={data[field]} onChange={(v) => onEdit(field, v)} />
  );
  return (
    <div className="sheet">
      {/* Visit Us */}
      <div className="panel fold outp">
        <h3 className="bk-h">{E('visitH')}</h3>
        <div className="bk-rule" />
        <div className="tloc">
          <div className="loc-city">{E('loc1City')}</div>
          <div className="loc-l">{E('loc1Addr')}<br />{E('loc1Phone')}</div>
        </div>
        <div className="tloc">
          <div className="loc-city">{E('loc2City')}</div>
          <div className="loc-l">{E('loc2Addr')}<br />{E('loc2Phone')}</div>
        </div>
        <div className="hrs">
          <div className="hrs-big">{E('hoursBig')}</div>
          <div className="hrs-s">{E('hoursSub1')}<br />{E('hoursSub2')}</div>
        </div>
        <div className="web">{E('web')}</div>
        <span className="foldtag">Fold</span>
      </div>
      {/* We Cater */}
      <div className="panel fold outp">
        <svg className="t-sprig" viewBox="0 0 200 46">
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
        <h3 className="ab-h">{E('caterH')}</h3>
        <p className="ab-p">{E('caterP1')}</p>
        <p className="ab-p">{E('caterP2')}</p>
        <div className="t-cater-list">{E('caterList1')}<br />{E('caterList2')}<br />{E('caterList3')}</div>
        <span className="foldtag">Fold</span>
      </div>
      {/* Front cover */}
      <div className="panel cov">
        <div className="cov-est">{E('est')}</div>
        <div>
          <img className="cov-logo" src="/olive-branch-logo.png" alt="The Olive Branch Café" />
          <div className="cov-tag">{E('tagline')}</div>
        </div>
        <div>
          <div className="cov-togo">{E('togo')}</div>
          <div className="cov-rule" />
          <div className="cov-sub">{E('sub')}</div>
        </div>
      </div>
    </div>
  );
}

export function TrifoldInside({
  sections,
  build,
  onEdit,
  onEditSection,
  onRemove,
  onCell,
  onLabel,
  onText,
}: {
  sections: Record<string, Section>;
  build: BuildData;
  onEdit: (id: string, patch: Partial<Item>) => void;
  onEditSection: (sid: string, patch: Partial<Section>) => void;
  onRemove: (sid: string, itemId: string) => void;
  onCell: (row: number, col: number, v: string) => void;
  onLabel: (row: number, v: string) => void;
  onText: (field: 'sauces' | 'proteins' | 'classicToppings' | 'note', v: string) => void;
}) {
  const S = (id: string) =>
    sections[id] ? <TriSection s={sections[id]} onEdit={onEdit} onEditSection={onEditSection} onRemove={onRemove} /> : null;
  return (
    <div className="sheet">
      <div className="panel fold">
        {S('appetizers')}
        {S('cannolis')}
        {S('soupsSalads')}
        <span className="foldtag">Fold</span>
      </div>
      <div className="panel fold">
        {S('subsWraps')}
        {S('signature')}
        {S('classic')}
        <span className="foldtag">Fold</span>
      </div>
      <div className="panel">
        {S('pizzas')}
        {S('combos')}
        <TriBuild build={build} onCell={onCell} onLabel={onLabel} onText={onText} />
      </div>
    </div>
  );
}
