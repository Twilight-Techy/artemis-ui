/**
 * MessageBubble Component
 * Renders USER and ASSISTANT messages with appropriate styling
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

interface MessageBubbleProps {
    message: ConversationMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const colors = useColors();
    const { theme } = useTheme();
    const { typography } = theme;

    const isUser = message.type === 'USER';

    // Entry animation
    const translateY = useSharedValue(20);
    const opacity = useSharedValue(0);

    useEffect(() => {
        translateY.value = withTiming(0, {
            duration: 300,
            easing: Easing.out(Easing.ease)
        });
        opacity.value = withTiming(1, {
            duration: 300,
            easing: Easing.out(Easing.ease)
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    // Format timestamp
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Animated.View
            style={[
                styles.container,
                isUser ? styles.userContainer : styles.assistantContainer,
                animatedStyle,
            ]}
        >
            <View
                style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.assistantBubble,
                    {
                        backgroundColor: isUser
                            ? 'rgba(139, 92, 199, 0.15)'
                            : 'rgba(139, 92, 199, 0.08)',
                        borderColor: isUser
                            ? 'rgba(139, 92, 199, 0.2)'
                            : 'rgba(139, 92, 199, 0.12)',
                    }
                ]}
            >
                <Text
                    style={[
                        styles.messageText,
                        isUser ? styles.userText : styles.assistantText,
                        {
                            color: isUser ? colors.text.secondary : colors.text.primary,
                            fontFamily: typography.fonts.body.regular,
                            fontSize: isUser ? typography.sizes.sm : typography.sizes.base,
                        }
                    ]}
                >
                    {message.content}
                </Text>
            </View>
            <Text
                style={[
                    styles.timestamp,
                    isUser ? styles.userTimestamp : styles.assistantTimestamp,
                    {
                        color: colors.text.tertiary,
                        fontFamily: typography.fonts.body.regular,
                        fontSize: typography.sizes.xs,
                    }
                ]}
            >
                {formatTime(message.timestamp)}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
        paddingHorizontal: 16,
    },
    userContainer: {
        alignItems: 'flex-end',
    },
    assistantContainer: {
        alignItems: 'flex-start',
    },
    bubble: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
        borderWidth: 1,
    },
    userBubble: {
        maxWidth: '70%',
        borderBottomRightRadius: 4,
    },
    assistantBubble: {
        maxWidth: '80%',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        lineHeight: 20,
    },
    userText: {
        textAlign: 'right',
    },
    assistantText: {
        textAlign: 'left',
    },
    timestamp: {
        marginTop: 4,
        opacity: 0.6,
    },
    userTimestamp: {
        marginRight: 4,
    },
    assistantTimestamp: {
        marginLeft: 4,
    },
});

export default MessageBubble;
