import { Avatar } from "../Avatars/Avatar";
import type { EventCallback, Rect } from "../Types";
import { EventEmitter } from "../Utils/EventEmitter";
import { CollisionDetector } from "../Animations/CollisionDetector";

/**
 * Represents the game floor where avatars are placed.
 */
export class Floor {
    private readonly eventEmitter: EventEmitter;
    private readonly collisionDetector: CollisionDetector;
    private readonly element: HTMLElement;
    private avatars: Avatar[] = [];

    /**
     * Creates a new Floor instance.
     * @param element - The DOM element representing the floor.
     * @throws Error if the floor element is not found in the DOM.
     */
    constructor(elementSelector: string) {
        this.element = document.querySelector(elementSelector) as HTMLElement;
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

    public calculateZIndex(y: number): number {
        const floorHeight = this.element.clientHeight;
        // Assuming the floor starts at y=0 and ends at y=floorHeight
        // Z-index will range from 1 to 1000 (you can adjust this range as needed)
        return Math.floor((y / floorHeight) * 999) + 1;
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
     * @param excludeAvatar - The avatar to exclude from collision checks.
     * @returns True if the position is free, false otherwise.
     */
    public isPositionFree(x: number, y: number, excludeAvatar?: Avatar): boolean {
        const rect: Rect = {
            x,
            y,
            width: excludeAvatar ? excludeAvatar.getCollisionRect().width : 0,
            height: excludeAvatar ? excludeAvatar.getCollisionRect().height : 0
        };

        return !this.avatars.some(avatar => {
            if (avatar === excludeAvatar) return false;
            return this.collisionDetector.isColliding(rect, avatar.getCollisionRect());
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
            const constrained = this.constrainPosition(position.x, position.y, avatar.getWidth(), avatar.getHeight());
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
    public constrainPosition(x: number, y: number, width: number, height: number): { x: number, y: number } {
        const floorWidth = this.element.clientWidth;
        const floorHeight = this.element.clientHeight;

        return {
            x: Math.max(0, Math.min(x, floorWidth - width)),
            y: Math.max(0, Math.min(y, floorHeight - height))
        };
    }

    /**
     * Constrains the position of an avatar considering collisions with other avatars.
     * @param avatar - The avatar to constrain.
     * @param x - The proposed x coordinate.
     * @param y - The proposed y coordinate.
     * @returns The constrained position.
     */
    public constrainPositionWithCollision(avatar: Avatar, newX: number, newY: number): { x: number, y: number } {
        const avatarRect = avatar.getCollisionRect();
        const boundingBox = avatar.getBoundingBox();

        // Adjust newX and newY to account for bounding box offsets
        newX += boundingBox.x;
        newY += boundingBox.y;

        avatarRect.x = newX;
        avatarRect.y = newY;

        for (const otherAvatar of this.avatars) {
            if (otherAvatar !== avatar) {
                const otherRect = otherAvatar.getCollisionRect();

                if (this.collisionDetector.isColliding(avatarRect, otherRect)) {

                    // Calculate overlaps
                    const leftOverlap = (newX + avatarRect.width) - otherRect.x;
                    const rightOverlap = (otherRect.x + otherRect.width) - newX;
                    const topOverlap = (newY + avatarRect.height) - otherRect.y;
                    const bottomOverlap = (otherRect.y + otherRect.height) - newY;

                    const minOverlap = Math.min(leftOverlap, rightOverlap, topOverlap, bottomOverlap);

                    if (minOverlap === leftOverlap) {
                        newX = otherRect.x - avatarRect.width;
                    } else if (minOverlap === rightOverlap) {
                        newX = otherRect.x + otherRect.width;
                    } else if (minOverlap === topOverlap) {
                        newY = otherRect.y - avatarRect.height;
                    } else if (minOverlap === bottomOverlap) {
                        newY = otherRect.y + otherRect.height;
                    }
                }
            }
        }

        // Adjust newX and newY back to account for bounding box offsets
        newX -= boundingBox.x;
        newY -= boundingBox.y;

        return { x: newX, y: newY };
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