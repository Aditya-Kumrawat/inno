import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { VaccineRecommendation } from "@shared/api";

const severityConfig = {
  critical: {
    label: "Critical 🔴",
    badgeClass: "border-red-200 bg-red-100 text-red-700",
  },
  moderate: {
    label: "Moderate 🟠",
    badgeClass: "border-orange-200 bg-orange-100 text-orange-700",
  },
  low: {
    label: "Low 🟢",
    badgeClass: "border-green-200 bg-green-100 text-green-700",
  },
} as const;

interface VaccineCardProps {
  vaccine: VaccineRecommendation;
  onRemind: (vaccine: VaccineRecommendation) => void;
  contextLabel?: string;
  isSavingReminder?: boolean;
}

const formatAge = (age: number) => {
  if (age < 1) {
    const months = Math.round(age * 12);
    if (months <= 1) {
      return "Newborn";
    }
    return `${months} months`;
  }
  if (Number.isInteger(age)) {
    return `${age} years`;
  }
  return `${age.toFixed(1)} years`;
};

const glassCardClass =
  "rounded-3xl border border-white/45 bg-gradient-to-br from-white/85 via-white/50 to-white/25 backdrop-blur-xl shadow-[0_24px_64px_rgba(79,70,229,0.16)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_76px_rgba(79,70,229,0.22)] min-w-0 overflow-hidden";

export function VaccineCard({
  vaccine,
  onRemind,
  contextLabel,
  isSavingReminder = false,
}: VaccineCardProps) {
  const severity = severityConfig[vaccine.severity];

  return (
    <Dialog>
      <Card
        className={cn(glassCardClass, "flex h-full flex-col justify-between")}
      >
        <CardHeader className="space-y-2 p-4">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base font-semibold leading-tight break-words text-foreground">
              {vaccine.vaccine}
            </CardTitle>
            <Badge className={severity.badgeClass}>{severity.label}</Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Protects against{" "}
            <span className="font-medium text-foreground">
              {vaccine.disease}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 p-4 pt-0">
          <div className="rounded-xl border border-white/40 bg-white/35 p-2 text-xs text-muted-foreground shadow-inner shadow-white/30">
            <div className="font-semibold text-foreground">Recommended at</div>
            <div>{formatAge(vaccine.age)}</div>
            {contextLabel ? (
              <div className="mt-1 text-xs">
                Tailored for{" "}
                <span className="font-medium text-foreground">
                  {contextLabel}
                </span>
              </div>
            ) : null}
          </div>
          {vaccine.notes ? (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Notes:</span>{" "}
              {vaccine.notes}
            </div>
          ) : null}
          <div className="flex items-center justify-end gap-2">
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View details
              </Button>
            </DialogTrigger>
            <Button
              size="sm"
              onClick={() => onRemind(vaccine)}
              disabled={isSavingReminder}
            >
              {isSavingReminder ? "Saving..." : "Remind Me"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <DialogContent className="rounded-3xl border border-white/40 bg-gradient-to-br from-white/90 via-white/55 to-white/30 backdrop-blur-2xl shadow-[0_40px_90px_rgba(79,70,229,0.28)] p-4 sm:p-5">
        <DialogHeader>
          <DialogTitle className="text-base leading-tight break-words">{vaccine.vaccine}</DialogTitle>
          <DialogDescription>
            Detailed information about the {vaccine.vaccine} vaccine.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-xs text-muted-foreground">
          <div>
            <span className="font-semibold text-foreground">
              Disease prevented:
            </span>{" "}
            {vaccine.disease}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Severity:</span>
            <Badge className={severity.badgeClass}>{severity.label}</Badge>
          </div>
          <div>
            <span className="font-semibold text-foreground">
              Recommended age:
            </span>{" "}
            {formatAge(vaccine.age)}
          </div>
          {vaccine.notes ? (
            <div>
              <span className="font-semibold text-foreground">Guidance:</span>{" "}
              {vaccine.notes}
            </div>
          ) : null}
          {contextLabel ? (
            <div>
              <span className="font-semibold text-foreground">Applies to:</span>{" "}
              {contextLabel}
            </div>
          ) : null}
        </div>
        <div className="mt-3 flex justify-end">
          <Button onClick={() => onRemind(vaccine)} disabled={isSavingReminder}>
            {isSavingReminder ? "Saving..." : "Remind Me"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
