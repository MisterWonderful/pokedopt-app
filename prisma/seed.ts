import { PrismaClient, Rarity, OrderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TYPES = [
  "fire", "water", "grass", "electric", "psychic", "fairy",
  "fighting", "bug", "ghost", "rock", "ice", "dark", "dragon", "normal",
];

const MIDDLES = [
  "Buttercup", "Marigold", "Pip", "Juniper", "Honey", "Clover", "Sunny", "Hazel",
  "Margaret", "James", "Eloise", "Theodore", "Wren", "Otis", "Maeve", "Arthur",
  "Stardust", "Ember", "Mooncrest", "Thornquill", "Whisper", "Glimmer", "Nebula", "Pebble",
  "Biscuit", "Tully", "Posy", "Rumi", "Fennel", "Sage", "Bramble", "Atlas",
];

const LASTS = [
  "Hollowby", "Thistlewick", "Pemberton", "Ashfield", "Brambleton", "Quillforth", "Mossworth", "Ferncliffe",
  "Sue", "Patrick", "Whitlow", "Greaves", "Marsden", "Harlow", "Tilbury", "Fairwell",
  "Mooncrest", "Starwick", "Thornquill", "Emberhart", "Glimmerstone", "Nightingale", "Willowmere", "Goldfinch",
  "Pickleby", "Periwinkle", "Honeydew", "Snickerdoodle", "Tumblebrook", "Cobblepot", "Maplewax", "Rumblesworth",
];

const BACKSTORY_OPENERS = [
  "Once trained by a young scholar at",
  "First adopted in the misty foothills near",
  "A loyal companion to a baker who lived above",
  "Hand-fed berries every morning at",
  "Discovered curled up in a hatbox at",
  "Trained alongside three siblings on the rooftops of",
  "A frequent visitor to the lantern festival at",
  "Once carried letters between two old friends in",
];

const BACKSTORY_PLACES = [
  "Cerulean Cape", "Goldenrod Square", "Pewter Hollow", "Mossy Brook", "Lavender Lane", "Saffron Gardens",
  "Hearthome Bakery", "Ecruteak Tea House", "Snowpoint Library", "Vermillion Pier", "Floaroma Meadow",
];

const BACKSTORY_QUIRKS = [
  "It still hums softly when it hears wooden wind chimes.",
  "It prefers to nap on books left open to a favorite page.",
  "It refuses berries that aren't served in a blue bowl.",
  "It once won a village pie-eating contest (twice).",
  "It chirps along when its trainer whistles old folk songs.",
  "It has a small chip on its slab — a memento from a clumsy hug.",
  "It collects bottle caps and arranges them by color.",
  "It will only sleep if a story is read aloud first.",
];

const WEAR = [
  "Soft corner-rounding from years of being carried in a coat pocket.",
  "A faint thumbprint near the holo — someone's favorite card.",
  "Gentle edge-wear; the slab tells the story.",
  "A tiny scuff on the back from countless late-night trades.",
  "Lovingly creased; lived a full life before being slabbed.",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const POKEMON_POOL = [
  { id: 25, name: "Pikachu", types: ["electric"], rarity: Rarity.common, hp: 60 },
  { id: 4, name: "Charmander", types: ["fire"], rarity: Rarity.common, hp: 50 },
  { id: 7, name: "Squirtle", types: ["water"], rarity: Rarity.common, hp: 50 },
  { id: 1, name: "Bulbasaur", types: ["grass"], rarity: Rarity.common, hp: 50 },
  { id: 133, name: "Eevee", types: ["normal"], rarity: Rarity.uncommon, hp: 60 },
  { id: 39, name: "Jigglypuff", types: ["fairy"], rarity: Rarity.common, hp: 70 },
  { id: 54, name: "Psyduck", types: ["water"], rarity: Rarity.common, hp: 50 },
  { id: 143, name: "Snorlax", types: ["normal"], rarity: Rarity.rare, hp: 130 },
  { id: 150, name: "Mewtwo", types: ["psychic"], rarity: Rarity.legendary, hp: 120 },
  { id: 6, name: "Charizard", types: ["fire"], rarity: Rarity.rare, hp: 120 },
  { id: 9, name: "Blastoise", types: ["water"], rarity: Rarity.rare, hp: 110 },
  { id: 3, name: "Venusaur", types: ["grass"], rarity: Rarity.rare, hp: 110 },
  { id: 94, name: "Gengar", types: ["ghost"], rarity: Rarity.rare, hp: 90 },
  { id: 130, name: "Gyarados", types: ["water"], rarity: Rarity.rare, hp: 130 },
  { id: 149, name: "Dragonite", types: ["dragon"], rarity: Rarity.rare, hp: 120 },
  { id: 131, name: "Lapras", types: ["water"], rarity: Rarity.uncommon, hp: 100 },
  { id: 26, name: "Raichu", types: ["electric"], rarity: Rarity.uncommon, hp: 80 },
  { id: 35, name: "Clefairy", types: ["fairy"], rarity: Rarity.common, hp: 60 },
  { id: 113, name: "Chansey", types: ["normal"], rarity: Rarity.uncommon, hp: 110 },
  { id: 144, name: "Articuno", types: ["ice"], rarity: Rarity.legendary, hp: 100 },
  { id: 145, name: "Zapdos", types: ["electric"], rarity: Rarity.legendary, hp: 100 },
  { id: 146, name: "Moltres", types: ["fire"], rarity: Rarity.legendary, hp: 100 },
  { id: 196, name: "Espeon", types: ["psychic"], rarity: Rarity.rare, hp: 90 },
  { id: 197, name: "Umbreon", types: ["dark"], rarity: Rarity.rare, hp: 90 },
  { id: 134, name: "Vaporeon", types: ["water"], rarity: Rarity.uncommon, hp: 90 },
  { id: 135, name: "Jolteon", types: ["electric"], rarity: Rarity.uncommon, hp: 80 },
  { id: 136, name: "Flareon", types: ["fire"], rarity: Rarity.uncommon, hp: 80 },
  { id: 16, name: "Pidgey", types: ["normal"], rarity: Rarity.common, hp: 40 },
  { id: 19, name: "Rattata", types: ["normal"], rarity: Rarity.common, hp: 40 },
  { id: 50, name: "Diglett", types: ["normal"], rarity: Rarity.common, hp: 30 },
  { id: 63, name: "Abra", types: ["psychic"], rarity: Rarity.common, hp: 40 },
  { id: 92, name: "Gastly", types: ["ghost"], rarity: Rarity.common, hp: 50 },
  { id: 129, name: "Magikarp", types: ["water"], rarity: Rarity.common, hp: 30 },
  { id: 147, name: "Dratini", types: ["dragon"], rarity: Rarity.uncommon, hp: 60 },
  { id: 116, name: "Horsea", types: ["water"], rarity: Rarity.common, hp: 40 },
  { id: 102, name: "Exeggcute", types: ["grass"], rarity: Rarity.common, hp: 50 },
];

const SHELTER_PARTNERS = [
  { name: "Honeybrook Animal Sanctuary", location: "Vermont", raised: 4280, helped: 38 },
  { name: "Mossy Pines Shelter", location: "Oregon", raised: 3140, helped: 27 },
  { name: "Lakeside Paws Rescue", location: "Michigan", raised: 2890, helped: 24 },
  { name: "Silver Whiskers Refuge", location: "Maine", raised: 2420, helped: 19 },
  { name: "Cottonwood Cat Cafe", location: "New Mexico", raised: 2150, helped: 31 },
  { name: "Driftwood Dog Haven", location: "Washington", raised: 1980, helped: 16 },
  { name: "Brambleton Bird Rescue", location: "Wales, UK", raised: 1620, helped: 22 },
  { name: "Tidewater Pet Foundation", location: "Florida", raised: 1480, helped: 14 },
  { name: "Golden Valley Animal Rescue", location: "Colorado", raised: 1250, helped: 18 },
  { name: "Coastal Wildlife Rehab", location: "California", raised: 980, helped: 12 },
  { name: "Mountain View Farm Sanctuary", location: "Tennessee", raised: 870, helped: 15 },
  { name: "Riverbend Horse Rescue", location: "Kentucky", raised: 760, helped: 9 },
  { name: "Sunset Senior Pet Home", location: "Arizona", raised: 650, helped: 21 },
  { name: "Northern Lights Wildlife", location: "Alaska", raised: 530, helped: 7 },
];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function buildCard(p: (typeof POKEMON_POOL)[0], idx: number) {
  const seed = p.id * 1000 + idx;
  const rand = mulberry32(seed);
  const middle = pick(rand, MIDDLES);
  const last = pick(rand, LASTS);
  const grade = 8 + Math.floor(rand() * 3) + "." + Math.floor(rand() * 10);
  const opener = pick(rand, BACKSTORY_OPENERS);
  const place = pick(rand, BACKSTORY_PLACES);
  const quirk = pick(rand, BACKSTORY_QUIRKS);
  const wear = pick(rand, WEAR);
  const birthMonth = pick(rand, MONTHS);
  const birthYear = pick(rand, ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"]);
  const trainer = pick(rand, ["Old trainer Rosa", "A kid named Theo", "The Marigold twins", "A traveling baker", "A retired Officer Jenny", "Scholar Wendell", "The Hollowby family"]);

  return {
    pokeId: p.id,
    name: p.name,
    middle,
    last,
    fullName: `${p.name} ${middle} ${last}`,
    types: p.types,
    rarity: p.rarity,
    hp: p.hp,
    grade,
    price: 10.0,
    donation: 1.5,
    backstory: `${opener} ${place}, this ${p.name} was ${trainer}'s closest friend. ${quirk}`,
    wear,
    birthday: `${birthMonth} ${birthYear}`,
    birthMonth,
    birthYear,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
    spritePixel: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`,
  };
}

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.card.deleteMany();
  await prisma.shelter.deleteMany();
  await prisma.user.deleteMany();

  // Seed cards
  const cardData = POKEMON_POOL.map((p, i) => buildCard(p, i));
  for (const c of cardData) {
    await prisma.card.create({ data: c });
  }
  console.log(`Seeded ${cardData.length} cards`);

  // Seed shelters
  for (const s of SHELTER_PARTNERS) {
    await prisma.shelter.create({ data: s });
  }
  console.log(`Seeded ${SHELTER_PARTNERS.length} shelters`);

  // Seed demo users
  const hashedPassword = await bcrypt.hash("password", 10);
  const hashedAdmin = await bcrypt.hash("admin", 10);

  const users = await prisma.user.createMany({
    data: [
      { email: "admin@pokedopt.com", password: hashedAdmin, name: "Maple Hollowby", role: "admin" },
      { email: "theo@example.com", password: hashedPassword, name: "Theo Hollowby" },
      { email: "rosa@example.com", password: hashedPassword, name: "Rosa Marigold" },
      { email: "otis@example.com", password: hashedPassword, name: "Otis Pemberton" },
      { email: "wren@example.com", password: hashedPassword, name: "Wren Thistlewick" },
      { email: "sage@example.com", password: hashedPassword, name: "Sage Brambleton" },
      { email: "pip@example.com", password: hashedPassword, name: "Pip Goldfinch" },
      { email: "ember@example.com", password: hashedPassword, name: "Ember Ashfield" },
      { email: "juniper@example.com", password: hashedPassword, name: "Juniper Ferncliffe" },
    ],
  });
  console.log(`Seeded ${users.count} users`);

  // Seed demo orders
  const allCards = await prisma.card.findMany();
  const allUsers = await prisma.user.findMany({ where: { role: "customer" } });
  const cities = [
    { city: "Cerulean", zip: "90210" },
    { city: "Goldenrod", zip: "12345" },
    { city: "Pewter", zip: "54321" },
    { city: "Lavender", zip: "67890" },
    { city: "Saffron", zip: "11223" },
    { city: "Vermillion", zip: "33445" },
  ];
  const streets = [
    "12 Bramblewick Lane",
    "7 Honeydew Court",
    "44 Mossy Pine Way",
    "101 Cobblestone Row",
    "23 Periwinkle Mews",
    "9 Lantern Hill",
  ];

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  let s = 1234567;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  for (let i = 0; i < 22; i++) {
    const daysAgo = Math.floor(rand() * 14);
    const hours = Math.floor(rand() * 24);
    const placedAt = new Date(now - daysAgo * day - hours * 60 * 60 * 1000);
    const user = pick(rand, allUsers);
    const city = pick(rand, cities);
    const itemCount = 1 + Math.floor(rand() * 3);
    const used = new Set<number>();
    const items: { cardId: string; qty: number; priceAt: number; nameAt: string; middleAt: string; lastAt: string }[] = [];

    for (let j = 0; j < itemCount; j++) {
      let card;
      do {
        card = pick(rand, allCards);
      } while (used.has(card.pokeId));
      used.add(card.pokeId);
      const qty = 1 + Math.floor(rand() * 2);
      items.push({
        cardId: card.id,
        qty,
        priceAt: Number(card.price),
        nameAt: card.name,
        middleAt: card.middle,
        lastAt: card.last,
      });
    }

    const subtotal = items.reduce((sum, it) => sum + it.priceAt * it.qty, 0);
    const donation = items.reduce((sum) => sum + 1.5, 0);
    const shippingFee = 4.99;
    const total = subtotal + shippingFee;

    let status: OrderStatus = OrderStatus.placed;
    if (daysAgo >= 9) status = OrderStatus.delivered;
    else if (daysAgo >= 5) status = rand() > 0.3 ? OrderStatus.delivered : OrderStatus.shipped;
    else if (daysAgo >= 2) status = rand() > 0.5 ? OrderStatus.shipped : OrderStatus.placed;
    if (rand() < 0.05) status = OrderStatus.cancelled;

    const orderNum = "PD-" + (100000 + Math.floor(rand() * 900000));

    await prisma.order.create({
      data: {
        orderNum,
        userId: user.id,
        placedAt,
        status,
        subtotal,
        donation,
        shippingFee,
        total,
        shelterPref: "auto",
        customerName: user.name,
        customerEmail: user.email,
        shippingName: user.name,
        shippingAddress: pick(rand, streets),
        shippingCity: city.city,
        shippingZip: city.zip,
        shippingCountry: "United States",
        orderItems: {
          create: items,
        },
      },
    });
  }
  console.log("Seeded 22 demo orders");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
