import type { Metadata } from "next";
import CareerClient from "./career-client";

export const metadata: Metadata = {
  title: "Plan de carrera | Maestro",
  description: "Seguimiento de Ingeniería de Sistemas y Software e Ingeniería Electrónica: materias, temas, sesiones de estudio y progreso.",
};

export default function CareerPage() {
  return <CareerClient />;
}
