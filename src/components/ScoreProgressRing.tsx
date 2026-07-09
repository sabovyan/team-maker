import { type ReactNode, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

type ScoreProgressRingProps = {
  value: number;
  maxValue: number | '';
  size: number;
  strokeWidth: number;
  color: string;
  trackColor: string;
  style?: StyleProp<ViewStyle> | undefined;
  children?: ReactNode;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ScoreProgressRing({
  value,
  maxValue,
  size,
  strokeWidth,
  color,
  trackColor,
  style,
  children,
}: ScoreProgressRingProps) {
  const normalizedMaxValue = typeof maxValue === 'number' && maxValue > 0 ? maxValue : 0;
  const progress = normalizedMaxValue === 0 ? 0 : Math.max(0, Math.min(1, value / normalizedMaxValue));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const center = size / 2;
  const animatedDashOffset = useRef(new Animated.Value(dashOffset)).current;

  useEffect(() => {
    Animated.timing(animatedDashOffset, {
      toValue: dashOffset,
      duration: 240,
      useNativeDriver: false,
    }).start();
  }, [animatedDashOffset, dashOffset]);

  return (
    <View style={[styles.root, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        <G rotation="-90" origin={`${center}, ${center}`}>
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={animatedDashOffset}
            fill="none"
          />
        </G>
      </Svg>

      <View pointerEvents="none" style={styles.centerContent}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
