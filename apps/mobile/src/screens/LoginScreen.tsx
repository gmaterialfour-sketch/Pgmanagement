import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import type { UserRole } from "@pg-rental/config";
import { designTokens } from "@pg-rental/ui";
import { api } from "../lib/api";

export function LoginScreen() {
  const [phone, setPhone] = useState("+919999999999");
  const [role, setRole] = useState<UserRole>("student");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  async function submit() {
    if (step === "phone") {
      const result = await api.requestOtp({ phone, role });
      setDevOtp(result.devOtp || "");
      setStep("otp");
      return;
    }
    await api.verifyOtp({ phone, role, otp });
    router.replace("/");
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.panel}>
        <Text style={styles.title}>OTP login</Text>
        <TextInput value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
        <View style={styles.segment}>
          {(["student", "owner"] as UserRole[]).map((item) => (
            <Pressable key={item} onPress={() => setRole(item)} style={[styles.segmentButton, role === item && styles.segmentActive]}>
              <Text style={role === item ? styles.segmentActiveText : styles.segmentText}>{item}</Text>
            </Pressable>
          ))}
        </View>
        {step === "otp" ? (
          <>
            <Text style={styles.help}>Development OTP: {devOtp}</Text>
            <TextInput value={otp} onChangeText={setOtp} style={styles.input} keyboardType="number-pad" placeholder="6 digit OTP" />
          </>
        ) : null}
        <Pressable onPress={submit} style={styles.primaryButton}>
          <Text style={styles.primaryText}>{step === "phone" ? "Send OTP" : "Verify"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: designTokens.colors.background, justifyContent: "center", padding: 20 },
  panel: { gap: 14, backgroundColor: designTokens.colors.surface, borderRadius: 8, padding: 18 },
  title: { fontSize: 28, fontWeight: "800", color: designTokens.colors.ink },
  input: { borderColor: designTokens.colors.border, borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  segment: { flexDirection: "row", borderRadius: 8, borderWidth: 1, borderColor: designTokens.colors.border, overflow: "hidden" },
  segmentButton: { flex: 1, padding: 12, alignItems: "center" },
  segmentActive: { backgroundColor: designTokens.colors.primary },
  segmentText: { color: designTokens.colors.ink, textTransform: "capitalize" },
  segmentActiveText: { color: "white", fontWeight: "700", textTransform: "capitalize" },
  help: { color: designTokens.colors.primary },
  primaryButton: { alignItems: "center", backgroundColor: designTokens.colors.ink, borderRadius: 8, padding: 14 },
  primaryText: { color: "white", fontWeight: "800" }
});
