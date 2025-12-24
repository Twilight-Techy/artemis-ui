/**
 * Artemis Main Screen
 * The heart of the app - voice/chat interface with the AI assistant
 * Layout: 60% orb (top) / 40% chat (bottom)
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArtemisOrb, ChatArea, IntroBoot, MicButton, VoiceWaveform } from '@/components/artemis';
import { useArtemisStore, useConversationStore, useSettingsStore } from '@/src/state';
import { useTheme } from '@/src/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ORB_SIZE = 180;

// Fake conversation responses for demo
const DEMO_RESPONSES: Record<string, { response: string; suggestion?: { content: string; actionType: 'device' | 'automation' | 'function'; targetId: string } }> = {
    default: {
        response: "I understand. How can I help you with that?",
    },
    light: {
        response: "I can help with that!",
        suggestion: {
            content: "Would you like me to turn on the lights?",
            actionType: 'device',
            targetId: 'light-living-room',
        },
    },
    dark: {
        response: "I noticed it's getting dark.",
        suggestion: {
            content: "Should I turn on the ambient lighting?",
            actionType: 'device',
            targetId: 'light-ambient',
        },
    },
    hot: {
        response: "I can adjust the temperature for you.",
        suggestion: {
            content: "Would you like me to turn on the fan?",
            actionType: 'device',
            targetId: 'fan-main',
        },
    },
};

export default function ArtemisScreen() {
    const { theme } = useTheme();
    const { colors, typography } = theme;
    const insets = useSafeAreaInsets();

    // Settings state
    const hasSeenIntro = useSettingsStore((s) => s.hasSeenIntro);
    const setHasSeenIntro = useSettingsStore((s) => s.setHasSeenIntro);

    // Local state for intro
    const [showIntro, setShowIntro] = useState(true);

    // Wait for store to hydrate
    useEffect(() => {
        if (hasSeenIntro) {
            setShowIntro(false);
        }
    }, [hasSeenIntro]);

    // Artemis state
    const artemisState = useArtemisStore((s) => s.state);
    const goIdle = useArtemisStore((s) => s.goIdle);
    const startResponding = useArtemisStore((s) => s.startResponding);

    // Conversation store
    const addUserMessage = useConversationStore((s) => s.addUserMessage);
    const addAssistantMessage = useConversationStore((s) => s.addAssistantMessage);
    const addSuggestion = useConversationStore((s) => s.addSuggestion);

    // Handle intro completion
    const handleIntroComplete = () => {
        setHasSeenIntro(true);
        setShowIntro(false);
        goIdle();
    };

    // Simulate conversation flow when PROCESSING ends
    useEffect(() => {
        if (artemisState === 'PROCESSING') {
            // Simulate thinking delay
            const timer = setTimeout(() => {
                simulateResponse();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [artemisState]);

    // Simulate AI response
    const simulateResponse = useCallback(() => {
        // Pick a random response type
        const types = Object.keys(DEMO_RESPONSES);
        const randomType = types[Math.floor(Math.random() * types.length)];
        const demo = DEMO_RESPONSES[randomType];

        // Add assistant message
        addAssistantMessage(demo.response);
        startResponding(demo.response);

        // If there's a suggestion, add it after a short delay
        if (demo.suggestion) {
            setTimeout(() => {
                addSuggestion(demo.suggestion!.content, {
                    actionType: demo.suggestion!.actionType,
                    targetId: demo.suggestion!.targetId,
                });
            }, 800);
        } else {
            // No suggestion, go idle after speaking
            setTimeout(() => {
                goIdle();
            }, 1500);
        }
    }, [addAssistantMessage, addSuggestion, startResponding, goIdle]);

    // Handle mic release - add user message
    useEffect(() => {
        if (artemisState === 'PROCESSING') {
            // Add fake user message when processing starts
            const fakeMessages = [
                "Turn on the lights",
                "It's getting hot in here",
                "What's the weather like?",
                "Set a reminder for tomorrow",
            ];
            const randomMessage = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];
            addUserMessage(randomMessage);
        }
    }, [artemisState]);

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

    // Dev: Replay intro when header is tapped
    const handleReplayIntro = () => {
        setHasSeenIntro(false);
        setShowIntro(true);
    };

    // Dev: Long press to clear conversation
    const handleClearChat = () => {
        useConversationStore.getState().clearConversation();
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
            <Pressable onPress={handleReplayIntro} onLongPress={handleClearChat}>
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
            </Pressable>

            {/* Main Orb Area - 55% of remaining height */}
            <View style={styles.orbArea}>
                {/* Waveform ring (behind orb) */}
                <VoiceWaveform orbSize={ORB_SIZE} />

                {/* Orb */}
                <View style={styles.orbWrapper}>
                    <ArtemisOrb size={ORB_SIZE} />
                </View>

                {/* State indicator */}
                <Text
                    style={[
                        styles.stateLabel,
                        {
                            color: colors.text.secondary,
                            fontFamily: typography.fonts.body.regular,
                            fontSize: typography.sizes.sm,
                        }
                    ]}
                >
                    {getStateLabel()}
                </Text>

                {/* Mic Button */}
                <View style={styles.micContainer}>
                    <MicButton size={56} />
                </View>
            </View>

            {/* Chat Area - 45% with glassmorphism */}
            <View style={styles.chatOuterContainer}>
                {/* Glass effect background */}
                <View
                    style={[
                        styles.glassBackground,
                        { backgroundColor: 'rgba(20, 15, 30, 0.7)' }
                    ]}
                />
                {/* Subtle top glow */}
                <View
                    style={[
                        styles.glassGlow,
                        { backgroundColor: colors.glow.primary }
                    ]}
                />
                {/* Glass border */}
                <View
                    style={[
                        styles.glassBorder,
                        { borderColor: 'rgba(139, 92, 199, 0.2)' }
                    ]}
                />
                {/* Chat content */}
                <View style={styles.chatContent}>
                    <ChatArea />
                    {/* Top fade for roll-out effect */}
                    <View
                        style={[
                            styles.topFadeOverlay,
                            { backgroundColor: 'rgba(20, 15, 30, 0.9)' }
                        ]}
                        pointerEvents="none"
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        alignItems: 'center',
    },
    headerTitle: {
        opacity: 0.9,
    },
    orbArea: {
        flex: 0.55,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orbWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateLabel: {
        marginTop: 16,
        opacity: 0.7,
    },
    micContainer: {
        marginTop: 20,
    },
    chatOuterContainer: {
        flex: 0.45,
        position: 'relative',
        overflow: 'hidden',
    },
    glassBackground: {
        ...StyleSheet.absoluteFillObject,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
    },
    glassGlow: {
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: 1,
        opacity: 0.4,
        borderRadius: 1,
    },
    glassBorder: {
        ...StyleSheet.absoluteFillObject,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderWidth: 1,
        borderBottomWidth: 0,
        pointerEvents: 'none',
    },
    chatContent: {
        flex: 1,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        overflow: 'hidden',
    },
    topFadeOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 40,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
    },
});
