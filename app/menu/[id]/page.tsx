// Menu editor route — server component shell.
// Loads menu data server-side and passes to the client MenuEditor component.

import { notFound } from "next/navigation";
import { getMenu, listSnapshots } from "@/content/store";
import MenuEditor from "@/editor/MenuEditor";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MenuEditorPage({ params }: Props) {
  const { id } = await params;
  const result = await getMenu(id);
  if (!result) notFound();

  const snapshots = await listSnapshots(id);

  return (
    <MenuEditor
      menu={result.menu}
      sections={result.sections}
      items={result.items}
      snapshots={snapshots}
    />
  );
}
