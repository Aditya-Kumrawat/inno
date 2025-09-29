import React from "react";
import { VaccineCard } from "@/components/vaccination/VaccineCard";
import type { VaccineRecommendation } from "@shared/api";

interface ScheduleSectionProps {
  title: string;
  vaccines: VaccineRecommendation[];
  onRemind: (vaccine: VaccineRecommendation) => void;
  contextLabel?: string;
  emptyMessage?: string;
  isSavingReminder?: boolean;
}

export function ScheduleSection({
  title,
  vaccines,
  onRemind,
  contextLabel,
  emptyMessage = "No vaccines in this section for now.",
  isSavingReminder = false,
}: ScheduleSectionProps) {
  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <span className="text-sm text-muted-foreground">{vaccines.length} item{vaccines.length === 1 ? "" : "s"}</span>
      </header>
      {vaccines.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted/80 bg-muted/10 p-6 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
