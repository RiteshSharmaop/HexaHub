import type { LucideIcon } from "lucide-react";

export interface Page {
  id: number;
  name: string;
  language: string;
  content: string;
}

export interface Language {
  value: string;
  label: string;
  icon: LucideIcon;
}

export interface CodeSnippets {
  [key: string]: string;
}

export interface LanguageVersions {
  [key: string]: string;
}
