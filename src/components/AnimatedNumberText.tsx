import { useEffect, useRef, useState } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

type AnimatedNumberTextProps = {
  value: number;
  duration?: number | undefined;
  style?: StyleProp<TextStyle> | undefined;
};

function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

export default function AnimatedNumberText({
  value,
  duration = 240,
  style,
}: AnimatedNumberTextProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const animationFrameRef = useRef<number | null>(null);
  const currentValueRef = useRef(value);

  useEffect(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startValue = currentValueRef.current;

    if (startValue === value || duration <= 0) {
      currentValueRef.current = value;
      setDisplayValue(value);
      return undefined;
    }

    const startedAt = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startedAt;
      const progress = Math.min(1, elapsed / duration);
      const nextValue = Math.round(startValue + (value - startValue) * easeOutCubic(progress));

      currentValueRef.current = nextValue;
      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      currentValueRef.current = value;
      animationFrameRef.current = null;
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [duration, value]);

  return <Text style={style}>{displayValue}</Text>;
}
