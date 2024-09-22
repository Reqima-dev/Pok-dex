export function getPokemonId(url: string): number {
  return parseInt(url.split("/").at(-2)!, 10);
}

export function getPokemonArtWork(id: number | string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function formateWeight(weight?: number): string {
  if (!weight) return "--";
  return (weight / 10).toString().replace(".", ",") + "kg";
}

export function formateSize(size?: number): string {
  if (!size) return "--";
  return (size / 10).toString().replace(".", ",") + "m";
}
