import type { EventCallback } from "../Types";

/**
 * A simple event emitter class for handling and dispatching events.
 */
export class EventEmitter {
    private events: { [key: string]: EventCallback[] } = {};

    /**
     * Registers an event listener for a specific event.
     * @param eventName - The name of the event to listen for.
     * @param callback - The function to call when the event occurs.
     */
    public on(eventName: string, callback: EventCallback): void {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    /**
     * Removes an event listener for a specific event.
     * @param eventName - The name of the event to remove the listener from.
     * @param callback - The function to remove from the event listeners.
     */
    public off(eventName: string, callback: EventCallback): void {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    }

    /**
     * Emits an event, calling all registered listeners for that event.
     * @param eventName - The name of the event to emit.
     * @param args - Any arguments to pass to the event listeners.
     */
    public emit(eventName: string, ...args: any[]): void {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName].forEach(callback => {
            callback(...args);
        });
    }

    /**
     * Removes all event listeners for a specific event.
     * @param eventName - The name of the event to clear listeners for.
     */
    public removeAllListeners(eventName: string): void {
        delete this.events[eventName];
    }
}