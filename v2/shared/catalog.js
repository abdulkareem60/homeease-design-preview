/*
  SAMPLE CATALOGUE — development data only.
  Names, prices, stock, dimensions and specs are invented for design review.
  Replace with the confirmed launch catalogue before any real use.
*/
window.HE_CATALOG = {
  store: {
    name: "HomeEaseEssentials",
    // Domain and WhatsApp number are TBC. ".example" is a reserved, non-routable domain.
    baseUrl: "https://homeeaseessentials.example",
    whatsappNumber: "TBC",
    currency: "PKR",
    // Sample shipping rule — real courier rates TBC.
    shipping: { standard: 250, bulkySurcharge: 200, label: "Standard delivery" }
  },
  categories: [
    { id: "organisation", name: "Organisation", blurb: "Trays, drawers and boxes that give small things a place." },
    { id: "mugs", name: "Mugs & Tumblers", blurb: "Insulated drinkware for desks, cars and long days." },
    { id: "lighting", name: "Lighting", blurb: "Desk lamps and warm string lights." },
    { id: "bath", name: "Bath & Self-care", blurb: "Practical pieces for the bathroom and daily routines." }
  ],
  products: [
    {
      handle: "velvet-jewellery-organiser-tray",
      name: "Velvet Jewellery Organiser Tray",
      category: "organisation",
      type: "tray",
      price: 2450,
      mode: "buy",
      representative: true,
      cardSpec: "24 × 16 cm · 5 compartments",
      views: [
        { id: "main", label: "Three-quarter view" },
        { id: "top", label: "Top view with jewellery" },
        { id: "detail", label: "Close-up of ring roll and lining" },
        { id: "dims", label: "Dimensions" }
      ],
      summary: "A low, divided tray for rings, earrings and everyday pieces, so they stay paired and visible on a dresser.",
      details: [
        "Five compartments: four small and one ring roll.",
        "Soft velvet-style lining helps prevent scratches.",
        "Stackable with a second tray of the same size."
      ],
      specs: { Dimensions: "24 × 16 × 4 cm", Material: "MDF frame, velvet-style lining", Weight: "320 g" },
      included: "1 tray",
      care: "Wipe with a dry, lint-free cloth. Keep away from damp areas.",
      dims: { w: "24 cm", h: "4 cm" },
      variants: [
        { id: "blush", name: "Blush", color: "#D9A6A0", stock: 6, sku: "SAMPLE-JT-BLS" },
        { id: "sage", name: "Sage", color: "#9DAE94", stock: 0, sku: "SAMPLE-JT-SGE" },
        { id: "charcoal", name: "Charcoal", color: "#4A4A4F", stock: 3, sku: "SAMPLE-JT-CHR" }
      ],
      added: 9
    },
    {
      handle: "stackable-drawer-organiser-set",
      name: "Stackable Drawer Organiser Set, 4 pieces",
      category: "organisation",
      type: "boxes",
      price: 1850,
      mode: "buy",
      summary: "Four trays in three sizes that sit side by side in a drawer for stationery, cosmetics or cutlery.",
      details: [
        "Sizes fit together in a 30 × 23 cm drawer area.",
        "Non-slip feet keep trays in place.",
        "Smooth corners for easy cleaning."
      ],
      specs: { Dimensions: "Largest tray 23 × 8 × 5 cm", Material: "Food-safe PP plastic", Weight: "410 g (set)" },
      included: "4 trays: 1 large, 2 medium, 1 small",
      care: "Hand wash with mild soap. Not for dishwasher.",
      dims: { w: "30 cm", h: "5 cm" },
      variants: [
        { id: "white", name: "White", color: "#F2F1EC", stock: 12, sku: "SAMPLE-DO-WHT" }
      ],
      added: 6
    },
    {
      handle: "insulated-steel-mug-350ml",
      name: "Insulated Steel Mug with Lid, 350 ml",
      category: "mugs",
      type: "mug",
      price: 1650,
      mode: "buy",
      summary: "A double-wall steel mug with a sliding lid that keeps tea warm through a long desk session.",
      details: [
        "Double-wall stainless steel.",
        "Press-fit lid with sliding opening.",
        "Fits most car cup holders."
      ],
      specs: { Capacity: "350 ml", Dimensions: "9 × 12 cm (Ø × height)", Material: "304 stainless steel, PP lid", Weight: "290 g" },
      included: "1 mug, 1 lid",
      care: "Hand wash only. Do not microwave.",
      dims: { w: "9 cm", h: "12 cm" },
      variants: [
        { id: "cream", name: "Cream", color: "#EDE3D1", stock: 10, sku: "SAMPLE-MG-CRM" },
        { id: "forest", name: "Forest", color: "#3F5B4A", stock: 4, sku: "SAMPLE-MG-FRS" },
        { id: "black", name: "Black", color: "#2A2A2C", stock: 0, sku: "SAMPLE-MG-BLK" }
      ],
      added: 8
    },
    {
      handle: "insulated-tumbler-straw-600ml",
      name: "Insulated Tumbler with Straw, 600 ml",
      category: "mugs",
      type: "tumbler",
      price: 2250,
      mode: "buy",
      summary: "A tall tumbler with a reusable straw for cold water and iced drinks during the day.",
      details: [
        "Double-wall stainless steel.",
        "Reusable straw and lid included.",
        "Tapered base for cup holders."
      ],
      specs: { Capacity: "600 ml", Dimensions: "9 × 21 cm (Ø × height)", Material: "Stainless steel, PP lid, Tritan straw", Weight: "350 g" },
      included: "1 tumbler, 1 lid, 1 straw",
      care: "Hand wash. Rinse straw after use.",
      dims: { w: "9 cm", h: "21 cm" },
      variants: [
        { id: "sand", name: "Sand", color: "#D8C3A5", stock: 8, sku: "SAMPLE-TB-SND" },
        { id: "dusty-blue", name: "Dusty Blue", color: "#8FA6B8", stock: 2, sku: "SAMPLE-TB-DBL" }
      ],
      added: 4
    },
    {
      handle: "warm-led-string-lights-10m",
      name: "Warm LED String Lights, 10 m",
      category: "lighting",
      type: "lights",
      price: 1450,
      mode: "buy",
      summary: "One hundred warm-white LEDs on thin copper wire for shelves, windows and balconies.",
      details: [
        "100 warm-white LEDs on a 10 m wire.",
        "Steady and slow-fade modes.",
        "Choose a wall plug or USB power."
      ],
      specs: { Length: "10 m", "Light colour": "Warm white", Power: "Wall adapter or USB-A", Weight: "120 g" },
      included: "Light string; adapter or USB lead depending on option",
      care: "Indoor use. Unplug before handling.",
      dims: { w: "10 m", h: "—" },
      variants: [
        { id: "plug", name: "Wall plug", color: "#F3D9A4", stock: 15, sku: "SAMPLE-SL-PLG" },
        { id: "usb", name: "USB", color: "#F3D9A4", stock: 9, sku: "SAMPLE-SL-USB" }
      ],
      added: 7
    },
    {
      handle: "adjustable-desk-lamp-usb",
      name: "Adjustable Desk Lamp with USB Port",
      category: "lighting",
      type: "lamp",
      price: 3950,
      mode: "buy",
      bulky: true,
      summary: "A jointed desk lamp with three brightness levels and a USB port in the base for charging a phone.",
      details: [
        "Three brightness levels, touch control.",
        "Adjustable arm and head.",
        "USB-A charging port in the base."
      ],
      specs: { Height: "Up to 45 cm", Base: "15 cm diameter", Power: "Mains adapter included", Weight: "1.1 kg" },
      included: "Lamp, power adapter",
      care: "Dust with a dry cloth. Unplug before cleaning.",
      dims: { w: "15 cm", h: "45 cm" },
      variants: [
        { id: "white", name: "White", color: "#ECEBE7", stock: 5, sku: "SAMPLE-DL-WHT" },
        { id: "black", name: "Black", color: "#2C2D30", stock: 5, sku: "SAMPLE-DL-BLK" }
      ],
      added: 5
    },
    {
      handle: "bamboo-bath-caddy",
      name: "Expandable Bamboo Bath Caddy",
      category: "bath",
      type: "caddy",
      price: 3250,
      mode: "enquire",
      bulky: true,
      summary: "A bamboo tray that rests across the bath, with a stand for a book or phone and spaces for a cup and soap.",
      details: [
        "Extends to fit most bathtubs.",
        "Book or phone stand folds flat.",
        "Cup and soap spaces."
      ],
      specs: { Dimensions: "70–105 × 22 × 4 cm", Material: "Bamboo with water-resistant finish", Weight: "1.4 kg" },
      included: "1 caddy",
      care: "Wipe dry after use. Do not soak.",
      dims: { w: "70–105 cm", h: "4 cm" },
      variants: [
        { id: "natural", name: "Natural bamboo", color: "#C9A46B", stock: 0, sku: "SAMPLE-BC-NAT" }
      ],
      added: 3
    },
    {
      handle: "silicone-scalp-massager",
      name: "Silicone Scalp Massager Brush",
      category: "bath",
      type: "massager",
      price: 650,
      mode: "buy",
      summary: "A palm-sized brush with soft silicone tips for shampooing and a gentle scalp massage.",
      details: [
        "Soft, flexible silicone tips.",
        "Fits in the palm; loop grip.",
        "For wet or dry hair."
      ],
      specs: { Dimensions: "8 × 7 cm", Material: "Food-grade silicone, ABS grip", Weight: "60 g" },
      included: "1 brush",
      care: "Rinse after use and let air dry.",
      dims: { w: "8 cm", h: "7 cm" },
      variants: [
        { id: "lilac", name: "Lilac", color: "#B9A7D3", stock: 20, sku: "SAMPLE-SM-LLC" },
        { id: "mint", name: "Mint", color: "#A7D3C3", stock: 0, sku: "SAMPLE-SM-MNT" }
      ],
      added: 2
    },
    {
      handle: "ceramic-soap-dispenser-set",
      name: "Ceramic Soap Dispenser and Tray Set",
      category: "bath",
      type: "dispenser",
      price: 1950,
      mode: "buy",
      summary: "A matte ceramic pump bottle with a small tray for the sink, for hand soap or lotion.",
      details: [
        "Matte glazed ceramic.",
        "Rust-resistant pump.",
        "Tray catches drips."
      ],
      specs: { Capacity: "300 ml", Dimensions: "Bottle 7 × 17 cm; tray 18 × 9 cm", Material: "Ceramic, stainless pump", Weight: "650 g" },
      included: "1 bottle with pump, 1 tray",
      care: "Wipe clean. Rinse before refilling.",
      dims: { w: "18 cm", h: "17 cm" },
      variants: [
        { id: "stone", name: "Stone", color: "#CFC8BD", stock: 7, sku: "SAMPLE-SD-STN" },
        { id: "clay", name: "Clay", color: "#B9785B", stock: 3, sku: "SAMPLE-SD-CLY" }
      ],
      added: 1
    }
  ]
};
