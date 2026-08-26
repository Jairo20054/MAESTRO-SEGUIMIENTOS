import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SectionPlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionPlaceholder({ eyebrow, title, description }: SectionPlaceholderProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Esta sección se conectará a los datos migrados en la siguiente fase.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f4f1e8" },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  eyebrow: {
    color: "#2f6657",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.3,
    marginBottom: 10,
  },
  title: { color: "#1c2a27", fontFamily: "serif", fontSize: 40, marginBottom: 14 },
  description: { color: "#68736d", fontSize: 15, lineHeight: 23, maxWidth: 420 },
  card: {
    marginTop: 30,
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#fffdf8",
    borderColor: "#dedbd1",
    borderWidth: 1,
  },
  cardText: { color: "#68736d", fontSize: 12, lineHeight: 18 },
});
