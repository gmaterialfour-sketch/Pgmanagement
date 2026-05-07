import { useEffect, useState } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { Link } from "expo-router";
import type { PgSummary } from "@pg-rental/api";
import { designTokens } from "@pg-rental/ui";
import { formatCurrencyInr } from "@pg-rental/utils";
import { api } from "../lib/api";

const fallback = { lat: 28.6803, lng: 77.2046 };

export function DiscoveryScreen() {
  const [pgs, setPgs] = useState<PgSummary[]>([]);
  const [loading, setLoading] = useState(false);

  async function load(coords = fallback) {
    setLoading(true);
    try {
      const response = await api.nearbyPgs(coords);
      setPgs(response.data);
    } finally {
      setLoading(false);
    }
  }

  async function locate() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") return load();
    const position = await Location.getCurrentPositionAsync({});
    await load({ lat: position.coords.latitude, lng: position.coords.longitude });
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>StayNear PG Rentals</Text>
        <Text style={styles.title}>Verified student PGs nearby</Text>
        <View style={styles.actions}>
          <Pressable onPress={locate} style={styles.primaryButton}>
            <Text style={styles.primaryText}>Use location</Text>
          </Pressable>
          <Link href="/login" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Login</Text>
            </Pressable>
          </Link>
        </View>
      </View>
      <FlatList
        data={pgs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>{loading ? "Loading..." : "No PGs found nearby"}</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {item.verified ? <Text style={styles.badge}>Verified</Text> : null}
            </View>
            <Text style={styles.muted}>{item.address}</Text>
            <Text style={styles.price}>{formatCurrencyInr(item.rent)}</Text>
            <View style={styles.row}>
              <Text style={styles.muted}>{item.rooms.available} beds left</Text>
              <Text style={styles.muted}>{item.occupancyRate}% full</Text>
              <Text style={styles.muted}>{item.distanceKm ?? "-"} km</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: designTokens.colors.background },
  header: { padding: 20, gap: 8, backgroundColor: designTokens.colors.surface },
  kicker: { color: designTokens.colors.primary, fontWeight: "800", textTransform: "uppercase", fontSize: 12 },
  title: { color: designTokens.colors.ink, fontSize: 30, fontWeight: "900" },
  actions: { flexDirection: "row", gap: 10, marginTop: 8 },
  primaryButton: { backgroundColor: designTokens.colors.ink, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 11 },
  primaryText: { color: "white", fontWeight: "800" },
  secondaryButton: { borderColor: designTokens.colors.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 11 },
  secondaryText: { color: designTokens.colors.ink, fontWeight: "800" },
  list: { padding: 14, gap: 12 },
  empty: { color: designTokens.colors.muted, padding: 20, textAlign: "center" },
  card: { gap: 8, backgroundColor: designTokens.colors.surface, borderRadius: 8, padding: 14, borderColor: designTokens.colors.border, borderWidth: 1 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10, alignItems: "center" },
  cardTitle: { color: designTokens.colors.ink, fontWeight: "900", fontSize: 18, flex: 1 },
  badge: { color: designTokens.colors.primary, fontWeight: "800" },
  muted: { color: designTokens.colors.muted },
  price: { color: designTokens.colors.ink, fontWeight: "900", fontSize: 20 }
});
