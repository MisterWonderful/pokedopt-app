"use client";

import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-6 left-1/2 z-[200] flex flex-col gap-2 -translate-x-1/2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-toast-pop flex items-center gap-3 rounded-full bg-pd-ink px-5 py-3 text-sm font-semibold text-pd-cream shadow-[0_12px_28px_rgba(0,0,0,0.28)]"
        >
          <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-pd-primary">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12.5l5 5L20 6.5" />
            </svg>
          </span>
          {toast.message}
          <button onClick={() => dismiss(toast.id)} className="ml-1 opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
