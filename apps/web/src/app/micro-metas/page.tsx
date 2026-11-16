import { redirect } from "next/navigation";

/**
 * Compatibility route for people who bookmarked /micro-metas.
 * Legacy micro-metas data and HTML files remain unchanged.
 */
export default function LegacyMicroMetasRedirect() {
  redirect("/carrera");
}
