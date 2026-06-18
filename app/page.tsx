// Home route — server component.
// Lists the two double-sided sheets.

import { SHEET_CONFIGS } from "@/sheets/sheetConfig";
import SheetList from "@/editor/SheetList";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return <SheetList sheets={SHEET_CONFIGS} />;
}
