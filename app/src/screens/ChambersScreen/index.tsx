import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { colors, spacing } from '@/theme';
import { CHAMBERS, type ChamberId } from './chambers';
import { ChamberView } from './ChamberView';

export const ChambersScreen = () => {
  const [active, setActive] = useState<ChamberId>('observatory');
  const chamber = CHAMBERS.find((c) => c.id === active) ?? CHAMBERS[0];

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {CHAMBERS.map((c) => (
          <Pressable
            key={c.id}
            accessibilityRole="button"
            accessibilityState={{ selected: c.id === active }}
            onPress={() => setActive(c.id)}
            style={[styles.tab, c.id === active && styles.tabActive]}
          >
            <ThemedText style={[styles.tabText, c.id === active && styles.tabTextActive]}>{c.title.toUpperCase()}</ThemedText>
          </Pressable>
        ))}
      </View>
      <ThemedText style={styles.verse}>{chamber.verse}</ThemedText>
      <View style={styles.stage}>
        <ChamberView html={chamber.html} />
      </View>
    </View>
  );
};

export default ChambersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  bar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.accent },
  tabText: { color: colors.textSecondary, fontFamily: 'Courier New', fontSize: 12, letterSpacing: 2 },
  tabTextActive: { color: colors.accent },
  verse: { color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center', fontSize: 12, paddingVertical: 6 },
  stage: { flex: 1 },
});
