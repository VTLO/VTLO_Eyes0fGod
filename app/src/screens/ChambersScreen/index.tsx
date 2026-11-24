import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { colors, spacing } from '@/theme';
import { CHAMBERS, type ChamberId } from './chambers';
import LiveScreen from '../LiveScreen';
import { ChamberLink } from './ChamberLink';
import { ChamberView } from './ChamberView';

const initialChamber = (): ChamberId => {
  if (typeof window === 'undefined' || !window.location) return 'live';
  const wanted = new URLSearchParams(window.location.search).get('chamber');
  return CHAMBERS.find((c) => c.id === wanted)?.id ?? 'live';
};

export const ChambersScreen = () => {
  const [active, setActive] = useState<ChamberId>(initialChamber);

  const select = (id: ChamberId) => {
    setActive(id);
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', `?chamber=${id}`);
    }
  };
  const chamber = CHAMBERS.find((c) => c.id === active) ?? CHAMBERS[0];

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {CHAMBERS.map((c) => (
          <View key={c.id} style={[styles.cell, c.id === active && styles.tabActive]}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: c.id === active }}
              onPress={() => select(c.id)}
              style={styles.tab}
            >
              <ThemedText style={[styles.tabText, c.id === active && styles.tabTextActive]}>{c.title.toUpperCase()}</ThemedText>
            </Pressable>
            <ChamberLink id={c.id} />
          </View>
        ))}
      </View>
      <ThemedText style={styles.verse}>{chamber.verse}</ThemedText>
      <View style={styles.stage}>
        {chamber.html === null ? <LiveScreen /> : <ChamberView html={chamber.html} />}
      </View>
    </View>
  );
};

export default ChambersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  bar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  cell: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tab: { paddingVertical: spacing.sm },
  tabActive: { borderBottomColor: colors.accent },
  tabText: { color: colors.textSecondary, fontFamily: 'Courier New', fontSize: 12, letterSpacing: 2 },
  tabTextActive: { color: colors.accent },
  verse: { color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center', fontSize: 12, paddingVertical: 6 },
  stage: { flex: 1 },
});
