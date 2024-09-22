import { Colors } from "@/constants/Colors";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Text, StyleSheet } from "react-native";
import type { TextProps } from "react-native";

type Props = TextProps & {
  vairant?: keyof typeof styles;
  color?: keyof (typeof Colors)["light"];
};

const styles = StyleSheet.create({
  body3: {
    fontSize: 10,
    lineHeight: 16,
  },
  headline: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 8,
    lineHeight: 12,
  },
  subtitle1: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: "bold",
  },
  subtitle2: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "bold",
  },
  subtitle3: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "bold",
  },
});

export default function ThemedText({ vairant, color, style, ...rest }: Props) {
  const colors = useThemeColors();
  return (
    <Text
      style={[
        styles[vairant ?? "body3"],
        { color: colors[color ?? "grayDark"] },
        style,
      ]}
      {...rest}
    />
  );
}
