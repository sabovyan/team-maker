import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

type SideDrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  drawerContent: ReactNode;
  drawerWidthRatio?: number | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  overlayStyle?: StyleProp<ViewStyle> | undefined;
  drawerStyle?: StyleProp<ViewStyle> | undefined;
};

export default function SideDrawer({
  open,
  onClose,
  children,
  drawerContent,
  drawerWidthRatio = 0.86,
  style,
  overlayStyle,
  drawerStyle,
}: SideDrawerProps) {
  const { width } = useWindowDimensions();
  const [isVisible, setIsVisible] = useState(open);
  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;
  const drawerWidth = Math.max(320, width * drawerWidthRatio);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    }

    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: 240,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !open) {
        setIsVisible(false);
      }
    });
  }, [open, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [drawerWidth, 0],
  });

  const overlayOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={style}>
      {children}

      {isVisible ? (
        <View pointerEvents="box-none" style={overlayStyle}>
          <Pressable accessibilityLabel="Close team members" onPress={onClose} style={styles.fill}>
            <Animated.View style={[overlayStyle, { opacity: overlayOpacity }]} />
          </Pressable>

          <Animated.View style={[drawerStyle, { width: drawerWidth, transform: [{ translateX }] }]}>
            {drawerContent}
          </Animated.View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
