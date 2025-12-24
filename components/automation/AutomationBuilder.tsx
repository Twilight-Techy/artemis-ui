/**
 * AutomationBuilder Component
 * Step-by-step wizard for creating new automations
 */

import {
    Action,
    AutomationRule,
    EventTrigger,
    generateRuleId,
    SensorTrigger,
    TimeTrigger,
    Trigger,
} from '@/src/automation/types';
import { useColors, useTheme } from '@/src/theme';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInRight
} from 'react-native-reanimated';

interface AutomationBuilderProps {
    isVisible: boolean;
    onComplete: (rule: AutomationRule) => void;
    onCancel: () => void;
}

type Step = 'trigger' | 'trigger-config' | 'action' | 'name' | 'review';

// Trigger options
const TRIGGER_OPTIONS = [
    { id: 'sensor', label: 'When sensor changes', icon: '🌡️', description: 'Temperature, humidity, light level' },
    { id: 'time', label: 'At a specific time', icon: '⏰', description: 'Daily, weekly schedules' },
    { id: 'event', label: 'When something happens', icon: '⚡', description: 'Motion, door opens, etc.' },
];

// Sensor options
const SENSOR_OPTIONS = [
    { id: 'temperature', label: 'Temperature', unit: '°C' },
    { id: 'humidity', label: 'Humidity', unit: '%' },
    { id: 'light_level', label: 'Light Level', unit: 'lux' },
];

// Event options
const EVENT_OPTIONS = [
    { id: 'motion_detected', label: 'Motion detected' },
    { id: 'door_opened', label: 'Door opened' },
    { id: 'door_closed', label: 'Door closed' },
    { id: 'presence_home', label: 'Arrive home' },
    { id: 'presence_away', label: 'Leave home' },
];

// Action options
const ACTION_OPTIONS = [
    { id: 'turn_on', label: 'Turn on device', icon: '💡' },
    { id: 'turn_off', label: 'Turn off device', icon: '🔌' },
    { id: 'set', label: 'Set value', icon: '🎚️' },
    { id: 'notify', label: 'Send notification', icon: '🔔' },
];

// Device options (mock)
const DEVICE_OPTIONS = [
    { id: 'light-living', name: 'Living Room Lights', type: 'light' },
    { id: 'light-bedroom', name: 'Bedroom Lights', type: 'light' },
    { id: 'fan-bedroom', name: 'Bedroom Fan', type: 'fan' },
    { id: 'ac-living', name: 'Living Room AC', type: 'ac' },
];

export function AutomationBuilder({ isVisible, onComplete, onCancel }: AutomationBuilderProps) {
    const colors = useColors();
    const { theme } = useTheme();
    const { typography } = theme;

    const [step, setStep] = useState<Step>('trigger');
    const [triggerType, setTriggerType] = useState<string | null>(null);
    const [trigger, setTrigger] = useState<Trigger | null>(null);
    const [actions, setActions] = useState<Action[]>([]);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    // Sensor config state
    const [sensorType, setSensorType] = useState('temperature');
    const [sensorOperator, setSensorOperator] = useState<'>' | '<'>('>');
    const [sensorValue, setSensorValue] = useState('28');

    // Time config state
    const [time, setTime] = useState('18:00');

    // Event config state
    const [eventType, setEventType] = useState('motion_detected');

    // Action config state
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

    const handleTriggerSelect = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTriggerType(id);
        setStep('trigger-config');
    };

    const handleTriggerConfigComplete = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        let newTrigger: Trigger;

        if (triggerType === 'sensor') {
            newTrigger = {
                type: 'sensor',
                sensorType: sensorType as SensorTrigger['sensorType'],
                operator: sensorOperator,
                value: parseFloat(sensorValue),
                unit: SENSOR_OPTIONS.find(s => s.id === sensorType)?.unit,
            };
        } else if (triggerType === 'time') {
            newTrigger = {
                type: 'time',
                time,
                repeat: true,
            };
        } else {
            newTrigger = {
                type: 'event',
                eventName: eventType,
            };
        }

        setTrigger(newTrigger);
        setStep('action');
    };

    const handleActionSelect = (actionType: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (!selectedDevice) return;

        const device = DEVICE_OPTIONS.find(d => d.id === selectedDevice);

        const newAction: Action = {
            type: actionType as 'turn_on' | 'turn_off' | 'toggle',
            deviceId: selectedDevice,
            deviceName: device?.name,
        };

        setActions([newAction]);
        setStep('name');
    };

    const handleNameComplete = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setStep('review');
    };

    const handleComplete = () => {
        if (!trigger || actions.length === 0) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        const rule: AutomationRule = {
            id: generateRuleId(),
            name: name || 'New Automation',
            trigger,
            actions,
            location: location || undefined,
            enabled: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            triggerCount: 0,
            riskLevel: 'low',
            trustLevel: 'ask_always',
            requiresConfirmation: true,
            createdBy: 'manual',
        };

        onComplete(rule);
        resetState();
    };

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        switch (step) {
            case 'trigger-config':
                setStep('trigger');
                break;
            case 'action':
                setStep('trigger-config');
                break;
            case 'name':
                setStep('action');
                break;
            case 'review':
                setStep('name');
                break;
        }
    };

    const handleCancel_ = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        resetState();
        onCancel();
    };

    const resetState = () => {
        setStep('trigger');
        setTriggerType(null);
        setTrigger(null);
        setActions([]);
        setName('');
        setLocation('');
        setSelectedDevice(null);
    };

    if (!isVisible) return null;

    return (
        <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={[styles.container, { backgroundColor: colors.background.primary }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={step === 'trigger' ? handleCancel_ : handleBack}>
                    <Text style={[styles.headerButton, { color: colors.text.secondary }]}>
                        {step === 'trigger' ? 'Cancel' : '← Back'}
                    </Text>
                </Pressable>
                <Text
                    style={[
                        styles.headerTitle,
                        {
                            color: colors.text.primary,
                            fontFamily: typography.fonts.heading.semiBold,
                        }
                    ]}
                >
                    New Automation
                </Text>
                <View style={{ width: 60 }} />
            </View>

            {/* Progress */}
            <View style={styles.progressBar}>
                {['trigger', 'trigger-config', 'action', 'name', 'review'].map((s, i) => (
                    <View
                        key={s}
                        style={[
                            styles.progressDot,
                            {
                                backgroundColor:
                                    i <= ['trigger', 'trigger-config', 'action', 'name', 'review'].indexOf(step)
                                        ? colors.glow.primary
                                        : 'rgba(139, 92, 199, 0.2)'
                            }
                        ]}
                    />
                ))}
            </View>

            {/* Step Content */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentInner}
                showsVerticalScrollIndicator={false}
            >
                {step === 'trigger' && (
                    <Animated.View entering={SlideInRight.duration(200)}>
                        <Text style={[styles.stepTitle, { color: colors.text.primary }]}>
                            When should this happen?
                        </Text>
                        <Text style={[styles.stepSubtitle, { color: colors.text.tertiary }]}>
                            Choose what triggers this automation
                        </Text>

                        {TRIGGER_OPTIONS.map((option) => (
                            <Pressable
                                key={option.id}
                                style={[
                                    styles.optionCard,
                                    {
                                        backgroundColor: 'rgba(139, 92, 199, 0.08)',
                                        borderColor: 'rgba(139, 92, 199, 0.2)',
                                    }
                                ]}
                                onPress={() => handleTriggerSelect(option.id)}
                            >
                                <Text style={styles.optionIcon}>{option.icon}</Text>
                                <View style={styles.optionText}>
                                    <Text style={[styles.optionLabel, { color: colors.text.primary }]}>
                                        {option.label}
                                    </Text>
                                    <Text style={[styles.optionDesc, { color: colors.text.tertiary }]}>
                                        {option.description}
                                    </Text>
                                </View>
                                <Text style={{ color: colors.text.tertiary }}>→</Text>
                            </Pressable>
                        ))}
                    </Animated.View>
                )}

                {step === 'trigger-config' && triggerType === 'sensor' && (
                    <Animated.View entering={SlideInRight.duration(200)}>
                        <Text style={[styles.stepTitle, { color: colors.text.primary }]}>
                            Configure sensor trigger
                        </Text>

                        <Text style={[styles.label, { color: colors.text.secondary }]}>Sensor Type</Text>
                        <View style={styles.chipRow}>
                            {SENSOR_OPTIONS.map((s) => (
                                <Pressable
                                    key={s.id}
                                    style={[
                                        styles.chip,
                                        sensorType === s.id && styles.chipActive,
                                        { borderColor: colors.glow.primary }
                                    ]}
                                    onPress={() => setSensorType(s.id)}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        { color: sensorType === s.id ? colors.glow.secondary : colors.text.secondary }
                                    ]}>
                                        {s.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <Text style={[styles.label, { color: colors.text.secondary }]}>Condition</Text>
                        <View style={styles.conditionRow}>
                            <Pressable
                                style={[
                                    styles.operatorButton,
                                    sensorOperator === '>' && styles.chipActive,
                                    { borderColor: colors.glow.primary }
                                ]}
                                onPress={() => setSensorOperator('>')}
                            >
                                <Text style={[styles.operatorText, { color: colors.text.primary }]}>Above</Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.operatorButton,
                                    sensorOperator === '<' && styles.chipActive,
                                    { borderColor: colors.glow.primary }
                                ]}
                                onPress={() => setSensorOperator('<')}
                            >
                                <Text style={[styles.operatorText, { color: colors.text.primary }]}>Below</Text>
                            </Pressable>
                            <TextInput
                                style={[
                                    styles.valueInput,
                                    {
                                        color: colors.text.primary,
                                        borderColor: colors.glow.primary,
                                    }
                                ]}
                                value={sensorValue}
                                onChangeText={setSensorValue}
                                keyboardType="numeric"
                                placeholderTextColor={colors.text.tertiary}
                            />
                            <Text style={[styles.unitText, { color: colors.text.tertiary }]}>
                                {SENSOR_OPTIONS.find(s => s.id === sensorType)?.unit}
                            </Text>
                        </View>

                        <Pressable
                            style={[styles.continueButton, { backgroundColor: colors.glow.primary }]}
                            onPress={handleTriggerConfigComplete}
                        >
                            <Text style={styles.continueText}>Continue</Text>
                        </Pressable>
                    </Animated.View>
                )}

                {step === 'trigger-config' && triggerType === 'time' && (
                    <Animated.View entering={SlideInRight.duration(200)}>
                        <Text style={[styles.stepTitle, { color: colors.text.primary }]}>
                            Set the time
                        </Text>

                        <Text style={[styles.label, { color: colors.text.secondary }]}>Time</Text>
                        <TextInput
                            style={[
                                styles.timeInput,
                                {
                                    color: colors.text.primary,
                                    borderColor: colors.glow.primary,
                                    backgroundColor: 'rgba(139, 92, 199, 0.1)',
                                }
                            ]}
                            value={time}
                            onChangeText={setTime}
                            placeholder="18:00"
                            placeholderTextColor={colors.text.tertiary}
                        />
                        <Text style={[styles.hint, { color: colors.text.tertiary }]}>
                            Use 24-hour format (e.g., 18:00 for 6 PM)
                        </Text>

                        <Pressable
                            style={[styles.continueButton, { backgroundColor: colors.glow.primary }]}
                            onPress={handleTriggerConfigComplete}
                        >
                            <Text style={styles.continueText}>Continue</Text>
                        </Pressable>
                    </Animated.View>
                )}

                {step === 'trigger-config' && triggerType === 'event' && (
                    <Animated.View entering={SlideInRight.duration(200)}>
                        <Text style={[styles.stepTitle, { color: colors.text.primary }]}>
                            Choose event
                        </Text>

                        {EVENT_OPTIONS.map((e) => (
                            <Pressable
                                key={e.id}
                                style={[
                                    styles.simpleOption,
                                    eventType === e.id && styles.simpleOptionActive,
                                    { borderColor: colors.glow.primary }
                                ]}
                                onPress={() => setEventType(e.id)}
                            >
                                <Text style={[
                                    styles.simpleOptionText,
                                    { color: eventType === e.id ? colors.glow.secondary : colors.text.secondary }
                                ]}>
                                    {e.label}
                                </Text>
                            </Pressable>
                        ))}

                        <Pressable
                            style={[styles.continueButton, { backgroundColor: colors.glow.primary }]}
                            onPress={handleTriggerConfigComplete}
                        >
                            <Text style={styles.continueText}>Continue</Text>
                        </Pressable>
                    </Animated.View>
                )}

                {step === 'action' && (
                    <Animated.View entering={SlideInRight.duration(200)}>
                        <Text style={[styles.stepTitle, { color: colors.text.primary }]}>
                            What should happen?
                        </Text>

                        <Text style={[styles.label, { color: colors.text.secondary }]}>Select device</Text>
                        <View style={styles.deviceGrid}>
                            {DEVICE_OPTIONS.map((d) => (
                                <Pressable
                                    key={d.id}
                                    style={[
                                        styles.deviceCard,
                                        selectedDevice === d.id && styles.deviceCardActive,
                                        { borderColor: colors.glow.primary }
                                    ]}
                                    onPress={() => setSelectedDevice(d.id)}
                                >
                                    <Text style={styles.deviceIcon}>
                                        {d.type === 'light' ? '💡' : d.type === 'fan' ? '🌀' : '❄️'}
                                    </Text>
                                    <Text style={[
                                        styles.deviceName,
                                        { color: selectedDevice === d.id ? colors.glow.secondary : colors.text.secondary }
                                    ]}>
                                        {d.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {selectedDevice && (
                            <>
                                <Text style={[styles.label, { color: colors.text.secondary, marginTop: 20 }]}>
                                    Action
                                </Text>
                                <View style={styles.actionRow}>
                                    <Pressable
                                        style={[styles.actionButton, { backgroundColor: 'rgba(74, 222, 128, 0.2)' }]}
                                        onPress={() => handleActionSelect('turn_on')}
                                    >
                                        <Text style={styles.actionButtonText}>Turn On</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.actionButton, { backgroundColor: 'rgba(255, 107, 107, 0.2)' }]}
                                        onPress={() => handleActionSelect('turn_off')}
                                    >
                                        <Text style={[styles.actionButtonText, { color: '#FF6B6B' }]}>Turn Off</Text>
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </Animated.View>
                )}

                {step === 'name' && (
                    <Animated.View entering={SlideInRight.duration(200)}>
                        <Text style={[styles.stepTitle, { color: colors.text.primary }]}>
                            Name your automation
                        </Text>

                        <TextInput
                            style={[
                                styles.nameInput,
                                {
                                    color: colors.text.primary,
                                    borderColor: colors.glow.primary,
                                    backgroundColor: 'rgba(139, 92, 199, 0.1)',
                                }
                            ]}
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g., Morning routine"
                            placeholderTextColor={colors.text.tertiary}
                        />

                        <Text style={[styles.label, { color: colors.text.secondary, marginTop: 20 }]}>
                            Location (optional)
                        </Text>
                        <TextInput
                            style={[
                                styles.nameInput,
                                {
                                    color: colors.text.primary,
                                    borderColor: 'rgba(139, 92, 199, 0.3)',
                                    backgroundColor: 'rgba(139, 92, 199, 0.05)',
                                }
                            ]}
                            value={location}
                            onChangeText={setLocation}
                            placeholder="e.g., bedroom, living room"
                            placeholderTextColor={colors.text.tertiary}
                        />

                        <Pressable
                            style={[styles.continueButton, { backgroundColor: colors.glow.primary }]}
                            onPress={handleNameComplete}
                        >
                            <Text style={styles.continueText}>Review</Text>
                        </Pressable>
                    </Animated.View>
                )}

                {step === 'review' && trigger && (
                    <Animated.View entering={SlideInRight.duration(200)}>
                        <Text style={[styles.stepTitle, { color: colors.text.primary }]}>
                            Review your automation
                        </Text>

                        <View
                            style={[
                                styles.reviewCard,
                                {
                                    backgroundColor: 'rgba(139, 92, 199, 0.08)',
                                    borderColor: 'rgba(139, 92, 199, 0.25)',
                                }
                            ]}
                        >
                            <Text style={[styles.reviewName, { color: colors.text.primary }]}>
                                {name || 'New Automation'}
                            </Text>
                            {location && (
                                <Text style={[styles.reviewLocation, { color: colors.text.tertiary }]}>
                                    📍 {location}
                                </Text>
                            )}

                            <View style={styles.reviewBlock}>
                                <View style={[styles.blockLabel, { backgroundColor: 'rgba(139, 92, 199, 0.2)' }]}>
                                    <Text style={[styles.labelText, { color: colors.glow.secondary }]}>WHEN</Text>
                                </View>
                                <Text style={[styles.reviewText, { color: colors.text.secondary }]}>
                                    {trigger.type === 'sensor'
                                        ? `${(trigger as SensorTrigger).sensorType} ${(trigger as SensorTrigger).operator} ${(trigger as SensorTrigger).value}${(trigger as SensorTrigger).unit}`
                                        : trigger.type === 'time'
                                            ? `at ${(trigger as TimeTrigger).time}`
                                            : (trigger as EventTrigger).eventName.replace('_', ' ')
                                    }
                                </Text>
                            </View>

                            <View style={styles.reviewBlock}>
                                <View style={[styles.blockLabel, { backgroundColor: 'rgba(74, 222, 128, 0.2)' }]}>
                                    <Text style={[styles.labelText, { color: '#4ADE80' }]}>DO</Text>
                                </View>
                                {actions.map((a, i) => (
                                    <Text key={i} style={[styles.reviewText, { color: colors.text.secondary }]}>
                                        • {a.type.replace('_', ' ')} {(a as any).deviceName}
                                    </Text>
                                ))}
                            </View>
                        </View>

                        <Pressable
                            style={[styles.createButton, { backgroundColor: colors.glow.primary }]}
                            onPress={handleComplete}
                        >
                            <Text style={styles.createText}>✓ Create Automation</Text>
                        </Pressable>
                    </Animated.View>
                )}
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerButton: {
        fontSize: 16,
        minWidth: 60,
    },
    headerTitle: {
        fontSize: 18,
    },
    progressBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingBottom: 16,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    content: {
        flex: 1,
    },
    contentInner: {
        padding: 24,
        paddingBottom: 40,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 8,
    },
    stepSubtitle: {
        fontSize: 14,
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        marginBottom: 12,
        fontWeight: '500',
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    optionIcon: {
        fontSize: 28,
        marginRight: 16,
    },
    optionText: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    optionDesc: {
        fontSize: 13,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 24,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 199, 0.3)',
    },
    chipActive: {
        backgroundColor: 'rgba(139, 92, 199, 0.2)',
    },
    chipText: {
        fontSize: 14,
    },
    conditionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 32,
    },
    operatorButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 199, 0.3)',
    },
    operatorText: {
        fontSize: 14,
    },
    valueInput: {
        width: 60,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        textAlign: 'center',
        fontSize: 16,
    },
    unitText: {
        fontSize: 14,
    },
    timeInput: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 20,
        textAlign: 'center',
    },
    hint: {
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
    },
    simpleOption: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 199, 0.3)',
        marginBottom: 10,
    },
    simpleOptionActive: {
        backgroundColor: 'rgba(139, 92, 199, 0.2)',
    },
    simpleOptionText: {
        fontSize: 15,
    },
    deviceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    deviceCard: {
        width: '47%',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 199, 0.2)',
        alignItems: 'center',
    },
    deviceCardActive: {
        backgroundColor: 'rgba(139, 92, 199, 0.15)',
    },
    deviceIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    deviceName: {
        fontSize: 13,
        textAlign: 'center',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4ADE80',
    },
    nameInput: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 16,
    },
    continueButton: {
        paddingVertical: 16,
        borderRadius: 24,
        alignItems: 'center',
        marginTop: 32,
    },
    continueText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    reviewCard: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 24,
    },
    reviewName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    reviewLocation: {
        fontSize: 13,
        marginBottom: 16,
    },
    reviewBlock: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    blockLabel: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 12,
    },
    labelText: {
        fontSize: 10,
        fontWeight: '700',
    },
    reviewText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    createButton: {
        paddingVertical: 16,
        borderRadius: 24,
        alignItems: 'center',
    },
    createText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AutomationBuilder;
