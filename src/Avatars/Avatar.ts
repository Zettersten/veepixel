import { Floor } from "../Game/Floor";
import { AvatarOptions, AvatarSprite, AvatarSpriteType, AvatarSprites, EventCallback, MovementDirectionType, Rect } from "../Types";
import { EventEmitter } from "../Utils/EventEmitter";
import { SpriteManager } from "../Avatars/SpriteManager";
import { domUtils } from "../Utils";
import { Avatar as AvatarElement } from "../UI/Components";

/**
 * Represents an avatar in the game.
 */
export class Avatar {
    private readonly eventEmitter: EventEmitter;
    private readonly spriteManager: SpriteManager;
    private readonly element: HTMLDivElement;
    private position: { x: number, y: number } = { x: 0, y: 0 };
    private originalPosition: { x: number, y: number } | null = null;
    private currentMovementDirection: MovementDirectionType = null;
    private isDragging: boolean = false;
    private isHovering: boolean = false;
    private isSelected: boolean = false;
    private dragOffset: { x: number, y: number } | null = null;
    private readonly dragThreshold: number = 1;

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
        this.setZIndex(1);
    }

    /**
     * Creates the avatar's DOM element.
     */
    private createAvatarElement(): HTMLDivElement {
        const element = domUtils.renderFragment(AvatarElement(this.spriteManager.width, this.spriteManager.height, this.options.path));
        return element as HTMLDivElement;
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
     * Retrieves the bounding box of the current object.
     * @returns The bounding box of the object.
     */
    public getBoundingBox(): Rect {
        const boundingBox = this.spriteManager.getBoundingBox();
        return boundingBox;
    }

    /**
     * Sets the position of the avatar's element.
     * @param x - The x position.
     * @param y - The y position.
     */
    public setPosition(x: number, y: number): void {
        this.position = { x, y };
        this.element.style.setProperty('--transform', `translate3d(${x}px, ${y}px, 0)`);
        this.eventEmitter.emit('positionChanged', this.position);
    }

    /**
    * Moves the avatar by a given delta and updates the animation.
    * @param dx - The change in x position.
    * @param dy - The change in y position.
    */
    public move(dx: number, dy: number): void {
        const currentPosition = this.getPosition();
        const newX = currentPosition.x + dx;
        const newY = currentPosition.y + dy;

        const constrained = this.floor.constrainPositionWithCollision(this, newX, newY);

        if (constrained.x !== currentPosition.x || constrained.y !== currentPosition.y) {
            // Set the position directly without subtracting the bounding box offsets
            this.setPosition(constrained.x, constrained.y);

            this.currentMovementDirection =
                Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') :
                    dy !== 0 ? (dy > 0 ? 'down' : 'up') : null;

            switch (this.currentMovementDirection) {
                case 'left':
                    this.startAnimation('walkLeft');
                    break;
                case 'right':
                    this.startAnimation('walkRight');
                    break;
                case 'up':
                    this.startAnimation('walkUp');
                    break;
                case 'down':
                    this.startAnimation('walkDown');
                    break;
            }
        }
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
        this.element.style.setProperty('--background-position', `${sprite.offsetX}px ${sprite.offsetY}px`);
    }

    /**
     * Starts dragging the avatar.
     */
    private startDrag = (event: MouseEvent): void => {
        this.isDragging = true;
        this.isHovering = false;

        const rect = this.floor.getElement().getBoundingClientRect();
        this.dragOffset = {
            x: event.clientX - rect.left - this.position.x,
            y: event.clientY - rect.top - this.position.y
        };

        this.originalPosition = { ...this.position };
        this.setZIndex(1000);

        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDrag);

        this.eventEmitter.emit('dragStarted', event);
    }

    /**
     * Sets the z-index of the element.
     * @param zIndex - The z-index value to set.
     */
    public setZIndex(zIndex: number): void {
        this.element.style.setProperty('--z-index', zIndex.toString());
    }

    /**
     * Handles the drag event.
     */
    private onDrag = (event: MouseEvent): void => {
        if (!this.isDragging || !this.dragOffset) return;

        const rect = this.floor.getElement().getBoundingClientRect();
        const newX = event.clientX - rect.left - this.dragOffset.x;
        const newY = event.clientY - rect.top - this.dragOffset.y;

        const previousPosition = { ...this.position };
        const constrained = this.floor.constrainPosition(newX, newY, this.getWidth(), this.getHeight());

        this.setPosition(constrained.x, constrained.y);

        const dx = constrained.x - previousPosition.x;
        const dy = constrained.y - previousPosition.y;

        if (Math.abs(dx) > this.dragThreshold || Math.abs(dy) > this.dragThreshold) {
            const animationType =
                Math.abs(dx) > Math.abs(dy)
                    ? (dx > 0 ? 'draggedRight' : 'draggedLeft')
                    : (dy > 0 ? 'draggedDown' : 'draggedUp');
            this.startAnimation(animationType);
        }

        this.eventEmitter.emit('dragging', { x: constrained.x, y: constrained.y });
    }

    /**
     * Stops dragging the avatar.
     */
    private stopDrag = (): void => {
        this.isDragging = false;

        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.stopDrag);

        if (this.originalPosition) {
            if (!this.floor.isPositionFree(this.position.x, this.position.y, this)) {
                // Move back to original position if dropped on another avatar
                this.setPosition(this.originalPosition.x, this.originalPosition.y);
            }
            this.originalPosition = null;
        }

        this.setZIndex(1);
        this.startAnimation(this.isHovering ? 'hovering' : 'breathBack');
        this.eventEmitter.emit('dragStopped', this.position);
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

    public getWidth(): number {
        return this.spriteManager.width;
    }

    public getHeight(): number {
        return this.spriteManager.height;
    }

    /**
     * Recalculates the bounding box of the avatar.
     */
    public async recalculateBoundingBox(): Promise<void> {
        await this.spriteManager.recalculateBoundingBox(this.options.path);
    }

    /**
     * Gets the collision rectangle for the avatar.
     * @returns The collision rectangle.
     */
    public getCollisionRect(): Rect {
        const boundingBox = this.spriteManager.getBoundingBox();
        const rect = {
            x: this.position.x + boundingBox.x,
            y: this.position.y + boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height
        };
        return rect;
    }

    /**
     * Get the name from the options object.
     * @returns The name as a string.
     */
    public getName(): string {
        return this.options.name;
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