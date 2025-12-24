/**
 * Device Store
 * Manages connected smart home devices and their states
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// ============================================================================
// Types
// ============================================================================

export type DeviceType =
    | 'light'
    | 'fan'
    | 'thermostat'
    | 'switch'
    | 'sensor'
    | 'lock'
    | 'camera'
    | 'speaker'
    | 'custom';

export type DeviceStatus = 'online' | 'offline' | 'error' | 'updating';

export type Protocol = 'http' | 'websocket' | 'mqtt' | 'serial' | 'bluetooth' | 'simulated';

export interface DeviceCapability {
    name: string;
    type: 'toggle' | 'range' | 'select' | 'trigger';
    currentValue: unknown;
    options?: {
        min?: number;
        max?: number;
        step?: number;
        choices?: string[];
    };
}

export interface Device {
    id: string;
    name: string;
    type: DeviceType;
    location: string;
    status: DeviceStatus;
    protocol: Protocol;

    // State
    isOn: boolean;
    capabilities: DeviceCapability[];

    // Metadata
    icon?: string;
    lastUpdated: number;
    lastError?: string;

    // Connection details (not exposed to MCP directly)
    connectionConfig?: {
        address?: string;
        port?: number;
        topic?: string;
    };
}

export interface Sensor extends Device {
    type: 'sensor';
    sensorType: 'temperature' | 'humidity' | 'motion' | 'light' | 'door' | 'custom';
    value: number | boolean;
    unit?: string;
    threshold?: {
        min?: number;
        max?: number;
    };
}

// ============================================================================
// Store Interface
// ============================================================================

interface DeviceStoreState {
    devices: Device[];
    sensors: Sensor[];
    isLoading: boolean;
    error: string | null;
}

interface DeviceStoreActions {
    // Device management
    addDevice: (device: Omit<Device, 'id' | 'lastUpdated'>) => void;
    removeDevice: (id: string) => void;
    updateDevice: (id: string, updates: Partial<Device>) => void;

    // Device control
    toggleDevice: (id: string) => void;
    setDeviceValue: (id: string, capability: string, value: unknown) => void;

    // Status updates
    setDeviceStatus: (id: string, status: DeviceStatus) => void;
    setDeviceOnline: (id: string) => void;
    setDeviceOffline: (id: string) => void;

    // Sensor management
    addSensor: (sensor: Omit<Sensor, 'id' | 'lastUpdated'>) => void;
    updateSensorValue: (id: string, value: number | boolean) => void;

    // Bulk operations
    loadDevices: (devices: Device[]) => void;
    loadSensors: (sensors: Sensor[]) => void;

    // Helpers
    getDeviceById: (id: string) => Device | undefined;
    getDevicesByLocation: (location: string) => Device[];
    getDevicesByType: (type: DeviceType) => Device[];

    // Reset
    reset: () => void;
}

type DeviceStore = DeviceStoreState & DeviceStoreActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: DeviceStoreState = {
    devices: [],
    sensors: [],
    isLoading: false,
    error: null,
};

// ============================================================================
// Helper: Generate unique ID
// ============================================================================

function generateId(): string {
    return `dev-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================================
// Store Creation
// ============================================================================

export const useDeviceStore = create<DeviceStore>()(
    subscribeWithSelector((set, get) => ({
        ...initialState,

        // Device management
        addDevice: (deviceData) => {
            const device: Device = {
                ...deviceData,
                id: generateId(),
                lastUpdated: Date.now(),
            };

            set((state) => ({
                devices: [...state.devices, device],
            }));
        },

        removeDevice: (id) => {
            set((state) => ({
                devices: state.devices.filter((d) => d.id !== id),
            }));
        },

        updateDevice: (id, updates) => {
            set((state) => ({
                devices: state.devices.map((d) =>
                    d.id === id ? { ...d, ...updates, lastUpdated: Date.now() } : d
                ),
            }));
        },

        // Device control
        toggleDevice: (id) => {
            set((state) => ({
                devices: state.devices.map((d) =>
                    d.id === id ? { ...d, isOn: !d.isOn, lastUpdated: Date.now() } : d
                ),
            }));
        },

        setDeviceValue: (id, capability, value) => {
            set((state) => ({
                devices: state.devices.map((d) => {
                    if (d.id !== id) return d;

                    return {
                        ...d,
                        capabilities: d.capabilities.map((c) =>
                            c.name === capability ? { ...c, currentValue: value } : c
                        ),
                        lastUpdated: Date.now(),
                    };
                }),
            }));
        },

        // Status updates
        setDeviceStatus: (id, status) => {
            set((state) => ({
                devices: state.devices.map((d) =>
                    d.id === id ? { ...d, status, lastUpdated: Date.now() } : d
                ),
            }));
        },

        setDeviceOnline: (id) => {
            get().setDeviceStatus(id, 'online');
        },

        setDeviceOffline: (id) => {
            get().setDeviceStatus(id, 'offline');
        },

        // Sensor management
        addSensor: (sensorData) => {
            const sensor: Sensor = {
                ...sensorData,
                id: generateId(),
                lastUpdated: Date.now(),
            };

            set((state) => ({
                sensors: [...state.sensors, sensor],
            }));
        },

        updateSensorValue: (id, value) => {
            set((state) => ({
                sensors: state.sensors.map((s) =>
                    s.id === id ? { ...s, value, lastUpdated: Date.now() } : s
                ),
            }));
        },

        // Bulk operations
        loadDevices: (devices) => {
            set({ devices, isLoading: false });
        },

        loadSensors: (sensors) => {
            set({ sensors });
        },

        // Helpers
        getDeviceById: (id) => {
            return get().devices.find((d) => d.id === id);
        },

        getDevicesByLocation: (location) => {
            return get().devices.filter((d) => d.location === location);
        },

        getDevicesByType: (type) => {
            return get().devices.filter((d) => d.type === type);
        },

        // Reset
        reset: () => {
            set(initialState);
        },
    }))
);

// ============================================================================
// Selectors
// ============================================================================

export const selectAllDevices = (state: DeviceStore) => state.devices;
export const selectOnlineDevices = (state: DeviceStore) =>
    state.devices.filter((d) => d.status === 'online');
export const selectAllSensors = (state: DeviceStore) => state.sensors;
