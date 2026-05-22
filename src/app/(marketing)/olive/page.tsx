"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GradedSlab } from "@/components/cards/graded-slab";
import { CardTile } from "@/components/cards/card-tile";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

const QUESTIONS = [
  {
    id: "weekend",
    question: "Pick a perfect Saturday.",
    options: [
      { label: "Reading by a sunny window", emoji: "📚", types: { psychic: 3, fairy: 1, normal: 1 } },
      { label: "Splashing in puddles", emoji: "💦", types: { water: 3, ice: 1 } },
      { label: "Building a backyard fort", emoji: "🛠️", types: { rock: 2, fighting: 2, normal: 1 } },
      { label: "Stargazing past bedtime", emoji: "🌙", types: { psychic: 2, dark: 2, ghost: 1 } },
    ],
  },
  {
    id: "mood",
    question: "Which word feels most like you?",
    options: [
      { label: "Cozy", emoji: "🍵", types: { fairy: 2, normal: 2, grass: 1 } },
      { label: "Sparky", emoji: "⚡", types: { electric: 3, fire: 1 } },
      { label: "Curious", emoji: "🔍", types: { psychic: 2, bug: 2, ghost: 1 } },
      { label: "Brave", emoji: "🦁", types: { fire: 2, fighting: 2, dragon: 2 } },
    ],
  },
  {
    id: "snack",
    question: "Snack of choice?",
    options: [
      { label: "Honey on toast", emoji: "🍯", types: { bug: 2, fairy: 1, normal: 1 } },
      { label: "Spicy noodles", emoji: "🌶️", types: { fire: 3, fighting: 1 } },
      { label: "Berry smoothie", emoji: "🫐", types: { grass: 3, water: 1, fairy: 1 } },
      { label: "Mystery flavor", emoji: "🍭", types: { psychic: 2, ghost: 2, dark: 1 } },
    ],
  },
  {
    id: "place",
    question: "Where would your Pokémon love to nap?",
    options: [
      { label: "A sunbeam on the rug", emoji: "☀️", types: { fire: 2, normal: 2, electric: 1 } },
      { label: "In a creek", emoji: "🏞️", types: { water: 3, grass: 1 } },
      { label: "Atop the tallest tree", emoji: "🌳", types: { grass: 2, bug: 2, dragon: 1 } },
      { label: "Inside a teacup", emoji: "🫖", types: { fairy: 3, psychic: 1 } },
    ],
  },
  {
    id: "friend",
    question: "A friend is sad. You…",
    options: [
      { label: "Bring them a flower", emoji: "🌸", types: { fairy: 3, grass: 2 } },
      { label: "Tell a silly joke", emoji: "😜", types: { electric: 2, normal: 2, fire: 1 } },
      { label: "Just sit with them", emoji: "🤗", types: { psychic: 2, ghost: 1, normal: 1 } },
      { label: "Plan an adventure", emoji: "🗺️", types: { dragon: 2, fighting: 2, fire: 1 } },
    ],
  },
  {
    id: "fav_color",
    question: "Pick a color you love.",
    options: [
      { label: "Sunny yellow", emoji: "🌻", types: { electric: 3, normal: 1 } },
      { label: "Sea blue", emoji: "🌊", types: { water: 3, ice: 1 } },
      { label: "Forest green", emoji: "🌲", types: { grass: 3, bug: 1 } },
      { label: "Twilight purple", emoji: "🔮", types: { psychic: 2, ghost: 2, dark: 1 } },
    ],
  },
];

const INTROS = [
  "Hello there! I'm Professor Olive — pleased to meet you.",
  "I help trainers like you find the Pokémon card that fits just right.",
  "I'll ask you six little questions. There are no wrong answers — just be you!",
];

interface Card {
  id: string;
  pokeId: number;
  name: string;
  middle: string;
  last: string;
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
}

export default function OlivePage() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "thinking" | "result">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const { addItem } = useCart();

  const start = () => {
    setPhase("quiz");
    setStep(0);
    setAnswers([]);
    // Fetch cards for matching
    fetch("/api/cards")
      .then((r) => r.json())
      .then((d) => setCards(d.cards || []));
  };

  const answer = (opt: any) => {
    const next = [...answers, opt];
    setAnswers(next);
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setPhase("thinking");
      setTimeout(() => setPhase("result"), 2200);
    }
  };

  const back = () => {
    if (step === 0) {
      setPhase("intro");
      return;
    }
    setStep(step - 1);
    setAnswers(answers.slice(0, -1));
  };

  const match = useMemo(() => {
    if (phase !== "result" && phase !== "thinking") return null;
    if (cards.length === 0) return null;

    const typeScores: Record<string, number> = {};
    answers.forEach((a) => {
      Object.entries(a.types || {}).forEach(([t, n]) => {
        typeScores[t] = (typeScores[t] || 0) + (n as number);
      });
    });

    const scored = cards
      .map((c) => {
        let s = 0;
        c.types.forEach((t) => {
          s += typeScores[t] || 0;
        });
        const rarityWeight: Record<string, number> = {
          common: 0.4,
          uncommon: 0.3,
          rare: 0.2,
          legendary: 0.1,
        };
        s += rarityWeight[c.rarity] || 0;
        s += (parseInt(c.id.split("-")[1] || "0") % 7) * 0.01;
        return { card: c, score: s };
      })
      .sort((a, b) => b.score - a.score);

    return {
      primary: scored[0]?.card,
      alts: scored.slice(1, 4).map((x) => x.card),
      topType: Object.entries(typeScores).sort((a, b) => b[1] - a[1])[0]?.[0],
    };
  }, [phase, answers, cards]);

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-b from-[#f0e8ff] to-[#fff5e8]"
    >
      <div className="mx-auto max-w-[760px] px-6 py-12 pb-20"
      >
        {phase === "intro" && (
          <div className="rounded-3xl border-2 border-pd-ink bg-white p-10 text-center shadow-[0_6px_0_#29261b]"
          >
            <div className="mb-4 flex justify-center"
            >
              <ProfessorAvatar size={140} />
            </div>
            <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-pd-violet"
            >
              <Sparkles size={12} strokeWidth={2} /> Pokédopt Matchmaker
            </div>
            <h1 className="font-fraunces text-[clamp(32px,4.4vw,48px)] font-bold leading-[1.1]"
            >
              Hi, I'm Professor Olive!
            </h1>
            <p className="mx-auto mt-4 max-w-[520px] text-base leading-relaxed text-pd-ink-soft"
            >
              {INTROS.join(" ")}
            </p>
            <div className="mt-7"
            >
              <Button size="lg" onClick={start}
              >
                Let's begin <ArrowRight size={16} strokeWidth={2.4} />
              </Button>
            </div>
            <div className="mt-4 text-sm text-pd-ink-muted"
            >
              Takes about a minute · 6 questions
            </div>
          </div>
        )}

        {phase === "quiz" && (
          <div>
            {/* Progress */}
            <div className="mb-6 flex items-center gap-3"
            >
              <button
                onClick={back}
                className="text-sm text-pd-ink-muted transition-colors hover:text-pd-ink"
              >
                <ArrowLeft size={13} strokeWidth={2} /> Back
              </button>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-pd-ink/10"
              >
                <div
                  className="h-full bg-pd-primary transition-all duration-300"
                  style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
              <div className="text-sm font-semibold text-pd-ink-muted"
              >
                {step + 1} / {QUESTIONS.length}
              </div>
            </div>

            {/* Olive prompt */}
            <div className="mb-5 flex items-end gap-4"
            >
              <ProfessorAvatar size={72} expression={step % 2 === 0 ? "smile" : "think"} />
              <div className="relative rounded-2xl border-2 border-pd-ink bg-white p-4 pb-3 shadow-[0_3px_0_#29261b]"
                style={{ borderBottomLeftRadius: 4 }}
              >
                <div className="font-fraunces text-[22px] font-bold leading-tight text-pd-ink"
                >
                  {QUESTIONS[step].question}
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="grid gap-3 sm:grid-cols-2"
            >
              {QUESTIONS[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => answer(opt)}
                  className="flex items-center gap-3.5 rounded-2xl border-2 border-pd-ink bg-white p-5 text-left shadow-[0_4px_0_#29261b] transition-all active:translate-y-0.5 active:shadow-[0_2px_0_#29261b]"
                >
                  <div className="text-[32px] leading-none">{opt.emoji}</div>
                  <div className="font-fraunces text-lg font-bold text-pd-ink"
                  >
                    {opt.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "thinking" && (
          <div className="py-15 text-center"
          >
            <div className="inline-block animate-olive-bounce"
            >
              <ProfessorAvatar size={140} expression="think" />
            </div>
            <div className="mt-5 font-fraunces text-[26px] italic text-pd-violet"
            >
              Hmmm… let me think…
            </div>
            <div className="mt-3 text-sm text-pd-ink-muted"
            >
              <span className="animate-pulse">·</span>
              <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>·</span>
              <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>·</span>
            </div>
          </div>
        )}

        {phase === "result" && match && match.primary && (
          <div>
            <div className="mb-6 flex items-end gap-4"
            >
              <ProfessorAvatar size={80} expression="wow" />
              <div className="rounded-2xl border-2 border-pd-ink bg-white p-4 pb-3 shadow-[0_3px_0_#29261b]"
                style={{ borderBottomLeftRadius: 4 }}
              >
                <div className="font-fraunces text-[22px] font-bold leading-tight"
                >
                  Oh! I know just the one for you. Meet…
                </div>
              </div>
            </div>

            <div className="grid items-center gap-8 rounded-3xl border-2 border-pd-ink bg-pd-cream p-8 shadow-[0_6px_0_#29261b] lg:grid-cols-[auto_1fr]"
            >
              <div className="flex justify-center"
              >
                <GradedSlab card={match.primary} size="md" />
              </div>
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-pd-violet"
                >
                  <Sparkles size={12} strokeWidth={2} /> Your match
                </div>
                <h2 className="font-springwood text-[40px] font-bold leading-[1.05] tracking-wide"
                >
                  {match.primary.name}
                </h2>
                <div className="mt-1 font-fraunces text-xl italic text-pd-violet"
                >
                  “{match.primary.middle} {match.primary.last}”
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-pd-ink-soft"
                >
                  {match.primary.backstory}
                </p>
                <div className="mt-4 flex flex-wrap gap-2"
                >
                  <Button
                    onClick={() => addItem(match.primary as any)}
                  >
                    <img src="/images/pokedopt-logo.png" alt="" width={16} height={16} /> Adopt for ${match.primary.price.toFixed(2)}
                  </Button>
                  <Link href={`/card/${match.primary.id}`}
                  >
                    <Button variant="secondary"
                    >Read full backstory</Button>
                  </Link>
                </div>
              </div>
            </div>

            {match.alts.length > 0 && (
              <div className="mt-12"
              >
                <div className="mb-3.5 text-xs font-bold uppercase tracking-widest text-pd-ink-muted"
                >
                  Or maybe one of these…
                </div>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3"
                >
                  {match.alts.map((c) => (
                    <CardTile key={c.id} card={c} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 text-center"
            >
              <Button variant="ghost" onClick={start}
              >
                Try again <ArrowRight size={14} strokeWidth={2.4} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfessorAvatar({ size = 80, expression = "smile" }: { size?: number; expression?: "smile" | "think" | "wow" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="flex-shrink-0"
    >
      <ellipse cx="60" cy="108" rx="32" ry="5" fill="#29261b" opacity="0.15" />
      <circle cx="60" cy="64" r="42" fill="#8a9a4e" stroke="#29261b" strokeWidth="2.5" />
      <ellipse cx="60" cy="74" rx="26" ry="22" fill="#c8d49a" />
      <path d="M60 24 Q52 12, 44 16 Q44 26, 56 28 Q60 26, 60 24 Z" fill="#5a8a3a" stroke="#29261b" strokeWidth="2" />
      <path d="M60 24 Q60 18, 56 14" stroke="#29261b" strokeWidth="1.5" fill="none" />
      <circle cx="38" cy="64" r="5" fill="#e58fa0" opacity="0.7" />
      <circle cx="82" cy="64" r="5" fill="#e58fa0" opacity="0.7" />
      <circle cx="48" cy="56" r="4" fill="#29261b" />
      <circle cx="72" cy="56" r="4" fill="#29261b" />
      <circle cx="49" cy="55" r="1.2" fill="#fff" />
      <circle cx="73" cy="55" r="1.2" fill="#fff" />
      <circle cx="48" cy="56" r="8" fill="none" stroke="#29261b" strokeWidth="1.5" />
      <circle cx="72" cy="56" r="8" fill="none" stroke="#29261b" strokeWidth="1.5" />
      <line x1="56" y1="56" x2="64" y2="56" stroke="#29261b" strokeWidth="1.5" />
      {expression === "smile" && (
        <path d="M52 72 Q60 78, 68 72" stroke="#29261b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}
      {expression === "think" && <circle cx="60" cy="74" r="2" fill="#29261b" />}
      {expression === "wow" && <ellipse cx="60" cy="74" rx="3" ry="4" fill="#29261b" />}
    </svg>
  );
}
