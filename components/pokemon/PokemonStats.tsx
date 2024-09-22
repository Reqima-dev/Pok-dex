import { type ViewProps, StyleSheet, View, type ViewStyle } from "react-native";
import { Row } from "../Row";
import ThemedText from "../ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";
type Props = ViewProps & {
  color: string;
  name: string;
  value: number;
};

function startShortName(name: string) {
  return name
    .replaceAll("special", "S")
    .replaceAll("-", "")
    .replaceAll("attack", "ATK")
    .replaceAll("defense", "DEF")
    .replaceAll("speed", "SPD")
    .replaceAll("accuracy", "ACC")
    .replaceAll("evasion", "EVA")
    .replaceAll("hp", "HP")
    .toUpperCase();
}

export function PokemonStats({ style, name, value, color, ...rest }: Props) {
   const colors = useThemeColors();
  const sharedValue = useSharedValue(value);
 
  const barInnerStyle = useAnimatedStyle(() => {
    return {
      flex: sharedValue.value,
    };
  });

  const barBackgroundStyle = useAnimatedStyle(() => {
    return {
      flex: 255 - sharedValue.value,
    };
  });

  useEffect(() => {
    sharedValue.value = withSpring(value);
  }, [value]);

  return (
    <Row gap={8} style={[style, styles.root]} {...rest}>
      <View style={[styles.name, { borderColor: colors.grayLight }]}>
        <ThemedText vairant="subtitle3" style={{ color: color }}>
          {startShortName(name)}
        </ThemedText>
      </View>
      <View style={styles.value}>
        <ThemedText vairant="subtitle3" style={{ color: color }}>
          {value.toString().padStart(3, "0")}
        </ThemedText>
      </View>
      <Row style={styles.bar}>
        <Animated.View
          style={[styles.barInner, { backgroundColor: color }, barInnerStyle]}
        />
        <Animated.View
          style={[
            styles.barBackground,
            { backgroundColor: color },
            barBackgroundStyle,
          ]}
        />
      </Row>
    </Row>
  );
}

const styles = StyleSheet.create({
  root: {},
  name: {
    width: 40,
    paddingRight: 8,
    borderRightWidth: 1,
    borderStyle: "solid",
  },
  value: {
    width: 23,
  },
  bar: {
    flex: 1,
    borderRadius: 20,
    height: 4,
    overflow: "hidden",
  },
  barInner: {
    height: 7,
  },
  barBackground: {
    height: 7,
    opacity: 0.24,
  },
});
