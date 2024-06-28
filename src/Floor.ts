import { Avatar } from "./Avatar";

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
        const avatarWidth = 192;
        const avatarHeight = 192;
    
        const availableWidth = floorWidth - avatarWidth;
        const availableHeight = floorHeight - avatarHeight;
    
        const x = Math.floor(Math.random() * availableWidth);
        const y = Math.floor(Math.random() * availableHeight);
    
        avatar.setElementPosition(y, x);
        this.avatars.push(avatar);
        this.element.appendChild(avatar.getElement());
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
}