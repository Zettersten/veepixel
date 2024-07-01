import { Avatar } from './Avatar';

/**
 * Manages the global animation loop for all game entities.
 */
export class AnimationManager {
    private entities: Avatar[] = [];
    private animationFrame: number | null = null;
    private lastUpdateTime: number = 0;
    private readonly updateInterval: number = 100; // 100ms, mimicking the original setInterval

    /**
     * Adds an entity to be managed by the animation loop.
     * @param entity - The entity (Avatar) to add.
     */
    addEntity(entity: Avatar): void {
        this.entities.push(entity);
    }

    /**
     * Removes an entity from the animation loop.
     * @param entity - The entity (Avatar) to remove.
     */
    removeEntity(entity: Avatar): void {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }

    /**
     * Starts the animation loop.
     */
    start(): void {
        if (this.animationFrame === null) {
            this.lastUpdateTime = performance.now();
            this.loop();
        }
    }

    /**
     * Stops the animation loop.
     */
    stop(): void {
        if (this.animationFrame !== null) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    private loop = (): void => {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastUpdateTime;

        if (deltaTime >= this.updateInterval) {
            for (const entity of this.entities) {
                entity.update();
            }
            this.lastUpdateTime = currentTime - (deltaTime % this.updateInterval);
        }

        this.animationFrame = requestAnimationFrame(this.loop);
    }
}
