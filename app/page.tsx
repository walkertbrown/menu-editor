// Menu list route — server component.
// Loads menus directly from the store (server-side) and renders the MenuList.

import { getMenus } from "@/content/store";
import MenuList from "@/editor/MenuList";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const menus = await getMenus();
  return <MenuList menus={menus} />;
}
