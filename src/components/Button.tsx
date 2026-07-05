import { type ReactNode } from 'react';
import { Pressable, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { appStyles } from '../styles/app';

export type ButtonType = 'primary' | 'secondary';

type ButtonProps = {
  children: ReactNode;
  onPress: () => void;
  type?: ButtonType | undefined;
  disabled?: boolean | undefined;
  grow?: boolean | undefined;
  accessibilityLabel?: string | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  textStyle?: StyleProp<TextStyle> | undefined;
  onPressIn?: (() => void) | undefined;
  onPressOut?: (() => void) | undefined;
};

export default function Button({
  children,
  onPress,
  type = 'primary',
  disabled = false,
  grow = false,
  accessibilityLabel,
  style,
  textStyle,
  onPressIn,
  onPressOut,
}: ButtonProps) {
  const shouldRenderTextChild = typeof children === 'string' || typeof children === 'number';

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        appStyles.button,
        shouldRenderTextChild ? appStyles.buttonTextFrame : null,
        grow ? appStyles.buttonGrow : null,
        type === 'secondary' ? appStyles.buttonSecondary : appStyles.buttonPrimary,
        disabled
          ? type === 'secondary'
            ? appStyles.buttonSecondaryDisabled
            : appStyles.buttonPrimaryDisabled
          : null,
        pressed && !disabled ? appStyles.buttonPressed : null,
        style,
      ]}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      {shouldRenderTextChild ? (
        <Text
          style={[
            appStyles.buttonText,
            type === 'secondary' ? appStyles.buttonSecondaryText : appStyles.buttonPrimaryText,
            disabled
              ? type === 'secondary'
                ? appStyles.buttonSecondaryTextDisabled
                : appStyles.buttonPrimaryTextDisabled
              : null,
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
