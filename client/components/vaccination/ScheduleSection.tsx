import React from "react";
import { VaccineCard } from "@/components/vaccination/VaccineCard";
import { cn } from "@/lib/utils";
import type { VaccineRecommendation } from "@shared/api";

interface ScheduleSectionProps {
  title: string;
  vaccines: VaccineRecommendation[];
  onRemind: (vaccine: VaccineRecommendation) => void;
  contextLabel?: string;
  emptyMessage?: string;
  isSavingReminder?: boolean;
}

const emptyStateClass =
  "rounded-3xl border border-dashed border-white/45 bg-gradient-to-br from-white/65 via-white/35 to-white/15 backdrop-blur-xl shadow-[0_25px_70px_rgba(79,70,229,0.12)]";

export function ScheduleSection({
  title,
  vaccines,
  onRemind,
  contextLabel,
  emptyMessage = "No vaccines in this section for now.",
  isSavingReminder = false,
}: ScheduleSectionProps) {
  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-500">{title}</p>
          <h3 className="text-xl font-semibold text-slate-900">Tailored recommendations</h3>
        </div>
        <span className="text-sm text-muted-foreground">{vaccines.length} item{vaccines.length === 1 ? "" : "s"}</span>
      </header>
      {vaccines.length === 0 ? (
        <div className={cn(emptyStateClass, "p-8 text-center text-sm text-muted-foreground")}>
          {emptyMessage}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {vaccines.map((vaccine) => (
            <VaccineCard
              key={vaccine.id}
              vaccine={vaccine}
              onRemind={onRemind}
              contextLabel={contextLabel}
              isSavingReminder={isSavingReminder}
            />
          ))}
        </div>
      )}
    </section>
  );
}
