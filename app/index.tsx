import { Card } from "@/components/Card";
import { SearchBar } from "@/components/SearchBar";
import ThemedText from "@/components/ThemedText";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { getPokemonId } from "@/functions/pokemon";
import { useInfiteFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { useState } from "react";
import { Row } from "@/components/Row";
import { SortButton } from "@/components/SortButton";
import { RootView } from "@/components/RootView";

export default function Index() {
  const colors = useThemeColors();
  const { data, isFetching, fetchNextPage } =
    useInfiteFetchQuery("/pokemon?limit=21");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"id" | "name">("id");
  const pokemons =
    data?.pages.flatMap((page) =>
      page.results.map((r) => ({
        name: r.name,
        id: getPokemonId(r.url),
      }))
    ) ?? [];
  const filteredPokemons = [
    ...(search
      ? pokemons.filter(
          (pokemon) =>
            pokemon.name.includes(search.toLowerCase()) ||
            pokemon.id.toString() === search
        )
      : pokemons),
  ].sort((a, b) => (a[sortKey] < b[sortKey] ? -1 : 1));
  return (
    <RootView>
      <Row style={styles.header} gap={16}>
        <Image
          source={require("@/assets/images/Pokeball.png")}
          width={24}
          height={24}
        />
        <ThemedText vairant="headline" color="grayLight">
          Pokédex
        </ThemedText>
      </Row>
      <Row gap={16} style={styles.forms}>
        <SearchBar onChange={setSearch} value={search} />
        <SortButton value={sortKey} onChange={setSortKey} />
      </Row>
      <Card style={styles.body}>
        <FlatList
          data={filteredPokemons}
          numColumns={3}
          columnWrapperStyle={styles.gridGap}
          contentContainerStyle={[styles.gridGap, styles.list]}
          ListFooterComponent={
            isFetching ? <ActivityIndicator color={colors.tint} /> : null
          }
          onEndReached={search ? undefined : () => fetchNextPage()}
          renderItem={({ item }) => (
            <PokemonCard
              id={item.id}
              name={item.name}
              style={{ flex: 1 / 3 }}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </Card>
    </RootView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  body: { flex: 1, marginTop: 16 },
  gridGap: {
    gap: 8,
  },
  list: {
    padding: 12,
  },
  forms: {
    paddingHorizontal: 12,
  },
});
