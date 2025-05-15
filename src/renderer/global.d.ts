export {};

declare global {
    interface Window {
        electronAPI: {
            launch: () => void;
        };
    }
}
