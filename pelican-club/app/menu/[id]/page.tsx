// Menu editor route — server component shell.
// Loads menu data server-side and passes to the client MenuEditorPage component.
// Phase 1: MenuEditorPage provides Edit and Preview tabs.

import { notFound } from "next/navigation";
import { getMenu, listSnapshots } from "@/content/store";
import MenuEditorPage from "@/editor/MenuEditorPage";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MenuRoute({ params }: Props) {
  const { id } = await params;
  const result = await getMenu(id);
  if (!result) notFound();

  const snapshots = await listSnapshots(id);

  return (
    <MenuEditorPage
      menu={result.menu}
      sections={result.sections}
      items={result.items}
      snapshots={snapshots}
    />
  );
}
