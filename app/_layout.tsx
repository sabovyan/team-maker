import { Stack } from 'expo-router/stack';

import { theme } from '../src/constants/theme';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.surfaces.surface1 },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="score-modal"
        options={{
          presentation: 'formSheet',
          headerShown: false,
          sheetAllowedDetents: [0.5, 0.85],
          sheetInitialDetentIndex: 0,
          sheetGrabberVisible: true,
          sheetCornerRadius: 28,
        }}
      />
    </Stack>
  );
}
