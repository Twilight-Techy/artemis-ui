/**
 * IntroBoot Component
 * Boot sequence animation: Sparkly stars swirl in galaxy pattern → converge to form orb → orb moves up
 * Creates an immersive "system coming online" experience
 */

import { useColors } from '@/src/theme';
import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ORB_SIZE = 200;
const NUM_PARTICLES = 60;
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = SCREEN_HEIGHT / 2;

interface IntroBootProps {
    onComplete: () => void;
}

// Generate particle initial positions in a galaxy/spiral pattern
const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
        // Spiral galaxy distribution
        const angle = (i / NUM_PARTICLES) * Math.PI * 6; // Multiple spirals
        const armOffset = (i % 3) * (Math.PI * 2 / 3); // 3 spiral arms
        const radius = 50 + (i / NUM_PARTICLES) * 300; // Expanding radius
        const jitter = Math.random() * 40 - 20; // Random scatter

        const x = Math.cos(angle + armOffset) * (radius + jitter);
        const y = Math.sin(angle + armOffset) * (radius + jitter) * 0.6; // Elliptical

        particles.push({
            id: i,
            startX: x,
            startY: y,
            size: 1 + Math.random() * 3,
            delay: Math.random() * 400,
            brightness: 0.3 + Math.random() * 0.7,
        });
    }
    return particles;
};

// Single particle component
function Particle({
    startX,
    startY,
    size,
    delay,
    brightness,
    progress,
    rotationProgress,
    colors
}: {
    startX: number;
    startY: number;
    size: number;
    delay: number;
    brightness: number;
    progress: SharedValue<number>;
    rotationProgress: SharedValue<number>;
    colors: { primary: string; secondary: string };
}) {
    const animatedStyle = useAnimatedStyle(() => {
        // Rotation around center during swirl phase
        const currentAngle = rotationProgress.value * Math.PI * 2;
        const rotatedX = startX * Math.cos(currentAngle) - startY * Math.sin(currentAngle);
        const rotatedY = startX * Math.sin(currentAngle) + startY * Math.cos(currentAngle);

        // Converge to center as progress increases
        const convergeFactor = interpolate(progress.value, [0.3, 0.8], [1, 0], 'clamp');
        const x = rotatedX * convergeFactor;
        const y = rotatedY * convergeFactor;

        // Fade in, then fade out as converging
        const opacity = interpolate(
            progress.value,
            [0, 0.15, 0.6, 0.85],
            [0, brightness, brightness, 0],
            'clamp'
        );

        // Scale up slightly as they converge
        const scale = interpolate(progress.value, [0.5, 0.8], [1, 1.5], 'clamp');

        return {
            transform: [
                { translateX: CENTER_X + x },
                { translateY: CENTER_Y + y },
                { scale },
            ],
            opacity,
        };
    });

    const particleColor = brightness > 0.6 ? colors.secondary : colors.primary;

    return (
        <Animated.View
            style={[
                styles.particle,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: particleColor,
                    shadowColor: particleColor,
                    shadowRadius: size * 2,
                    shadowOpacity: 0.8,
                },
                animatedStyle,
            ]}
        />
    );
}

export function IntroBoot({ onComplete }: IntroBootProps) {
    const colors = useColors();

    // Animation progress values
    const progress = useSharedValue(0);
    const rotationProgress = useSharedValue(0);
    const orbOpacity = useSharedValue(0);
    const orbScale = useSharedValue(0.1);
    const orbPositionY = useSharedValue(0); // 0 = center, negative = up
    const screenOpacity = useSharedValue(1);

    // Generate particles once
    const particles = useMemo(() => generateParticles(), []);

    // Orb colors
    const orbColors = {
        deepPurple: colors.glow.primary,
        mediumPurple: '#8B5CC7',
        lightPurple: '#AB7EE0',
    };

    useEffect(() => {
        // Phase 1: Stars appear and swirl (0-2s)
        progress.value = withTiming(1, {
            duration: 3000,
            easing: Easing.inOut(Easing.ease)
        });

        // Rotation during swirl
        rotationProgress.value = withTiming(1.5, {
            duration: 2500,
            easing: Easing.out(Easing.ease)
        });

        // Phase 2: Orb appears at center (starts at 1.5s)
        orbOpacity.value = withDelay(
            1500,
            withTiming(1, { duration: 800 })
        );

        orbScale.value = withDelay(
            1500,
            withSequence(
                withTiming(0.3, { duration: 400, easing: Easing.out(Easing.ease) }),
                withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.2)) })
            )
        );

        // Phase 3: Orb moves up to final position (starts at 2.8s)
        const finalYOffset = -(SCREEN_HEIGHT * 0.15); // Move up ~15% of screen
        orbPositionY.value = withDelay(
            2800,
            withTiming(finalYOffset, {
                duration: 800,
                easing: Easing.inOut(Easing.ease)
            })
        );

        // Phase 4: Fade out overlay and complete (at 4s)
        screenOpacity.value = withDelay(
            3800,
            withTiming(0, {
                duration: 400
            }, (finished) => {
                if (finished) {
                    runOnJS(onComplete)();
                }
            })
        );
    }, []);

    // Animated styles
    const containerStyle = useAnimatedStyle(() => ({
        opacity: screenOpacity.value,
    }));

    const orbContainerStyle = useAnimatedStyle(() => ({
        opacity: orbOpacity.value,
        transform: [
            { translateY: orbPositionY.value },
            { scale: orbScale.value },
        ],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: interpolate(orbOpacity.value, [0, 1], [0, 0.5]),
        transform: [
            { translateY: orbPositionY.value },
            { scale: orbScale.value * 1.2 },
        ],
    }));

    return (
        <Animated.View style={[styles.container, { backgroundColor: colors.background.primary }, containerStyle]}>
            {/* Particles layer */}
            <View style={styles.particlesContainer}>
                {particles.map((particle) => (
                    <Particle
                        key={particle.id}
                        startX={particle.startX}
                        startY={particle.startY}
                        size={particle.size}
                        delay={particle.delay}
                        brightness={particle.brightness}
                        progress={progress}
                        rotationProgress={rotationProgress}
                        colors={{
                            primary: orbColors.lightPurple,
                            secondary: '#E0D0FF',
                        }}
                    />
                ))}
            </View>

            {/* Glow layer behind orb */}
            <Animated.View style={[styles.orbWrapper, glowStyle]}>
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
            <Animated.View style={[styles.orbWrapper, orbContainerStyle]}>
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
    particlesContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    particle: {
        position: 'absolute',
        shadowOffset: { width: 0, height: 0 },
    },
    orbWrapper: {
        position: 'absolute',
        width: ORB_SIZE,
        height: ORB_SIZE,
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
});

export default IntroBoot;
