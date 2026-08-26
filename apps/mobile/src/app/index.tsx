import { calculateMaestroScore } from "@maestro/core";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const score = calculateMaestroScore(
  [
    { key: "habits", label: "Hábitos", score: 82 },
    { key: "sessions", label: "Aprendizaje", score: 76 },
    { key: "goals", label: "Metas", score: 68 },
    { key: "consistency", label: "Consistencia", score: 91 },
  ],
  [
    { key: "habits", weight: 35 },
    { key: "sessions", weight: 25 },
    { key: "goals", weight: 25 },
    { key: "consistency", weight: 15 },
  ],
);

const agenda = [
  ["06:30", "Lectura y reflexión", "Crecimiento · 25 min"],
  ["09:00", "Inglés: conversación", "Idiomas · 40 min"],
  ["14:30", "Bloque de creación", "NIDO · 90 min"],
] as const;

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>MIÉRCOLES, 26 DE AGOSTO</Text>
            <Text style={styles.title}>Tu día, con intención.</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AC</Text>
          </View>
        </View>

        <View style={styles.focusCard}>
          <View style={styles.row}>
            <View>
              <Text style={styles.eyebrow}>ENFOQUE DE HOY</Text>
              <Text style={styles.cardTitle}>Avanzar con calma</Text>
            </View>
            <Text style={styles.chip}>Día 47</Text>
          </View>
          <Text style={styles.body}>
            Completa lo esencial y deja que cada bloque alimente tu progreso.
          </Text>
          <View style={styles.track}>
            <View style={styles.trackFill} />
          </View>
          <View style={styles.row}>
            <Text style={styles.progressStrong}>5 de 8 acciones</Text>
            <Text style={styles.muted}>62%</Text>
          </View>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.score}>
            <Text style={styles.scoreNumber}>{score.total}</Text>
            <Text style={styles.scoreUnit}>/100</Text>
          </View>
          <View>
            <Text style={styles.eyebrow}>MAESTRO SCORE</Text>
            <Text style={styles.scoreTitle}>Ritmo sólido</Text>
            <Text style={styles.positive}>+4 esta semana</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Lo que sigue</Text>
        <View style={styles.agenda}>
          {agenda.map(([time, title, meta]) => (
            <View style={styles.agendaRow} key={time}>
              <Text style={styles.time}>{time}</Text>
              <View style={styles.dot} />
              <View style={styles.agendaCopy}>
                <Text style={styles.agendaTitle}>{title}</Text>
                <Text style={styles.muted}>{meta}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.localNote}>
          <Text style={styles.localNoteTitle}>Datos protegidos</Text>
          <Text style={styles.localNoteBody}>
            Esta base todavía opera localmente. La sincronización llegará después de una migración
            explícita y reversible.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f4f1e8" },
  content: { padding: 22, paddingBottom: 38, gap: 18 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eyebrow: {
    color: "#747b77",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: { color: "#1c2a27", fontFamily: "serif", fontSize: 34, lineHeight: 40, maxWidth: 280 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2f6657",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  focusCard: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#fffdf8",
    borderWidth: 1,
    borderColor: "#dedbd1",
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  cardTitle: { color: "#1c2a27", fontFamily: "serif", fontSize: 24 },
  chip: {
    color: "#2f6657",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#bfd0c4",
    borderRadius: 20,
  },
  body: { color: "#68736d", fontSize: 14, lineHeight: 21, marginVertical: 24 },
  track: {
    height: 7,
    backgroundColor: "#e1dfd5",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 11,
  },
  trackFill: { width: "62%", height: "100%", backgroundColor: "#2f6657", borderRadius: 10 },
  progressStrong: { color: "#1c2a27", fontSize: 11, fontWeight: "700" },
  muted: { color: "#747b77", fontSize: 11 },
  scoreCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#2f6657",
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  score: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#f4f1e8",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNumber: { color: "#1c2a27", fontFamily: "serif", fontSize: 28, lineHeight: 31 },
  scoreUnit: { color: "#747b77", fontSize: 9 },
  scoreTitle: { color: "#fffdf8", fontFamily: "serif", fontSize: 22 },
  positive: { color: "#bed3c5", fontSize: 11, marginTop: 3 },
  sectionTitle: { color: "#1c2a27", fontFamily: "serif", fontSize: 24, marginTop: 12 },
  agenda: {
    backgroundColor: "#fffdf8",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dedbd1",
    paddingHorizontal: 18,
  },
  agendaRow: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#dedbd1",
  },
  time: { width: 48, color: "#747b77", fontSize: 11 },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#2f6657",
    marginRight: 14,
  },
  agendaCopy: { flex: 1, gap: 4 },
  agendaTitle: { color: "#1c2a27", fontSize: 13, fontWeight: "600" },
  localNote: { padding: 18, borderRadius: 16, backgroundColor: "#e1e9e2" },
  localNoteTitle: { color: "#2f6657", fontSize: 12, fontWeight: "700", marginBottom: 5 },
  localNoteBody: { color: "#50635b", fontSize: 11, lineHeight: 17 },
});
