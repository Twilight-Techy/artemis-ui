/**
 * Artemis Main Screen
 * The heart of the app - voice/chat interface with the AI assistant
 * Layout: 55% orb (top) / 45% chat (bottom)
 * Now powered by MCP events
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArtemisOrb, ChatArea, IntroBoot, MicButton, ReasoningOverlay, VoiceWaveform } from '@/components/artemis';
import { mockEvents, processMCPEvent } from '@/src/mcp';
import { useArtemisStore, useConversationStore, useReasoningStore, useSettingsStore } from '@/src/state';
import { useTheme } from '@/src/theme';

const ORB_SIZE = 180;

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

    // Conversation store
    const addUserMessage = useConversationStore((s) => s.addUserMessage);

    // Reasoning store
    const toggleReasoning = useReasoningStore((s) => s.toggleVisible);

    // Handle intro completion
    const handleIntroComplete = () => {
        setHasSeenIntro(true);
        setShowIntro(false);
        goIdle();
    };

    // Simulate MCP event flow when PROCESSING
    useEffect(() => {
        if (artemisState === 'PROCESSING') {
            // Add fake user message
            const fakeMessages = [
                "Turn on the lights",
                "It's getting hot in here",
                "What's the weather like?",
                "Set a reminder for tomorrow",
            ];
            const randomMessage = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];
            addUserMessage(randomMessage);

            // Simulate MCP thought process
            const thoughtTimer1 = setTimeout(() => {
                processMCPEvent(mockEvents.thought('Analyzing user intent...', 0.7));
            }, 300);

            const thoughtTimer2 = setTimeout(() => {
                processMCPEvent(mockEvents.thought(`Intent detected: "${randomMessage}"`, 0.85));
            }, 700);

            const thoughtTimer3 = setTimeout(() => {
                processMCPEvent(mockEvents.thought('Searching for relevant devices and automations...', 0.9));
            }, 1100);

            // Simulate MCP response
            const responseTimer = setTimeout(() => {
                simulateMCPResponse(randomMessage);
            }, 1500);

            return () => {
                clearTimeout(thoughtTimer1);
                clearTimeout(thoughtTimer2);
                clearTimeout(thoughtTimer3);
                clearTimeout(responseTimer);
            };
        }
    }, [artemisState]);

    // Simulate MCP response based on user input
    const simulateMCPResponse = useCallback((userInput: string) => {
        const input = userInput.toLowerCase();

        if (input.includes('light') || input.includes('dark')) {
            processMCPEvent(mockEvents.message("I can help with the lighting!"));
            setTimeout(() => {
                processMCPEvent(mockEvents.suggestion(
                    "Would you like me to turn on the lights?",
                    'device',
                    'light-living-room'
                ));
            }, 800);
        } else if (input.includes('hot') || input.includes('temperature') || input.includes('fan')) {
            processMCPEvent(mockEvents.message("I can adjust the temperature for you."));
            setTimeout(() => {
                processMCPEvent(mockEvents.suggestion(
                    "Would you like me to turn on the fan?",
                    'device',
                    'fan-main'
                ));
            }, 800);
        } else {
            processMCPEvent(mockEvents.message("I understand. How can I help you with that?"));
            setTimeout(() => goIdle(), 1500);
        }
    }, [goIdle]);

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

    // Dev: Long press to toggle reasoning panel
    const handleToggleReasoning = () => {
        toggleReasoning();
    };

    // Dev: Double tap to clear conversation
    const handleClearChat = () => {
        useConversationStore.getState().clearConversation();
        useReasoningStore.getState().clearThoughts();
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
            <Pressable
                onPress={handleToggleReasoning}
                onLongPress={handleClearChat}
                delayLongPress={1000}
            >
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
                    <Text
                        style={[
                            styles.headerHint,
                            { color: colors.text.tertiary }
                        ]}
                    >
                        tap for insight
                    </Text>
                </View>
            </Pressable>

            {/* Main Orb Area - 55% of remaining height */}
            <View style={styles.orbArea}>
                {/* Waveform ring (behind orb) */}
                <VoiceWaveform orbSize={ORB_SIZE} />

                {/* Orb */}
                <Pressable onPress={handleReplayIntro}>
                    <View style={styles.orbWrapper}>
                        <ArtemisOrb size={ORB_SIZE} />
                    </View>
                </Pressable>

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

            {/* Reasoning Overlay */}
            <ReasoningOverlay />
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
    headerHint: {
        fontSize: 10,
        marginTop: 2,
        opacity: 0.5,
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
