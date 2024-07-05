import { Avatar } from "./Avatar";
import { EventCallback, Rect } from "./Types";
import { EventEmitter } from "./EventEmitter";
import { CollisionDetector } from "./CollisionDetector";

/**
 * Represents the game floor where avatars are placed.
 */
export class Floor {
    private readonly eventEmitter: EventEmitter;
    private readonly collisionDetector: CollisionDetector;
    private avatars: Avatar[] = [];

    /**
     * Creates a new Floor instance.
     * @param element - The DOM element representing the floor.
     * @throws Error if the floor element is not found in the DOM.
     */
    constructor(private readonly element: HTMLElement) {
        if (!element) {
            throw new Error("Floor element not provided");
        }
        this.eventEmitter = new EventEmitter();
        this.collisionDetector = new CollisionDetector();
        this.setupResizeListener();
    }

    /**
     * Adds an avatar to the floor and positions it randomly.
     * @param avatar - The avatar to be added to the floor.
     */
    public placeAvatarRandomly(avatar: Avatar): void {
        const position = this.findRandomFreePosition(avatar);
        if (position) {
            avatar.setPosition(position.x, position.y);
            this.avatars.push(avatar);
            this.element.appendChild(avatar.getElement());
            this.eventEmitter.emit('avatarAdded', avatar);
        } else {
            console.warn("Could not find a collision-free position for the avatar");
            this.eventEmitter.emit('avatarPlacementFailed', avatar);
        }
    }

    /**
     * Finds a random free position for an avatar.
     * @param avatar - The avatar to place.
     * @returns A free position or null if none found.
     */
    private findRandomFreePosition(avatar: Avatar): { x: number, y: number } | null {
        const floorWidth = this.element.clientWidth;
        const floorHeight = this.element.clientHeight;
        const avatarRect = avatar.getCollisionRect();

        const maxAttempts = 100;
        for (let i = 0; i < maxAttempts; i++) {
            const x = Math.floor(Math.random() * (floorWidth - avatarRect.width));
            const y = Math.floor(Math.random() * (floorHeight - avatarRect.height));

            if (this.isPositionFree(x, y, avatar)) {
                return { x, y };
            }
        }

        return null;
    }

    /**
     * Checks if a position is free from collisions.
     * @param x - The x coordinate to check.
     * @param y - The y coordinate to check.
     * @param avatar - The avatar to check for (excluded from collision checks).
     * @returns True if the position is free, false otherwise.
     */
    public isPositionFree(x: number, y: number, avatar: Avatar): boolean {
        const rect = avatar.getCollisionRect();
        rect.x = x;
        rect.y = y;

        return !this.avatars.some(existingAvatar => {
            if (existingAvatar === avatar) return false;
            return this.collisionDetector.isColliding(rect, existingAvatar.getCollisionRect());
        });
    }

    /**
     * Gets the floor's DOM element.
     * @returns The floor's HTMLElement.
     */
    public getElement(): HTMLElement {
        return this.element;
    }

    /**
     * Gets all avatars on the floor.
     * @returns An array of Avatar instances.
     */
    public getAvatars(): Avatar[] {
        return [...this.avatars];
    }

    /**
     * Sets up a resize listener to adjust avatar positions when the window is resized.
     */
    private setupResizeListener(): void {
        window.addEventListener('resize', this.adjustAvatarPositions.bind(this));
    }

    /**
     * Adjusts the positions of all avatars to ensure they stay within the floor boundaries.
     */
    private adjustAvatarPositions(): void {
        this.avatars.forEach(avatar => {
            const position = avatar.getPosition();
            const constrained = this.constrainPosition(position.x, position.y);
            avatar.setPosition(constrained.x, constrained.y);
        });
        this.eventEmitter.emit('avatarsAdjusted');
    }

    /**
     * Removes an avatar from the floor.
     * @param avatar - The avatar to be removed.
     */
    public removeAvatar(avatar: Avatar): void {
        const index = this.avatars.indexOf(avatar);
        if (index > -1) {
            this.avatars.splice(index, 1);
            this.element.removeChild(avatar.getElement());
            this.eventEmitter.emit('avatarRemoved', avatar);
        }
    }

    /**
     * Removes all avatars from the floor.
     */
    public clearAvatars(): void {
        this.avatars.forEach(avatar => this.element.removeChild(avatar.getElement()));
        this.avatars = [];
        this.eventEmitter.emit('avatarsCleared');
    }

    /**
     * Constrains a position to be within the floor boundaries.
     * @param x - The x coordinate to constrain.
     * @param y - The y coordinate to constrain.
     * @returns The constrained x and y coordinates.
     */
    public constrainPosition(x: number, y: number): { x: number, y: number } {
        const floorWidth = this.element.clientWidth;
        const floorHeight = this.element.clientHeight;
        const avatarWidth = 192;  // Consider making this dynamic or a parameter
        const avatarHeight = 192;

        return {
            x: Math.max(0, Math.min(x, floorWidth - avatarWidth)),
            y: Math.max(0, Math.min(y, floorHeight - avatarHeight / 1.3))
        };
    }

    /**
     * Constrains the position of an avatar considering collisions with other avatars.
     * @param avatar - The avatar to constrain.
     * @param x - The proposed x coordinate.
     * @param y - The proposed y coordinate.
     * @returns The constrained position.
     */
    public constrainPositionWithCollision(avatar: Avatar, x: number, y: number): { x: number, y: number } {
        const constrained = this.constrainPosition(x, y);

        if (this.isPositionFree(constrained.x, constrained.y, avatar)) {
            return constrained;
        }

        return avatar.getPosition();  // Return current position if collision detected
    }

    /**
     * Registers an event listener for floor events.
     * @param eventName - The name of the event to listen for.
     * @param callback - The function to call when the event occurs.
     */
    public on(eventName: string, callback: EventCallback): void {
        this.eventEmitter.on(eventName, callback);
    }
}