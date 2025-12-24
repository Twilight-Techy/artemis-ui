/**
 * Artemis Main Screen
 * The heart of the app - voice/chat interface with the AI assistant
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArtemisOrb } from '@/components/artemis';
import { useArtemisStore } from '@/src/state';
import { useTheme } from '@/src/theme';

export default function ArtemisScreen() {
    const { theme } = useTheme();
    const { colors, typography, spacing } = theme;
    const insets = useSafeAreaInsets();

    // Artemis state
    const artemisState = useArtemisStore((s) => s.state);
    const startListening = useArtemisStore((s) => s.startListening);
    const cancelListening = useArtemisStore((s) => s.cancelListening);
    const stopListening = useArtemisStore((s) => s.stopListening);
    const goIdle = useArtemisStore((s) => s.goIdle);

    // Get state label for display
    const getStateLabel = () => {
        switch (artemisState) {
            case 'IDLE': return 'Tap to speak';
            case 'LISTENING': return 'Listening...';
            case 'PROCESSING': return 'Thinking...';
            case 'RESPONDING': return 'Speaking...';
            case 'SUGGESTING': return 'Waiting for your decision';
            case 'EXECUTING': return 'On it...';
            case 'OFFLINE': return 'Offline';
            default: return '';
        }
    };

    // Handle orb tap
    const handleOrbPress = () => {
        switch (artemisState) {
            case 'IDLE':
                startListening();
                break;
            case 'LISTENING':
                // For demo: simulate stopping with a test message
                stopListening("It's getting hot in here");
                break;
            case 'PROCESSING':
                // Can't interrupt processing
                break;
            case 'RESPONDING':
                // Could skip TTS
                goIdle();
                break;
            case 'SUGGESTING':
                // Tap elsewhere to dismiss, handled by suggestion cards
                break;
            case 'EXECUTING':
                // Can't interrupt execution
                break;
            case 'OFFLINE':
                // Maybe show retry
                break;
        }
    };

    // Demo: cycle through states for testing
    const handleLongPress = () => {
        const states: Array<'IDLE' | 'LISTENING' | 'PROCESSING' | 'RESPONDING' | 'SUGGESTING' | 'EXECUTING' | 'OFFLINE'> = [
            'IDLE', 'LISTENING', 'PROCESSING', 'RESPONDING', 'SUGGESTING', 'EXECUTING', 'OFFLINE'
        ];
        const currentIndex = states.indexOf(artemisState);
        const nextIndex = (currentIndex + 1) % states.length;

        // Use store methods where possible
        const nextState = states[nextIndex];
        switch (nextState) {
            case 'IDLE':
                goIdle();
                break;
            case 'LISTENING':
                if (artemisState === 'IDLE') startListening();
                break;
            case 'OFFLINE':
                useArtemisStore.getState().setOffline(true);
                break;
            default:
                // For demo, directly set state
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
                <Pressable
                    onPress={handleOrbPress}
                    onLongPress={handleLongPress}
                    style={styles.orbPressable}
                >
                    <ArtemisOrb size={220} />
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

            {/* Chat area (placeholder for now) */}
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
                Tap orb to speak • Long press to cycle states (dev)
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
    stateBadge: {
        marginTop: 12,
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
        minHeight: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hint: {
        textAlign: 'center',
        paddingBottom: 16,
        opacity: 0.6,
    },
});
