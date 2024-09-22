import { useThemeColors } from "@/hooks/useThemeColors";
import { View, StyleSheet } from "react-native";
type Props = {
  ckecked: boolean;
};

export function Radio({ ckecked }: Props) {
  const colors = useThemeColors();
  return (
    <View>
      <View style={[styles.radio, { borderColor: colors.tint }]}>
        {ckecked && (
          <View style={[styles.raiodInner, { backgroundColor: colors.tint }]} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  radio: {
    width: 14,
    height: 14,
    borderRadius: 14,
    borderStyle: "solid",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  raiodInner: {
    width: 6,
    height: 6,
    borderRadius: 6,
  },
});
