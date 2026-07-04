const COLORS = ['#0f4c5c', '#e36414', '#fb8b24', '#9a031e', '#5f0f40', '#335c67'] as const;

export function getColorByIndex(index: number): string {
  return COLORS[index % COLORS.length] ?? COLORS[0] ?? '#0f4c5c';
}

export default COLORS;
