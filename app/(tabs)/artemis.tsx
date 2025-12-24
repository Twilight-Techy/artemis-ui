/**
 * Artemis Main Screen
 * The heart of the app - voice/chat interface with the AI assistant
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArtemisOrb, IntroBoot, MicButton, VoiceWaveform } from '@/components/artemis';
import { useArtemisStore, useSettingsStore } from '@/src/state';
import { useTheme } from '@/src/theme';

const ORB_SIZE = 200;

export default function ArtemisScreen() {
    const { theme } = useTheme();
    const { colors, typography } = theme;
    const insets = useSafeAreaInsets();

    // Settings state
    const hasSeenIntro = useSettingsStore((s) => s.hasSeenIntro);
    const setHasSeenIntro = useSettingsStore((s) => s.setHasSeenIntro);

    // Local state for intro
    const [showIntro, setShowIntro] = useState(!hasSeenIntro);

    // Artemis state
    const artemisState = useArtemisStore((s) => s.state);
    const goIdle = useArtemisStore((s) => s.goIdle);

    // Handle intro completion
    const handleIntroComplete = () => {
        setHasSeenIntro(true);
        setShowIntro(false);
        goIdle();
    };

    // Get state label for display
    const getStateLabel = () => {
        switch (artemisState) {
            case 'IDLE': return 'Hold mic to speak';
            case 'LISTENING': return 'Listening...';
            case 'PROCESSING': return 'Thinking...';
            case 'RESPONDING': return 'Speaking...';
            case 'SUGGESTING': return 'Waiting for your decision';
            case 'EXECUTING': return 'On it...';
            case 'OFFLINE': return 'Offline';
            default: return '';
        }
    };

    // Demo: cycle through states for testing (long press on orb)
    const handleLongPress = () => {
        const states: Array<'IDLE' | 'LISTENING' | 'PROCESSING' | 'RESPONDING' | 'SUGGESTING' | 'EXECUTING' | 'OFFLINE'> = [
            'IDLE', 'LISTENING', 'PROCESSING', 'RESPONDING', 'SUGGESTING', 'EXECUTING', 'OFFLINE'
        ];
        const currentIndex = states.indexOf(artemisState);
        const nextIndex = (currentIndex + 1) % states.length;
        const nextState = states[nextIndex];

        if (nextState === 'IDLE') {
            goIdle();
        } else if (nextState === 'OFFLINE') {
            useArtemisStore.getState().setOffline(true);
        } else {
            useArtemisStore.setState({ state: nextState, previousState: artemisState });
        }
    };

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background.primary,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                }
            ]}
        >
            {/* Intro Boot Sequence */}
            {showIntro && (
                <IntroBoot onComplete={handleIntroComplete} />
            )}

            {/* Header - minimal */}
            <View style={styles.header}>
                <Text
                    style={[
                        styles.headerTitle,
                        {
                            color: colors.text.primary,
                            fontFamily: typography.fonts.heading.semiBold,
                            fontSize: typography.sizes.lg,
                        }
                    ]}
                >
                    Artemis
                </Text>
            </View>

            {/* Main Orb Area */}
            <View style={styles.orbArea}>
                {/* Waveform ring (behind orb) */}
                <VoiceWaveform orbSize={ORB_SIZE} />

                {/* Orb */}
                <Pressable
                    onLongPress={handleLongPress}
                    style={styles.orbPressable}
                >
                    <ArtemisOrb size={ORB_SIZE} />
                </Pressable>

                {/* State indicator */}
                <Text
                    style={[
                        styles.stateLabel,
                        {
                            color: colors.text.secondary,
                            fontFamily: typography.fonts.body.regular,
                            fontSize: typography.sizes.base,
                        }
                    ]}
                >
                    {getStateLabel()}
                </Text>

                {/* Mic Button */}
                <View style={styles.micContainer}>
                    <MicButton size={64} />
                </View>

                {/* Current state badge (for development) */}
                <View
                    style={[
                        styles.stateBadge,
                        {
                            backgroundColor: colors.background.secondary,
                            borderColor: colors.border.subtle,
                        }
                    ]}
                >
                    <Text
                        style={{
                            color: colors.accent.secondary,
                            fontFamily: typography.fonts.mono.regular,
                            fontSize: typography.sizes.xs,
                        }}
                    >
                        {artemisState}
                    </Text>
                </View>
            </View>

            {/* Chat area placeholder */}
            <View style={[styles.chatArea, { backgroundColor: colors.background.secondary }]}>
                <Text
                    style={{
                        color: colors.text.tertiary,
                        fontFamily: typography.fonts.body.regular,
                        fontSize: typography.sizes.sm,
                        textAlign: 'center',
                    }}
                >
                    Chat messages will appear here
                </Text>
            </View>

            {/* Quick instruction */}
            <Text
                style={[
                    styles.hint,
                    {
                        color: colors.text.tertiary,
                        fontFamily: typography.fonts.body.regular,
                        fontSize: typography.sizes.xs,
                    }
                ]}
            >
                Hold mic button to speak • Long press orb to cycle states (dev)
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        alignItems: 'center',
    },
    headerTitle: {
        opacity: 0.9,
    },
    orbArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    orbPressable: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateLabel: {
        marginTop: 24,
        opacity: 0.8,
    },
    micContainer: {
        marginTop: 32,
    },
    stateBadge: {
        marginTop: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
    },
    chatArea: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 16,
        minHeight: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hint: {
        textAlign: 'center',
        paddingBottom: 16,
        opacity: 0.6,
    },
});
