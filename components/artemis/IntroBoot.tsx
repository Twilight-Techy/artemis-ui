/**
 * IntroBoot Component
 * Boot sequence animation: dark → dot → orb → IDLE
 * Plays once on first launch
 */

import { useColors } from '@/src/theme';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ORB_SIZE = 200;

interface IntroBootProps {
    onComplete: () => void;
}

export function IntroBoot({ onComplete }: IntroBootProps) {
    const colors = useColors();

    // Animation progress (0 = start, 1 = complete)
    const progress = useSharedValue(0);
    const dotOpacity = useSharedValue(0);
    const dotScale = useSharedValue(0.05); // Start as tiny dot
    const glowOpacity = useSharedValue(0);

    // Orb colors
    const orbColors = {
        deepPurple: colors.glow.primary,
        mediumPurple: '#8B5CC7',
        lightPurple: '#AB7EE0',
    };

    useEffect(() => {
        // Boot sequence timing
        // Phase 1: Dot fades in (0-400ms)
        dotOpacity.value = withTiming(1, {
            duration: 400,
            easing: Easing.out(Easing.ease)
        });

        // Phase 2: Hold as dot (400-600ms) then expand (600-1400ms)
        dotScale.value = withDelay(
            400,
            withSequence(
                withTiming(0.08, { duration: 200 }), // Slight pulse
                withTiming(1, {
                    duration: 800,
                    easing: Easing.bezier(0.16, 1, 0.3, 1) // Smooth expansion
                })
            )
        );

        // Phase 3: Glow stabilizes (1200-1800ms)
        glowOpacity.value = withDelay(
            1000,
            withTiming(1, {
                duration: 600,
                easing: Easing.inOut(Easing.ease)
            })
        );

        // Phase 4: Complete (at 2000ms)
        progress.value = withDelay(
            2000,
            withTiming(1, {
                duration: 100
            }, (finished) => {
                if (finished) {
                    runOnJS(onComplete)();
                }
            })
        );
    }, []);

    // Animated styles
    const containerStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 0.8, 1], [1, 1, 0]),
    }));

    const orbContainerStyle = useAnimatedStyle(() => ({
        opacity: dotOpacity.value,
        transform: [{ scale: dotScale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value * 0.4,
        transform: [{ scale: 1 + glowOpacity.value * 0.15 }],
    }));

    return (
        <Animated.View style={[styles.container, { backgroundColor: colors.background.primary }, containerStyle]}>
            {/* Glow layer behind orb */}
            <Animated.View style={[styles.glowContainer, glowStyle]}>
                <View
                    style={[
                        styles.glow,
                        {
                            backgroundColor: orbColors.deepPurple,
                            shadowColor: orbColors.deepPurple,
                        }
                    ]}
                />
            </Animated.View>

            {/* Main orb */}
            <Animated.View style={[styles.orbContainer, orbContainerStyle]}>
                <Svg width={ORB_SIZE} height={ORB_SIZE} viewBox="0 0 100 100">
                    <Defs>
                        {/* Water-like core gradient */}
                        <RadialGradient id="bootWaterCore" cx="50%" cy="55%" r="55%">
                            <Stop offset="0%" stopColor={orbColors.lightPurple} stopOpacity="0.2" />
                            <Stop offset="20%" stopColor={orbColors.mediumPurple} stopOpacity="0.3" />
                            <Stop offset="45%" stopColor={orbColors.deepPurple} stopOpacity="0.5" />
                            <Stop offset="75%" stopColor="#1A1025" stopOpacity="0.75" />
                            <Stop offset="100%" stopColor="#0D0815" stopOpacity="0.9" />
                        </RadialGradient>

                        {/* Glassy edge gradient */}
                        <RadialGradient id="bootGlassyEdge" cx="50%" cy="50%" r="50%">
                            <Stop offset="75%" stopColor="transparent" stopOpacity="0" />
                            <Stop offset="88%" stopColor={orbColors.mediumPurple} stopOpacity="0.4" />
                            <Stop offset="95%" stopColor={orbColors.lightPurple} stopOpacity="0.6" />
                            <Stop offset="100%" stopColor={orbColors.lightPurple} stopOpacity="0.3" />
                        </RadialGradient>

                        {/* Inner depth glow */}
                        <RadialGradient id="bootDepthGlow" cx="50%" cy="55%" r="40%">
                            <Stop offset="0%" stopColor={orbColors.lightPurple} stopOpacity="0.25" />
                            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>

                    {/* Glassy edge */}
                    <Circle cx="50" cy="50" r="46" fill="url(#bootGlassyEdge)" />

                    {/* Main orb body */}
                    <Circle cx="50" cy="50" r="46" fill="url(#bootWaterCore)" />

                    {/* Inner glow */}
                    <Circle cx="50" cy="50" r="35" fill="url(#bootDepthGlow)" />
                </Svg>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    glowContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    glow: {
        width: ORB_SIZE * 1.5,
        height: ORB_SIZE * 1.5,
        borderRadius: ORB_SIZE * 0.75,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 60,
    },
    orbContainer: {
        width: ORB_SIZE,
        height: ORB_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default IntroBoot;
