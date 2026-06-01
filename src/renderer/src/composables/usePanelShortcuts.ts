import { EventHandler, useEvent } from "~/composables/useEvent.js";
import { PanelModel } from "~/helper/GlobalComponents.js";

export type PanelShortcuts = Record<string, EventHandler<void>>;

export function usePanelShortcuts<T extends Record<string, EventHandler<void>>>(
    panelModel: PanelModel | undefined,
    shortcutsKeymap: Record<keyof T, string>,
): T {
    interface KeyShortcut {
        key: string;
        ctrlKey?: boolean;
        altKey?: boolean;
        shiftKey?: boolean;
    }

    interface MouseShortcut {
        button: number;
    }

    const keyShortcuts = new Map<KeyShortcut, EventHandler<void>>();
    const mouseShortcuts = new Map<MouseShortcut, EventHandler<void>>();

    const mouseShortcutRegex = /mouse(\d)/;

    const shortcutEventsObj: PanelShortcuts = {};
    for (const [shortcutName, keymap] of Object.entries(shortcutsKeymap)) {
        const event = useEvent<void>();
        shortcutEventsObj[shortcutName] = event;

        const mouseCaptures = keymap.match(mouseShortcutRegex);
        if (mouseCaptures) {
            const button = Number.parseInt(mouseCaptures[1]);
            mouseShortcuts.set({ button }, event);
        } else {
            const splits = keymap.split("_");

            const keyShortcut: KeyShortcut = { key: "", ctrlKey: false, shiftKey: false, altKey: false };
            for (const split of splits) {
                if (split === "ctrl") {
                    keyShortcut.ctrlKey = true;
                } else if (split === "shift") {
                    keyShortcut.shiftKey = true;
                } else if (split === "alt") {
                    keyShortcut.altKey = true;
                } else {
                    keyShortcut.key = split;
                    break; // only take the first non-special split as the key
                }
            }
            keyShortcuts.set(keyShortcut, event);
        }
    }

    if (panelModel) {
        if (panelModel._onKeyInput === undefined || Object.entries(panelModel._onKeyInput).length === 0)
            panelModel._onKeyInput = useEvent();

        panelModel._onKeyInput.on((event) => {
            for (const [keyShortcut, eventHandler] of keyShortcuts) {
                // weak comparison with == is intentional here since we want false to equal undefined
                if (
                    keyShortcut.key === event.key &&
                    keyShortcut.ctrlKey == event.ctrlKey &&
                    keyShortcut.shiftKey == event.shiftKey &&
                    keyShortcut.altKey == event.altKey
                ) {
                    eventHandler.call();
                }
            }
        });

        if (panelModel._onClickInput === undefined || Object.entries(panelModel._onClickInput).length === 0)
            panelModel._onClickInput = useEvent();

        panelModel._onClickInput.on((event) => {
            for (const [mouseShortcut, eventHandler] of mouseShortcuts) {
                if (mouseShortcut.button === event.button) {
                    eventHandler.call();
                }
            }
        });
    }

    return shortcutEventsObj as T;
}
