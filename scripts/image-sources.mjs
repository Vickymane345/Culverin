// Per-product image sourcing rules.
//
// `provider`  - "wikimedia" for model-specific hardware, "unsplash" for scenes
//               where the exact unit does not matter.
// `queries`   - tried in order; first result with a usable image wins.
// `fallback`  - slug of a sibling product to borrow from if every query misses.
//
// Phones and laptops go to Wikimedia Commons because it actually has photographs
// of named models. Solar, gaming and accessories go to Unsplash because generic
// but beautiful is the right trade there.

/** @type {Record<string, {provider: "wikimedia"|"unsplash", queries: string[], fallback?: string}>} */
export const SOURCES = {
  // ---------------- iPhone ----------------
  "iphone-11": { provider: "wikimedia", queries: ["iPhone 11 back", "iPhone 11"] },
  "iphone-11-pro": { provider: "wikimedia", queries: ["iPhone 11 Pro", "iPhone 11 Pro Max"], fallback: "iphone-11" },
  "iphone-11-pro-max": { provider: "wikimedia", queries: ["iPhone 11 Pro Max", "iPhone 11 Pro"], fallback: "iphone-11-pro" },
  "iphone-12": { provider: "wikimedia", queries: ["iPhone 12 blue", "iPhone 12"], fallback: "iphone-11" },
  "iphone-12-pro": { provider: "wikimedia", queries: ["iPhone 12 Pro", "iPhone 12 Pro Max"], fallback: "iphone-12" },
  "iphone-12-pro-max": { provider: "wikimedia", queries: ["iPhone 12 Pro Max", "iPhone 12 Pro"], fallback: "iphone-12-pro" },
  "iphone-13": { provider: "wikimedia", queries: ["iPhone 13", "iPhone 13 mini"], fallback: "iphone-12" },
  "iphone-13-pro-max": { provider: "wikimedia", queries: ["iPhone 13 Pro Max", "iPhone 13 Pro"], fallback: "iphone-13" },
  "iphone-14": { provider: "wikimedia", queries: ["iPhone 14", "iPhone 14 Plus"], fallback: "iphone-13" },
  "iphone-14-pro": { provider: "wikimedia", queries: ["iPhone 14 Pro", "iPhone 14 Pro Max"], fallback: "iphone-14" },
  "iphone-14-pro-max": { provider: "wikimedia", queries: ["iPhone 14 Pro Max", "iPhone 14 Pro"], fallback: "iphone-14-pro" },
  "iphone-15": { provider: "wikimedia", queries: ["iPhone 15", "iPhone 15 Plus"], fallback: "iphone-14" },
  "iphone-15-pro": { provider: "wikimedia", queries: ["iPhone 15 Pro", "iPhone 15 Pro Max"], fallback: "iphone-15" },
  "iphone-15-pro-max": { provider: "wikimedia", queries: ["iPhone 15 Pro Max", "iPhone 15 Pro"], fallback: "iphone-15-pro" },
  "iphone-16": { provider: "wikimedia", queries: ["iPhone 16", "iPhone 16 Plus"], fallback: "iphone-15" },
  "iphone-16-plus": { provider: "wikimedia", queries: ["iPhone 16 Plus", "iPhone 16"], fallback: "iphone-16" },
  "iphone-16-pro": { provider: "wikimedia", queries: ["iPhone 16 Pro", "iPhone 16 Pro Max"], fallback: "iphone-16" },
  "iphone-16-pro-max": { provider: "wikimedia", queries: ["iPhone 16 Pro Max", "iPhone 16 Pro"], fallback: "iphone-16-pro" },
  "iphone-17": { provider: "wikimedia", queries: ["iPhone 17", "iPhone 16"], fallback: "iphone-16" },
  "iphone-17-air": { provider: "wikimedia", queries: ["iPhone Air", "iPhone 17 Air"], fallback: "iphone-17" },
  "iphone-17-pro": { provider: "wikimedia", queries: ["iPhone 17 Pro", "iPhone 17"], fallback: "iphone-17" },
  "iphone-17-pro-max": { provider: "wikimedia", queries: ["iPhone 17 Pro Max", "iPhone 17 Pro"], fallback: "iphone-17-pro" },

  // ---------------- Samsung Galaxy ----------------
  "galaxy-s20": { provider: "wikimedia", queries: ["Samsung Galaxy S20", "Galaxy S20"] },
  "galaxy-s20-plus": { provider: "wikimedia", queries: ["Samsung Galaxy S20+", "Samsung Galaxy S20 Plus"], fallback: "galaxy-s20" },
  "galaxy-s20-ultra": { provider: "wikimedia", queries: ["Samsung Galaxy S20 Ultra"], fallback: "galaxy-s20-plus" },
  "galaxy-s21": { provider: "wikimedia", queries: ["Samsung Galaxy S21", "Galaxy S21"], fallback: "galaxy-s20" },
  "galaxy-s21-ultra": { provider: "wikimedia", queries: ["Samsung Galaxy S21 Ultra"], fallback: "galaxy-s21" },
  "galaxy-s22": { provider: "wikimedia", queries: ["Samsung Galaxy S22", "Galaxy S22"], fallback: "galaxy-s21" },
  "galaxy-s22-ultra": { provider: "wikimedia", queries: ["Samsung Galaxy S22 Ultra"], fallback: "galaxy-s22" },
  "galaxy-s23": { provider: "wikimedia", queries: ["Samsung Galaxy S23", "Galaxy S23"], fallback: "galaxy-s22" },
  "galaxy-s23-ultra": { provider: "wikimedia", queries: ["Samsung Galaxy S23 Ultra"], fallback: "galaxy-s23" },
  "galaxy-s24": { provider: "wikimedia", queries: ["Samsung Galaxy S24", "Galaxy S24"], fallback: "galaxy-s23" },
  "galaxy-s24-plus": { provider: "wikimedia", queries: ["Samsung Galaxy S24+", "Samsung Galaxy S24 Plus"], fallback: "galaxy-s24" },
  "galaxy-s24-ultra": { provider: "wikimedia", queries: ["Samsung Galaxy S24 Ultra"], fallback: "galaxy-s24-plus" },
  "galaxy-s25": { provider: "wikimedia", queries: ["Samsung Galaxy S25", "Galaxy S25"], fallback: "galaxy-s24" },
  "galaxy-s25-plus": { provider: "wikimedia", queries: ["Samsung Galaxy S25+", "Samsung Galaxy S25 Plus"], fallback: "galaxy-s25" },
  "galaxy-s25-ultra": { provider: "wikimedia", queries: ["Samsung Galaxy S25 Ultra"], fallback: "galaxy-s25-plus" },
  "galaxy-s26": { provider: "wikimedia", queries: ["Samsung Galaxy S26", "Galaxy S26"], fallback: "galaxy-s25" },
  "galaxy-s26-plus": { provider: "wikimedia", queries: ["Samsung Galaxy S26+", "Samsung Galaxy S26 Plus"], fallback: "galaxy-s26" },
  "galaxy-s26-ultra": { provider: "wikimedia", queries: ["Samsung Galaxy S26 Ultra"], fallback: "galaxy-s26-plus" },

  // ---------------- Laptops ----------------
  "macbook-air-13-m4": { provider: "wikimedia", queries: ["MacBook Air M4", "MacBook Air M3", "MacBook Air"] },
  "macbook-air-15-m4": { provider: "wikimedia", queries: ["MacBook Air 15", "MacBook Air M4"], fallback: "macbook-air-13-m4" },
  "macbook-pro-14-m4-pro": { provider: "wikimedia", queries: ["MacBook Pro 14", "MacBook Pro M4"], fallback: "macbook-air-13-m4" },
  "macbook-pro-16-m4-max": { provider: "wikimedia", queries: ["MacBook Pro 16", "MacBook Pro M4 Max"], fallback: "macbook-pro-14-m4-pro" },
  "dell-xps-13": { provider: "wikimedia", queries: ["Dell XPS 13", "Dell XPS"] },
  "dell-xps-15": { provider: "wikimedia", queries: ["Dell XPS 15", "Dell XPS"], fallback: "dell-xps-13" },
  "dell-inspiron-15": { provider: "wikimedia", queries: ["Dell Inspiron 15", "Dell Inspiron"], fallback: "dell-xps-13" },
  "dell-latitude-5450": { provider: "wikimedia", queries: ["Dell Latitude", "Dell laptop"], fallback: "dell-inspiron-15" },
  "hp-spectre-x360-14": { provider: "wikimedia", queries: ["HP Spectre x360", "HP Spectre"] },
  "hp-pavilion-15": { provider: "wikimedia", queries: ["HP Pavilion laptop", "HP Pavilion"], fallback: "hp-spectre-x360-14" },
  "hp-elitebook-840-g11": { provider: "wikimedia", queries: ["HP EliteBook", "HP laptop"], fallback: "hp-pavilion-15" },
  "hp-omen-16": { provider: "wikimedia", queries: ["HP Omen laptop", "HP Omen"], fallback: "hp-spectre-x360-14" },
  "lenovo-thinkpad-x1-carbon": { provider: "wikimedia", queries: ["ThinkPad X1 Carbon", "Lenovo ThinkPad"] },
  "lenovo-ideapad-slim-3": { provider: "wikimedia", queries: ["Lenovo IdeaPad", "Lenovo laptop"], fallback: "lenovo-thinkpad-x1-carbon" },
  "lenovo-legion-5": { provider: "wikimedia", queries: ["Lenovo Legion", "Lenovo gaming laptop"], fallback: "lenovo-thinkpad-x1-carbon" },
  "asus-rog-zephyrus-g14": { provider: "wikimedia", queries: ["Asus ROG Zephyrus", "Asus ROG laptop"] },
  "asus-vivobook-15": { provider: "wikimedia", queries: ["Asus VivoBook", "Asus laptop"], fallback: "asus-rog-zephyrus-g14" },

  // ---------------- Tablets ----------------
  "ipad-11th-gen": { provider: "wikimedia", queries: ["iPad 10th generation", "Apple iPad"] },
  "ipad-air-13-m3": { provider: "wikimedia", queries: ["iPad Air M2", "iPad Air"], fallback: "ipad-11th-gen" },
  "ipad-pro-13-m4": { provider: "wikimedia", queries: ["iPad Pro M4", "iPad Pro"], fallback: "ipad-air-13-m3" },
  "galaxy-tab-s10-fe": { provider: "wikimedia", queries: ["Samsung Galaxy Tab S9", "Samsung Galaxy Tab"] },
  "galaxy-tab-s11-ultra": { provider: "wikimedia", queries: ["Samsung Galaxy Tab S9 Ultra", "Samsung Galaxy Tab"], fallback: "galaxy-tab-s10-fe" },

  // ---------------- Accessories (Unsplash) ----------------
  "20w-usb-c-power-adapter": { provider: "unsplash", queries: ["usb c power adapter", "phone charger"], wikimediaQueries: ["Apple 20W USB-C Power Adapter", "USB-C power adapter", "phone charger"] },
  "magsafe-charger": { provider: "unsplash", queries: ["magsafe wireless charger", "wireless charging"], wikimediaQueries: ["MagSafe charger", "Qi wireless charger", "wireless charging pad"], fallback: "20w-usb-c-power-adapter" },
  "65w-gan-charger": { provider: "unsplash", queries: ["gan charger", "usb c charger"], wikimediaQueries: ["GaN charger", "USB-C power adapter", "power supply charger"], fallback: "20w-usb-c-power-adapter" },
  "20000mah-power-bank": { provider: "unsplash", queries: ["power bank", "portable battery charger"], wikimediaQueries: ["Power bank", "portable charger battery", "USB power bank"] },
  "usb-c-to-usb-c-cable-2m": { provider: "unsplash", queries: ["usb c cable braided", "charging cable"], wikimediaQueries: ["USB-C cable", "USB Type-C cable"] },
  "clear-magsafe-case": { provider: "unsplash", queries: ["clear phone case", "smartphone case"], wikimediaQueries: ["Smartphone case", "phone case transparent"] },

  // ---------------- Audio & wearables (Unsplash) ----------------
  "airpods-4-anc": { provider: "unsplash", queries: ["airpods", "wireless earbuds"], wikimediaQueries: ["AirPods", "AirPods 3rd generation", "wireless earbuds"] },
  "airpods-pro-3": { provider: "unsplash", queries: ["airpods pro", "earbuds case"], wikimediaQueries: ["AirPods Pro", "AirPods Pro 2nd generation"], fallback: "airpods-4-anc" },
  "airpods-max": { provider: "unsplash", queries: ["airpods max", "over ear headphones"], wikimediaQueries: ["AirPods Max", "over-ear headphones"] },
  "galaxy-buds3-pro": { provider: "unsplash", queries: ["galaxy buds", "wireless earbuds case"], wikimediaQueries: ["Samsung Galaxy Buds", "Galaxy Buds Pro", "wireless earbuds"], fallback: "airpods-4-anc" },
  "sony-wh-1000xm6": { provider: "unsplash", queries: ["sony headphones", "noise cancelling headphones"], wikimediaQueries: ["Sony WH-1000XM5", "Sony WH-1000XM4", "noise cancelling headphones"], fallback: "airpods-max" },
  "apple-watch-series-10": { provider: "unsplash", queries: ["apple watch", "smartwatch"], wikimediaQueries: ["Apple Watch Series 9", "Apple Watch Series 10", "Apple Watch"] },
  "apple-watch-ultra-2": { provider: "unsplash", queries: ["apple watch ultra", "rugged smartwatch"], wikimediaQueries: ["Apple Watch Ultra", "Apple Watch Ultra 2"], fallback: "apple-watch-series-10" },
  "galaxy-watch-7": { provider: "unsplash", queries: ["samsung galaxy watch", "smartwatch android"], wikimediaQueries: ["Samsung Galaxy Watch", "Galaxy Watch 6", "smartwatch"], fallback: "apple-watch-series-10" },

  // ---------------- Gaming (Unsplash) ----------------
  "playstation-5-slim": { provider: "unsplash", queries: ["playstation 5", "ps5 console"], wikimediaQueries: ["PlayStation 5", "PlayStation 5 console"] },
  "playstation-5-pro": { provider: "unsplash", queries: ["playstation 5 console", "ps5"], wikimediaQueries: ["PlayStation 5 Pro", "PlayStation 5"], fallback: "playstation-5-slim" },
  "xbox-series-x": { provider: "unsplash", queries: ["xbox series x", "xbox console"], wikimediaQueries: ["Xbox Series X", "Xbox Series X console"] },
  "xbox-series-s": { provider: "unsplash", queries: ["xbox series s", "xbox console white"], wikimediaQueries: ["Xbox Series S", "Xbox Series X"], fallback: "xbox-series-x" },
  "dualsense-wireless-controller": { provider: "unsplash", queries: ["dualsense controller", "playstation controller"], wikimediaQueries: ["DualSense", "PlayStation 5 controller"] },
  "nintendo-switch-2": { provider: "unsplash", queries: ["nintendo switch", "handheld console"], wikimediaQueries: ["Nintendo Switch 2", "Nintendo Switch OLED", "Nintendo Switch"] },
  "pro-gaming-headset-7-1": { provider: "unsplash", queries: ["gaming headset", "gaming headphones rgb"], wikimediaQueries: ["Gaming headset", "headset microphone"] },
  "27-qhd-165hz-gaming-monitor": { provider: "unsplash", queries: ["gaming monitor", "computer monitor desk"], wikimediaQueries: ["Computer monitor", "LCD monitor display"] },

  // ---------------- Solar & power (Unsplash) ----------------
  "quantum-hybrid-inverter-3-5kva": { provider: "unsplash", queries: ["solar inverter", "power inverter wall"], wikimediaQueries: ["Solar inverter", "Power inverter"] },
  "quantum-hybrid-inverter-5kva": { provider: "unsplash", queries: ["solar inverter installation", "solar inverter"], wikimediaQueries: ["Solar inverter", "Photovoltaic inverter"], fallback: "quantum-hybrid-inverter-3-5kva" },
  "quantum-hybrid-inverter-10kva": { provider: "unsplash", queries: ["industrial inverter", "solar power system"], wikimediaQueries: ["Solar inverter industrial", "Power inverter"], fallback: "quantum-hybrid-inverter-5kva" },
  "550w-monocrystalline-panel": { provider: "unsplash", queries: ["solar panel close up", "monocrystalline solar panel"], wikimediaQueries: ["Monocrystalline solar panel", "Solar panel", "Photovoltaic module"] },
  "220ah-lithium-battery-lifepo4": { provider: "unsplash", queries: ["lithium battery storage", "home battery system"], wikimediaQueries: ["LiFePO4 battery", "Lithium iron phosphate battery", "Home battery storage"] },
  "6-6kw-rooftop-solar-array": { provider: "unsplash", queries: ["rooftop solar panels house", "solar array roof"], wikimediaQueries: ["Rooftop solar power plant", "Solar panels on roof"], fallback: "550w-monocrystalline-panel" },
  "home-backup-bundle-5kva": { provider: "unsplash", queries: ["home solar power system", "solar battery inverter"], wikimediaQueries: ["Home solar power system", "Solar inverter battery"], fallback: "quantum-hybrid-inverter-5kva" },
};

/** Category hero images for the /shop hub tiles. */
export const CATEGORY_SOURCES = {
  phones: {
    provider: "unsplash",
    queries: ["smartphones collection", "smartphone flat lay"],
    wikimediaQueries: ["Smartphones", "Mobile phone collection"],
  },
  laptops: {
    provider: "unsplash",
    queries: ["laptop workspace", "macbook desk"],
    wikimediaQueries: ["Laptop computer", "Notebook computer"],
  },
  tablets: {
    provider: "unsplash",
    queries: ["tablet and accessories", "ipad desk"],
    wikimediaQueries: ["Tablet computer", "Apple iPad"],
  },
  audio: {
    provider: "unsplash",
    queries: ["headphones and earbuds", "audio gear flat lay"],
    wikimediaQueries: ["Headphones", "Earphones"],
  },
  gaming: {
    provider: "unsplash",
    queries: ["gaming setup console", "video game controller neon"],
    wikimediaQueries: ["Video game console", "Game controller"],
  },
  solar: {
    provider: "unsplash",
    queries: ["solar panels sunset", "solar energy home"],
    wikimediaQueries: ["Solar panels", "Photovoltaic power station"],
  },
};
