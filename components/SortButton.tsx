import { useThemeColors } from "@/hooks/useThemeColors";
import {
  View,
  type ViewProps,
  StyleSheet,
  type ViewStyle,
  Image,
  Pressable,
  Modal,
  Text,
  Dimensions,
} from "react-native";
import { useState, useRef } from "react";
import ThemedText from "./ThemedText";
import { Card } from "./Card";
import { Row } from "./Row";
import { Radio } from "./Radio";
import { Shadows } from "@/constants/Shadows";

type Props = {
  value: "id" | "name";
  onChange: (value: "id" | "name") => void;
};

const options = [
  { label: "Number", value: "id" },
  { label: "Name", value: "name" },
] as const;

export function SortButton({ value, onChange }: Props) {
  const buttonRef = useRef<View>(null);
  const colors = useThemeColors();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [position, setPosition] = useState<null | {
    top: number;
    right: number;
  }>(null);
  const onButtonPress = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({
        top: y + height,
        right: Dimensions.get("window").width - x - width,
      });
    });
    setIsModalVisible(true);
  };
  const onClose = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <Pressable onPress={onButtonPress}>
        <View
          ref={buttonRef}
          style={[styles.button, { backgroundColor: colors.grayWhite }]}
        >
          <Image
            source={
              value === "id"
                ? require("@/assets/images/sort-id.png")
                : require("@/assets/images/sort-name.png")
            }
            width={16}
            height={16}
          />
        </View>
      </Pressable>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={onClose}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[styles.popup, { backgroundColor: colors.tint, ...position }]}
        >
          <ThemedText
            style={styles.title}
            vairant="subtitle2"
            color="grayWhite"
          >
            Filtrer par :
          </ThemedText>
          <Card style={styles.card}>
            {options.map((o) => (
              <Pressable
                key={o.value}
                onPress={() => {
                  onChange(o.value), onClose();
                }}
              >
                <Row gap={8}>
                  <Radio ckecked={o.value === value} />
                  <ThemedText>{o.label}</ThemedText>
                </Row>
              </Pressable>
            ))}
          </Card>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 32,
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  popup: {
    position: "absolute",
    width: 113,
    padding: 4,
    paddingTop: 16,
    gap: 16,
    borderRadius: 12,
    ...Shadows.dp2,
  },
  title: {
    paddingLeft: 20,
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
});
