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
    Defs,
    Ellipse,
    G,
    LinearGradient,
    Path,
    RadialGradient,
    Stop
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

    // Animation values - using refs for continuous values to persist across re-renders
    const breatheScale = useSharedValue(1);
    const rotateAngle = useSharedValue(Math.random() * 360); // Random start to avoid reset feel
    const pulseOpacity = useSharedValue(0.6);
    const glowIntensity = useSharedValue(1);
    const ribbonOffset = useSharedValue(0);
    const scaleX = useSharedValue(0.995 + Math.random() * 0.01); // Random start
    const scaleY = useSharedValue(0.995 + Math.random() * 0.01); // Random start

    // Get orb behavior based on state
    const orbBehavior = useMemo(() => stateToOrbBehavior[artemisState], [artemisState]);

    // ============================================================================
    // Animation Effects based on State
    // ============================================================================

    // Continuous animations - only run once on mount, never reset
    useEffect(() => {
        // Extremely slow rotation - 10 minutes per full rotation
        rotateAngle.value = withRepeat(
            withTiming(360, { duration: 600000, easing: Easing.linear }),
            -1,
            false
        );

        // Extremely slow fluid oscillation - ~2 minute full cycle
        scaleX.value = withRepeat(
            withSequence(
                withTiming(1.008, { duration: 40000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.992, { duration: 45000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1.003, { duration: 35000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        scaleY.value = withRepeat(
            withSequence(
                withTiming(0.992, { duration: 42000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1.01, { duration: 40000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.997, { duration: 38000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []); // Empty dependency - only runs once on mount

    // State-dependent animations - change based on Artemis state
    useEffect(() => {
        // Only cancel state-dependent animations
        cancelAnimation(breatheScale);
        cancelAnimation(pulseOpacity);
        cancelAnimation(glowIntensity);

        switch (artemisState) {
            case 'IDLE':
                // Slow, peaceful breathing
                breatheScale.value = withRepeat(
                    withSequence(
                        withTiming(1.03, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
                        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) })
                    ),
                    -1,
                    true
                );
                pulseOpacity.value = withRepeat(
                    withSequence(
                        withTiming(0.8, { duration: 2500 }),
                        withTiming(0.6, { duration: 2500 })
                    ),
                    -1,
                    true
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
        transform: [
            { rotate: `${rotateAngle.value}deg` },
            { scaleX: scaleX.value * breatheScale.value },
            { scaleY: scaleY.value * breatheScale.value },
        ],
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
                        {/* Fluid blob path - organic, irregular shape */}
                        {/* Water-like core gradient */}
                        <RadialGradient id="waterCore" cx="50%" cy="55%" r="55%">
                            <Stop offset="0%" stopColor={orbColors.lightPurple} stopOpacity="0.2" />
                            <Stop offset="20%" stopColor={orbColors.mediumPurple} stopOpacity="0.3" />
                            <Stop offset="45%" stopColor={orbColors.deepPurple} stopOpacity="0.5" />
                            <Stop offset="75%" stopColor="#1A1025" stopOpacity="0.75" />
                            <Stop offset="100%" stopColor="#0D0815" stopOpacity="0.9" />
                        </RadialGradient>

                        {/* Edge glow gradient - brighter at edges */}
                        <RadialGradient id="edgeGlow" cx="50%" cy="50%" r="50%">
                            <Stop offset="70%" stopColor="transparent" stopOpacity="0" />
                            <Stop offset="85%" stopColor={orbColors.lightPurple} stopOpacity="0.5" />
                            <Stop offset="95%" stopColor={orbColors.mediumPurple} stopOpacity="0.8" />
                            <Stop offset="100%" stopColor="white" stopOpacity="0.4" />
                        </RadialGradient>

                        {/* Refraction/depth layer */}
                        <RadialGradient id="refraction" cx="40%" cy="40%" r="65%">
                            <Stop offset="0%" stopColor="white" stopOpacity="0.15" />
                            <Stop offset="35%" stopColor={orbColors.lightPurple} stopOpacity="0.1" />
                            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </RadialGradient>

                        {/* Inner depth glow */}
                        <RadialGradient id="depthGlow" cx="50%" cy="55%" r="40%">
                            <Stop offset="0%" stopColor={orbColors.lightPurple} stopOpacity="0.25" />
                            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </RadialGradient>

                        {/* Caustic highlight - purple tinted */}
                        <RadialGradient id="caustic" cx="35%" cy="30%" r="35%">
                            <Stop offset="0%" stopColor={orbColors.lightPurple} stopOpacity="0.5" />
                            <Stop offset="50%" stopColor={orbColors.lightPurple} stopOpacity="0.2" />
                            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </RadialGradient>

                        {/* Surface highlight gradient - purple tinted */}
                        <LinearGradient id="surfaceHighlight" x1="20%" y1="10%" x2="70%" y2="45%">
                            <Stop offset="0%" stopColor={orbColors.lightPurple} stopOpacity="0.5" />
                            <Stop offset="25%" stopColor={orbColors.lightPurple} stopOpacity="0.25" />
                            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </LinearGradient>

                        {/* Glassy edge gradient - seamless with orb */}
                        <RadialGradient id="glassyEdge" cx="50%" cy="50%" r="50%">
                            <Stop offset="75%" stopColor="transparent" stopOpacity="0" />
                            <Stop offset="88%" stopColor={orbColors.mediumPurple} stopOpacity="0.4" />
                            <Stop offset="95%" stopColor={orbColors.lightPurple} stopOpacity="0.6" />
                            <Stop offset="100%" stopColor={orbColors.lightPurple} stopOpacity="0.3" />
                        </RadialGradient>
                    </Defs>

                    {/* Glassy glowing edge - thick, blends with orb */}
                    <Path
                        d="M 50 4
                           C 68 4, 82 10, 90 22
                           C 98 34, 98 48, 96 58
                           C 94 70, 86 82, 74 90
                           C 62 98, 46 98, 34 94
                           C 20 90, 10 80, 6 66
                           C 2 52, 4 38, 12 26
                           C 20 14, 34 4, 50 4
                           Z"
                        fill="url(#glassyEdge)"
                    />

                    {/* Organic blob shape - floating liquid form */}
                    <Path
                        d="M 50 4
                           C 68 4, 82 10, 90 22
                           C 98 34, 98 48, 96 58
                           C 94 70, 86 82, 74 90
                           C 62 98, 46 98, 34 94
                           C 20 90, 10 80, 6 66
                           C 2 52, 4 38, 12 26
                           C 20 14, 34 4, 50 4
                           Z"
                        fill="url(#waterCore)"
                    />

                    {/* Refraction layer - same blob shape */}
                    <Path
                        d="M 50 6
                           C 66 6, 80 12, 88 23
                           C 96 34, 96 47, 94 57
                           C 92 68, 84 80, 73 88
                           C 61 96, 47 96, 35 92
                           C 22 88, 12 78, 8 65
                           C 4 52, 6 39, 13 27
                           C 21 15, 35 6, 50 6
                           Z"
                        fill="url(#refraction)"
                    />

                    {/* Depth glow - inner */}
                    <Path
                        d="M 50 15
                           C 62 15, 74 20, 80 30
                           C 86 40, 86 52, 84 62
                           C 82 72, 74 80, 64 85
                           C 54 90, 44 90, 35 85
                           C 25 80, 18 72, 16 62
                           C 14 52, 16 40, 22 30
                           C 28 20, 38 15, 50 15
                           Z"
                        fill="url(#depthGlow)"
                    />

                    {/* Specular highlight - purple tinted */}
                    <Ellipse
                        cx="32"
                        cy="22"
                        rx="3"
                        ry="1.5"
                        fill={orbColors.lightPurple}
                        opacity={0.4}
                    />

                    {/* Secondary specular - purple tinted */}
                    <Ellipse
                        cx="44"
                        cy="20"
                        rx="2"
                        ry="1"
                        fill={orbColors.lightPurple}
                        opacity={0.25}
                    />

                    {/* Bottom internal reflection */}
                    <Ellipse
                        cx="60"
                        cy="75"
                        rx="14"
                        ry="8"
                        fill={orbColors.lightPurple}
                        opacity={0.12}
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
