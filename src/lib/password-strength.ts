import { ZxcvbnFactory } from "@zxcvbn-ts/core";
import {
  adjacencyGraphs,
  dictionary as commonDictionary,
} from "@zxcvbn-ts/language-common";
import {
  dictionary as enDictionary,
  translations,
} from "@zxcvbn-ts/language-en";

const zxcvbn = new ZxcvbnFactory({
  translations,
  graphs: adjacencyGraphs,
  dictionary: {
    ...commonDictionary,
    ...enDictionary,
  },
});

export type PasswordStrength = {
  score: number;
  label: string;
  width: number;
  color: string;
};

const LABELS = [
  "Very weak",
  "Weak",
  "Fair",
  "Moderate",
  "Strong",
  "Very strong",
];
const COLORS = [
  "var(--danger)",
  "var(--danger)",
  "var(--warning)",
  "var(--warning)",
  "var(--success)",
  "var(--success)",
];

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: "", width: 0, color: "var(--text-subtle)" };
  }

  const result = zxcvbn.check(password);
  const score = result.score;
  const width = Math.max(8, ((score + 1) / 5) * 100);

  return {
    score,
    label: LABELS[score] ?? "Moderate",
    width,
    color: COLORS[score] ?? "var(--warning)",
  };
}

export function isPasswordStrongEnough(password: string, minScore = 2) {
  if (password.length < 8) return false;
  return zxcvbn.check(password).score >= minScore;
}
