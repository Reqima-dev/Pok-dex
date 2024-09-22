import {
  type ViewProps,
  StyleSheet,
  View,
  Image,
  type ImageSourcePropType,
} from "react-native";
import { Row } from "../Row";
import ThemedText from "../ThemedText";

type Props = ViewProps & {
  title?: string;
  description?: string;
  image?: ImageSourcePropType;
};

export function PokemonSpec({
  style,
  image,
  title,
  description,
  ...rest
}: Props) {
  return (
    <View style={[style, styles.root]} {...rest}>
      <Row style={styles.row}>
        {image && <Image source={image} width={16} height={16} />}
        <ThemedText>{title}</ThemedText>
      </Row>
      <ThemedText vairant="caption" color="grayMedium">
        {description}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: 4,
    alignItems: "center",
  },
  row: {
    height: 32,
    alignItems: "center",
  },
});
