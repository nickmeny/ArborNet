import { Stack } from "expo-router";

<Stack.Screen options={{ title: "Home" }} />
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}