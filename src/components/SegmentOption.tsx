import { Pressable, Text } from 'react-native';

import { appStyles } from '../styles/app';

type SegmentOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function SegmentOption({ label, selected, onPress }: SegmentOptionProps) {
  return (
    <Pressable
      style={[appStyles.segment, selected ? appStyles.segmentActive : null]}
      onPress={onPress}
    >
      <Text style={[appStyles.segmentLabel, selected ? appStyles.segmentLabelActive : null]}>
        {label}
      </Text>
    </Pressable>
  );
}
