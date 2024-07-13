import { Avatar } from "../Avatars";
import type { EventCallback } from "../Types";
import { EventEmitter } from "../Utils";

/**
 * Manages the global animation loop for all game entities.
 */
export class AnimationManager {
    private entities: Set<Avatar> = new Set();
    private animationFrame: number | null = null;
    private lastUpdateTime: number = 0;
    private readonly updateInterval: number = 100; // 100ms, mimicking the original setInterval
    private readonly eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    /**
     * Adds an entity to be managed by the animation loop.
     * @param entity - The entity to add.
     */
    public addEntity(entity: Avatar): void {
        this.entities.add(entity);
        this.eventEmitter.emit('entityAdded', entity);
    }

    /**
     * Removes an entity from the animation loop.
     * @param entity - The entity to remove.
     */
    public removeEntity(entity: Avatar): void {
        if (this.entities.delete(entity)) {
            this.eventEmitter.emit('entityRemoved', entity);
        }
    }

    /**
     * Removes all entities from the animation loop.
     */
    public clearEntities(): void {
        this.entities.clear();
        this.eventEmitter.emit('entitiesCleared');
    }

    /**
     * Starts the animation loop.
     */
    public start(): void {
        if (this.animationFrame === null) {
            this.lastUpdateTime = performance.now();
            this.loop();
            this.eventEmitter.emit('animationStarted');
        }
    }

    /**
     * Stops the animation loop.
     */
    public stop(): void {
        if (this.animationFrame !== null) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
            this.eventEmitter.emit('animationStopped');
        }
    }

    /**
     * The main animation loop.
     */
    private loop = (): void => {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastUpdateTime;

        if (deltaTime >= this.updateInterval) {
            this.updateEntities();
            this.lastUpdateTime = currentTime - (deltaTime % this.updateInterval);
        }

        this.animationFrame = requestAnimationFrame(this.loop);
    }

    /**
     * Updates all entities in the animation loop.
     */
    private updateEntities(): void {
        for (const entity of this.entities) {
            entity.update();
        }
        this.eventEmitter.emit('entitiesUpdated');
    }

    /**
     * Registers an event listener for animation events.
     * @param eventName - The name of the event to listen for.
     * @param callback - The function to call when the event occurs.
     */
    public on(eventName: string, callback: EventCallback): void {
        this.eventEmitter.on(eventName, callback);
    }

    /**
     * Gets the current update interval.
     * @returns The current update interval in milliseconds.
     */
    public getUpdateInterval(): number {
        return this.updateInterval;
    }

    /**
     * Gets the number of entities currently being managed.
     * @returns The number of entities.
     */
    public getEntityCount(): number {
        return this.entities.size;
    }
}