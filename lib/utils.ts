export type ClassValue = string | number | boolean | undefined | null | ClassValue[]

function clsx(...inputs: ClassValue[]): string {
  return inputs.flat().filter(Boolean).join(" ")
}

// Simple twMerge replacement - just joins classes without deduplication
function twMerge(classes: string): string {
  return classes
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
