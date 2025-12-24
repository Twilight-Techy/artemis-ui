/**
 * ChatArea Component
 * Container for conversation messages with bottom-up scrolling
 */

import { useArtemisStore, useConversationStore } from '@/src/state';
import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MessageBubble } from './MessageBubble';
import { SuggestionCard } from './SuggestionCard';
import { SystemMessage } from './SystemMessage';

interface ChatAreaProps {
    maxHeight?: number;
}

export function ChatArea({ maxHeight }: ChatAreaProps) {
    const scrollViewRef = useRef<ScrollView>(null);

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

    // Render individual message based on type
    const renderMessage = (message: typeof messages[0]) => {
        switch (message.type) {
            case 'USER':
            case 'ASSISTANT':
                return <MessageBubble key={message.id} message={message} />;
            case 'SUGGESTION':
                return (
                    <SuggestionCard
                        key={message.id}
                        message={message}
                        onApprove={() => handleApprove(message.id, message.content)}
                        onReject={() => handleReject(message.id)}
                    />
                );
            case 'SYSTEM':
                return <SystemMessage key={message.id} message={message} />;
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, maxHeight ? { maxHeight } : {}]}>
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {messages.map(renderMessage)}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 8,
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
});

export default ChatArea;
