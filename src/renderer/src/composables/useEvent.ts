export type EventListenerFunc<T> = (payload: T) => void;
export interface EventHandler<T> {
    on: (listener: EventListenerFunc<T>) => () => void;
    call: (payload: T) => void;
}

export function useEvent<T>(): EventHandler<T> {
    const listeners: EventListenerFunc<T>[] = [];
    let offFunc: (() => void) | undefined = undefined;

    function on(listener: EventListenerFunc<T>) {
        listeners.push(listener);
        const index = listeners.length - 1;

        offFunc = () => {
            const idx = listeners.indexOf(listener);
            if (idx > 0) {
                listeners.splice(index);
            } else {
                console.warn("Failed to delete event listener because it's not in the list. Was it deleted twice?");
            }
        };
        onScopeDispose(offFunc);
        return offFunc;
    }

    function call(payload: T) {
        for (const listener of listeners) {
            listener(payload);
        }
    }

    return { on, call };
}
