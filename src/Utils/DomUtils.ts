import { EventEmitter } from ".";
import type { EventCallback } from "../Types";

class DomUtils {
    private static readonly componentManifest: { [key: string]: HTMLElement } = {};
    private readonly eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    /**
     * Renders a given JSX element or string into a DOM element, registers it in the component manifest,
     * and sets up event listeners for interactive elements within the rendered fragment.
     *
     * @param {JSX.Element | string} element - The JSX element or string to be rendered.
     * @returns {HTMLElement} The rendered DOM element.
     */
    renderFragment = (element: JSX.Element | string): HTMLElement => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = element.toString();
        const result = wrapper.firstChild as HTMLElement;
        DomUtils.componentManifest[result.id] = result;
        this.eventEmitter.emit('componentRendered', result);

        Array
            .from(result.querySelectorAll("a, button, input, select, textarea") ?? [])
            .forEach((item) => {
                item.addEventListener('click', (event) => {
                    this.eventEmitter.emit('click', event);
                });
            });

        return result;
    }

    /**
     * Retrieves the component manifest from the DomUtils.
     *
     * @returns {{ [key: string]: HTMLElement }} The component manifest.
     */
    getManifest = (): { [key: string]: HTMLElement } => DomUtils.componentManifest;

    /**
     * Subscribe to a specific event with a callback function.
     * 
     * @param event - The name of the event to subscribe to.
     * @param callback - The callback function to be executed when the event occurs.
     */
    on = (event: string, callback: EventCallback) => {
        this.eventEmitter.on(event, callback);
    }

    /**
     * Appends a child element to a parent element and emits an event.
     * 
     * @param parent - The parent element to append the child element to.
     * @param child - The child element to append to the parent element.
     */
    appendChild = (parent: HTMLElement, child: HTMLElement) => {
        parent.appendChild(child);
        this.eventEmitter.emit('componentInserted', child);
    }

    prependChild = (parent: HTMLElement, child: HTMLElement) => {
        parent.prepend(child);
        this.eventEmitter.emit('componentInserted', child);
    }
}

export const domUtils = new DomUtils();