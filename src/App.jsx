import { useState, useEffect, useRef, useMemo } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, FileText, X, Copy, Check, Pencil, AlertTriangle } from "lucide-react";
import { localStore } from "./storage";

// ---------- Brand tokens (from Lily logo) ----------
const COLORS = {
  bg: "#454A3C",
  bgDeep: "#3A3E32",
  cream: "#F2DECE",
  creamDim: "#D9C7B6",
  line: "#5A5F4E",
  panel: "#4E5341",
  danger: "#E0A199",
};

const uid = () => Math.random().toString(36).slice(2, 10);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const KEY_PREFIX = "lily-inv-cat-";

// ---------- Seed data (stable slug ids so storage keys never change) ----------
const SEED = [
  { name: "Grab & Go / Prêt-à-Emporter", groups: [
    { name: "Water", supplier: "UNFI Canada", items: [
      "Perrier Sparkling Water","Maison Perrier – Pamplemousse (Grapefruit)","Maison Perrier – Citron Vert (Lime)",
      "Maison Perrier – Original","Saint James – Mango","Saint James – Classic Lemon",
      "Bio Steel Sports Hydration – Lemon-Lime","Bio Steel Sports Hydration – Pink/Mixed Berry","Bio Steel Sports Hydration – Cherry",
      "Maple3 Maple Water – Raspberry","Maple3 Maple Water – Original","Maple3 Maple Water – Strawberry",
      "Vita Coco Coconut Water – Original","Vita Coco Coconut Water – Extra Coconut","Vita Coco Coconut Water – Pineapple",
      "Flow Alkaline Spring Water – Plain (small)","Flow Alkaline Spring Water – Plain (1L)",
      "Flow Alkaline Spring Water – Cucumber Mint","Flow Alkaline Spring Water – Strawberry Rose",
      "Fiji Natural Spring Water","Evian Natural Spring Water","Thirsty Buddha Organic Coconut Water"
    ]},
    { name: "Kombucha, Iced Tea & Sodas", supplier: "UNFI Canada", items: [
      "Mateina Yerba Mate – Lemon Original","Mateina Yerba Mate – Peach Passion","Mateina Yerba Mate – Mint Limeade",
      "Cove Kombucha – Blueberry","Cove Kombucha – Strawberry Lime","Cove Kombucha – Watermelon Guava",
      "Cove Kombucha – Limonade Framboise (Raspberry Lemonade)","Cove Kombucha – Ginger","Cove Kombucha – Curcuma Mango (Turmeric Mango)",
      "Loop Iced Tea – Thé Glacé (flavor 1)","Loop Iced Tea – Thé Glacé (flavor 2)","Loop Iced Tea – Thé Glacé (peach/yellow)",
      "Say It Ain't Soda – Lemon","Say It Ain't Soda – Lime/Green Apple","Say It Ain't Soda – Grape/Berry",
      "Daydream Sparkling Drink – Pink/Orange","Daydream Sparkling Drink – Blue/Purple","Daydream Sparkling Drink – Teal/Blue",
      "Poppi Prebiotic Soda – Grape","Poppi Prebiotic Soda – Strawberry Lemon","Poppi Prebiotic Soda – Peach",
      "Poppi Prebiotic Soda – Orange","Poppi Prebiotic Soda – Raspberry Rose","Poppi Prebiotic Soda – Cherry Limeade",
      "Poppi Prebiotic Soda – Dark Grape","Poppi Prebiotic Soda – Lemon Lime","Poppi Prebiotic Soda – Doc Pop/Cola",
      "LaCroix Sparkling Water – Watermelon","LaCroix Sparkling Water – Assorted Flavors"
    ]},
    { name: "Wellness Shots & Cold-Pressed Juices", supplier: "UNFI Canada", items: [
      "Get Well+ Wellness Shot","Sick Day+ Wellness Shot","Turmeric Daily+ Wellness Shot",
      "Loop Immunity Shot – Red/Berry","Loop Immunity Shot – Orange","Loop Recovery Shot – Green",
      "Loop Lemonade Recovery Shot – Red/Orange","Booch Kombucha Shot – Purple","Booch Kombucha Shot – Gold/Turmeric",
      "Booch Kombucha Shot – Light Green","Booch Kombucha Shot – Green","Wellness Shot – Dark Red/Brown",
      "Wellness Shot – Green","Fiery Ginger Shot","Green Ritual Juice","Ferme.C Cold-Pressed Juice",
      "Greenhouse Fiery Ginger Wellness Shot","XU Cold-Pressed Wellness Shot – Yerba Mate/Cayenne"
    ]},
    { name: "Grab & Go Snacks", supplier: "UNFI Canada", items: [
      "Perfect Bar – Peanut Butter","Perfect Bar – (other flavor)",
      "Mid-Day Squares – PB&J","Mid-Day Squares – Cookie Dough","Mid-Day Squares – Coffee/Mocha",
      "Mid-Day Squares – Caramel","Mid-Day Squares – Orange/PB","Mid-Day Squares – Chocolate Peanut Butter",
      "Frankie's Organic Puffcorn – Avocado Oil & Himalayan Pink Salt",
      "Frankie's Organic Puffs Soufflés – BBQ","Frankie's Organic Puffs Soufflés – White Cheddar",
      "ChocXO Dark Chocolate Almond Butter Cups","ChocXO Dark Chocolate Lemon Crème Cups",
      "Simply Naked Pita Chips – Sea Salt","Justin's Dark Chocolate Peanut Butter Cups",
      "Justin's Dark Chocolate Cashew Butter Cups","MadeGood Organic Granola Bites – Mixed Berry",
      "Sana Chocolate (No Added Sugar)","RXBAR No B.S. – Peanut Butter Chocolate","RXBAR No B.S. – Chocolate",
      "RXBAR No B.S. – Blueberry/Dark","Kettle Brand Potato Chips – Sea Salt","Kettle Brand Potato Chips – Salt & Vinegar",
      "Awake Caffeinated Chocolate Bites – Milk","Awake Caffeinated Chocolate Bites – Peanut Butter","Victory Crisps"
    ]}
  ]},
  { name: "Fruits & Vegetables / Fruits et Légumes", groups: [
    { name: "Fresh", supplier: "Distaulo", items: [
      "Bananas / Bananes","Apples / Pommes","Avocados / Avocats","Lemons / Citrons","Tomatoes / Tomates",
      "Grape Tomatoes / Tomates Raisins","Lettuce / Laitue","Romaine Hearts / Cœurs de Romaine","Kale / Chou Frisé",
      "Cabbage / Chou","Spinach / Épinards","Cucumbers / Concombres","Celery / Céleri","Carrots / Carottes",
      "Beets / Betteraves","Peppers / Poivrons","Red Onions / Oignons Rouges","Shallots / Échalotes",
      "Coriander / Coriandre","Fresh Ginger / Gingembre Frais","Eggs / Œufs","Pineapple / Ananas",
      "Strawberries / Fraises","Blueberries / Bleuets","Pitted Dates / Dattes Dénoyautées"
    ]},
    { name: "Frozen Fruit", supplier: "Dubord & Rainville", items: [
      "Frozen Bananas","Frozen Pineapple","Frozen Mango","Frozen Strawberries","Frozen Blueberries","Frozen Edamame"
    ]}
  ]},
  { name: "Meats / Viandes", groups: [
    { name: "Meats", supplier: "Dubord & Rainville", items: [
      "Chicken Breast (frozen)","Smoked Turkey Breast (deli)","Bacon Crumbles","Canned Tuna in Water (case)",
      "Smoked Salmon (Coho, sliced)","Prosciutto"
    ]}
  ]},
  { name: "Dry Items / Produits Secs", groups: [
    { name: "Powders & Supplements", supplier: "UNFI Canada", items: [
      "Vanilla Protein Powder","Chocolate Protein Powder","Blue Spirulina","Hemp Seeds","Chia Seeds",
      "Maca Powder","Cacao Nibs","Collagen","Creatine","Beet Powder","Hot Chocolate Powder",
      "Organika Marine Collagen","Nufyx Heavenly Protein Powder – Dreamy Chocolate","Nufyx Heavenly Protein Powder – Creamy Vanilla",
      "Cymbiotika Golden Mind – Vanilla Chai","Cymbiotika Liposomal Glutathione – Citrus Berry",
      "Cymbiotika Shilajit Liquid Complex – Hazelnut Cacao","Cymbiotika Liposomal Brain Complex – Vanilla Cinnamon",
      "Cymbiotika Liposomal Elderberry – Blueberry","Cymbiotika Super Greens with Chlorophyll – Citrus Lime",
      "Cymbiotika Liposomal Vitamin C – Citrus Vanilla"
    ]},
    { name: "Baking & Grains", supplier: "UNFI Canada", items: [
      "Granola","Steel Cut Oats","Quick Oats","Flour","Gluten-Free Flour Blend","Sugar","Coffee Beans",
      "Sesame Seeds","Flax Seeds","Peanuts","Dried Cranberries","Cooked Quinoa (bagged)"
    ]},
    { name: "Condiments, Sauces & Oils", supplier: "Dubord & Rainville", items: [
      "Maple Syrup","Avocado Oil","Olive Oil","Rice Vinegar","Soy Sauce","Red Wine Vinegar","White Vinegar",
      "Cayenne Pepper","Sea Salt","Kosher Salt","Black Pepper","Sesame Oil","Dijon Mustard (for vinaigrettes only)",
      "Pickled Jalapeños","Hot Sauce","Vegan Mayo","Pesto","Caesar Dressing","Hot Honey"
    ]},
    { name: "Coffee, Tea & Syrups", supplier: "UNFI Canada", items: [
      "Illy Classico Ground Coffee","Illy Classico Whole Bean Coffee","Illy Intenso Ground Coffee","Illy Decaffeinato Ground Coffee",
      "Monin Hazelnut Syrup","Monin Hazelnut Noisette Syrup","Monin Pistachio Syrup","Monin Caramel Syrup (Sugar Free)",
      "Monin Caramel Syrup","Monin Strawberry Syrup","Monin French Vanilla Syrup","Monin Vanilla Syrup (Sugar Free)",
      "Monin Pure Cane Syrup","Monin Lavender Syrup","Monin Rose Syrup","Monin Yuzu Pineapple Syrup",
      "Éclat Citron-Gingembre Herbal Tea","Menthe (Mint) Tea","Sublime Camomille Tea","Sencha Nagashima Green Tea",
      "Earl Grey Tea","Camellia Sinensis Matcha Barista Powder","Cinnamon (for drinks)"
    ]},
    { name: "Nut Butters", supplier: "Dubord & Rainville", items: ["Almond Butter","Peanut Butter (12kg bucket)"] },
    { name: "Dairy & Milk Alternatives", supplier: "Dubord & Rainville", items: [
      "Almond Milk – Unsweetened (for smoothies)","Almond Milk – Regular/Sweetened (for coffee)",
      "Oat Milk (Barista)","Macadamia Milk (Barista)","Coconut Milk","Soy Milk","Lactose-Free Milk",
      "Barista Whole Milk","Chai Concentrate","Greek Yogurt"
    ]},
    { name: "Bread", supplier: "Arhoma", items: ["Toast Bread (sliced)","Sandwich Bread (ciabatta-style)","Gluten-Free Bread"] },
    { name: "Other Pantry", supplier: "Dubord & Rainville", items: ["Açaí Sorbet","Strawberry Popsicles"] }
  ]},
  { name: "Containers, Boxes & Bags / Contenants, Boîtes et Sacs", groups: [
    { name: "Containers, Boxes & Bags", supplier: "Dubord & Rainville", items: [
      "Smoothie Cups","Coffee Cups","Plastic Dome Lids","Salad Bowls","Açaí Bowls","Sauce Cups",
      "Kraft Paper Trays","Paper Sleeves","Straws – Thin","Straws – Large","Wooden Stir Sticks",
      "Cutlery (Forks/Spoons)","Grocery Paper Bags","Garbage Bags","Grease-Resistant Paper"
    ]}
  ]},
  { name: "Cleaning Supplies / Produits Nettoyants", groups: [
    { name: "Cleaning Supplies", supplier: "Cintas", items: [
      "Lysol Bathroom Foam","Lysol Toilet Bowl Cleaner","Windex","Cintas Mop Heads",
      "Cintas Soap Dispensers","Cintas Air Freshener","Cintas Kitchen Linens","Cintas Microfiber Cloths",
      "Vinyl Gloves (Boustan)","Nitrile Gloves","Bath Tissue (DuraPlus)","Bath Tissue (JRT)",
      "Kersia Elite","Kersia DV-2000","Kersia Ali-Dher","Sodium Hydroxide Solution","Javex Wipes",
      "InnuScience DR-300 Sanitizer","Steel Wool Pads"
    ]}
  ]},
  { name: "Packaging / Stickers / Emballage et Autocollants", groups: [
    { name: "Packaging / Stickers", supplier: "", items: [
      "Lily Stickers","Salad Sticker – La Césarine","Salad Sticker – La Lily Vitalité",
      "Salad Sticker – Bangkok","Salad Sticker – La Fraîche"
    ]}
  ]}
];

const CATEGORY_SKELETON = SEED.map((cat) => ({
  id: slug(cat.name),
  name: cat.name,
  groups: cat.groups.map((g) => ({
    id: slug(g.name),
    name: g.name,
    supplier: g.supplier || "",
    seedItems: g.items,
  })),
}));

function freshCategory(skel) {
  return {
    id: skel.id,
    name: skel.name,
    groups: skel.groups.map((g) => ({
      id: g.id, name: g.name, supplier: g.supplier,
      items: g.seedItems.map((name) => ({ id: uid(), name, qty: "", urgent: false, lastEditedBy: "", lastEditedAt: "" })),
    })),
  };
}

export default function App() {
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [nameConfirmed, setNameConfirmed] = useState(false);

  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCats, setOpenCats] = useState({});
  const [newItemText, setNewItemText] = useState({});
  const [syncNote, setSyncNote] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierDraft, setSupplierDraft] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [itemNameDraft, setItemNameDraft] = useState("");
  const saveTimers = useRef({});

  // ---------- Load all categories from localStorage ----------
  useEffect(() => {
    (async () => {
      const loaded = [];
      for (const skel of CATEGORY_SKELETON) {
        try {
          const result = await localStore.get(KEY_PREFIX + skel.id);
          if (result && result.value) {
            loaded.push(JSON.parse(result.value));
            continue;
          }
        } catch (e) {}
        const fresh = freshCategory(skel);
        loaded.push(fresh);
        localStore.set(KEY_PREFIX + skel.id, JSON.stringify(fresh)).catch(() => {});
      }
      setCategories(loaded);
      setLoading(false);
    })();
  }, []);

  const stamp = () => ({ lastEditedBy: name, lastEditedAt: new Date().toLocaleString() });

  const persistCategory = (catId, updatedCategory) => {
    setCategories((prev) => prev.map((c) => (c.id === catId ? updatedCategory : c)));
    if (saveTimers.current[catId]) clearTimeout(saveTimers.current[catId]);
    saveTimers.current[catId] = setTimeout(() => {
      localStore.set(KEY_PREFIX + catId, JSON.stringify(updatedCategory))
        .then(() => setSyncNote(""))
        .catch(() => setSyncNote("Erreur de sauvegarde locale / Local save error."));
    }, 300);
  };

  const updateQty = (catId, groupId, itemId, qty) => {
    const cat = categories.find((c) => c.id === catId);
    const updated = {
      ...cat,
      groups: cat.groups.map((g) =>
        g.id !== groupId ? g : { ...g, items: g.items.map((it) => (it.id === itemId ? { ...it, qty, ...stamp() } : it)) }
      ),
    };
    persistCategory(catId, updated);
  };

  const addItem = (catId, groupId) => {
    const key = `${catId}-${groupId}`;
    const text = (newItemText[key] || "").trim();
    if (!text) return;
    const cat = categories.find((c) => c.id === catId);
    const updated = {
      ...cat,
      groups: cat.groups.map((g) =>
        g.id !== groupId ? g : { ...g, items: [...g.items, { id: uid(), name: text, qty: "", urgent: false, ...stamp() }] }
      ),
    };
    persistCategory(catId, updated);
    setNewItemText((prev) => ({ ...prev, [key]: "" }));
  };

  const removeItem = (catId, groupId, itemId) => {
    const cat = categories.find((c) => c.id === catId);
    const updated = {
      ...cat,
      groups: cat.groups.map((g) =>
        g.id !== groupId ? g : { ...g, items: g.items.filter((it) => it.id !== itemId) }
      ),
    };
    persistCategory(catId, updated);
  };

  const toggleUrgent = (catId, groupId, itemId) => {
    const cat = categories.find((c) => c.id === catId);
    const updated = {
      ...cat,
      groups: cat.groups.map((g) =>
        g.id !== groupId ? g : { ...g, items: g.items.map((it) => (it.id === itemId ? { ...it, urgent: !it.urgent, ...stamp() } : it)) }
      ),
    };
    persistCategory(catId, updated);
  };

  const saveSupplier = (catId, groupId) => {
    const cat = categories.find((c) => c.id === catId);
    const updated = { ...cat, groups: cat.groups.map((g) => (g.id !== groupId ? g : { ...g, supplier: supplierDraft.trim() })) };
    persistCategory(catId, updated);
    setEditingSupplier(null);
  };

  const saveItemName = (catId, groupId, itemId) => {
    const trimmed = itemNameDraft.trim();
    if (!trimmed) { setEditingItem(null); return; }
    const cat = categories.find((c) => c.id === catId);
    const updated = {
      ...cat,
      groups: cat.groups.map((g) =>
        g.id !== groupId ? g : { ...g, items: g.items.map((it) => (it.id === itemId ? { ...it, name: trimmed, ...stamp() } : it)) }
      ),
    };
    persistCategory(catId, updated);
    setEditingItem(null);
  };

  const toggleCat = (catId) => setOpenCats((p) => ({ ...p, [catId]: !p[catId] }));

  const totalFilled = useMemo(() => {
    if (!categories) return 0;
    let n = 0;
    categories.forEach((c) => c.groups.forEach((g) => g.items.forEach((it) => { if (it.qty !== "") n++; })));
    return n;
  }, [categories]);

  const reportText = useMemo(() => {
    if (!categories) return "";
    const lines = [`LILY — Inventaire des stocks restants / Remaining Stock Inventory`, `Par / By: ${name}`, ""];
    const urgentLines = [];
    categories.forEach((c) => c.groups.forEach((g) => g.items.forEach((it) => {
      if (it.urgent) urgentLines.push(`  - ${it.name}${it.qty !== "" ? `: ${it.qty}` : ""}`);
    })));
    if (urgentLines.length) { lines.push("URGENT"); lines.push(...urgentLines); lines.push(""); }
    let any = false;
    categories.forEach((c) => {
      const catLines = [];
      c.groups.forEach((g) => g.items.forEach((it) => {
        if (it.qty !== "" && Number(it.qty) >= 0) catLines.push(`  - ${it.name}: ${it.qty}`);
      }));
      if (catLines.length) { any = true; lines.push(c.name); lines.push(...catLines); lines.push(""); }
    });
    if (!any && !urgentLines.length) lines.push("Rien à signaler / Nothing entered yet.");
    return lines.join("\n");
  }, [categories, name]);

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {}
  };

  // ---------- Name gate ----------
  if (!nameConfirmed) {
    return (
      <div style={{ background: COLORS.bg, minHeight: "100vh" }} className="flex flex-col items-center justify-center px-6">
        <h1 style={{ color: COLORS.cream, fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.2em" }} className="text-5xl mb-2 tracking-widest">
          LILY
        </h1>
        <p style={{ color: COLORS.creamDim, letterSpacing: "0.35em" }} className="text-xs uppercase mb-3">
          Manger . Vivre . Aimer
        </p>
        <p style={{ color: COLORS.creamDim, opacity: 0.75 }} className="text-xs mb-10 text-center">
          Inventaire des stocks restants <br className="sm:hidden" />/ Remaining Stock Inventory
        </p>
        <div className="w-full max-w-xs">
          <label style={{ color: COLORS.creamDim }} className="block text-sm mb-2 text-center">Votre nom / Your name</label>
          <input
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && nameInput.trim()) { setName(nameInput.trim()); setNameConfirmed(true); } }}
            placeholder="Nom / Name"
            style={{ background: COLORS.panel, color: COLORS.cream, borderColor: COLORS.line }}
            className="w-full border rounded-lg px-4 py-3 text-center focus:outline-none"
          />
          <button
            onClick={() => { if (nameInput.trim()) { setName(nameInput.trim()); setNameConfirmed(true); } }}
            style={{ background: COLORS.cream, color: COLORS.bgDeep }}
            className="w-full mt-3 rounded-lg py-3 font-semibold"
          >
            Entrer / Enter
          </button>
        </div>
      </div>
    );
  }

  if (loading || !categories) {
    return (
      <div style={{ background: COLORS.bg }} className="min-h-screen flex items-center justify-center">
        <p style={{ color: COLORS.cream }}>Chargement... / Loading inventory…</p>
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="text-center mb-1">
          <h1 style={{ color: COLORS.cream, fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.18em" }} className="text-3xl">LILY</h1>
          <p style={{ color: COLORS.creamDim, letterSpacing: "0.3em" }} className="text-[10px] uppercase mt-1.5">Manger . Vivre . Aimer</p>
          <p style={{ color: COLORS.creamDim, opacity: 0.7 }} className="text-[11px] mt-1">
            Inventaire des stocks restants / Remaining Stock Inventory
          </p>
        </div>

        <div className="flex items-center justify-between mt-5 mb-1">
          <div style={{ color: COLORS.creamDim }} className="text-xs">
            Connecté en tant que / Signed in as <span style={{ color: COLORS.cream }} className="font-semibold">{name}</span>
          </div>
        </div>
        {syncNote && (
          <p style={{ color: COLORS.creamDim, opacity: 0.75 }} className="text-[11px] mb-3">{syncNote}</p>
        )}
        <p style={{ color: COLORS.creamDim, opacity: 0.6 }} className="text-[10px] mb-3">
          Sauvegarde locale (cet appareil seulement) / Saved on this device only.
        </p>

        <div className="flex items-center justify-between mb-2 gap-2">
          <p style={{ color: COLORS.creamDim }} className="text-xs">Articles notés / Items entered: {totalFilled}</p>
          <button
            onClick={() => setShowReport(true)}
            style={{ background: COLORS.cream, color: COLORS.bgDeep }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold shrink-0"
          >
            <FileText size={15} /> Rapport / Report
          </button>
        </div>
        <p style={{ color: COLORS.creamDim, opacity: 0.75 }} className="text-[11px] mb-5">
          Qté = ce qu'il reste / Qty = what's left. <AlertTriangle size={11} className="inline -mt-0.5" style={{ color: COLORS.danger }} /> = urgent.
        </p>

        <div className="space-y-3">
          {categories.map((cat) => {
            const catCount = cat.groups.reduce((s, g) => s + g.items.length, 0);
            return (
              <div key={cat.id} style={{ borderColor: COLORS.line, background: COLORS.panel }} className="border rounded-xl overflow-hidden">
                <button onClick={() => toggleCat(cat.id)} style={{ color: COLORS.cream }} className="w-full flex items-center justify-between px-4 py-3.5 text-left">
                  <span className="font-semibold text-sm">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span style={{ color: COLORS.creamDim }} className="text-xs">{catCount}</span>
                    {openCats[cat.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {openCats[cat.id] && (
                  <div className="px-4 pb-4">
                    {cat.groups.map((group) => {
                      const key = `${cat.id}-${group.id}`;
                      return (
                        <div key={group.id} className="mb-4">
                          <div className="flex items-center justify-between mt-2 mb-2 gap-2">
                            <p style={{ color: COLORS.creamDim }} className="text-xs uppercase tracking-wide">{group.name}</p>
                            {editingSupplier === key ? (
                              <input
                                autoFocus
                                value={supplierDraft}
                                onChange={(e) => setSupplierDraft(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && saveSupplier(cat.id, group.id)}
                                onBlur={() => saveSupplier(cat.id, group.id)}
                                placeholder="Supplier name"
                                style={{ background: COLORS.bgDeep, color: COLORS.cream, borderColor: COLORS.line }}
                                className="border rounded px-2 py-1 text-[11px] w-28 focus:outline-none"
                              />
                            ) : (
                              <button
                                onClick={() => { setEditingSupplier(key); setSupplierDraft(group.supplier || ""); }}
                                style={{ color: COLORS.creamDim, opacity: 0.85 }}
                                className="flex items-center gap-1 text-[10px]"
                              >
                                {group.supplier || "Fournisseur / Supplier"} <Pencil size={10} />
                              </button>
                            )}
                          </div>
                          <div style={{ borderColor: COLORS.line }} className="border-t">
                            {group.items.map((item) => (
                              <div
                                key={item.id}
                                style={{ borderColor: COLORS.line, background: item.urgent ? "rgba(224,161,153,0.12)" : "transparent" }}
                                className="flex items-center gap-2 py-2 border-b px-1 rounded"
                              >
                                <div className="flex-1 min-w-0">
                                  {editingItem === item.id ? (
                                    <input
                                      autoFocus
                                      value={itemNameDraft}
                                      onChange={(e) => setItemNameDraft(e.target.value)}
                                      onKeyDown={(e) => e.key === "Enter" && saveItemName(cat.id, group.id, item.id)}
                                      onBlur={() => saveItemName(cat.id, group.id, item.id)}
                                      style={{ background: COLORS.bgDeep, color: COLORS.cream, borderColor: COLORS.line }}
                                      className="border rounded px-2 py-1 text-sm w-full focus:outline-none"
                                    />
                                  ) : (
                                    <button onClick={() => { setEditingItem(item.id); setItemNameDraft(item.name); }} className="flex items-center gap-1 text-left">
                                      <p style={{ color: COLORS.cream }} className="text-sm leading-tight">{item.name}</p>
                                      <Pencil size={10} style={{ color: COLORS.creamDim, opacity: 0.5 }} className="shrink-0" />
                                    </button>
                                  )}
                                  {item.lastEditedBy && (
                                    <p style={{ color: COLORS.creamDim }} className="text-[10px] mt-0.5 flex items-center gap-1">
                                      by {item.lastEditedBy}
                                      <span className="inline-flex items-center gap-0.5" style={{ color: "#9CB68A" }}>
                                        <Check size={10} /> saved
                                      </span>
                                    </p>
                                  )}
                                </div>
                                <button onClick={() => toggleUrgent(cat.id, group.id, item.id)} style={{ color: item.urgent ? COLORS.danger : COLORS.creamDim, opacity: item.urgent ? 1 : 0.4 }} className="shrink-0" title="Mark as urgent">
                                  <AlertTriangle size={15} />
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  inputMode="numeric"
                                  placeholder="Qty"
                                  value={item.qty}
                                  onChange={(e) => updateQty(cat.id, group.id, item.id, e.target.value)}
                                  style={{ background: COLORS.bgDeep, color: COLORS.cream, borderColor: COLORS.line }}
                                  className="w-16 border rounded px-2 py-1.5 text-sm text-right focus:outline-none shrink-0"
                                />
                                <button onClick={() => removeItem(cat.id, group.id, item.id)} style={{ color: COLORS.creamDim }} className="shrink-0" aria-label="Remove">
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              type="text"
                              placeholder="Ajouter un article / Add item…"
                              value={newItemText[key] || ""}
                              onChange={(e) => setNewItemText((p) => ({ ...p, [key]: e.target.value }))}
                              onKeyDown={(e) => e.key === "Enter" && addItem(cat.id, group.id)}
                              style={{ background: COLORS.bgDeep, color: COLORS.cream, borderColor: COLORS.line }}
                              className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
                            />
                            <button onClick={() => addItem(cat.id, group.id)} style={{ background: COLORS.cream, color: COLORS.bgDeep }} className="flex items-center gap-1 rounded px-3 py-2 text-sm font-semibold shrink-0">
                              <Plus size={14} /> Ajouter / Add
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ color: COLORS.creamDim }} className="text-[11px] text-center mt-6">
          Sauvegarde locale sur cet appareil / Saved locally on this device.
        </p>
      </div>

      {showReport && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center p-4 z-50" style={{ background: "rgba(0,0,0,0.55)" }}>
          <div style={{ background: COLORS.panel, borderColor: COLORS.line }} className="w-full max-w-lg border rounded-xl p-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 style={{ color: COLORS.cream }} className="font-semibold">Rapport / Report</h2>
              <button onClick={() => setShowReport(false)} style={{ color: COLORS.creamDim }}><X size={20} /></button>
            </div>
            <pre style={{ background: COLORS.bgDeep, color: COLORS.cream, borderColor: COLORS.line }} className="border rounded-lg p-3 text-xs overflow-auto flex-1 whitespace-pre-wrap">
              {reportText}
            </pre>
            <button onClick={copyReport} style={{ background: COLORS.cream, color: COLORS.bgDeep }} className="mt-3 flex items-center justify-center gap-2 rounded-lg py-3 font-semibold">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copié ! / Copied!" : "Copier / Copy Report"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
