/**
 * ArtemisOrb Component
 * 
 * A sophisticated, glass-like energy orb that represents Artemis AI.
 * Features layered ribbons, gradients, and state-reactive animations.
 * 
 * States:
 * - IDLE: Slow breathing glow, soft inner pulse
 * - LISTENING: Outer rings expand/contract to voice amplitude  
 * - PROCESSING: Inner particles swirl inward, rotation
 * - RESPONDING: Pulse synced to speech rhythm
 * - SUGGESTING: Brighter glow
 * - EXECUTING: Brief energy surge outward
 * - OFFLINE: Dimmed, reduced motion
 */

import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    cancelAnimation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import Svg, {
    Circle,
    Defs,
    Ellipse,
    G,
    LinearGradient,
    Path,
    RadialGradient,
    Stop,
} from 'react-native-svg';

import { stateToOrbBehavior, useArtemisStore } from '@/src/state';
import { useTheme } from '@/src/theme';

// ============================================================================
// Types
// ============================================================================

interface ArtemisOrbProps {
    size?: number;
    style?: ViewStyle;
}

// Animated SVG components
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedPath = Animated.createAnimatedComponent(Path);

// ============================================================================
// Ribbon Path Data - Creates the flowing glass-like curves
// ============================================================================

// These paths create the organic, flowing ribbon effect seen in the reference
const ribbonPaths = {
    // Main outer ribbon - flows around the orb
    outer1: `M 50,5 
    C 80,5 95,25 95,50 
    C 95,75 80,95 50,95 
    C 20,95 5,75 5,50 
    C 5,25 20,5 50,5`,

    // Inner ribbon - creates depth
    inner1: `M 50,15 
    Q 75,20 80,50 
    Q 75,80 50,85 
    Q 25,80 20,50 
    Q 25,20 50,15`,

    // Accent ribbon - adds visual interest
    accent1: `M 30,20 
    Q 60,15 75,40 
    Q 80,60 60,80 
    Q 40,85 25,65 
    Q 15,45 30,20`,

    // Secondary flowing ribbon
    flow1: `M 20,40 
    Q 35,25 55,30 
    Q 75,35 80,55 
    Q 78,75 55,78 
    Q 35,80 22,60 
    Q 18,50 20,40`,

    // Tertiary ribbon for added depth
    flow2: `M 70,25 
    Q 85,40 82,60 
    Q 78,80 55,82 
    Q 30,78 25,55 
    Q 22,35 40,25 
    Q 55,18 70,25`,
};

// ============================================================================
// Component
// ============================================================================

export function ArtemisOrb({ size = 200, style }: ArtemisOrbProps) {
    const { theme } = useTheme();
    const { colors } = theme;

    // Get current state from store
    const artemisState = useArtemisStore((s) => s.state);
    const voiceAmplitude = useArtemisStore((s) => s.voice.amplitude);

    // Animation values
    const breatheScale = useSharedValue(1);
    const rotateAngle = useSharedValue(0);
    const pulseOpacity = useSharedValue(0.6);
    const glowIntensity = useSharedValue(1);
    const ribbonOffset = useSharedValue(0);

    // Get orb behavior based on state
    const orbBehavior = useMemo(() => stateToOrbBehavior[artemisState], [artemisState]);

    // ============================================================================
    // Animation Effects based on State
    // ============================================================================

    useEffect(() => {
        // Cancel previous animations
        cancelAnimation(breatheScale);
        cancelAnimation(rotateAngle);
        cancelAnimation(pulseOpacity);
        cancelAnimation(glowIntensity);
        cancelAnimation(ribbonOffset);

        switch (artemisState) {
            case 'IDLE':
                // Slow, peaceful breathing
                breatheScale.value = withRepeat(
                    withSequence(
                        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
                    ),
                    -1,
                    true
                );
                pulseOpacity.value = withRepeat(
                    withSequence(
                        withTiming(0.8, { duration: 2000 }),
                        withTiming(0.6, { duration: 2000 })
                    ),
                    -1,
                    true
                );
                rotateAngle.value = withRepeat(
                    withTiming(360, { duration: 60000, easing: Easing.linear }),
                    -1,
                    false
                );
                glowIntensity.value = withTiming(1, { duration: 500 });
                break;

            case 'LISTENING':
                // More active, responsive to voice
                breatheScale.value = withRepeat(
                    withSequence(
                        withTiming(1.08, { duration: 300 }),
                        withTiming(1.02, { duration: 300 })
                    ),
                    -1,
                    true
                );
                pulseOpacity.value = withRepeat(
                    withSequence(
                        withTiming(1, { duration: 200 }),
                        withTiming(0.7, { duration: 200 })
                    ),
                    -1,
                    true
                );
                rotateAngle.value = withRepeat(
                    withTiming(360, { duration: 20000, easing: Easing.linear }),
                    -1,
                    false
                );
                glowIntensity.value = withTiming(1.3, { duration: 300 });
                break;

            case 'PROCESSING':
                // Swirling, thinking motion
                breatheScale.value = withRepeat(
                    withSequence(
                        withTiming(1.02, { duration: 500 }),
                        withTiming(0.98, { duration: 500 })
                    ),
                    -1,
                    true
                );
                rotateAngle.value = withRepeat(
                    withTiming(360, { duration: 3000, easing: Easing.linear }),
                    -1,
                    false
                );
                pulseOpacity.value = withRepeat(
                    withSequence(
                        withTiming(0.9, { duration: 300 }),
                        withTiming(0.5, { duration: 300 })
                    ),
                    -1,
                    true
                );
                glowIntensity.value = withTiming(1.1, { duration: 200 });
                ribbonOffset.value = withRepeat(
                    withTiming(1, { duration: 2000, easing: Easing.linear }),
                    -1,
                    false
                );
                break;

            case 'RESPONDING':
                // Rhythmic pulse
                breatheScale.value = withRepeat(
                    withSequence(
                        withTiming(1.06, { duration: 400 }),
                        withTiming(1, { duration: 400 })
                    ),
                    -1,
                    true
                );
                pulseOpacity.value = withRepeat(
                    withSequence(
                        withTiming(1, { duration: 300 }),
                        withTiming(0.6, { duration: 300 })
                    ),
                    -1,
                    true
                );
                rotateAngle.value = withRepeat(
                    withTiming(360, { duration: 30000, easing: Easing.linear }),
                    -1,
                    false
                );
                glowIntensity.value = withTiming(1.2, { duration: 300 });
                break;

            case 'SUGGESTING':
                // Gentle glow, awaiting
                breatheScale.value = withRepeat(
                    withSequence(
                        withTiming(1.04, { duration: 1500 }),
                        withTiming(1, { duration: 1500 })
                    ),
                    -1,
                    true
                );
                pulseOpacity.value = withTiming(0.9, { duration: 500 });
                glowIntensity.value = withRepeat(
                    withSequence(
                        withTiming(1.4, { duration: 1000 }),
                        withTiming(1.2, { duration: 1000 })
                    ),
                    -1,
                    true
                );
                break;

            case 'EXECUTING':
                // Energy burst
                breatheScale.value = withSequence(
                    withSpring(1.15, { damping: 8 }),
                    withTiming(1.05, { duration: 500 }),
                    withRepeat(
                        withSequence(
                            withTiming(1.08, { duration: 200 }),
                            withTiming(1.02, { duration: 200 })
                        ),
                        -1,
                        true
                    )
                );
                glowIntensity.value = withSequence(
                    withTiming(1.8, { duration: 200 }),
                    withTiming(1.3, { duration: 300 })
                );
                pulseOpacity.value = withTiming(1, { duration: 200 });
                break;

            case 'OFFLINE':
                // Dimmed, slow
                breatheScale.value = withRepeat(
                    withSequence(
                        withTiming(1.02, { duration: 4000 }),
                        withTiming(1, { duration: 4000 })
                    ),
                    -1,
                    true
                );
                glowIntensity.value = withTiming(0.4, { duration: 1000 });
                pulseOpacity.value = withTiming(0.3, { duration: 1000 });
                rotateAngle.value = withRepeat(
                    withTiming(360, { duration: 120000, easing: Easing.linear }),
                    -1,
                    false
                );
                break;
        }
    }, [artemisState]);

    // Voice amplitude effect (for LISTENING state)
    useEffect(() => {
        if (artemisState === 'LISTENING') {
            // Scale ribbons based on voice amplitude
            const amplitudeScale = 1 + (voiceAmplitude * 0.15);
            breatheScale.value = withSpring(amplitudeScale, { damping: 15, stiffness: 300 });
        }
    }, [voiceAmplitude, artemisState]);

    // ============================================================================
    // Animated Styles
    // ============================================================================

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: breatheScale.value }],
    }));

    const rotatingGroupStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotateAngle.value}deg` }],
    }));

    const glowAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(glowIntensity.value, [0, 1, 2], [0.2, 0.6, 1]),
        transform: [{ scale: glowIntensity.value }],
    }));

    // ============================================================================
    // Color Palette (purple-first with accents)
    // ============================================================================

    const orbColors = {
        // Core purple gradients
        deepPurple: colors.glow.primary,
        mediumPurple: '#8B5CC7',
        lightPurple: '#AB7EE0',

        // Electric blue accents
        electricBlue: colors.glow.secondary,
        lightBlue: '#5A9EF7',

        // Warm accents (amber/gold)
        warmAccent: '#F59E0B',
        softGold: '#FBBF24',

        // Glass/reflection colors
        glassWhite: 'rgba(255, 255, 255, 0.3)',
        glassHighlight: 'rgba(255, 255, 255, 0.15)',
    };

    // ============================================================================
    // Render
    // ============================================================================

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            {/* Main Orb Container */}
            <Animated.View style={[styles.orbContainer, containerAnimatedStyle]}>
                <Svg
                    width={size}
                    height={size}
                    viewBox="0 0 100 100"
                >
                    <Defs>
                        {/* Main orb gradient - deep purple core */}
                        <RadialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor={orbColors.lightPurple} stopOpacity="0.4" />
                            <Stop offset="30%" stopColor={orbColors.mediumPurple} stopOpacity="0.6" />
                            <Stop offset="60%" stopColor={orbColors.deepPurple} stopOpacity="0.85" />
                            <Stop offset="100%" stopColor="#0D0815" stopOpacity="1" />
                        </RadialGradient>

                        {/* Glass depth gradient - creates 3D sphere illusion */}
                        <RadialGradient id="glassDepth" cx="35%" cy="35%" r="65%">
                            <Stop offset="0%" stopColor={orbColors.lightPurple} stopOpacity="0.5" />
                            <Stop offset="40%" stopColor={orbColors.mediumPurple} stopOpacity="0.2" />
                            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </RadialGradient>

                        {/* Inner glow - soft center light */}
                        <RadialGradient id="innerGlow" cx="50%" cy="50%" r="40%">
                            <Stop offset="0%" stopColor={orbColors.lightPurple} stopOpacity="0.7" />
                            <Stop offset="50%" stopColor={orbColors.mediumPurple} stopOpacity="0.3" />
                            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </RadialGradient>

                        {/* Top highlight - glass reflection */}
                        <LinearGradient id="topHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor="white" stopOpacity="0.5" />
                            <Stop offset="30%" stopColor="white" stopOpacity="0.2" />
                            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </LinearGradient>

                        {/* Secondary highlight */}
                        <LinearGradient id="secondaryHighlight" x1="100%" y1="100%" x2="0%" y2="0%">
                            <Stop offset="0%" stopColor={orbColors.electricBlue} stopOpacity="0.3" />
                            <Stop offset="50%" stopColor={orbColors.lightBlue} stopOpacity="0.1" />
                            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </LinearGradient>

                        {/* Edge rim light */}
                        <RadialGradient id="rimLight" cx="50%" cy="50%" r="50%">
                            <Stop offset="85%" stopColor="transparent" stopOpacity="0" />
                            <Stop offset="95%" stopColor={orbColors.lightPurple} stopOpacity="0.4" />
                            <Stop offset="100%" stopColor={orbColors.mediumPurple} stopOpacity="0.6" />
                        </RadialGradient>

                        {/* Subtle blue accent rim */}
                        <RadialGradient id="blueRim" cx="70%" cy="70%" r="50%">
                            <Stop offset="80%" stopColor="transparent" stopOpacity="0" />
                            <Stop offset="100%" stopColor={orbColors.electricBlue} stopOpacity="0.3" />
                        </RadialGradient>
                    </Defs>

                    {/* Base orb - dark core with gradient */}
                    <Circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="url(#coreGradient)"
                    />

                    {/* Glass depth layer */}
                    <Circle
                        cx="50"
                        cy="50"
                        r="44"
                        fill="url(#glassDepth)"
                    />

                    {/* Inner glow - creates depth */}
                    <Circle
                        cx="50"
                        cy="50"
                        r="30"
                        fill="url(#innerGlow)"
                    />

                    {/* Rim light - edge definition */}
                    <Circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="url(#rimLight)"
                    />



                    {/* Primary glass highlight - top left */}
                    <Ellipse
                        cx="35"
                        cy="32"
                        rx="18"
                        ry="10"
                        fill="url(#topHighlight)"
                        opacity={0.7}
                    />

                    {/* Secondary glass highlight - smaller */}
                    <Ellipse
                        cx="30"
                        cy="28"
                        rx="8"
                        ry="4"
                        fill="white"
                        opacity={0.4}
                    />

                    {/* Bottom reflection - subtle */}
                    <Ellipse
                        cx="62"
                        cy="68"
                        rx="12"
                        ry="6"
                        fill="url(#secondaryHighlight)"
                        opacity={0.5}
                    />

                    {/* Subtle inner ring for depth */}
                    <Circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke={orbColors.lightPurple}
                        strokeWidth="0.3"
                        opacity={0.2}
                    />


                </Svg>
            </Animated.View>
        </View>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    glowLayer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    glow: {
        borderRadius: 9999,
        opacity: 0.5,
    },
    orbContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ArtemisOrb;
