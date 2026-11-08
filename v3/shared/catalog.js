/*
  SAMPLE CATALOGUE (v3) — development data only.
  Products were chosen to match licensed stock photographs (Unsplash License, see shared/img/CREDITS.md).
  Names, colours and visible features follow what each photo shows. Prices, stock, dimensions and
  weights are invented sample values and must be replaced with real supplier data before any real use.

  Photo fields:
    photo: { img, pos, zoom }   img = file stem in shared/img (…-800.jpg / …-1600.jpg)
                                 pos = focal point "x% y%" used for cropping on every screen size
                                 zoom = optional close-up crop of the same photograph
    views: gallery images (representative product only); each is a crop of a real photo of that same product
    variant.photo: optional override when a variant is shown in a different crop
*/
window.HE_CATALOG = {
  store: {
    name: "HomeEaseEssentials",
    baseUrl: "https://homeeaseessentials.example",
    whatsappNumber: "TBC",
    currency: "PKR",
    shipping: { standard: 250, bulkySurcharge: 200, label: "Standard delivery" }
  },
  categories: [
    { id: "organisation", name: "Organisation", blurb: "Boxes and baskets that give small things a place." },
    { id: "mugs", name: "Mugs & Flasks", blurb: "Everyday drinkware for desks, kitchens and travel." },
    { id: "lighting", name: "Lighting", blurb: "A desk lamp and warm decorative light." },
    { id: "bath", name: "Bath & Self-care", blurb: "Practical pieces for the bathroom." }
  ],
  products: [
    {
      handle: "travel-jewellery-organiser-box",
      name: "Travel Jewellery Organiser Box",
      category: "organisation",
      price: 1950,
      mode: "buy",
      representative: true,
      cardSpec: "Zip case · ring roll + 4 compartments",
      photo: { img: "jewellery-box-1", pos: "42% 62%" },
      views: [
        { id: "main", label: "Open box with jewellery", img: "jewellery-box-1", pos: "42% 62%" },
        { id: "inside", label: "Compartments and ring roll", img: "jewellery-box-2", pos: "50% 60%" },
        { id: "rings", label: "Close-up of the ring roll", img: "jewellery-box-2", pos: "80% 62%", zoom: 2 },
        { id: "lid", label: "Lid with elastic strap", img: "jewellery-box-1", pos: "12% 45%", zoom: 1.9 }
      ],
      summary: "A compact zip-up case that keeps rings, earrings and necklaces separated at home or when travelling.",
      details: [
        "Ring roll plus four compartments for earrings and small pieces.",
        "Elastic strap in the lid holds a necklace or bracelet flat.",
        "Zip closure keeps everything in place in a handbag or suitcase."
      ],
      specs: { Size: "About 11 × 11 × 5.5 cm", Outer: "Faux leather, blush pink", Lining: "Soft velvet-touch fabric", Closure: "Zip" },
      included: "1 organiser box (jewellery not included)",
      care: "Wipe the outside with a dry cloth. Keep away from damp areas.",
      variants: [
        { id: "blush", name: "Blush Pink", color: "#E9BDB6", stock: 6, sku: "SAMPLE-JB-BLS" }
      ],
      added: 9
    },
    {
      handle: "woven-storage-box",
      name: "Woven Storage Box with Lid",
      category: "organisation",
      price: 2450,
      mode: "enquire",
      cardSpec: "Seagrass · lid with loop handle",
      photo: { img: "storage-basket", pos: "40% 86%", zoom: 1.55 },
      summary: "A hand-woven box with a fitted lid for shelves, for chargers, cosmetics or small linens.",
      details: ["Hand-woven natural fibre.", "Fitted lid with loop handle.", "Looks at home on open shelving."],
      specs: { Size: "About 30 × 22 × 18 cm", Material: "Seagrass weave", Lid: "Fitted, loop handle" },
      included: "1 box with lid",
      care: "Dust with a soft brush. Keep dry.",
      variants: [{ id: "natural", name: "Natural", color: "#C8A777", stock: 0, sku: "SAMPLE-WB-NAT" }],
      added: 8
    },
    {
      handle: "speckled-ceramic-mug",
      name: "Speckled Ceramic Mug, 350 ml",
      category: "mugs",
      price: 1250,
      mode: "buy",
      cardSpec: "350 ml · glazed stoneware look",
      photo: { img: "camp-mug", pos: "57% 68%" },
      summary: "A sturdy, speckled green mug with a rolled rim for tea and coffee every day.",
      details: ["Speckled glaze with a rolled rim.", "Comfortable C-shaped handle.", "Microwave and dishwasher safe."],
      specs: { Capacity: "350 ml", Size: "9 × 9.5 cm (Ø × height)", Material: "Ceramic" },
      included: "1 mug",
      care: "Dishwasher safe. Avoid sudden temperature changes.",
      variants: [{ id: "green", name: "Forest Green", color: "#3F5A4D", stock: 12, sku: "SAMPLE-CM-GRN" }],
      added: 7
    },
    {
      handle: "vacuum-flask",
      name: "Stainless Steel Vacuum Flask with Cup Lid, 500 ml",
      category: "mugs",
      price: 3250,
      mode: "buy",
      cardSpec: "500 ml · cup lid · double wall",
      photo: { img: "vacuum-flask", pos: "35% 50%" },
      summary: "A double-wall steel flask whose lid doubles as a cup, for hot tea on the commute or outdoors.",
      details: ["Double-wall vacuum insulation.", "Screw lid doubles as a drinking cup.", "Gold-finish exterior."],
      specs: { Capacity: "500 ml", Size: "7.5 × 26 cm (Ø × height)", Material: "Stainless steel" },
      included: "Flask with cup lid",
      care: "Hand wash only.",
      variants: [{ id: "gold", name: "Gold", color: "#C79A45", stock: 3, sku: "SAMPLE-VF-GLD" }],
      added: 6
    },
    {
      handle: "dome-desk-lamp",
      name: "White Dome Desk Lamp",
      category: "lighting",
      price: 4450,
      mode: "buy",
      bulky: true,
      cardSpec: "Dome shade · round weighted base",
      photo: { img: "desk-lamp", pos: "33% 50%", zoom: 1.75 },
      summary: "A simple white lamp with a tilting dome shade that directs light onto the desk.",
      details: ["Tilting dome shade.", "Round, weighted base.", "Matte white finish."],
      specs: { Height: "About 40 cm", Base: "15 cm diameter", Bulb: "E27, not included" },
      included: "Lamp with cable and plug",
      care: "Dust with a dry cloth. Unplug before cleaning.",
      variants: [{ id: "white", name: "White", color: "#EEEDEA", stock: 5, sku: "SAMPLE-DL-WHT" }],
      added: 5
    },
    {
      handle: "jar-fairy-lights",
      name: "Fairy Lights in Glass Jar",
      category: "lighting",
      price: 1650,
      mode: "buy",
      cardSpec: "Warm white · battery powered",
      photo: { img: "jar-lights", pos: "38% 70%" },
      summary: "Fine copper-wire fairy lights in a clear glass jar for a soft, warm glow on a shelf or table.",
      details: ["Warm white micro LEDs on copper wire.", "Clear glass jar with screw lid.", "Battery powered; no socket needed."],
      specs: { Lights: "Warm white micro LEDs", Power: "Batteries (not included)", Jar: "Clear glass" },
      included: "Glass jar and light string",
      care: "Indoor use. Remove batteries when stored.",
      variants: [{ id: "warm", name: "Warm White", color: "#F2D49A", stock: 10, sku: "SAMPLE-JL-WRM" }],
      added: 4
    },
    {
      handle: "ribbed-glass-soap-dispenser",
      name: "Ribbed Glass Soap Dispenser",
      category: "bath",
      price: 1450,
      mode: "buy",
      cardSpec: "Teal ribbed glass · black pump",
      photo: { img: "soap-dispenser", pos: "77% 60%" },
      summary: "A ribbed teal glass bottle with a black pump for hand soap or lotion by the sink.",
      details: ["Ribbed tinted glass.", "Black pump.", "Refillable."],
      specs: { Capacity: "About 400 ml", Material: "Glass, plastic pump", Colour: "Teal" },
      included: "1 dispenser with pump",
      care: "Rinse before refilling.",
      variants: [{ id: "teal", name: "Teal", color: "#3E7A7E", stock: 7, sku: "SAMPLE-SD-TEL" }],
      added: 3
    },
    {
      handle: "cotton-bath-towel",
      name: "Cotton Bath Towel",
      category: "bath",
      price: 2250,
      mode: "buy",
      cardSpec: "Soft cotton terry · hanging loop",
      photo: { img: "bath-towels", pos: "45% 30%" },
      summary: "A soft cotton terry bath towel with a hanging loop, in white or charcoal.",
      details: ["Absorbent cotton terry.", "Hanging loop.", "Machine washable."],
      specs: { Size: "70 × 140 cm", Material: "100% cotton terry" },
      included: "1 bath towel",
      care: "Machine wash at 40°C. Tumble dry low.",
      variants: [
        { id: "white", name: "White", color: "#F4F3EF", stock: 9, sku: "SAMPLE-BT-WHT", photo: { img: "bath-towels", pos: "45% 33%", zoom: 1.7 } },
        { id: "charcoal", name: "Charcoal", color: "#4A4B4D", stock: 0, sku: "SAMPLE-BT-CHR", photo: { img: "bath-towels", pos: "67% 33%", zoom: 1.7 } }
      ],
      added: 2
    }
  ]
};
