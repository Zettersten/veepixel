import { Avatar } from "./Avatar";
import { Rect } from "./Types";

/**
 * Represents the game floor where avatars are placed.
 */
export class Floor {
    private readonly element: HTMLElement;
    private avatars: Avatar[] = [];

    /**
     * Creates a new Floor instance.
     * @throws Error if the floor element is not found in the DOM.
     */
    constructor() {
        const element = document.getElementById("floor");

        if (!element) {
            throw new Error("Element with id 'floor' not found");
        }

        this.element = element;
        this.setupResizeListener();
    }

    /**
     * Adds an avatar to the floor and positions it randomly.
     * @param avatar - The avatar to be added to the floor.
     */
    public placeAvatarRandomly(avatar: Avatar): void {
        const floorWidth = this.element.clientWidth;
        const floorHeight = this.element.clientHeight;
        const avatarWidth = avatar.getWidth();
        const avatarHeight = avatar.getHeight();

        let x, y;
        let collisionFree = false;
        let attempts = 0;
        const maxAttempts = 100;  // Prevent infinite loop

        while (!collisionFree && attempts < maxAttempts) {
            x = Math.floor(Math.random() * (floorWidth - avatarWidth));
            y = Math.floor(Math.random() * (floorHeight - avatarHeight));

            collisionFree = this.isPositionFree(x, y, avatar);
            attempts++;
        }

        if (collisionFree) {
            avatar.setElementPosition(y, x);
            this.avatars.push(avatar);
            this.element.appendChild(avatar.getElement());
        } else {
            console.warn("Could not find a collision-free position for the avatar");
            // Handle this case (e.g., don't add the avatar, or add it at a default position)
        }
    }

    public isPositionFree(x: number, y: number, avatar: Avatar, excludeAvatar?: Avatar): boolean {
        const rect = avatar.getCollisionRect();
        rect.x = x + (rect.x - avatar.getPosition().x);
        rect.y = y + (rect.y - avatar.getPosition().y);

        return !this.avatars.some(existingAvatar => {
            if (existingAvatar === excludeAvatar) return false;
            const existingRect = existingAvatar.getCollisionRect();
            return this.isColliding(rect, existingRect);
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
        return this.avatars;
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
            avatar.setElementPosition(constrained.y, constrained.x);
        });
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
        }
    }

    /**
     * Removes all avatars from the floor.
     */
    public clearFloor(): void {
        this.avatars.forEach(avatar => this.element.removeChild(avatar.getElement()));
        this.avatars = [];
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
        const avatarWidth = 192;
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

        const avatarRect = avatar.getCollisionRect();
        avatarRect.x = constrained.x + (avatarRect.x - avatar.getPosition().x);
        avatarRect.y = constrained.y + (avatarRect.y - avatar.getPosition().y);

        for (const otherAvatar of this.avatars) {
            if (otherAvatar !== avatar) {
                const otherRect = otherAvatar.getCollisionRect();

                if (this.isColliding(avatarRect, otherRect)) {
                    return avatar.getPosition();  // Return current position if collision detected
                }
            }
        }

        return constrained;
    }

    private isColliding(rect1: Rect, rect2: Rect): boolean {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    public updateAvatarCollision(avatar: Avatar): void {
        // This method can be called when an avatar's collision box is updated
        // For now, it doesn't need to do anything, but it's a hook for future functionality
    }

}