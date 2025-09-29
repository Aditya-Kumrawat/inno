import type { RequestHandler } from "express";
import { Gender, VaccinesResponse } from "@shared/api";
import { vaccinationSchedule } from "../data/vaccines";

function normalizeGenderParam(value: unknown): Gender {
  if (typeof value !== "string") {
    return "any";
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === "male" || normalized === "m") return "male";
  if (normalized === "female" || normalized === "f") return "female";
  return "any";
}

function matchesGender(entryGender: Gender, targetGender: Gender) {
  return entryGender === "any" || targetGender === "any" || entryGender === targetGender;
}

export const handleVaccines: RequestHandler = (req, res) => {
  const ageParam = Array.isArray(req.query.age) ? req.query.age[0] : req.query.age;
  const genderParam = Array.isArray(req.query.gender) ? req.query.gender[0] : req.query.gender;

  const age = ageParam ? Number.parseFloat(ageParam) : Number.NaN;
  if (Number.isNaN(age) || age < 0) {
    res.status(400).json({ error: "Invalid age provided" });
    return;
  }

  const gender = normalizeGenderParam(genderParam);

  const eligible = vaccinationSchedule.filter((entry) => matchesGender(entry.gender, gender));

  const upcoming = eligible
    .filter((entry) => entry.age >= age)
    .sort((a, b) => a.age - b.age);

  const recent = eligible
    .filter((entry) => entry.age < age && entry.age >= Math.max(0, age - 2))
    .sort((a, b) => b.age - a.age);

  const response: VaccinesResponse = {
    upcoming,
    recent,
  };

  res.json(response);
};
