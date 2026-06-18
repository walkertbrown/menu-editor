// Home route — server component.
// Lists the two double-sided sheets, with any overridden sheet titles from the data store.

import { SHEET_CONFIGS } from "@/sheets/sheetConfig";
import { getSheetTitles } from "@/content/store";
import SheetList from "@/editor/SheetList";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const sheetTitles = await getSheetTitles();
  return <SheetList sheets={SHEET_CONFIGS} sheetTitles={sheetTitles} />;
}
