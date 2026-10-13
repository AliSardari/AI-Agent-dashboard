import clsx, { type ClassValue } from "clsx";

/** Conditionally join class names. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
