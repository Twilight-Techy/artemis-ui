/**
 * SystemMessage Component
 * Centered, minimal messages for system status updates
 */

import { ConversationMessage } from '@/src/state';
import { useColors, useTheme } from '@/src/theme';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface SystemMessageProps {
    message: ConversationMessage;
}

export function SystemMessage({ message }: SystemMessageProps) {
    const colors = useColors();
    const { theme } = useTheme();
    const { typography } = theme;

    // Entry animation
    const translateY = useSharedValue(10);
    const opacity = useSharedValue(0);

    useEffect(() => {
        translateY.value = withTiming(0, {
            duration: 250,
            easing: Easing.out(Easing.ease)
        });
        opacity.value = withTiming(1, {
            duration: 250,
            easing: Easing.out(Easing.ease)
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <View style={styles.messageWrapper}>
                <Text
                    style={[
                        styles.messageText,
                        {
                            color: colors.text.tertiary,
                            fontFamily: typography.fonts.body.regular,
                            fontSize: typography.sizes.xs,
                        }
                    ]}
                >
                    {message.content}
                </Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    messageWrapper: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    messageText: {
        textAlign: 'center',
        opacity: 0.7,
    },
});

export default SystemMessage;
