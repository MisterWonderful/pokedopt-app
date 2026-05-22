"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TypeChip } from "@/components/cards/type-chip";
import { RarityBadge } from "@/components/cards/rarity-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Pencil, Trash2, EyeOff, Eye } from "lucide-react";
import { POKEMON_TYPES } from "@/lib/constants";

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
  price: number | string;
  donation: number | string;
  backstory: string;
  wear: string;
  birthday: string;
  birthMonth: string;
  birthYear: string;
  sprite: string;
  spritePixel: string;
  isActive: boolean;
}

type CardForm = Omit<Card, "id" | "price" | "donation"> & {
  price: string;
  donation: string;
};

const EMPTY_FORM: CardForm = {
  pokeId: 0,
  name: "",
  middle: "",
  last: "",
  types: [],
  rarity: "common",
  hp: 60,
  grade: "9.0",
  price: "10.00",
  donation: "1.50",
  backstory: "",
  wear: "",
  birthday: "",
  birthMonth: "",
  birthYear: "",
  sprite: "",
  spritePixel: "",
  isActive: true,
};

export default function AdminCardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<{ mode: "new" | "edit"; id?: string; form: CardForm } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/cards?scope=all")
      .then((r) => r.json())
      .then((d) => {
        setCards(d.cards || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = cards.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(s) ||
      c.middle.toLowerCase().includes(s) ||
      c.last.toLowerCase().includes(s)
    );
  });

  const openNew = () =>
    setEditing({ mode: "new", form: { ...EMPTY_FORM } });

  const openEdit = (c: Card) =>
    setEditing({
      mode: "edit",
      id: c.id,
      form: {
        pokeId: c.pokeId,
        name: c.name,
        middle: c.middle,
        last: c.last,
        types: c.types,
        rarity: c.rarity,
        hp: c.hp,
        grade: c.grade,
        price: String(c.price),
        donation: String(c.donation),
        backstory: c.backstory,
        wear: c.wear,
        birthday: c.birthday,
        birthMonth: c.birthMonth,
        birthYear: c.birthYear,
        sprite: c.sprite,
        spritePixel: c.spritePixel,
        isActive: c.isActive,
      },
    });

  const submit = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    const payload = {
      ...editing.form,
      price: Number(editing.form.price),
      donation: Number(editing.form.donation),
    };
    const url =
      editing.mode === "new" ? "/api/cards" : `/api/cards/${editing.id}`;
    const method = editing.mode === "new" ? "POST" : "PATCH";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error || "Save failed");
      return;
    }
    setEditing(null);
    load();
  };

  const remove = async (c: Card) => {
    const ok = confirm(
      `Delete "${c.name} ${c.middle} ${c.last}"? If this card appears in any order it will be archived (hidden) instead.`,
    );
    if (!ok) return;
    const res = await fetch(`/api/cards/${c.id}`, { method: "DELETE" });
    if (res.ok) load();
  };

  const toggleActive = async (c: Card) => {
    await fetch(`/api/cards/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    load();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-pd-ink/10" />
        <div className="h-64 animate-pulse rounded-2xl bg-pd-ink/5" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} /> Back
          </Button>
        </Link>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-pd-violet">
            Cards
          </div>
          <h1 className="font-fraunces text-2xl font-bold">Card catalog</h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-[1_1_240px]">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards…"
          />
        </div>
        <div className="ml-auto">
          <Button onClick={openNew}>
            <CreditCard size={16} /> + New card
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-pd-ink/10 bg-white">
        <div className="grid grid-cols-[60px_2fr_1.5fr_auto_auto_auto_auto] gap-3.5 border-b border-pd-ink/10 bg-[#f7f3e8] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-pd-ink-muted">
          <div></div>
          <div>Name</div>
          <div>Types</div>
          <div>Rarity</div>
          <div>HP</div>
          <div>Price</div>
          <div></div>
        </div>
        {filtered.map((c) => (
          <div
            key={c.id}
            className={
              "grid grid-cols-[60px_2fr_1.5fr_auto_auto_auto_auto] items-center gap-3.5 border-b border-pd-ink/5 px-4 py-2.5 " +
              (c.isActive ? "" : "opacity-60")
            }
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-pd-ink/10 bg-pd-cream">
              {c.sprite ? (
                <img
                  src={c.sprite}
                  alt=""
                  className="h-[85%] w-[85%] object-contain"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-pd-ink">
                {c.name}
                {!c.isActive && (
                  <span className="ml-2 rounded bg-pd-ink/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pd-ink-muted">
                    archived
                  </span>
                )}
              </div>
              <div className="font-fraunces text-[13px] italic text-pd-violet">
                “{c.middle} {c.last}”
              </div>
              <div className="text-[11px] tabular-nums text-pd-ink-muted">
                {c.id}
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {c.types.map((t) => (
                <TypeChip key={t} type={t} size="sm" />
              ))}
            </div>
            <RarityBadge rarity={c.rarity} />
            <div className="text-[13px] font-bold tabular-nums">{c.hp}</div>
            <div className="text-sm font-bold tabular-nums">
              ${Number(c.price).toFixed(2)}
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleActive(c)}
                title={c.isActive ? "Archive" : "Restore"}
              >
                {c.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                <Pencil size={14} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => remove(c)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-10 text-center text-pd-ink-muted">
            No cards match.
          </div>
        )}
      </div>

      {editing && (
        <CardEditor
          mode={editing.mode}
          form={editing.form}
          setForm={(f) => setEditing({ ...editing, form: f })}
          onClose={() => setEditing(null)}
          onSave={submit}
          saving={saving}
          error={error}
        />
      )}
    </div>
  );
}

function CardEditor({
  mode,
  form,
  setForm,
  onClose,
  onSave,
  saving,
  error,
}: {
  mode: "new" | "edit";
  form: CardForm;
  setForm: (f: CardForm) => void;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  error: string | null;
}) {
  const toggleType = (t: string) => {
    setForm({
      ...form,
      types: form.types.includes(t)
        ? form.types.filter((x) => x !== t)
        : [...form.types, t],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pd-ink/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border-2 border-pd-ink bg-white shadow-[0_8px_0_#29261b]">
        <div className="sticky top-0 flex items-center justify-between border-b border-pd-ink/10 bg-white px-6 py-4">
          <h2 className="font-fraunces text-xl font-bold">
            {mode === "new" ? "New card" : "Edit card"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Pokémon name" >
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Pikachu"
              />
            </Field>
            <Field label="Pokédex #">
              <Input
                type="number"
                value={form.pokeId || ""}
                onChange={(e) =>
                  setForm({ ...form, pokeId: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Middle name">
              <Input
                value={form.middle}
                onChange={(e) => setForm({ ...form, middle: e.target.value })}
                placeholder="Buttercup"
              />
            </Field>
            <Field label="Last name">
              <Input
                value={form.last}
                onChange={(e) => setForm({ ...form, last: e.target.value })}
                placeholder="Hollowby"
              />
            </Field>
          </div>

          <Field label="Types">
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(POKEMON_TYPES).map((t) => {
                const active = form.types.includes(t);
                const s = POKEMON_TYPES[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleType(t)}
                    className={
                      "rounded-full border px-2.5 py-1 text-xs font-bold capitalize transition-all " +
                      (active
                        ? "border-pd-ink shadow-[0_2px_0_#29261b]"
                        : "border-pd-ink/20 opacity-60")
                    }
                    style={
                      active
                        ? { background: s.bg, color: s.color }
                        : { background: "white" }
                    }
                  >
                    {s.glyph} {t}
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="grid grid-cols-4 gap-3">
            <Field label="Rarity">
              <select
                value={form.rarity}
                onChange={(e) => setForm({ ...form, rarity: e.target.value })}
                className="h-11 w-full rounded-xl border border-pd-ink/20 bg-white px-3 text-sm"
              >
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="legendary">Legendary</option>
              </select>
            </Field>
            <Field label="HP">
              <Input
                type="number"
                value={form.hp || ""}
                onChange={(e) => setForm({ ...form, hp: Number(e.target.value) })}
              />
            </Field>
            <Field label="Grade">
              <Input
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                placeholder="9.0"
              />
            </Field>
            <Field label="Birthday">
              <Input
                value={form.birthday}
                onChange={(e) =>
                  setForm({ ...form, birthday: e.target.value })
                }
                placeholder="Jan 2018"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Price ($)">
              <Input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </Field>
            <Field label="Donation ($)">
              <Input
                type="number"
                step="0.01"
                value={form.donation}
                onChange={(e) =>
                  setForm({ ...form, donation: e.target.value })
                }
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Birth month">
              <Input
                value={form.birthMonth}
                onChange={(e) =>
                  setForm({ ...form, birthMonth: e.target.value })
                }
                placeholder="Jan"
              />
            </Field>
            <Field label="Birth year">
              <Input
                value={form.birthYear}
                onChange={(e) =>
                  setForm({ ...form, birthYear: e.target.value })
                }
                placeholder="2018"
              />
            </Field>
          </div>

          <Field label="Sprite URL">
            <Input
              value={form.sprite}
              onChange={(e) => setForm({ ...form, sprite: e.target.value })}
              placeholder="https://…"
            />
          </Field>
          <Field label="Pixel sprite URL">
            <Input
              value={form.spritePixel}
              onChange={(e) =>
                setForm({ ...form, spritePixel: e.target.value })
              }
              placeholder="https://…"
            />
          </Field>

          <Field label="Backstory">
            <textarea
              value={form.backstory}
              onChange={(e) =>
                setForm({ ...form, backstory: e.target.value })
              }
              rows={3}
              className="w-full rounded-xl border border-pd-ink/20 bg-white px-4 py-2 text-sm"
            />
          </Field>
          <Field label="Wear">
            <textarea
              value={form.wear}
              onChange={(e) => setForm({ ...form, wear: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-pd-ink/20 bg-white px-4 py-2 text-sm"
            />
          </Field>

          <label className="flex items-center gap-2 text-sm font-semibold text-pd-ink">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
            Active (visible in catalog)
          </label>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-pd-ink/10 bg-white px-6 py-4">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : mode === "new" ? "Create card" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <div className="text-[11px] font-bold uppercase tracking-wider text-pd-ink-muted">
        {label}
      </div>
      {children}
    </label>
  );
}
