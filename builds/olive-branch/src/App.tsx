import './menu.css';
import './editor.css';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ChangeEvent } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCorners,
  type CollisionDetection,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type Item, type Section, type BuildData, type TrifoldOutsideData } from './data';
import { load, save, seed, hasLocal, adopt, type MenuState } from './store';
import { ItemRow, SectionBlock } from './SectionBlock';
import { pushBackup, pullBackup } from './backup';
import { BACKUP_ENABLED } from './config';
import { Cover, Back, Page3Extras } from './StaticPages';
import { TrifoldInside, TrifoldOutside } from './Trifold';
import { Editable } from './Editable';

const MIN_GAP = 6;
const PARKED = 'PARKED';

type PageId = 'cover' | 'food' | 'special' | 'back' | 'trifold' | 'trioutside';
const PAGES: { id: PageId; label: string; editable: boolean }[] = [
  { id: 'cover', label: 'Cover', editable: false },
  { id: 'food', label: 'Page 2 · Starters', editable: true },
  { id: 'special', label: 'Page 3 · Pasta & Pizza', editable: true },
  { id: 'back', label: 'Back', editable: false },
  { id: 'trioutside', label: 'To-Go · Outside', editable: true },
  { id: 'trifold', label: 'To-Go · Inside', editable: true },
];
// Trifold sheets are landscape letter; everything else is legal portrait.
const LANDSCAPE: PageId[] = ['trifold', 'trioutside'];

// One editable column inside the locked Beverages+Desserts pair.
function PairColumn({
  s,
  dragProps,
  twoCol,
  onRemove,
  onEdit,
  onEditSection,
}: {
  s: Section;
  dragProps: Record<string, unknown>;
  twoCol?: boolean;
  onRemove: (sid: string, itemId: string) => void;
  onEdit: (id: string, patch: Partial<Item>) => void;
  onEditSection: (sid: string, patch: Partial<Section>) => void;
}) {
  const drop = useDroppable({ id: s.id, data: { type: 'container' } });
  return (
    <div className="section">
      <div className="sec-head">
        <button className="sec-grip" title="Drag drinks & desserts" {...dragProps}>⠿</button>
        <Editable className="sec-title" value={s.title} onChange={(v) => onEditSection(s.id, { title: v })} />
        <span className="sec-line" />
      </div>
      <div className={twoCol ? 'items' : 'items one-col'} ref={drop.setNodeRef}>
        {s.items.map((it) => (
          <div className="item" key={it.id}>
            <div className="item-tools">
              <button
                className="rm"
                title="Remove"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => onRemove(s.id, it.id as string)}
              >
                ×
              </button>
            </div>
            <div className="item-head">
              <Editable className="item-name" value={it.n} onChange={(v) => onEdit(it.id as string, { n: v })} />
              <span className="dots" />
              <Editable className="item-price" value={it.p} onChange={(v) => onEdit(it.id as string, { p: v })} />
            </div>
            <Editable className="item-desc" value={it.d ?? ''} onChange={(v) => onEdit(it.id as string, { d: v })} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Beverages + Desserts: two columns locked together as one draggable unit.
function PairBlock({
  bev,
  dess,
  gap,
  onRemove,
  onEdit,
  onEditSection,
}: {
  bev: Section;
  dess: Section;
  gap?: number;
  onRemove: (sid: string, itemId: string) => void;
  onEdit: (id: string, patch: Partial<Item>) => void;
  onEditSection: (sid: string, patch: Partial<Section>) => void;
}) {
  const sortable = useSortable({ id: 'sec:bevpair', data: { type: 'section' } });
  const dragProps = { ...sortable.attributes, ...sortable.listeners };
  const style: CSSProperties = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
    marginBottom: gap != null ? gap : undefined,
    opacity: sortable.isDragging ? 0.6 : 1,
  };
  return (
    <div className="bd-row" ref={sortable.setNodeRef} data-sid="bevpair" style={style}>
      <PairColumn s={bev} dragProps={dragProps} twoCol onRemove={onRemove} onEdit={onEdit} onEditSection={onEditSection} />
      <PairColumn s={dess} dragProps={dragProps} onRemove={onRemove} onEdit={onEdit} onEditSection={onEditSection} />
    </div>
  );
}

export default function App() {
  const [state, setState] = useState<MenuState>(() => load());
  const [dirty, setDirty] = useState(false);
  const [fit, setFit] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pageId, setPageId] = useState<PageId>('food');
  const [variant, setVariant] = useState<'b' | 'bw'>('b'); // color (b) | black & white (bw)
  const [tick, setTick] = useState(0); // re-measure trigger (fonts loaded / page switch)
  // Backup status shown next to Save: idle | syncing | ok | pending (offline, will retry)
  const [sync, setSync] = useState<'idle' | 'syncing' | 'ok' | 'pending'>('idle');
  const pageRef = useRef<HTMLDivElement>(null);
  const trifoldRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef(state); // latest state for async listeners (online catch-up)
  stateRef.current = state;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const PENDING_KEY = 'olive-branch-backup-pending';

  const bumpFit = () => { setDirty(true); setFit((f) => f + 1); };

  // The To-Go trifold is its own dataset. Every item/section/build/park operation
  // targets whichever dataset the current page belongs to — never both.
  const isTri = pageId === 'trifold';
  const curSections = isTri ? state.trifold.sections : state.sections;
  const curParked = isTri ? state.trifold.parked : state.parked;
  const curBuild = isTri ? state.trifold.build : state.build;
  const secsOf = (s: MenuState) => (isTri ? s.trifold.sections : s.sections);

  // Container ids for normal dine-in sections use `${sectionId}::L` / `::R`.
  // Beverages, desserts, and trifold sections still use the bare section id.
  const getItems = (s: MenuState, c: string): Item[] => {
    if (c === PARKED) return isTri ? s.trifold.parked : s.parked;
    if (c.endsWith('::L')) return secsOf(s)[c.slice(0, -3)].colL ?? [];
    if (c.endsWith('::R')) return secsOf(s)[c.slice(0, -3)].colR ?? [];
    return secsOf(s)[c].items; // bev, dess, or trifold sections
  };
  const setItems = (s: MenuState, c: string, arr: Item[]) => {
    if (c === PARKED) { if (isTri) s.trifold.parked = arr; else s.parked = arr; return; }
    if (c.endsWith('::L')) { secsOf(s)[c.slice(0, -3)].colL = arr; return; }
    if (c.endsWith('::R')) { secsOf(s)[c.slice(0, -3)].colR = arr; return; }
    secsOf(s)[c].items = arr; // bev, dess, or trifold sections
  };

  const findContainer = (id: string): string | null => {
    if (id === PARKED) return PARKED;
    // Already a column container id (e.g. when dragging over an empty column).
    if (id.endsWith('::L') || id.endsWith('::R')) return id;
    if (isTri) {
      // Trifold: all sections use single items lists.
      if (curSections[id]) return id;
      for (const sid of Object.keys(curSections)) {
        if (curSections[sid].items.some((it) => it.id === id)) return sid;
      }
    } else {
      // Dine-in: bev/dess use bare section id; all others use ::L / ::R columns.
      if (id === 'beverages' || id === 'desserts') return id;
      for (const sid of Object.keys(curSections)) {
        if (sid === 'beverages' || sid === 'desserts') {
          if (curSections[sid].items.some((it) => it.id === id)) return sid;
        } else {
          if ((curSections[sid].colL ?? []).some((it) => it.id === id)) return `${sid}::L`;
          if ((curSections[sid].colR ?? []).some((it) => it.id === id)) return `${sid}::R`;
        }
      }
    }
    if (curParked.some((it) => it.id === id)) return PARKED;
    return null;
  };

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over || active.data.current?.type !== 'item') return;
    const from = findContainer(String(active.id));
    const to = findContainer(String(over.id));
    if (!from || !to || from === to) return;
    setState((prev) => {
      const s = structuredClone(prev);
      const fromItems = getItems(s, from);
      const toItems = getItems(s, to);
      const idx = fromItems.findIndex((x) => x.id === active.id);
      if (idx < 0) return prev;
      const [moved] = fromItems.splice(idx, 1);
      const overIdx = toItems.findIndex((x) => x.id === over.id);
      toItems.splice(overIdx >= 0 ? overIdx : toItems.length, 0, moved);
      setItems(s, from, fromItems);
      setItems(s, to, toItems);
      return s;
    });
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    if (active.data.current?.type === 'section') {
      const a = String(active.id).replace('sec:', '');
      const o = String(over.id).replace('sec:', '');
      if (a !== o) {
        setState((prev) => {
          const s = structuredClone(prev);
          const ord = s.pageOrders[pageId];
          const oi = ord.indexOf(a);
          const ni = ord.indexOf(o);
          if (oi >= 0 && ni >= 0) s.pageOrders[pageId] = arrayMove(ord, oi, ni);
          return s;
        });
        bumpFit();
      }
      return;
    }

    const c = findContainer(String(over.id)) ?? findContainer(String(active.id));
    if (c) {
      setState((prev) => {
        const s = structuredClone(prev);
        const items = getItems(s, c);
        const oldI = items.findIndex((x) => x.id === active.id);
        let newI = items.findIndex((x) => x.id === over.id);
        if (newI < 0) newI = items.length - 1;
        if (oldI >= 0 && newI >= 0 && oldI !== newI) setItems(s, c, arrayMove(items, oldI, newI));
        return s;
      });
    }
    bumpFit();
  };

  const collision: CollisionDetection = (args) => {
    const activeType = args.active.data.current?.type;
    const filtered = args.droppableContainers.filter((c) => {
      const t = c.data.current?.type;
      return activeType === 'section' ? t === 'section' : t !== 'section';
    });
    return closestCorners({ ...args, droppableContainers: filtered });
  };

  const removeItem = (sid: string, itemId: string) => {
    setState((prev) => {
      const s = structuredClone(prev);
      const sec = secsOf(s)[sid];
      // Search colL, colR, then items (for bev/dess and trifold sections).
      for (const col of ['colL', 'colR', 'items'] as const) {
        const list = sec[col] as Item[] | undefined;
        if (!list) continue;
        const idx = list.findIndex((x) => x.id === itemId);
        if (idx >= 0) {
          (isTri ? s.trifold.parked : s.parked).push(list.splice(idx, 1)[0]);
          break;
        }
      }
      return s;
    });
    bumpFit();
  };

  // New items are born in the sidebar, then dragged onto any section.
  const addNewItem = () => {
    setState((prev) => {
      const s = structuredClone(prev);
      let id: string;
      try { id = crypto.randomUUID(); } catch { id = 'id-' + Math.random().toString(36).slice(2); }
      (isTri ? s.trifold.parked : s.parked).push({ id, n: 'New Item', p: '' });
      return s;
    });
    setDirty(true);
  };

  const editItem = (itemId: string, patch: Partial<Item>) => {
    setState((prev) => {
      const s = structuredClone(prev);
      outer: for (const sec of Object.values(secsOf(s))) {
        for (const col of ['colL', 'colR', 'items'] as const) {
          const list = sec[col] as Item[] | undefined;
          if (!list) continue;
          const it = list.find((x) => x.id === itemId);
          if (it) { Object.assign(it, patch); break outer; }
        }
      }
      const pit = (isTri ? s.trifold.parked : s.parked).find((x) => x.id === itemId); // also editable while parked
      if (pit) Object.assign(pit, patch);
      return s;
    });
    bumpFit();
  };

  const editSection = (sid: string, patch: Partial<Section>) => {
    setState((prev) => {
      const s = structuredClone(prev);
      if (secsOf(s)[sid]) Object.assign(secsOf(s)[sid], patch);
      return s;
    });
    bumpFit();
  };

  // ---- Build Your Own edits ---- (targets the active page's Build block)
  const editBuild = (mut: (b: BuildData) => void, refit = false) => {
    setState((prev) => {
      const s = structuredClone(prev);
      mut(isTri ? s.trifold.build : s.build);
      return s;
    });
    setDirty(true);
    if (refit) setFit((f) => f + 1);
  };
  const onCell = (r: number, c: number, v: string) => editBuild((b) => { b.rows[r].prices[c] = v; });
  const onLabel = (r: number, v: string) => editBuild((b) => { b.rows[r].label = v; });
  const onText = (field: 'sauces' | 'proteins' | 'classicToppings' | 'note', v: string) =>
    editBuild((b) => { b[field] = v; });
  const onAddTopping = () => editBuild((b) => { b.rows.push({ label: 'New Topping', prices: b.sizes.map(() => '') }); }, true);
  const onRemoveTopping = (r: number) => editBuild((b) => { b.rows.splice(r, 1); }, true);

  // ---- Cover & Back edits ----
  const editCover = (field: string, v: string) => {
    setState((prev) => { const s = structuredClone(prev); (s.cover as unknown as Record<string, string>)[field] = v; return s; });
    setDirty(true);
  };
  const editBack = (field: string, v: string) => {
    setState((prev) => { const s = structuredClone(prev); (s.back as unknown as Record<string, string>)[field] = v; return s; });
    setDirty(true);
  };
  const editTriOutside = (field: keyof TrifoldOutsideData, v: string) => {
    setState((prev) => {
      const s = structuredClone(prev);
      (s.trifold.outside as unknown as Record<string, string>)[field] = v;
      return s;
    });
    setDirty(true);
  };
  const setOffset = (which: 'cover' | 'back', key: string, v: number) => {
    setState((prev) => {
      const s = structuredClone(prev);
      if (!s[which].offsets) s[which].offsets = {};
      s[which].offsets![key] = v;
      return s;
    });
    setDirty(true);
  };

  const doSave = async () => {
    save(state);            // local copy first — always succeeds, even offline
    setDirty(false);
    if (!BACKUP_ENABLED) return;
    setSync('syncing');
    const ok = await pushBackup(state);
    setSync(ok ? 'ok' : 'pending');
    try { ok ? localStorage.removeItem(PENDING_KEY) : localStorage.setItem(PENDING_KEY, '1'); } catch { /* ignore */ }
  };

  const reset = () => {
    if (!window.confirm('Reset the menu to the original and discard all your changes? This cannot be undone.')) return;
    const s = seed(); setState(s); save(s); setDirty(false);
  };

  // Download a backup file the owner keeps (works in every browser, offline).
  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'olive-branch-menu.olivebranch';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Load a previously downloaded backup file.
  const loadBackupFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as MenuState;
        if (!window.confirm('Replace the current menu with this backup file?')) return;
        setState(adopt(parsed)); setDirty(false); setTick((t) => t + 1);
      } catch { window.alert('That file could not be read as a menu backup.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Pull the latest from ServerMac (e.g. on a new computer).
  const restoreFromServer = async () => {
    setSync('syncing');
    const remote = await pullBackup();
    setSync('idle');
    if (!remote) { window.alert('No backup found on the server yet.'); return; }
    if (!window.confirm('Replace the current menu with the latest backup from the server?')) return;
    setState(adopt(remote)); setDirty(false); setTick((t) => t + 1);
  };

  // Startup: on a fresh device pull the latest from the server; and if a prior
  // save never reached the server (offline), retry now and whenever we reconnect.
  useEffect(() => {
    if (!BACKUP_ENABLED) return;
    let live = true;
    const catchUp = async () => {
      let pending = false;
      try { pending = !!localStorage.getItem(PENDING_KEY); } catch { /* ignore */ }
      if (!pending || !live) return;
      const ok = await pushBackup(stateRef.current);
      if (ok && live) { try { localStorage.removeItem(PENDING_KEY); } catch { /* ignore */ } setSync('ok'); }
    };
    (async () => {
      if (!hasLocal()) {
        const remote = await pullBackup();
        if (remote && live) { setState(adopt(remote)); setTick((t) => t + 1); }
      }
      await catchUp();
    })();
    window.addEventListener('online', catchUp);
    return () => { live = false; window.removeEventListener('online', catchUp); };
  }, []);

  // Save-as-PDF: set the @page size to match the current sheet (trifold = landscape
  // letter, everything else = legal portrait), then print just that page.
  const printMenu = () => {
    const landscape = LANDSCAPE.includes(pageId);
    let el = document.getElementById('print-size') as HTMLStyleElement | null;
    if (!el) { el = document.createElement('style'); el.id = 'print-size'; document.head.appendChild(el); }
    el.textContent = `@media print { @page { size: ${landscape ? '11in 8.5in' : '8.5in 14in'}; margin: 0; } }`;
    window.print();
  };

  // Re-measure once fonts are ready (and on each page switch) so heights are accurate.
  useEffect(() => {
    if (typeof document === 'undefined' || !(document as Document).fonts) return;
    let live = true;
    (document as Document).fonts.ready.then(() => { if (live) setTick((t) => t + 1); });
    return () => { live = false; };
  }, [pageId]);

  // Auto-fit engine. ONLY COMPRESS when content overflows (so the page can never
  // hang off the bottom). As long as the content fits, the designed/saved spacing is
  // left exactly as-is — moving, reordering, or editing never re-spreads the gaps.
  // (Previously it spread-to-fill after any edit, which flattened hand-tuned spacing.)
  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const blocks = Array.from(page.querySelectorAll<HTMLElement>('[data-sid]'));
    if (blocks.length === 0) return;
    const foot = page.querySelector<HTMLElement>('.foot-note');
    const cs = getComputedStyle(page);
    const availH = page.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    let natural = 0;
    blocks.forEach((b) => { natural += b.offsetHeight; });
    natural += MIN_GAP * (blocks.length - 1);
    if (foot) { const fcs = getComputedStyle(foot); natural += foot.offsetHeight + parseFloat(fcs.marginTop); }
    const leftover = availH - natural;
    if (leftover >= 0) return; // still fits → keep the saved spacing exactly (no reflow on moves/edits)
    const overflow = leftover < 0;
    const denom = overflow ? blocks.length : blocks.length - 1;
    const extra = denom > 0 ? leftover / denom : 0;
    const gaps: Record<string, number> = {};
    blocks.forEach((b, i) => {
      const isLast = i === blocks.length - 1;
      const g = !overflow && isLast ? MIN_GAP : MIN_GAP + extra;
      gaps[b.dataset.sid as string] = Math.max(0, g);
    });
    setState((prev) => ({ ...prev, gaps }));
  }, [fit, tick, pageId]);

  // Trifold auto-fit: scale the sheet's font down just enough that the tightest
  // panel fits the fixed letter height — applied uniformly so all panels match.
  useLayoutEffect(() => {
    if (pageId !== 'trifold') return;
    const sheet = trifoldRef.current?.querySelector<HTMLElement>('.sheet');
    if (!sheet) return;
    let fs = 1;
    sheet.style.setProperty('--fs', '1');
    // Iterate: font-scaling shifts line wrapping, so converge over a few passes.
    for (let pass = 0; pass < 4; pass++) {
      let minR = 1;
      sheet.querySelectorAll<HTMLElement>('.panel').forEach((panel) => {
        if (panel.scrollHeight > panel.clientHeight) {
          minR = Math.min(minR, panel.clientHeight / panel.scrollHeight);
        }
      });
      if (minR >= 0.999) break;
      fs = Math.max(0.5, fs * minR * 0.99);
      sheet.style.setProperty('--fs', fs.toFixed(3));
    }
  }, [pageId, tick, fit]);

  const order = state.pageOrders[pageId] ?? [];
  const activeItem =
    activeId && !activeId.startsWith('sec:')
      ? [
          ...Object.values(curSections).flatMap((s) => [
            ...(s.colL ?? []),
            ...(s.colR ?? []),
            ...s.items, // catches bev/dess and trifold sections (no colL/colR)
          ]),
          ...curParked,
        ].find((i) => i.id === activeId)
      : null;

  return (
    <DndContext sensors={sensors} collisionDetection={collision} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
      <div className="editor">
        <ParkedSidebar parked={curParked} onAddNew={addNewItem} onEdit={editItem} />

        <main className="stage">
          <div className="toolbar">
            <div className="tabs">
              {PAGES.map((p) => (
                <button key={p.id} className={'tab' + (pageId === p.id ? ' active' : '')} onClick={() => setPageId(p.id)}>
                  {p.label}
                </button>
              ))}
            </div>
            <div className="spacer" />
            {BACKUP_ENABLED && (
              <span className={`sync sync-${sync}`}>
                {sync === 'syncing' ? 'Backing up…'
                  : sync === 'ok' ? 'Backed up ✓'
                  : sync === 'pending' ? 'Saved · backs up when online'
                  : ''}
              </span>
            )}
            <button className="ghost" onClick={() => setVariant((v) => (v === 'b' ? 'bw' : 'b'))}>
              {variant === 'b' ? 'Switch to B&W' : 'Switch to Color'}
            </button>
            <button className="ghost" onClick={printMenu}>Save PDF</button>
            <button className="ghost" onClick={downloadBackup}>Download backup</button>
            <button className="ghost" onClick={() => fileRef.current?.click()}>Load backup</button>
            {BACKUP_ENABLED && (
              <button className="ghost" onClick={restoreFromServer}>Restore from server</button>
            )}
            <button className="save" onClick={doSave} disabled={!dirty && sync !== 'pending'}>{dirty ? 'Save' : 'Saved'}</button>
            <button className="ghost danger" onClick={reset}>Reset</button>
            <input
              ref={fileRef}
              type="file"
              accept=".olivebranch,application/json,.json"
              style={{ display: 'none' }}
              onChange={loadBackupFile}
            />
          </div>

          <div className={`menu v-${variant}`}>
            {pageId === 'trifold' && (
              <div ref={trifoldRef}>
                <TrifoldInside
                  sections={state.trifold.sections}
                  build={state.trifold.build}
                  onEdit={editItem}
                  onEditSection={editSection}
                  onRemove={removeItem}
                  onCell={onCell}
                  onLabel={onLabel}
                  onText={onText}
                />
              </div>
            )}
            {pageId === 'trioutside' && (
              <TrifoldOutside data={state.trifold.outside} onEdit={editTriOutside} />
            )}
            {pageId === 'cover' && (
              <Cover data={state.cover} onEdit={editCover} onOffset={(k, v) => setOffset('cover', k, v)} />
            )}
            {pageId === 'back' && (
              <Back data={state.back} onEdit={editBack} onOffset={(k, v) => setOffset('back', k, v)} />
            )}
            {(pageId === 'food' || pageId === 'special') && (
              <div className="page content" ref={pageRef}>
                <SortableContext items={order.map((id) => 'sec:' + id)} strategy={verticalListSortingStrategy}>
                  {order.map((id) => {
                    if (id === 'bevpair') {
                      const bev = state.sections.beverages;
                      const dess = state.sections.desserts;
                      if (!bev || !dess) return null;
                      return (
                        <PairBlock
                          key="bevpair"
                          bev={bev}
                          dess={dess}
                          gap={state.gaps?.['bevpair']}
                          onRemove={removeItem}
                          onEdit={editItem}
                          onEditSection={editSection}
                        />
                      );
                    }
                    const s = state.sections[id];
                    if (!s) return null;
                    return (
                      <SectionBlock
                        key={id}
                        s={s}
                        gap={state.gaps?.[id]}
                        onRemove={removeItem}
                        onEdit={editItem}
                        onEditSection={editSection}
                      />
                    );
                  })}
                </SortableContext>
                {pageId === 'special' && (
                  <Page3Extras
                    gaps={state.gaps}
                    build={state.build}
                    onCell={onCell}
                    onLabel={onLabel}
                    onAddTopping={onAddTopping}
                    onRemoveTopping={onRemoveTopping}
                    onText={onText}
                  />
                )}
                <div className="foot-note">
                  18% gratuity added to parties of six or more &amp; to separate checks.
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="drag-chip">{activeItem.n}</div>
        ) : activeId?.startsWith('sec:') ? (
          <div className="drag-chip">↕ {activeId === 'sec:bevpair' ? 'Drinks & Desserts' : state.sections[activeId.replace('sec:', '')]?.title}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function ParkedSidebar({
  parked,
  onAddNew,
  onEdit,
}: {
  parked: Item[];
  onAddNew: () => void;
  onEdit: (id: string, patch: Partial<Item>) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: PARKED, data: { type: 'container' } });
  return (
    <aside className="sidebar" ref={setNodeRef} style={isOver ? { outline: '2px dashed #9d3d24' } : undefined}>
      <div className="side-title">Saved Items ({parked.length})</div>
      <button className="add-item" onClick={onAddNew}>+ New item</button>
      {parked.length === 0 ? (
        <div className="side-empty">New &amp; removed items wait here — edit them, then drag onto the menu.</div>
      ) : (
        <SortableContext items={parked.map((i) => i.id as string)} strategy={verticalListSortingStrategy}>
          {parked.map((it) => (
            <ParkedRow key={it.id} it={it} onEdit={onEdit} />
          ))}
        </SortableContext>
      )}
    </aside>
  );
}

function ParkedRow({ it, onEdit }: { it: Item; onEdit: (id: string, patch: Partial<Item>) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: it.id as string,
    data: { type: 'item', container: PARKED },
  });
  const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 };
  const id = it.id as string;
  return (
    <div className="park" ref={setNodeRef} style={style} {...attributes}>
      <button className="park-grip" title="Drag onto the menu" {...listeners}>⠿</button>
      <Editable className="park-name" value={it.n} onChange={(v) => onEdit(id, { n: v })} />
      <Editable className="park-price" value={it.p} onChange={(v) => onEdit(id, { p: v })} />
    </div>
  );
}
