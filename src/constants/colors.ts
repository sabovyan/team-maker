import { theme } from './theme';

const COLORS = theme.teams.colors;

export function getColorByIndex(index: number): string {
  return COLORS[index % COLORS.length] ?? COLORS[0] ?? theme.teams.colors[0];
}

export default COLORS;
