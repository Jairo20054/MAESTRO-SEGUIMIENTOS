import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text } from "react-native";

const icons: Record<string, string> = {
  index: "●",
  progress: "↗",
  create: "+",
  goals: "◇",
  profile: "○",
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return <Text style={[styles.icon, focused && styles.iconFocused]}>{icons[name]}</Text>;
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#2f6657",
          tabBarInactiveTintColor: "#7b817d",
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.label,
          tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        })}
      >
        <Tabs.Screen name="index" options={{ title: "Hoy" }} />
        <Tabs.Screen name="progress" options={{ title: "Progreso" }} />
        <Tabs.Screen name="create" options={{ title: "Crear" }} />
        <Tabs.Screen name="goals" options={{ title: "Metas" }} />
        <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 76,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopColor: "#dedbd1",
    backgroundColor: "#fffdf8",
  },
  label: { fontSize: 10, fontWeight: "600" },
  icon: { color: "#7b817d", fontSize: 20, lineHeight: 22 },
  iconFocused: { color: "#2f6657", fontWeight: "700" },
});
