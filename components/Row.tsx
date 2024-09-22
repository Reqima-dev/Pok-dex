import { View, type ViewProps, type ViewStyle } from "react-native";

type Props = ViewProps & {
  gap?: number;
};

export function Row({ style, gap, ...rest }: Props) {
  return (
    <View style={[rowStyle, style, gap ? { gap: gap } : undefined]} {...rest} />
  );
}

const rowStyle = {
  flex: 0,
  flexDirection: "row",
  alignItems: "center",
} satisfies ViewStyle;
