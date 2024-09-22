import { Card } from "@/components/Card";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import ThemedText from "@/components/ThemedText";
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStats } from "@/components/pokemon/PokemonStats";
import { PokmenonType } from "@/components/pokemon/PokmenonType";
import { Colors } from "@/constants/Colors";
import {
  formateSize,
  formateWeight,
  getPokemonArtWork,
} from "@/functions/pokemon";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Audio } from "expo-av";
import PagerView from "react-native-pager-view";
import { useRef, useState } from "react";

export default function Pokemon() {
  const params = useLocalSearchParams() as { id: string };
  const [id, setId] = useState(parseInt(params.id, 10));
  const offset = useRef(1);
  const pager = useRef<PagerView>(null);

  const onPageSelected = (e: { nativeEvent: { position: number } }) => {
    offset.current = e.nativeEvent.position - 1;
  };

  const onPageScrollStateChanged = (e: {
    nativeEvent: { pageScrollState: string };
  }) => {
    if (e.nativeEvent.pageScrollState !== "idle") {
      return;
    }
    if (offset.current === -1 && id === 2) {
      return;
    }
    if (offset.current === 1 && id === 150) {
      return;
    }
    if (offset.current !== 0) {
      setId(id + offset.current);
      offset.current = 0;
      pager.current?.setPageWithoutAnimation(1);
    }
  };

  const onPrevious = () => {
    pager.current?.setPage(0);
  };

  const onNext = () => {
    pager.current?.setPage(2 + offset.current);
  };
  // const onPrevious = () => {
  //   router.replace({
  //     pathname: "/pokemon/[id]",
  //     params: { id: Math.max(id - 1, 1) },
  //   });
  // };

  // const onNext = () => {
  //   router.replace({
  //     pathname: "/pokemon/[id]",
  //     params: { id: Math.min(id - 1, 151) },
  //   });
  // };

  return (
    <PagerView
      ref={pager}
      onPageSelected={onPageSelected}
      onPageScrollStateChanged={onPageScrollStateChanged}
      initialPage={1}
      style={{ flex: 1 }}
    >
      <PokemonView
        key={id - 1}
        id={id - 1}
        onNext={onNext}
        onPrevious={onPrevious}
      />
      <PokemonView key={id} id={id} onNext={onNext} onPrevious={onPrevious} />
      <PokemonView
        key={id + 1}
        id={id + 1}
        onNext={onNext}
        onPrevious={onPrevious}
      />
    </PagerView>
  );
}

type Props = {
  id: number;
  onPrevious?: () => void;
  onNext?: () => void;
};

function PokemonView({ id, onPrevious, onNext }: Props) {
  const colors = useThemeColors();
  const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: id });
  const { data: species } = useFetchQuery("/pokemon-species/[id]", {
    id: id,
  });
  const mainType = pokemon?.types[0].type.name;
  const colorType = mainType ? Colors.type[mainType] : colors.tint;
  const types = pokemon?.types ?? [];
  const bio = species?.flavor_text_entries
    ?.find((e) => e.language.name === "en")
    ?.flavor_text.replaceAll("\n", ".");

  const onImagePress = async () => {
    const cry = pokemon?.cries.latest;
    if (!cry) {
      return;
    }
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: cry,
      },
      { shouldPlay: true }
    );
    sound.playAsync();
  };

  return (
    <RootView backgroundColor={colorType}>
      <View>
        <Image
          style={styles.pokeball}
          source={require("@/assets/images/pokeball_big.png")}
          width={208}
          height={208}
        />
        <Row style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Row gap={8}>
              <Image
                source={require("@/assets/images/arrow_back.png")}
                width={32}
                height={32}
              />
              <ThemedText
                style={{ textTransform: "capitalize" }}
                color="grayWhite"
                vairant="headline"
              >
                {pokemon?.name}
              </ThemedText>
            </Row>
          </Pressable>
          <ThemedText color="grayWhite" vairant="subtitle2">
            #{id.toString().padStart(3, "0")}
          </ThemedText>
        </Row>

        <Card style={[styles.card, { overflow: "visible" }]}>
          <Row style={styles.images}>
            {id === 1 ? (
              <View style={{ width: 24 }}></View>
            ) : (
              <Pressable onPress={onPrevious}>
                <Image
                  source={require("@/assets/images/back.png")}
                  width={200}
                  height={200}
                />
              </Pressable>
            )}

            <Pressable onPress={onImagePress}>
              <Image
                source={{ uri: getPokemonArtWork(id) }}
                width={200}
                height={200}
              />
            </Pressable>
            <Pressable onPress={onNext}>
              <Image
                source={require("@/assets/images/next.png")}
                width={200}
                height={200}
              />
            </Pressable>
          </Row>
          <Row gap={16} style={{ height: 20 }}>
            {types.map((type) => (
              <PokmenonType name={type.type.name} key={type.type.name} />
            ))}
          </Row>
          <ThemedText vairant="subtitle1" style={{ color: colorType }}>
            A propos
          </ThemedText>
          <Row>
            <PokemonSpec
              style={{
                borderStyle: "solid",
                borderRightWidth: 1,
                borderColor: colors.grayLight,
              }}
              title={formateWeight(pokemon?.weight)}
              description="Poids"
              image={require("@/assets/images/weight.png")}
            />
            <PokemonSpec
              style={{
                borderStyle: "solid",
                borderRightWidth: 1,
                borderColor: colors.grayLight,
              }}
              title={formateSize(pokemon?.height)}
              description="Taille"
              image={require("@/assets/images/straighten.png")}
            />
            <PokemonSpec
              title={pokemon?.moves
                .slice(0, 2)
                .map((m) => m.move.name)
                .join("\n")}
              description="Moves"
            />
          </Row>
          <ThemedText>{bio}</ThemedText>
          <ThemedText vairant="subtitle1" style={{ color: colorType }}>
            Statistiques{" "}
          </ThemedText>
          <View style={{ alignSelf: "stretch" }}>
            {pokemon?.stats.map((stat) => (
              <PokemonStats
                key={stat.stat.name}
                name={stat.stat.name}
                value={stat.base_stat}
                color={colorType}
              />
            ))}
          </View>
        </Card>
      </View>
    </RootView>
  );
}

const styles = StyleSheet.create({
  header: {
    margin: 20,
    justifyContent: "space-between",
  },
  pokeball: {
    opacity: 1,
    position: "absolute",
    right: 8,
    top: 8,
  },
  card: {
    marginTop: 144,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 60,
    gap: 16,
    alignItems: "center",
  },
  images: {
    position: "absolute",
    top: -140,
    zIndex: 2,
    justifyContent: "space-around",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
});
