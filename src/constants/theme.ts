export const theme = {
  surfaces: {
    surface1: '#f7f5f0',
    surface2: '#ffffff',
    surfaceMuted: '#f1eee8',
    surfaceInput: '#fcfbf7',
    surfaceInset: '#f4f1eb',
    surfaceHeader: '#faf7f2',
  },
  text: {
    primary: '#111111',
    secondary: '#6d6a63',
    muted: '#6b665d',
    input: '#171717',
    inverse: '#ffffff',
    placeholder: '#9a968d',
  },
  borders: {
    subtle: '#e7e1d7',
    muted: '#ece7de',
    strong: '#ddd8ce',
  },
  actions: {
    primaryBg: '#000000',
    primaryText: '#ffffff',
    secondaryBg: '#f1eee8',
    secondaryText: '#111111',
    disabledPrimaryBg: '#d7d2c8',
    disabledPrimaryText: '#8d877c',
    disabledSecondaryBg: '#ece7de',
    disabledSecondaryText: '#9a968d',
    pressedOpacity: 0.85,
    disabledOpacity: 1,
  },
  overlays: {
    scrim: 'rgba(0, 0, 0, 0.38)',
  },
  effects: {
    shadowColor: '#000000',
  },
  progress: {
    track: '#ece7de',
  },
  teams: {
    colors: ['#1f1f1f', '#4f5a66', '#6f6258', '#667060', '#6c6478', '#6b737a'] as const,
  },
} as const;

export default theme;
