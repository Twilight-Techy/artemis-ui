import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/src/theme';

export default function TabLayout() {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius } = theme;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent.secondary,
        tabBarInactiveTintColor: colors.text.tertiary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.border.subtle,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 11,
          letterSpacing: 0.4,
        },
      }}
    >
      <Tabs.Screen
        name="artemis"
        options={{
          title: 'Artemis',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : undefined}>
              <IconSymbol
                size={28}
                name="sparkles"
                color={focused ? colors.accent.secondary : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: 'Devices',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name="cpu"
              color={focused ? colors.accent.secondary : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="automations"
        options={{
          title: 'Automations',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name="bolt.fill"
              color={focused ? colors.accent.secondary : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name="gearshape.fill"
              color={focused ? colors.accent.secondary : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    // Subtle glow effect for active tab
  },
});
