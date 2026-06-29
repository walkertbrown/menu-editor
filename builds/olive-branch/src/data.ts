// Seed menu data for The Olive Branch Café.
// Lifted verbatim from the approved design (MenuBody.dc.html renderVals()).
// This is the data that pre-seeds localStorage on first run.

export type Item = { id?: string; n: string; p: string; d?: string };
export type Section = {
  id: string;
  title: string;
  note?: string;
  items: Item[];
  /** Independent left/right column lists for normal dine-in sections.
   *  Absent on beverages, desserts, and all trifold sections.
   *  Populated by the normalize() migration in store.ts. */
  colL?: Item[];
  colR?: Item[];
};

export const SECTIONS: Record<string, Section> = {
  appetizers: {
    id: 'appetizers',
    title: 'Appetizers',
    items: [
      { n: 'Bread Sticks', p: '6' },
      { n: 'Spinach & Artichoke Dip', p: '11', d: 'House recipe served with fresh-baked bread bites.' },
      { n: 'Wings', p: '15', d: '8 crispy baked Cajun chicken wings, choice of sauce, dressing on the side.' },
      { n: 'Chicken Quesadilla', p: '15', d: 'Grilled chicken, cheese, tomatoes & veggie mix in a grilled tomato-basil tortilla. Salsa, sour cream & jalapeños.' },
      { n: 'Pizza Bites', p: '8', d: 'Fresh-baked bread, your choice of sauce & mozzarella, plus any fresh toppings.' },
      { n: 'BBQ Chicken Bites', p: '12', d: 'Chicken, bacon, red onions, cheddar, mozzarella & BBQ sauce.' },
      { n: 'Pesto Bites', p: '11', d: 'House pesto, artichokes, tomatoes, spinach, mozzarella & feta.' },
      { n: 'Seafood Bites', p: '11', d: 'Signature seafood sauce with shrimp & fish, topped with mozzarella.' },
      { n: 'Hummus Tahini', p: '10', d: 'House hummus, black olives, feta & sun-dried tomatoes. Served with pita.' },
      { n: 'Mozzarella Cheese Sticks', p: '8', d: '8 breaded mozzarella sticks with marinara on the side.' },
      { n: 'Boudin Egg Rolls', p: '11', d: '4 egg rolls stuffed with Cajun boudin, house sweet chili sauce.' },
      { n: 'Caprese Salad', p: '12', d: 'Fresh mozzarella, tomatoes, basil & balsamic reduction with toast points.' },
    ],
  },
  cannolis: {
    id: 'cannolis',
    title: 'Cannolis',
    note: 'With pasta salad or chips',
    items: [
      { n: 'Savory Cannoli', p: '14', d: 'Ham, pepperoni, salami, mozzarella, onions, black olives & tomatoes. Marinara dip.' },
      { n: 'Spinach & Artichoke Cannoli', p: '13', d: 'Spinach, artichokes, tomatoes, onions, mushrooms, mozzarella & feta. Alfredo dip.' },
      { n: 'Chicken Pesto Cannoli', p: '14', d: 'Grilled chicken, house pesto, artichoke, tomatoes, mozzarella & feta. Alfredo dip.' },
    ],
  },
  soupsSalads: {
    id: 'soupsSalads',
    title: 'Soups & Salads',
    note: 'Add — Chicken 4 · Shrimp 6 · Redfish 10',
    items: [
      { n: 'Famous Shrimp & Corn Bisque', p: '6' },
      { n: 'House Salad', p: 'Lg 12 · Sm 8', d: 'Romaine, tomatoes, red onions, bell pepper, mushrooms, olives, pepperoni & cheese. Italian dressing.' },
      { n: 'Caesar Salad', p: 'Lg 12 · Sm 8', d: 'Romaine, croutons, shredded parmesan & our famous homemade Caesar.' },
      { n: 'Spinach Salad', p: 'Lg 12 · Sm 8', d: 'Spinach, candied pecans, red onions, tomatoes & feta. Balsamic vinaigrette.' },
      { n: 'Citrus Salad', p: 'Lg 12 · Sm 8', d: 'Romaine, mandarin oranges, red onions, candied pecans & feta. Raspberry vinaigrette.' },
      { n: 'Greek Salad', p: 'Lg 12 · Sm 8', d: 'Romaine, roma tomatoes, red onions, kalamata olives, pepperoncini & feta.' },
      { n: 'Redfish Spinach Salad', p: '20', d: 'Spinach, red onions & cheese topped with grilled redfish filet; choice of dressing.' },
      { n: 'Cobb Salad', p: '20', d: 'Avocado, boiled egg, feta & bacon with grilled chicken over romaine, tomato & green onion.' },
    ],
  },
  subsWraps: {
    id: 'subsWraps',
    title: 'Subs & Wraps',
    note: 'With pasta salad or chips',
    items: [
      { n: 'Meatball or Italian Sausage Sub', p: '14', d: 'Sausage or meatballs, marinara, mozzarella & parmesan on a fresh-baked roll.' },
      { n: 'Spinach & Artichoke Sub', p: '12', d: 'Spinach, artichoke, roma tomato, onion, mushrooms, garlic sauce, feta & mozzarella.' },
      { n: 'Italian Sub', p: '14', d: 'Pepperoni, salami, ham, black olives, onions & provolone.' },
      { n: 'Tuscan Sub', p: '13', d: 'Breaded eggplant, roasted red peppers, spinach & fresh mozzarella, pesto aioli.' },
      { n: 'Chicken Parmesan Sub', p: '14', d: 'Grilled chicken, marinara, parmesan & mozzarella.' },
      { n: 'Muffuletta Sub', p: '14', d: 'Olive salad blend, salami, ham & provolone, toasted.' },
      { n: 'California Club', p: '14', d: 'Turkey, bacon, spinach, avocado & provolone with house garlic aioli.' },
      { n: 'Chicken Bacon & Ranch Wrap', p: '12', d: 'Chicken, bacon & lettuce; ranch on the side. Tomato-basil tortilla.' },
      { n: 'Chicken Caesar Wrap', p: '12', d: 'Grilled chicken, romaine & shredded parmesan; Caesar on the side.' },
      { n: 'Mediterranean Wrap', p: '12', d: 'Hummus, artichoke, grilled chicken, black olives, feta & roasted red peppers.' },
      { n: 'Citrus Chicken Wrap', p: '12', d: 'Grilled chicken, mandarin oranges, feta, romaine & bacon; raspberry vinaigrette.' },
    ],
  },
  signature: {
    id: 'signature',
    title: 'Signature Entrées',
    items: [
      { n: 'Shrimp Carnival', p: '20', d: 'Gulf shrimp, smoked sausage, onions & bell peppers in roasted garlic cream sauce over penne.' },
      { n: "Becky's Pasta", p: '20', d: 'Angel hair, red onions, mushrooms & shrimp in a light Cajun cream sauce, breaded eggplant & parmesan.' },
      { n: 'Pasta Jambalaya', p: '18', d: 'Smoked sausage, chicken, onions & bell peppers in roasted garlic cream sauce over penne.' },
      { n: 'Spicy Cajun Trio', p: '20', d: 'Crawfish, smoked sausage & chicken in a spicy Cajun tomato cream sauce over penne.' },
      { n: 'Spicy Cajun Redfish', p: '22', d: 'Spicy tomato cream sauce over angel hair, topped with a blackened redfish filet.' },
      { n: 'Grilled Redfish Medley', p: '22', d: 'Artichokes, spinach, sun-dried tomatoes, onions & mushrooms in garlic olive oil over spinach.' },
    ],
  },
  classic: {
    id: 'classic',
    title: 'Classic Entrées',
    note: 'Add 8″ garlic bread 6 · side salad 6',
    items: [
      { n: 'Pasta with Alfredo Sauce', p: '12' },
      { n: 'Pasta with Seafood Sauce', p: '14', d: 'Penne with savory alfredo or homemade seafood sauce. Add: Sausage 5 · Chicken 4 · Shrimp 6 · Redfish 10.' },
      { n: 'Lasagna', p: '17', d: 'Layers of beef, seasonings, marinara, cheeses & pasta, baked to perfection.' },
      { n: 'Meatballs or Italian Sausage & Pasta', p: '16', d: 'Homemade meatballs or sausage in zesty marinara over angel hair.' },
      { n: 'Cheese Manicotti — Marinara or Alfredo', p: '14', d: 'Pasta filled with a traditional Italian cheese blend.' },
      { n: 'Cheese Manicotti — Seafood Sauce', p: '16', d: 'Topped with seafood sauce of shrimp & fish.' },
      { n: 'Cheese Manicotti — Spinach & Artichoke', p: '16', d: 'Sautéed spinach, mushrooms, onions & artichokes.' },
    ],
  },
  combos: {
    id: 'combos',
    title: 'Combos & Lunch',
    items: [
      { n: 'Sandwich Combo', p: '18', d: 'Your favorite sub paired with a side salad or soup of the day.' },
      { n: 'Wrap Combo', p: '16', d: 'Your favorite wrap paired with a side salad or soup of the day.' },
      { n: 'Personal Pizza Combo', p: '17', d: 'Choose three toppings plus a cup of soup or side salad.' },
      { n: 'Soup & Salad', p: '13', d: 'A side salad and a cup of soup of the day. Add Chicken 4 · Shrimp 6.' },
    ],
  },
  pizzas: {
    id: 'pizzas',
    title: 'Gourmet Pizzas',
    note: '10″ | 14″',
    items: [
      { n: 'Chicken Alfredo', p: '19 | 25', d: 'Alfredo, grilled chicken, red onions, mozzarella & feta.' },
      { n: 'Meat Feast', p: '19 | 25', d: 'Tomato sauce, ground beef, spicy sausage, ham, pepperoni, bacon & mozzarella.' },
      { n: 'Artichoke & Spinach', p: '17 | 23', d: 'Garlic sauce, mushrooms, onions, spinach, artichokes, tomatoes, mozzarella & feta.' },
      { n: 'Chicken Pesto', p: '19 | 25', d: 'Pesto, grilled chicken, artichokes, tomatoes, mozzarella & feta.' },
      { n: 'Muffuletta', p: '18 | 24', d: 'Salami, ham, olive salad blend & mozzarella.' },
      { n: 'Hawaiian', p: '15 | 21', d: 'Ham, pineapple, green peppers, traditional sauce & mozzarella.' },
      { n: 'BBQ Chicken', p: '19 | 25', d: 'Chicken, bacon, red onions, BBQ sauce, cheddar & mozzarella.' },
      { n: 'Cajun Trio', p: '20 | 26', d: 'Smoked sausage, chicken & crawfish with a zesty made-to-order sauce & mozzarella.' },
      { n: 'Combination', p: '19 | 25', d: 'Tomato sauce, pepperoni, spicy sausage, mushrooms, onions, peppers, black olives & mozzarella.' },
      { n: 'Veggie', p: '17 | 23', d: 'Garlic or tomato sauce; mushrooms, onions, peppers, olives, tomatoes & mozzarella.' },
      { n: 'Margherita', p: '15 | 21', d: 'Pesto, tomato sauce, fresh basil, roma tomatoes & fresh mozzarella.' },
      { n: 'Luau BBQ', p: '20 | 26', d: 'BBQ sauce, pineapple, jalapeños, red onions, bacon, shrimp, mozzarella & cheddar.' },
      { n: "Mario's Hot Honey", p: '19 | 25', d: 'Alfredo, spinach, bacon, mushrooms, caramelized onions, feta & mozzarella, hot honey.' },
    ],
  },
  desserts: {
    id: 'desserts',
    title: 'Desserts',
    items: [
      { n: 'New York Cheesecake', p: '4', d: 'A slice of plain New York-style cheesecake.' },
      { n: 'Pecan Cheesecake', p: '5', d: 'Cheesecake topped with candied pecans, caramel & white chocolate sauce.' },
      { n: 'Bread Pudding', p: '5.50', d: 'Our scratch-made bread pudding, served with rum sauce.' },
    ],
  },
  beverages: {
    id: 'beverages',
    title: 'Beverages',
    items: [
      { n: 'Coke', p: '3.79' },
      { n: 'Diet Coke', p: '3.79' },
      { n: 'Coke Zero', p: '3.79' },
      { n: 'Sprite', p: '3.79' },
      { n: 'Root Beer', p: '3.79' },
      { n: 'Sweet Tea', p: '3.79' },
      { n: 'Unsweetened Tea', p: '3.79' },
      { n: 'Red Powerade', p: '3.79' },
      { n: 'Orange Powerade', p: '3.79' },
      { n: 'Dasani Water', p: '3.50' },
    ],
  },
};

// ---- Build Your Own (editable: prices, labels, add/remove topping rows) ----
export type BuildRow = { label: string; prices: string[] }; // prices align to `sizes`
export type BuildData = {
  sizes: string[];
  rows: BuildRow[]; // rows[0] = Cheese (base); rows[1..] = premium toppings
  sauces: string;
  proteins: string;
  classicToppings: string;
  note: string;
};

export const BUILD: BuildData = {
  sizes: ['8″', '10″', '14″', 'Calzone'],
  rows: [
    { label: 'Cheese', prices: ['9', '12', '17', '11'] },
    { label: 'Meatballs', prices: ['3', '3', '5', '5'] },
    { label: 'Chicken', prices: ['3', '3', '4', '4'] },
    { label: 'Shrimp', prices: ['4', '4', '6', '6'] },
    { label: 'Italian Sausage', prices: ['3', '3', '5', '5'] },
  ],
  sauces: 'Traditional · Garlic · Pesto · Alfredo · BBQ',
  proteins: 'Pepperoni · Spicy Sausage · Ham · Salami · Bacon · Ground Beef',
  classicToppings:
    'Ricotta · Feta · Cheddar · Red, White & Caramelized Onions · Green, Banana, Jalapeño & Roasted Red Peppers · Black & Green Olives · Mushrooms · Minced Garlic · Tomatoes · Anchovies · Artichoke · Pineapple · Spinach',
  note: 'Cauliflower crust +5 (10″) / +7 (14″) · Try our thin crust · Gluten-friendly options available',
};

// ---- Cover & Back (editable text + reorderable blocks) ----
export type CoverData = {
  order: string[]; // 'est' | 'center' | 'foot'
  offsets?: Record<string, number>; // per-piece vertical nudge in px
  est: string;
  tagline: string;
  blurb: string;
  marreroCity: string;
  marreroAddr: string;
  hours: string;
  serve: string;
  algiersCity: string;
  algiersAddr: string;
};
export const COVER: CoverData = {
  order: ['est', 'center', 'foot'],
  offsets: {},
  est: 'Est. 1997 · Family-Owned & Owner-Run for 29 Years',
  tagline: 'Westbank Born · Westbank Raised · Westbank Proud',
  blurb:
    "Affordable gourmet pizza & Italian on the West Bank — from-scratch dough daily, Spanish olives, fresh vegetables. Nothing's made till you order it.",
  marreroCity: 'MARRERO',
  marreroAddr: '1995 Barataria Blvd',
  hours: 'Open Daily · 11–9',
  serve: 'We Serve Louisiana Shrimp & Crawfish',
  algiersCity: 'ALGIERS',
  algiersAddr: '5145 Gen. de Gaulle Dr',
};

export type BackData = {
  order: string[]; // 'wine' | 'about' | 'cater'
  offsets?: Record<string, number>; // per-piece vertical nudge in px
  byowL: string;
  byowWine: string;
  byowSub: string;
  byowTag: string;
  aboutH: string;
  p1: string;
  p2: string;
  p3: string;
  caterH: string;
  caterList: string;
  caterQuote: string;
  caterSign: string;
  caterWeb: string;
  gluten: string;
};
export const BACK: BackData = {
  order: ['wine', 'about', 'cater'],
  offsets: {},
  byowL: 'Bring Your Own',
  byowWine: 'Wine',
  byowSub: 'No Corkage Fee',
  byowTag: 'Eat Better! Feel Better! Be Better!',
  aboutH: 'Our Story',
  p1: "Founded in 1997 by Russell Autry — Rusty to his friends and customers — The Olive Branch Café is THE gourmet pizza restaurant in Marrero and Algiers. Rusty has plenty of restaurant experience and it shows: he's always at one of his stores making sure customers are satisfied, keeping his employees on their toes as they work hard to keep the business running smoothly day after day.",
  p2: 'At The Olive Branch Café we use only the highest-quality cheeses and the freshest ingredients possible. We bring in the finest Spanish olives and Italian olive oil because our customers deserve the best. Fresh vegetables arrive daily so your pizza, salad, sub, or pasta is perfect every time. Our dough is made in house every day and nothing is prepared until you order it, so we can make everything just the way you like it — even our signature Caesar dressing is made almost daily from scratch.',
  p3: 'The Olive Branch Café has proudly served fresh, delicious Italian cuisine for 29 years.',
  caterH: 'We Cater to You',
  caterList: 'Parties · Special Events · Church Functions · Holidays · Birthdays · Anniversaries',
  caterQuote:
    '"Extending the olive branch is our way of meeting needs in our community. Visit us online to find out how your organization can partner with us."',
  caterSign: '— Russell "Rusty" Autry, Owner',
  caterWeb: 'OLIVEBRANCHCAFE.COM',
  gluten: 'Due to the nature of our kitchen, we cannot guarantee that gluten will not be present in any dish.',
};

// ---- Trifold OUTSIDE sheet (Visit Us · We Cater · Cover) — editable text ----
export type TrifoldOutsideData = {
  // Visit Us panel
  visitH: string;
  loc1City: string; loc1Addr: string; loc1Phone: string;
  loc2City: string; loc2Addr: string; loc2Phone: string;
  hoursBig: string; hoursSub1: string; hoursSub2: string;
  web: string;
  // We Cater panel
  caterH: string; caterP1: string; caterP2: string;
  caterList1: string; caterList2: string; caterList3: string;
  // Front cover panel
  est: string; tagline: string; togo: string; sub: string;
};
export const TRIFOLD_OUTSIDE: TrifoldOutsideData = {
  visitH: 'Visit Us',
  loc1City: 'MARRERO', loc1Addr: '1995 Barataria Blvd', loc1Phone: '(504) 555-0142',
  loc2City: 'ALGIERS', loc2Addr: '5145 Gen. de Gaulle Dr', loc2Phone: '(504) 555-0187',
  hoursBig: 'Open Daily · 11–9',
  hoursSub1: 'Dine-In · Takeout · Curbside',
  hoursSub2: 'We Serve Louisiana Shrimp & Crawfish',
  web: 'OLIVEBRANCHCAFE.COM',
  caterH: 'We Cater to You',
  caterP1:
    "Affordable gourmet pizza & Italian on the West Bank — from-scratch dough daily, Spanish olives, fresh vegetables. Nothing's made till you order it.",
  caterP2:
    'Extending the olive branch is our way of meeting needs in our community. Visit us online to find out how your organization can partner with us.',
  caterList1: 'Parties · Special Events',
  caterList2: 'Church Functions · Holidays',
  caterList3: 'Birthdays · Anniversaries',
  est: 'Est. 1997 · Family-Owned 29 Years',
  tagline: 'Westbank Born · Raised · Proud',
  togo: 'To-Go Menu',
  sub: 'Pizza · Pasta · Po-Boys & More',
};

// Page 2 of the dine-in menu: Starters → Entrées
export const PAGE2_SECTION_IDS = ['appetizers', 'cannolis', 'soupsSalads', 'subsWraps', 'signature'];
// Page 3 editable/draggable order. 'bevpair' = Beverages + Desserts as one locked
// two-column unit (they move together). Build Your Own remains a fixed block.
export const PAGE3_SECTION_IDS = ['classic', 'combos', 'pizzas', 'bevpair'];
