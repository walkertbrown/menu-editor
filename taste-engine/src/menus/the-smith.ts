// The Smith Restaurant & Bar — Main (lunch/dinner) menu
// Transcribed from photo. STEAKS section partially cut off in source photo — may be incomplete.

export interface MenuItem {
  name: string;
  price: number | null;
  desc?: string;
  note?: string;
}

export interface MenuSection {
  title: string;
  note?: string;
  items: MenuItem[];
}

export interface Menu {
  name: string;
  location: string;
  footer: string;
  sections: MenuSection[];
}

export const theSmith: Menu = {
  name: "The Smith Restaurant & Bar",
  location: "New York City",
  footer:
    "Please alert your server of any food allergies, as not all ingredients are listed on the menu. " +
    "Eating raw or undercooked fish, shellfish, eggs or meat increases the risk of foodborne illnesses.",
  sections: [
    {
      title: "RAW BAR",
      note: "Oysters",
      items: [
        { name: "Puffer Petite", price: 4, desc: "Wellfleet, MA" },
        { name: "Cotuit Bay", price: 4, desc: "Cape Cod, MA" },
        { name: "East Beach Blonde", price: 4, desc: "Charlestown, RI" },
        { name: "Oyster of the Day", price: 4 },
        { name: "Oyster Sampler", price: 31, desc: "two of each" },
      ],
    },
    {
      title: "RAW BAR PLATTERS",
      items: [
        { name: "The Deluxe", price: 45, desc: "eight oysters, four chilled shrimp" },
        { name: "The Royale", price: 72, desc: "eight oysters, six chilled shrimp, spicy salmon tartare" },
        { name: "The Grand", price: 128, desc: "sixteen oysters, twelve chilled shrimp, spicy salmon tartare" },
        {
          name: "Shrimp Cocktail",
          price: 19,
          desc: "cocktail sauce, citrus remoulade (chilled shrimp per piece 4)",
        },
      ],
    },
    {
      title: "STARTERS",
      items: [
        { name: "Chips + Dip", price: 16, desc: "french onion blue cheese dip, waffle cut potato chips, crunchy vegetables" },
        { name: "Fried Chicken Nuggets", price: 16, desc: "spicy peach jam" },
        { name: "Crispy Calamari", price: 19, desc: "feta, oregano, sesame, zucchini, olives, lemon aioli" },
        { name: "Avocado + Corn", price: 17, desc: "sweet peppers, jalapeño, red onion, lime, cilantro, roasted tomato vinaigrette" },
        { name: "Burrata", price: 17, desc: "toasted almond pesto, sesame garlic bread" },
        { name: "Spicy Salmon Tartare", price: 19, desc: "crispy rice, avocado, sriracha, nori" },
        { name: "Mac + Cheese", price: 16, desc: "skillet roasted" },
      ],
    },
    {
      title: "SALADS",
      note: "Salads with an addition: avocado 22 | grilled chicken 28 | marinated shrimp 31 | roasted salmon 31 | sliced flat iron steak 31",
      items: [
        { name: "Kale + Quinoa", price: 18, desc: "sun dried cranberries, ricotta salata, toasted almonds, dijon vinaigrette" },
        { name: "Little Gem Caesar", price: 18, desc: "crispy parmesan frico" },
        { name: "Mediterranean", price: 18, desc: "red romaine, cucumber, tomato, red onion, feta, olives, oregano lemon vinaigrette" },
      ],
    },
    {
      title: "SANDWICHES",
      note: "served with fries or mixed greens",
      items: [
        { name: "Grilled Chicken", price: 25, desc: "burrata, tomato jam, basil aioli, toasted ciabatta" },
        { name: "Burger Royale", price: 26, desc: "american cheese, lettuce, tomato, onion, dill pickles, 50/50 sauce, brioche bun (make it a veggie burger!)" },
        { name: "French Dip", price: 33, desc: "slow roasted steak, caramelized onions, gruyère, dijonnaise, baguette, au jus" },
        { name: "The Smith Burger", price: 28, desc: "cheddar, bacon shallot jam, crispy onions, dill pickles, TSB sauce, brioche bun" },
      ],
    },
    {
      title: "PASTA",
      note: "gluten-free pasta available upon request",
      items: [
        { name: "Rigatoni alla Vodka", price: 25, desc: "tomato, stracciatella cheese, crème fraîche, basil" },
        { name: "Spicy Shrimp Scampi", price: 21, desc: "tagliatelle, calabrian chilies, lemony garlic breadcrumbs" },
        { name: "Ricotta Gnocchi", price: 24, desc: "truffle cream" },
        { name: "Spaghetti + Baby Tomatoes", price: 21, desc: "garlic, olive oil, lemon, red chilies, parsley, basil, parmesan" },
        { name: "Braised Short Rib Mafaldine", price: 27, desc: "10 hour short rib ragù, burst tomatoes, mascarpone, parmesan" },
      ],
    },
    {
      title: "DAILY SANDWICHES",
      items: [
        { name: "Monday — Chicken Parm", price: 25 },
        { name: "Tuesday — Le Burger", price: 29 },
        { name: "Wednesday — Ahi Tuna Melt", price: 25 },
        { name: "Thursday — Chicken Kebab", price: 25 },
        { name: "Friday — Slow Roasted Pork", price: 25 },
      ],
    },
    {
      title: "CLASSICS",
      items: [
        { name: "Avocado Toast", price: 19, desc: "whole wheat, red pepper flakes, lemon (add poached eggs: one 3 / two 5.50)" },
        { name: "Goat Cheese Omelette", price: 23, desc: "baby spinach, shallots, soft herbs, mixed greens" },
        { name: "Roasted Salmon", price: 35, desc: "artichoke + butter bean hummus, harissa marinated eggplant, shaved fennel, celery" },
        { name: "Chicken Milanese", price: 28, desc: "baby arugula, tomatoes, red onion, parmesan, basil, red wine lemon vinaigrette" },
        { name: "Pot of Mussels", price: 29, desc: "chardonnay broth, dijon, tarragon, fries" },
        { name: "Vegetable Bibimbap", price: 25, desc: "sushi rice, shiitake mushrooms, edamame, spinach, kimchi, sunny up egg" },
      ],
    },
    {
      title: "VEGETABLES",
      items: [
        { name: "Baby Broccoli + Cauliflower", price: 14, desc: "slow cooked tomatoes, mediterranean vinaigrette" },
        { name: "Brussels Sprouts", price: 14, desc: "avocado green goddess, soft herbs, pink peppercorns" },
        { name: "Baby Spinach", price: 9 },
        { name: "Hand Cut Fries", price: 11, desc: "roasted garlic aioli" },
      ],
    },
    {
      title: "STEAKS",
      // STEAKS section was partially cut off in the source photo — may be incomplete.
      note: "Cedar River Farms",
      items: [
        { name: "The Smith Bar Steak", price: 38, desc: "flat iron, baby spinach, fries, green peppercorn" },
        { name: "Hanger", price: 37, desc: "burst tomatoes + balsamic" },
        { name: "Skirt", price: null, desc: "chimichurri" },
        { name: "Bone-in Ribeye", price: 57, desc: "garlic herb butter" },
      ],
    },
  ],
};
