export interface CartItem {
  card: {
    id: string;
    pokeId: number;
    name: string;
    middle: string;
    last: string;
    fullName: string;
    types: string[];
    rarity: string;
    hp: number;
    grade: string;
    price: number;
    donation: number;
    backstory: string;
    wear: string;
    birthday: string;
    birthMonth: string;
    birthYear: string;
    sprite: string;
    spritePixel: string;
  };
  qty: number;
}
