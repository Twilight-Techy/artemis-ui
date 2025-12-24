/**
 * MicButton Component
 * Press-to-talk microphone button with animated states
 */

import { useArtemisStore } from '@/src/state';
import { useColors } from '@/src/theme';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

const BUTTON_SIZE = 64;

interface MicButtonProps {
    disabled?: boolean;
    size?: number;
}

export function MicButton({ disabled = false, size = BUTTON_SIZE }: MicButtonProps) {
    const colors = useColors();
    const startListening = useArtemisStore((s) => s.startListening);
    const startProcessing = useArtemisStore((s) => s.startProcessing);
    const artemisState = useArtemisStore((s) => s.state);

    // Animation values
    const pressScale = useSharedValue(1);
    const glowIntensity = useSharedValue(0);
    const pulseScale = useSharedValue(1);

    // Determine if mic should be active
    const isListening = artemisState === 'LISTENING';
    const isDisabled = disabled || ['PROCESSING', 'RESPONDING', 'EXECUTING', 'OFFLINE'].includes(artemisState);

    // Colors
    const buttonColors = {
        idle: colors.glow.primary,
        active: colors.glow.secondary,
        disabled: colors.text.tertiary,
    };

    // Start listening animation
    const startListeningAnimation = useCallback(() => {
        glowIntensity.value = withTiming(1, { duration: 200 });
        pulseScale.value = withRepeat(
            withSequence(
                withTiming(1.15, { duration: 600, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    // Stop listening animation
    const stopListeningAnimation = useCallback(() => {
        glowIntensity.value = withTiming(0, { duration: 300 });
        pulseScale.value = withTiming(1, { duration: 200 });
    }, []);

    // Handle press in
    const handlePressIn = useCallback(() => {
        if (isDisabled) return;

        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Visual feedback
        pressScale.value = withTiming(0.92, { duration: 100 });

        // State change
        startListening();
        startListeningAnimation();
    }, [isDisabled, startListening, startListeningAnimation]);

    // Handle press out
    const handlePressOut = useCallback(() => {
        if (isDisabled) return;

        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Visual feedback
        pressScale.value = withTiming(1, { duration: 150 });

        // State change
        startProcessing();
        stopListeningAnimation();
    }, [isDisabled, startProcessing, stopListeningAnimation]);

    // Animated styles
    const containerStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: pressScale.value * pulseScale.value },
        ],
        opacity: isDisabled ? 0.4 : 1,
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: interpolate(glowIntensity.value, [0, 1], [0.3, 0.8]),
        transform: [{ scale: interpolate(glowIntensity.value, [0, 1], [1, 1.3]) }],
    }));

    const currentColor = isDisabled
        ? buttonColors.disabled
        : isListening
            ? buttonColors.active
            : buttonColors.idle;

    return (
        <View style={styles.wrapper}>
            {/* Glow effect behind button */}
            <Animated.View style={[styles.glowContainer, glowStyle]}>
                <View
                    style={[
                        styles.glow,
                        {
                            backgroundColor: currentColor,
                            shadowColor: currentColor,
                            width: size * 1.8,
                            height: size * 1.8,
                            borderRadius: size * 0.9,
                        }
                    ]}
                />
            </Animated.View>

            {/* Button */}
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isDisabled}
                style={styles.pressable}
            >
                <Animated.View style={[styles.buttonContainer, { width: size, height: size }, containerStyle]}>
                    <Svg width={size} height={size} viewBox="0 0 64 64">
                        <Defs>
                            {/* Button gradient */}
                            <RadialGradient id="micButtonGradient" cx="50%" cy="40%" r="60%">
                                <Stop offset="0%" stopColor={isListening ? '#7DD3FC' : '#C4A7E7'} stopOpacity="1" />
                                <Stop offset="100%" stopColor={currentColor} stopOpacity="1" />
                            </RadialGradient>

                            {/* Button shadow/depth */}
                            <RadialGradient id="micButtonDepth" cx="50%" cy="70%" r="50%">
                                <Stop offset="0%" stopColor="transparent" stopOpacity="0" />
                                <Stop offset="100%" stopColor="#000" stopOpacity="0.3" />
                            </RadialGradient>
                        </Defs>

                        {/* Button circle */}
                        <Circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="url(#micButtonGradient)"
                        />

                        {/* Depth overlay */}
                        <Circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="url(#micButtonDepth)"
                        />

                        {/* Mic icon */}
                        <Path
                            d="M32 10c-3.3 0-6 2.7-6 6v12c0 3.3 2.7 6 6 6s6-2.7 6-6V16c0-3.3-2.7-6-6-6z"
                            fill="white"
                            opacity={isDisabled ? 0.5 : 0.95}
                        />
                        <Path
                            d="M42 28c0 5.5-4.5 10-10 10s-10-4.5-10-10h-2c0 6.4 4.9 11.7 11 12.4V46h-4v2h10v-2h-4v-5.6c6.1-0.7 11-6 11-12.4h-2z"
                            fill="white"
                            opacity={isDisabled ? 0.5 : 0.95}
                        />

                        {/* Highlight */}
                        <Circle
                            cx="26"
                            cy="24"
                            r="4"
                            fill="white"
                            opacity={0.3}
                        />
                    </Svg>
                </Animated.View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressable: {
        zIndex: 2,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    glowContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    glow: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
    },
});

export default MicButton;
