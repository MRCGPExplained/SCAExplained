// Small pure stats helpers for the economics dashboard.

export function sum(nums: number[]): number {
  return nums.reduce((s, n) => s + n, 0);
}

export function mean(nums: number[]): number {
  return nums.length ? sum(nums) / nums.length : 0;
}

export function median(nums: number[]): number {
  if (!nums.length) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Nearest-rank percentile (p in 0..100). */
export function percentile(nums: number[], p: number): number {
  if (!nums.length) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const rank = Math.ceil((p / 100) * sorted.length);
  return sorted[Math.min(sorted.length - 1, Math.max(0, rank - 1))];
}

export function max(nums: number[]): number {
  return nums.length ? Math.max(...nums) : 0;
}
