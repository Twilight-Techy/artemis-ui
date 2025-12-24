/**
 * ChatArea Component
 * Container for conversation messages with curved glass rolling effect
 */

import { useArtemisStore, useConversationStore } from '@/src/state';
import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';
import { MessageBubble } from './MessageBubble';
import { SuggestionCard } from './SuggestionCard';
import { SystemMessage } from './SystemMessage';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface ChatAreaProps {
    maxHeight?: number;
}

export function ChatArea({ maxHeight }: ChatAreaProps) {
    const scrollViewRef = useRef<ScrollView>(null);
    const scrollY = useSharedValue(0);

    // Get messages from store
    const messages = useConversationStore((s) => s.messages);
    const approveSuggestion = useConversationStore((s) => s.approveSuggestion);
    const rejectSuggestion = useConversationStore((s) => s.rejectSuggestion);
    const addSystemMessage = useConversationStore((s) => s.addSystemMessage);

    // Artemis state for executing suggestions
    const startExecuting = useArtemisStore((s) => s.startExecuting);
    const goIdle = useArtemisStore((s) => s.goIdle);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollViewRef.current && messages.length > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages.length]);

    // Handle scroll for rolling effect
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    // Handle suggestion approval
    const handleApprove = (messageId: string, content: string) => {
        approveSuggestion(messageId);
        startExecuting();

        // Simulate execution completion
        setTimeout(() => {
            addSystemMessage('✓ Action completed');
            goIdle();
        }, 1500);
    };

    // Handle suggestion rejection
    const handleReject = (messageId: string) => {
        rejectSuggestion(messageId);
        addSystemMessage('Action cancelled');
        goIdle();
    };

    // Render individual message based on type with index for rolling effect
    const renderMessage = (message: typeof messages[0], index: number) => {
        switch (message.type) {
            case 'USER':
            case 'ASSISTANT':
                return (
                    <RollingMessageWrapper key={message.id} index={index} totalMessages={messages.length}>
                        <MessageBubble message={message} />
                    </RollingMessageWrapper>
                );
            case 'SUGGESTION':
                return (
                    <RollingMessageWrapper key={message.id} index={index} totalMessages={messages.length}>
                        <SuggestionCard
                            message={message}
                            onApprove={() => handleApprove(message.id, message.content)}
                            onReject={() => handleReject(message.id)}
                        />
                    </RollingMessageWrapper>
                );
            case 'SYSTEM':
                return (
                    <RollingMessageWrapper key={message.id} index={index} totalMessages={messages.length}>
                        <SystemMessage message={message} />
                    </RollingMessageWrapper>
                );
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, maxHeight ? { maxHeight } : {}]}>
            {/* Curved glass perspective container */}
            <View style={styles.perspectiveContainer}>
                <AnimatedScrollView
                    ref={scrollViewRef as any}
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                >
                    {messages.map((msg, idx) => renderMessage(msg, idx))}
                </AnimatedScrollView>
            </View>

            {/* Top fade gradient for rolling out effect */}
            <View style={styles.topFade} pointerEvents="none" />
        </View>
    );
}

// Wrapper that gives each message a subtle rolling perspective
function RollingMessageWrapper({
    children,
    index,
    totalMessages
}: {
    children: React.ReactNode;
    index: number;
    totalMessages: number;
}) {
    // Calculate position from bottom (newest = 0)
    const positionFromBottom = totalMessages - 1 - index;

    // Subtle rotation and scale for older messages (simulates curved surface)
    const rotation = Math.min(positionFromBottom * 0.5, 3); // Max 3 degrees
    const scale = Math.max(1 - positionFromBottom * 0.01, 0.95); // Min 95% scale
    const opacity = Math.max(1 - positionFromBottom * 0.05, 0.7); // Min 70% opacity

    return (
        <Animated.View
            style={[
                styles.messageWrapper,
                {
                    transform: [
                        { perspective: 1000 },
                        { rotateX: `${rotation}deg` },
                        { scale },
                    ],
                    opacity,
                }
            ]}
        >
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    perspectiveContainer: {
        flex: 1,
        // Add perspective to the container for 3D effect
        transform: [{ perspective: 800 }],
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 16,
        paddingTop: 40, // Extra padding for fade effect
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    messageWrapper: {
        transformOrigin: 'center bottom',
    },
    topFade: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        // Gradient fade effect at top
        backgroundColor: 'transparent',
        // Using a semi-transparent overlay for fade
        borderBottomWidth: 0,
    },
});

export default ChatArea;
