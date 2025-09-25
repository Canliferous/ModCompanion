export function useEvent<T>() {
    type EventListenerFunc = (payload: T) => void;
    const listeners: EventListenerFunc[] = [];
    let offFunc: (() => void) | undefined = undefined;

    function on(listener: EventListenerFunc) {
        listeners.push(listener);
        const index = listeners.length - 1;

        offFunc = () => {
            listeners.splice(index, 1);
        };
        onScopeDispose(offFunc);
        return offFunc;
    }

    function off() {
        offFunc?.();
    }

    function call(payload: T) {
        for (const listener of listeners) {
            listener(payload);
        }
    }

    return { on, off, call };
}
