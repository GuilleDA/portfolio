export type ClassValue = string | number | false | null | undefined;

export function cx(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
