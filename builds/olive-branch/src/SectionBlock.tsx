// Extracted from App.tsx.
// ItemRow — one draggable menu item.
// ColZone — a single droppable column inside a normal dine-in section.
// SectionBlock — section header + two independent column lists (colL / colR).
import { type CSSProperties } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type Item, type Section } from './data';
import { Editable } from './Editable';

export function ItemRow({
  it,
  sid,
  onRemove,
  onEdit,
}: {
  it: Item;
  sid: string;
  onRemove?: () => void;
  onEdit: (id: string, patch: Partial<Item>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: it.id as string,
    data: { type: 'item', container: sid },
  });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };
  const id = it.id as string;
  return (
    <div className="item" ref={setNodeRef} style={style} {...attributes}>
      <div className="item-tools">
        <button className="grip" title="Drag" {...listeners}>⠿</button>
        {onRemove && (
          <button className="rm" title="Remove" onPointerDown={(e) => e.stopPropagation()} onClick={onRemove}>×</button>
        )}
      </div>
      <div className="item-head">
        <Editable className="item-name" value={it.n} onChange={(v) => onEdit(id, { n: v })} />
        <span className="dots" />
        <Editable className="item-price" value={it.p} onChange={(v) => onEdit(id, { p: v })} />
      </div>
      <Editable className="item-desc" value={it.d ?? ''} onChange={(v) => onEdit(id, { d: v })} />
    </div>
  );
}

// One droppable column (L or R) inside a normal dine-in section.
// Container id is `${sectionId}::L` or `${sectionId}::R`.
function ColZone({
  containerId,
  items,
  sid,
  onRemove,
  onEdit,
}: {
  containerId: string;
  items: Item[];
  sid: string;
  onRemove: (sid: string, itemId: string) => void;
  onEdit: (id: string, patch: Partial<Item>) => void;
}) {
  const { setNodeRef } = useDroppable({ id: containerId, data: { type: 'container' } });
  return (
    <div className="items-col" ref={setNodeRef}>
      <SortableContext items={items.map((i) => i.id as string)} strategy={verticalListSortingStrategy}>
        {items.map((it) => (
          <ItemRow
            key={it.id}
            it={it}
            sid={sid}
            onRemove={() => onRemove(sid, it.id as string)}
            onEdit={onEdit}
          />
        ))}
      </SortableContext>
    </div>
  );
}

// A normal dine-in section: sortable header + two independent droppable columns.
// Beverages, Desserts, and trifold sections use PairColumn / TrifoldInside instead.
export function SectionBlock({
  s,
  gap,
  onRemove,
  onEdit,
  onEditSection,
}: {
  s: Section;
  gap?: number;
  onRemove: (sid: string, itemId: string) => void;
  onEdit: (id: string, patch: Partial<Item>) => void;
  onEditSection: (sid: string, patch: Partial<Section>) => void;
}) {
  const sortable = useSortable({ id: 'sec:' + s.id, data: { type: 'section' } });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
    marginBottom: gap != null ? gap : undefined,
    opacity: sortable.isDragging ? 0.6 : 1,
  };
  return (
    <div className="section" ref={sortable.setNodeRef} data-sid={s.id} style={style}>
      <div className="sec-head">
        <button className="sec-grip" title="Drag section" {...sortable.attributes} {...sortable.listeners}>⠿</button>
        <Editable className="sec-title" value={s.title} onChange={(v) => onEditSection(s.id, { title: v })} />
        <span className="sec-line" />
        {s.note != null ? (
          <Editable className="sec-note" value={s.note} onChange={(v) => onEditSection(s.id, { note: v })} />
        ) : null}
      </div>
      <div className="items-cols">
        <ColZone containerId={`${s.id}::L`} items={s.colL ?? []} sid={s.id} onRemove={onRemove} onEdit={onEdit} />
        <ColZone containerId={`${s.id}::R`} items={s.colR ?? []} sid={s.id} onRemove={onRemove} onEdit={onEdit} />
      </div>
    </div>
  );
}
