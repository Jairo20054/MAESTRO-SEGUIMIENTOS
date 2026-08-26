import "react-native-url-polyfill/auto";

import type { Database } from "@maestro/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Faltan EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
}

const isStaticWebRender = Platform.OS === "web" && typeof window === "undefined";

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: isStaticWebRender ? undefined : AsyncStorage,
    autoRefreshToken: !isStaticWebRender,
    persistSession: !isStaticWebRender,
    detectSessionInUrl: false,
  },
});
