import { Colors } from "@/constants/Colors";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

const endpoint = "https://pokeapi.co/api/v2";

type API = {
  "/pokemon?limit=21": {
    count: number;
    next: string | null;
    results: { name: string; url: string }[];
  };
  "/pokemon/{id}": {
    id: number;
    name: string;
    url: string;
    weight: number;
    height: number;
    moves: { move: { name: string } }[];
    stats: {
      base_stat: number;
      stat: {
        name: string;
      };
    }[];
    cries: {
      latest: string;
    };
    types: {
      type: {
        name: keyof typeof Colors.type;
      };
    }[];
  };
  "/pokemon-species/[id]": {
    flavor_text_entries: {
      flavor_text: string;
      language: {
        name: string;
      };
    }[];
  };
};

export function useFetchQuery<T extends keyof API>(
  path: string,
  params?: Record<string, string | number>
) {
  const localUrl =
    endpoint +
    Object.entries(params ?? {}).reduce(
      (acc, [key, value]) => acc.replaceAll(`[${key}]`, value),
      path
    );
  return useQuery({
    queryKey: [localUrl],
    queryFn: async () => {
      return fetch(localUrl, {
        headers: {
          Accept: "application/json",
        },
      }).then((res) => res.json() as Promise<API[T]>);
    },
  });
}

export function useInfiteFetchQuery<T extends keyof API>(path: string) {
  return useInfiniteQuery({
    queryKey: [path],
    initialPageParam: endpoint + path,
    queryFn: async ({ pageParam }) => {
      return fetch(pageParam, {
        headers: {
          Accept: "application/json",
        },
      }).then((res) => res.json() as Promise<API[T]>);
    },
    getNextPageParam: (lastPage) => {
      if ("next" in lastPage) {
        return lastPage.next;
      }
      return null;
    },
  });
}

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration * 1000));
}
