/**
 * VoiceWaveform Component
 * Circular waveform ring that appears around the orb during LISTENING state
 */

import { useArtemisStore } from '@/src/state';
import { useColors } from '@/src/theme';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    Easing,
    cancelAnimation,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

interface VoiceWaveformProps {
    orbSize: number;
}

export function VoiceWaveform({ orbSize }: VoiceWaveformProps) {
    const colors = useColors();
    const artemisState = useArtemisStore((s) => s.state);
    const voiceAmplitude = useArtemisStore((s) => s.voice.amplitude);

    const isListening = artemisState === 'LISTENING';

    // Animation values
    const visibility = useSharedValue(0);
    const ring1Scale = useSharedValue(1);
    const ring2Scale = useSharedValue(1);
    const ring3Scale = useSharedValue(1);
    const ring1Opacity = useSharedValue(0.6);
    const ring2Opacity = useSharedValue(0.4);
    const ring3Opacity = useSharedValue(0.2);

    // Ring sizes relative to orb
    const ring1Size = orbSize * 1.15;
    const ring2Size = orbSize * 1.3;
    const ring3Size = orbSize * 1.45;

    // Colors
    const waveColors = {
        primary: colors.glow.primary,
        secondary: colors.glow.secondary,
        light: '#AB7EE0',
    };

    useEffect(() => {
        if (isListening) {
            // Fade in
            visibility.value = withTiming(1, { duration: 200 });

            // Ring 1 - fastest, closest
            ring1Scale.value = withRepeat(
                withSequence(
                    withTiming(1.08, { duration: 400, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
            ring1Opacity.value = withRepeat(
                withSequence(
                    withTiming(0.8, { duration: 400 }),
                    withTiming(0.5, { duration: 400 })
                ),
                -1,
                true
            );

            // Ring 2 - medium
            ring2Scale.value = withRepeat(
                withSequence(
                    withTiming(1.06, { duration: 500, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
            ring2Opacity.value = withRepeat(
                withSequence(
                    withTiming(0.6, { duration: 500 }),
                    withTiming(0.3, { duration: 500 })
                ),
                -1,
                true
            );

            // Ring 3 - slowest, outermost
            ring3Scale.value = withRepeat(
                withSequence(
                    withTiming(1.04, { duration: 600, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
            ring3Opacity.value = withRepeat(
                withSequence(
                    withTiming(0.4, { duration: 600 }),
                    withTiming(0.15, { duration: 600 })
                ),
                -1,
                true
            );
        } else {
            // Fade out and reset
            visibility.value = withTiming(0, { duration: 300 });

            // Cancel animations
            cancelAnimation(ring1Scale);
            cancelAnimation(ring2Scale);
            cancelAnimation(ring3Scale);
            cancelAnimation(ring1Opacity);
            cancelAnimation(ring2Opacity);
            cancelAnimation(ring3Opacity);

            // Reset to default
            ring1Scale.value = withTiming(1, { duration: 300 });
            ring2Scale.value = withTiming(1, { duration: 300 });
            ring3Scale.value = withTiming(1, { duration: 300 });
        }
    }, [isListening]);

    // Animated styles
    const containerStyle = useAnimatedStyle(() => ({
        opacity: visibility.value,
        pointerEvents: visibility.value > 0 ? 'auto' : 'none',
    }));

    const ring1Style = useAnimatedStyle(() => ({
        transform: [{ scale: ring1Scale.value }],
        opacity: ring1Opacity.value,
    }));

    const ring2Style = useAnimatedStyle(() => ({
        transform: [{ scale: ring2Scale.value }],
        opacity: ring2Opacity.value,
    }));

    const ring3Style = useAnimatedStyle(() => ({
        transform: [{ scale: ring3Scale.value }],
        opacity: ring3Opacity.value,
    }));

    const renderRing = (ringSize: number, style: any, color: string, strokeWidth: number) => (
        <Animated.View
            style={[
                styles.ringContainer,
                { width: ringSize, height: ringSize },
                style
            ]}
        >
            <Svg width={ringSize} height={ringSize} viewBox="0 0 100 100">
                <Defs>
                    <RadialGradient id={`ringGradient_${ringSize}`} cx="50%" cy="50%" r="50%">
                        <Stop offset="85%" stopColor="transparent" stopOpacity="0" />
                        <Stop offset="95%" stopColor={color} stopOpacity="0.8" />
                        <Stop offset="100%" stopColor={color} stopOpacity="0.3" />
                    </RadialGradient>
                </Defs>
                <Circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    opacity={0.6}
                />
            </Svg>
        </Animated.View>
    );

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            {/* Ring 3 - outermost */}
            {renderRing(ring3Size, ring3Style, waveColors.light, 1)}

            {/* Ring 2 - middle */}
            {renderRing(ring2Size, ring2Style, waveColors.primary, 1.5)}

            {/* Ring 1 - innermost */}
            {renderRing(ring1Size, ring1Style, waveColors.secondary, 2)}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
    },
    ringContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default VoiceWaveform;
