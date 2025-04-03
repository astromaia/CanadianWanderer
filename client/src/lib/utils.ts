import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind's class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a city slug for display (e.g., "quebec-city" -> "Quebec City")
 */
export function formatCityName(slug: string): string {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Creates a delay promise for simulating loading states
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Simulates a loading progress from 0 to 100%
 * @param onProgress Callback that receives the current progress value (0-100)
 * @param durationMs Total duration in milliseconds
 * @param steps Number of steps to reach 100%
 */
export async function simulateProgress(
  onProgress: (progress: number) => void,
  durationMs: number = 3000,
  steps: number = 20
): Promise<void> {
  const stepTime = durationMs / steps;
  let currentProgress = 0;
  
  for (let i = 0; i < steps; i++) {
    await delay(stepTime);
    // Non-linear progress to make it feel more natural
    currentProgress = Math.round((i + 1) / steps * 100);
    onProgress(currentProgress);
  }
}
