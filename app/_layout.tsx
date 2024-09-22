import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
const queryCLient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryCLient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
