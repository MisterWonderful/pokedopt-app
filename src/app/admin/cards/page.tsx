"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TypeChip } from "@/components/cards/type-chip";
import { RarityBadge } from "@/components/cards/rarity-badge";
import { CroppedArt } from "@/components/cards/graded-slab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Pencil, Trash2, EyeOff, Eye, Upload } from "lucide-react";
import { POKEMON_TYPES } from "@/lib/constants";

interface Card {
  id: string;
  sku?: string | null;
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
  setName?: string | null;
  cardNumber?: string | null;
  year?: string | null;
  stage?: string | null;
  illustrator?: string | null;
  originalTitle?: string | null;
  condition?: string | null;
  imageUrl1?: string | null;
  imageUrl2?: string | null;
  artCropX?: number;
  artCropY?: number;
  artCropWidth?: number;
  artCropHeight?: number;
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
  sku: "",
  setName: "",
  cardNumber: "",
  year: "",
  stage: "",
  illustrator: "",
  originalTitle: "",
  condition: "",
  imageUrl1: "",
  imageUrl2: "",
  artCropX: 0.07,
  artCropY: 0.11,
  artCropWidth: 0.86,
  artCropHeight: 0.5,
};

export default function AdminCardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<{ mode: "new" | "edit"; id?: string; form: CardForm } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<null | {
    created: number;
    updated: number;
    total: number;
    errors: { row: number; sku?: string; message: string }[];
  }>(null);
  const [importError, setImportError] = useState<string | null>(null);

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
        sku: c.sku || "",
        setName: c.setName || "",
        cardNumber: c.cardNumber || "",
        year: c.year || "",
        stage: c.stage || "",
        illustrator: c.illustrator || "",
        originalTitle: c.originalTitle || "",
        condition: c.condition || "",
        imageUrl1: c.imageUrl1 || "",
        imageUrl2: c.imageUrl2 || "",
        artCropX: c.artCropX ?? 0.07,
        artCropY: c.artCropY ?? 0.11,
        artCropWidth: c.artCropWidth ?? 0.86,
        artCropHeight: c.artCropHeight ?? 0.5,
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
      const issues = err?.issues?.fieldErrors;
      const detail = issues
        ? Object.entries(issues)
            .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
            .join(" · ")
        : "";
      setError(detail ? `${err.error || "Save failed"} — ${detail}` : err.error || "Save failed");
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
        <div className="ml-auto flex gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                e.target.value = "";
                setImporting(true);
                setImportError(null);
                setImportResult(null);
                try {
                  const text = await file.text();
                  const res = await fetch("/api/admin/cards/import", {
                    method: "POST",
                    headers: { "Content-Type": "text/csv" },
                    body: text,
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    setImportError(data.error || "Import failed");
                  } else {
                    setImportResult(data);
                    load();
                  }
                } catch (err: any) {
                  setImportError(err?.message || "Import failed");
                } finally {
                  setImporting(false);
                }
              }}
            />
            <span className="inline-flex">
              <Button variant="secondary" asChild>
                <span>
                  <Upload size={16} /> {importing ? "Importing…" : "Import CSV"}
                </span>
              </Button>
            </span>
          </label>
          <Button onClick={openNew}>
            <CreditCard size={16} /> + New card
          </Button>
        </div>
      </div>

      {(importResult || importError) && (
        <div className="rounded-2xl border-2 border-pd-ink/10 bg-white p-4">
          {importError && (
            <div className="text-sm font-semibold text-red-700">
              Import failed: {importError}
            </div>
          )}
          {importResult && (
            <div className="space-y-2">
              <div className="text-sm font-bold text-pd-ink">
                Imported {importResult.total} rows — created{" "}
                <span className="text-pd-green">{importResult.created}</span>,
                updated{" "}
                <span className="text-pd-violet">{importResult.updated}</span>
                {importResult.errors.length > 0 && (
                  <>
                    , <span className="text-red-700">{importResult.errors.length} error{importResult.errors.length === 1 ? "" : "s"}</span>
                  </>
                )}
              </div>
              {importResult.errors.length > 0 && (
                <ul className="space-y-1 text-xs text-pd-ink-soft">
                  {importResult.errors.slice(0, 8).map((e, i) => (
                    <li key={i}>
                      Row {e.row}
                      {e.sku && ` (${e.sku})`}: {e.message}
                    </li>
                  ))}
                  {importResult.errors.length > 8 && (
                    <li>…and {importResult.errors.length - 8} more</li>
                  )}
                </ul>
              )}
              <button
                onClick={() => {
                  setImportResult(null);
                  setImportError(null);
                }}
                className="text-xs font-bold text-pd-ink-muted underline"
              >
                dismiss
              </button>
            </div>
          )}
        </div>
      )}

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
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border-2 border-pd-ink bg-white shadow-[0_8px_0_#29261b]">
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

          <div className="grid grid-cols-2 gap-3">
            <Field label="SKU">
              <Input
                value={form.sku || ""}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="Pokedopt-S1-1"
              />
            </Field>
            <Field label="Set name">
              <Input
                value={form.setName || ""}
                onChange={(e) =>
                  setForm({ ...form, setName: e.target.value })
                }
                placeholder="Base Set 2"
              />
            </Field>
            <Field label="Card #">
              <Input
                value={form.cardNumber || ""}
                onChange={(e) =>
                  setForm({ ...form, cardNumber: e.target.value })
                }
                placeholder="50/130"
              />
            </Field>
            <Field label="Year">
              <Input
                value={form.year || ""}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="2000"
              />
            </Field>
            <Field label="Stage">
              <Input
                value={form.stage || ""}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
                placeholder="Basic"
              />
            </Field>
            <Field label="Illustrator">
              <Input
                value={form.illustrator || ""}
                onChange={(e) =>
                  setForm({ ...form, illustrator: e.target.value })
                }
                placeholder="Mitsuhiro Arita"
              />
            </Field>
          </div>

          <Field label="Card scan URL (Front · Image 1)">
            <Input
              value={form.imageUrl1 || ""}
              onChange={(e) =>
                setForm({ ...form, imageUrl1: e.target.value })
              }
              placeholder="https://images.carduploader.com/…"
            />
          </Field>
          <Field label="Card scan URL (Back · Image 2)">
            <Input
              value={form.imageUrl2 || ""}
              onChange={(e) =>
                setForm({ ...form, imageUrl2: e.target.value })
              }
              placeholder="https://images.carduploader.com/…"
            />
          </Field>

          {form.imageUrl1 && (
            <CropTool
              src={form.imageUrl1}
              cropX={form.artCropX ?? 0.07}
              cropY={form.artCropY ?? 0.11}
              cropW={form.artCropWidth ?? 0.86}
              cropH={form.artCropHeight ?? 0.5}
              onChange={(c) =>
                setForm({
                  ...form,
                  artCropX: c.x,
                  artCropY: c.y,
                  artCropWidth: c.w,
                  artCropHeight: c.h,
                })
              }
            />
          )}

          <Field label="Sprite URL (fallback for cards without a scan)">
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

interface CropToolProps {
  src: string;
  cropX: number;
  cropY: number;
  cropW: number;
  cropH: number;
  onChange: (c: { x: number; y: number; w: number; h: number }) => void;
}

type DragMode = "new" | "move" | "resize-tl" | "resize-tr" | "resize-bl" | "resize-br" | null;

function CropTool({ src, cropX, cropY, cropW, cropH, onChange }: CropToolProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    mode: DragMode;
    startMouseX: number;
    startMouseY: number;
    startCropX: number;
    startCropY: number;
    startCropW: number;
    startCropH: number;
  } | null>(null);

  const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

  const startDrag = (mode: DragMode) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    dragRef.current = {
      mode,
      startMouseX: rx,
      startMouseY: ry,
      startCropX: cropX,
      startCropY: cropY,
      startCropW: cropW,
      startCropH: cropH,
    };
    if (mode === "new") {
      onChange({ x: rx, y: ry, w: 0.01, h: 0.01 });
    }
    const onMove = (ev: MouseEvent) => {
      if (!containerRef.current || !dragRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const mx = (ev.clientX - r.left) / r.width;
      const my = (ev.clientY - r.top) / r.height;
      const d = dragRef.current;
      const dx = mx - d.startMouseX;
      const dy = my - d.startMouseY;

      if (d.mode === "new") {
        const x = Math.min(d.startMouseX, mx);
        const y = Math.min(d.startMouseY, my);
        const w = Math.abs(mx - d.startMouseX);
        const h = Math.abs(my - d.startMouseY);
        onChange({
          x: clamp(x),
          y: clamp(y),
          w: clamp(w, 0.01, 1 - clamp(x)),
          h: clamp(h, 0.01, 1 - clamp(y)),
        });
      } else if (d.mode === "move") {
        const nx = clamp(d.startCropX + dx, 0, 1 - d.startCropW);
        const ny = clamp(d.startCropY + dy, 0, 1 - d.startCropH);
        onChange({ x: nx, y: ny, w: d.startCropW, h: d.startCropH });
      } else if (d.mode === "resize-br") {
        onChange({
          x: d.startCropX,
          y: d.startCropY,
          w: clamp(d.startCropW + dx, 0.02, 1 - d.startCropX),
          h: clamp(d.startCropH + dy, 0.02, 1 - d.startCropY),
        });
      } else if (d.mode === "resize-tl") {
        const nx = clamp(d.startCropX + dx, 0, d.startCropX + d.startCropW - 0.02);
        const ny = clamp(d.startCropY + dy, 0, d.startCropY + d.startCropH - 0.02);
        onChange({
          x: nx,
          y: ny,
          w: d.startCropW - (nx - d.startCropX),
          h: d.startCropH - (ny - d.startCropY),
        });
      } else if (d.mode === "resize-tr") {
        const ny = clamp(d.startCropY + dy, 0, d.startCropY + d.startCropH - 0.02);
        onChange({
          x: d.startCropX,
          y: ny,
          w: clamp(d.startCropW + dx, 0.02, 1 - d.startCropX),
          h: d.startCropH - (ny - d.startCropY),
        });
      } else if (d.mode === "resize-bl") {
        const nx = clamp(d.startCropX + dx, 0, d.startCropX + d.startCropW - 0.02);
        onChange({
          x: nx,
          y: d.startCropY,
          w: d.startCropW - (nx - d.startCropX),
          h: clamp(d.startCropH + dy, 0.02, 1 - d.startCropY),
        });
      }
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleStyle: React.CSSProperties = {
    position: "absolute",
    width: 12,
    height: 12,
    background: "#fff",
    border: "2px solid #29261b",
    borderRadius: 2,
  };

  return (
    <div className="rounded-xl border border-pd-ink/15 bg-pd-cream p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-pd-ink-muted">
            Crop the Pokémon art
          </div>
          <div className="text-xs text-pd-ink-soft">
            Drag on the image to select. Drag the corners to resize. Right-side preview shows how it'll fill the slab's art window.
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() =>
            onChange({ x: 0.07, y: 0.11, w: 0.86, h: 0.5 })
          }
        >
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-[1fr_180px] gap-4">
        {/* Image with crop overlay */}
        <div
          ref={containerRef}
          className="relative select-none overflow-hidden rounded-lg border border-pd-ink/15 bg-white"
          style={{ aspectRatio: "5 / 7" }}
          onMouseDown={startDrag("new")}
        >
          <img
            src={src}
            alt="card scan"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
            draggable={false}
          />
          {/* Dim outside crop */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "rgba(20,16,10,0.55)",
              clipPath: `polygon(
                0 0, 100% 0, 100% 100%, 0 100%, 0 0,
                ${cropX * 100}% ${cropY * 100}%,
                ${cropX * 100}% ${(cropY + cropH) * 100}%,
                ${(cropX + cropW) * 100}% ${(cropY + cropH) * 100}%,
                ${(cropX + cropW) * 100}% ${cropY * 100}%,
                ${cropX * 100}% ${cropY * 100}%
              )`,
            }}
          />
          {/* Crop rectangle */}
          <div
            className="absolute border-2 border-white shadow-[0_0_0_1px_#29261b]"
            style={{
              left: `${cropX * 100}%`,
              top: `${cropY * 100}%`,
              width: `${cropW * 100}%`,
              height: `${cropH * 100}%`,
              cursor: "move",
            }}
            onMouseDown={startDrag("move")}
          >
            <div style={{ ...handleStyle, top: -7, left: -7, cursor: "nwse-resize" }} onMouseDown={startDrag("resize-tl")} />
            <div style={{ ...handleStyle, top: -7, right: -7, cursor: "nesw-resize" }} onMouseDown={startDrag("resize-tr")} />
            <div style={{ ...handleStyle, bottom: -7, left: -7, cursor: "nesw-resize" }} onMouseDown={startDrag("resize-bl")} />
            <div style={{ ...handleStyle, bottom: -7, right: -7, cursor: "nwse-resize" }} onMouseDown={startDrag("resize-br")} />
          </div>
        </div>

        {/* Live preview matching slab's art window */}
        <div>
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-pd-ink-muted">
            Slab preview
          </div>
          <div
            className="relative overflow-hidden rounded border-2 border-pd-ink/40 bg-white"
            style={{ width: 160, height: 160 * (0.7 / 0.92) }}
            title="How the crop appears inside the slab's art window"
          >
            <CroppedArt
              src={src}
              alt="preview"
              cropX={cropX}
              cropY={cropY}
              cropW={cropW}
              cropH={cropH}
            />
          </div>
          <div className="mt-3 space-y-1 text-[10px] tabular-nums text-pd-ink-muted">
            <div>X: {(cropX * 100).toFixed(1)}%</div>
            <div>Y: {(cropY * 100).toFixed(1)}%</div>
            <div>W: {(cropW * 100).toFixed(1)}%</div>
            <div>H: {(cropH * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
