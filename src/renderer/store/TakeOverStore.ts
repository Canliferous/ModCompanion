import { defineStore } from "pinia";

export enum TakeOverId {
    MessageLog,
}

export const useTakeOverStore = defineStore("takeover", () => {
    const openTakeOver = ref<TakeOverId | undefined>(undefined);

    function isOpen(takeOver: TakeOverId): boolean {
        return openTakeOver.value === takeOver;
    }

    function close(): void {
        openTakeOver.value = undefined;
    }

    function open(takeOver: TakeOverId): void {
        openTakeOver.value = takeOver;
    }

    return { openTakeOver, isOpen, close, open };
});
