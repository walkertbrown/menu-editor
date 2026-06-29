// Sheet route — server component shell.
// Loads both sides' menu data and passes to the client SheetEditorPage.

import { notFound } from "next/navigation";
import { getMenu, listSnapshots, getRestaurant, getSheetTitles } from "@/content/store";
import { getSheetConfig } from "@/sheets/sheetConfig";
import SheetEditorPage from "@/editor/SheetEditorPage";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SheetRoute({ params }: Props) {
  const { id } = await params;

  const sheet = getSheetConfig(id);
  if (!sheet) notFound();

  // Load both sides. For spirits both sides share the same menuId.
  const frontResult = await getMenu(sheet.front.menuId);
  if (!frontResult) notFound();

  // Back side may be the same menu (spirits) or a different one (dinner/drinks)
  const backResult =
    sheet.back.menuId === sheet.front.menuId
      ? frontResult
      : await getMenu(sheet.back.menuId);
  if (!backResult) notFound();

  const frontSnapshots = await listSnapshots(sheet.front.menuId);
  const backSnapshots =
    sheet.back.menuId === sheet.front.menuId
      ? frontSnapshots
      : await listSnapshots(sheet.back.menuId);

  const restaurant = await getRestaurant();
  const sheetTitles = await getSheetTitles();
  const sheetTitle = sheetTitles[sheet.id] ?? sheet.name;

  return (
    <SheetEditorPage
      sheet={sheet}
      frontData={{
        menu: frontResult.menu,
        sections: frontResult.sections,
        items: frontResult.items,
        snapshots: frontSnapshots,
      }}
      backData={{
        menu: backResult.menu,
        sections: backResult.sections,
        items: backResult.items,
        snapshots: backSnapshots,
      }}
      restaurant={restaurant}
      sheetTitle={sheetTitle}
    />
  );
}
