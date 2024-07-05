import { Floor } from "./Floor";
import { AvatarOptions, AvatarSprite, AvatarSpriteType, AvatarSprites, EventCallback, MovementDirectionType, Rect } from "./Types";
import { EventEmitter } from "./EventEmitter";
import { SpriteManager } from "./SpriteManager";

/**
 * Represents an avatar in the game.
 */
export class Avatar {
    private readonly eventEmitter: EventEmitter;
    private readonly spriteManager: SpriteManager;
    private readonly element: HTMLDivElement;
    private position: { x: number, y: number } = { x: 0, y: 0 };
    private currentMovementDirection: MovementDirectionType = null;
    private isDragging: boolean = false;
    private isHovering: boolean = false;
    private isSelected: boolean = false;

    /**
     * Creates a new Avatar instance.
     * @param floor - The floor on which the avatar is placed.
     * @param options - Avatar options including path and name.
     * @param sprites - All sprite offset positions for the avatar.
     */
    constructor(
        private readonly floor: Floor,
        private readonly options: AvatarOptions,
        sprites: AvatarSprites
    ) {
        this.eventEmitter = new EventEmitter();
        this.spriteManager = new SpriteManager(sprites);
        this.element = this.createAvatarElement();
        this.setupEventListeners();
    }

    /**
     * Creates the avatar's DOM element.
     */
    private createAvatarElement(): HTMLDivElement {
        const element = document.createElement('div');
        element.style.cssText = `
            width: ${this.spriteManager.width}px;
            height: ${this.spriteManager.height}px;
            background-image: url(${this.options.path});
            background-repeat: no-repeat;
            background-position: 0px 0px;
            position: absolute;
            transform: translate3d(0px, 0px, 0);
            transform-origin: left top;
            will-change: transform;
            cursor: pointer;
        `;
        return element;
    }

    /**
     * Sets up event listeners for the avatar.
     */
    private setupEventListeners(): void {
        this.element.addEventListener('mouseenter', this.onMouseEnter);
        this.element.addEventListener('mouseleave', this.onMouseLeave);
        this.element.addEventListener('mousedown', this.startDrag);
    }

    /**
     * Gets the avatar's DOM element.
     * @returns The avatar's HTMLDivElement.
     */
    public getElement(): HTMLDivElement {
        return this.element;
    }

    /**
     * Sets the position of the avatar's element.
     * @param x - The x position.
     * @param y - The y position.
     */
    public setPosition(x: number, y: number): void {
        this.position = { x, y };
        this.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        this.eventEmitter.emit('positionChanged', this.position);
    }

    /**
     * Moves the avatar by a given delta and updates the animation.
     * @param dx - The change in x position.
     * @param dy - The change in y position.
     */
    public move(dx: number, dy: number): void {
        const newX = this.position.x + dx;
        const newY = this.position.y + dy;

        const constrained = this.isDragging
            ? this.floor.constrainPosition(newX, newY)
            : this.floor.constrainPositionWithCollision(this, newX, newY);

        this.setPosition(constrained.x, constrained.y);

        this.currentMovementDirection =
            Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') :
            dy !== 0 ? (dy > 0 ? 'down' : 'up') : null;

        this.startAnimation(this.currentMovementDirection === 'down' ? 'swayFront' : 'swayBack');
    }

    /**
     * Starts an animation for the avatar.
     * @param spriteType - The type of sprite animation to start.
     */
    public startAnimation(spriteType: AvatarSpriteType): void {
        this.spriteManager.startAnimation(spriteType);
        this.eventEmitter.emit('animationStarted', spriteType);
    }

    /**
     * Updates the avatar's animation state.
     */
    public update(): void {
        const newSprite = this.spriteManager.update();
        if (newSprite) {
            this.setSpritePosition(newSprite);
        }
    }

    /**
     * Sets the sprite position for the avatar.
     */
    private setSpritePosition(sprite: AvatarSprite): void {
        this.element.style.backgroundPosition = `${sprite.offsetX}px ${sprite.offsetY}px`;
    }

    /**
     * Starts dragging the avatar.
     */
    private startDrag = (event: MouseEvent): void => {
        this.isDragging = true;
        this.isHovering = false;
        this.eventEmitter.emit('dragStarted', event);
        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDrag);
    }

    /**
     * Handles the drag event.
     */
    private onDrag = (event: MouseEvent): void => {
        if (!this.isDragging) return;
        this.eventEmitter.emit('dragging', event);
    }

    /**
     * Stops dragging the avatar.
     */
    private stopDrag = (): void => {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.stopDrag);
        this.startAnimation(this.isHovering ? 'hovering' : 'breathBack');
        this.eventEmitter.emit('dragStopped');
    }

    /**
     * Gets the current position of the avatar.
     * @returns The x and y coordinates of the avatar.
     */
    public getPosition(): { x: number, y: number } {
        return { ...this.position };
    }

    /**
     * Stops the current movement and resets to the default animation.
     */
    public stopMovement(): void {
        this.currentMovementDirection = null;
        this.startAnimation(this.isHovering ? 'hovering' : 'breathBack');
    }

    /**
     * Sets the selected state of the avatar.
     * @param selected - Whether the avatar is selected or not.
     */
    public setSelected(selected: boolean): void {
        this.isSelected = selected;
        this.eventEmitter.emit('selectionChanged', selected);
    }

    /**
     * Handles the mouse enter event.
     */
    private onMouseEnter = (): void => {
        if (!this.isDragging && !this.isSelected) {
            this.isHovering = true;
            this.startAnimation('hovering');
        }
    }

    /**
     * Handles the mouse leave event.
     */
    private onMouseLeave = (): void => {
        if (!this.isDragging && !this.isSelected) {
            this.isHovering = false;
            this.startAnimation('breathBack');
        }
    }

    /**
     * Initiates a jump animation for the avatar.
     */
    public jump(): void {
        this.startAnimation('jumping');
    }

    /**
     * Updates the avatar's sprite with a new image path.
     * @param newPath - The new image path for the avatar's sprite.
     */
    public updateSprite(newPath: string): void {
        this.options.path = newPath;
        this.element.style.backgroundImage = `url(${newPath})`;
        this.spriteManager.recalculateBoundingBox(newPath);
    }

    /**
     * Gets the collision rectangle for the avatar.
     * @returns The collision rectangle.
     */
    public getCollisionRect(): Rect {
        return this.spriteManager.getCollisionRect(this.position);
    }

    /**
     * Toggles the visibility of the debug bounding box.
     * @param show - Whether to show or hide the debug box.
     */
    public toggleDebugBoundingBox(show: boolean): void {
        this.spriteManager.toggleDebugBoundingBox(show, this.element);
    }

    /**
     * Registers an event listener for avatar events.
     * @param eventName - The name of the event to listen for.
     * @param callback - The function to call when the event occurs.
     */
    public on(eventName: string, callback: EventCallback): void {
        this.eventEmitter.on(eventName, callback);
    }
}