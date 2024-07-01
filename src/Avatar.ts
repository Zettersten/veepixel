import { Floor } from "./Floor";
import { AvatarOptions, AvatarSprite, AvatarSpriteType, AvatarSprites, MovementDirectionType } from "./Types";

/**
 * Represents an avatar in the game.
 */
export class Avatar {
    private currentMovementDirection: MovementDirectionType = null;
    private oneTimeAnimations: Set<AvatarSpriteType> = new Set(['turnAround', 'jumping']);
    private readonly height: number = 192;
    private readonly width: number = 192;
    private readonly options: AvatarOptions;
    private element: HTMLDivElement;
    private currentSpriteType: AvatarSpriteType | null = null;
    private currentSpriteIndex: number = 0;
    private dragOffset: { x: number, y: number } | null = null;
    private lastPosition: { x: number, y: number } | null = null;
    private readonly dragThreshold: number = 1;
    private isDragging: boolean = false;
    private isHovering: boolean = false;
    private isSelected: boolean = false;
    private readonly floor: Floor;
    private sprites: AvatarSprites;

    /**
     * Creates a new Avatar instance.
     * @param floor - The floor on which the avatar is placed.
     * @param options - Avatar options including path and name.
     * @param sprites - All sprite offset positions for the avatar.
     */
    constructor(floor: Floor, options: AvatarOptions, sprites: AvatarSprites) {
        this.options = options;
        this.floor = floor;
        this.sprites = sprites;
        this.element = this.createAvatarElement();
        this.setupEventListeners();
    }

    /**
     * Creates the avatar's DOM element.
     */
    private createAvatarElement(): HTMLDivElement {
        const element = document.createElement('div');
        element.style.cssText = `
            width: ${this.width}px;
            height: ${this.height}px;
            background-image: url(${this.options.path});
            background-repeat: no-repeat;
            background-position: 0px 0px;
            position: absolute;
            top: 0;
            left: 0;
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
     * Sets the sprite position for the avatar.
     */
    private setSpritePosition(sprite: AvatarSprite): void {
        this.element.style.backgroundPosition = `${sprite.offsetX}px ${sprite.offsetY}px`;
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
     * @param top - The top position.
     * @param left - The left position.
     */
    public setElementPosition(top: number, left: number): void {
        this.element.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    }

    /**
     * Moves the avatar by a given delta and updates the animation.
     * @param dx - The change in x position.
     * @param dy - The change in y position.
     */
    public move(dx: number, dy: number): void {
        const currentTransform = new DOMMatrix(getComputedStyle(this.element).transform);
        const newX = currentTransform.m41 + dx;
        const newY = currentTransform.m42 + dy;
        const constrained = this.floor.constrainPosition(newX, newY);
        this.setElementPosition(constrained.y, constrained.x);

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
        if (this.currentSpriteType === spriteType) return;
        
        this.currentSpriteType = spriteType;
        this.currentSpriteIndex = 0;
    }

    /**
     * Updates the avatar's animation state.
     */
    public update(): void {
        if (this.currentSpriteType && this.sprites[this.currentSpriteType]) {
            const sprites = this.sprites[this.currentSpriteType];
            this.currentSpriteIndex = (this.currentSpriteIndex + 1) % sprites.length;
            this.setSpritePosition(sprites[this.currentSpriteIndex]);

            if (this.oneTimeAnimations.has(this.currentSpriteType) && this.currentSpriteIndex === sprites.length - 1) {
                this.startAnimation(this.isHovering ? 'hovering' : 'breathBack');
            }
        }
    }

    /**
     * Starts dragging the avatar.
     */
    private startDrag = (event: MouseEvent): void => {
        this.isDragging = true;
        this.isHovering = false;

        const floorRect = this.floor.getElement().getBoundingClientRect();
        const avatarRect = this.element.getBoundingClientRect();

        this.dragOffset = {
            x: event.clientX - (avatarRect.left - floorRect.left),
            y: event.clientY - (avatarRect.top - floorRect.top)
        };
        this.lastPosition = { x: event.clientX, y: event.clientY };

        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDrag);
    }

    /**
     * Handles the drag event.
     */
    private onDrag = (event: MouseEvent): void => {
        if (!this.dragOffset || !this.lastPosition || !this.isDragging) return;

        const newX = event.clientX - this.dragOffset.x;
        const newY = event.clientY - this.dragOffset.y;

        const constrainedPosition = this.floor.constrainPosition(newX, newY);
        this.setElementPosition(constrainedPosition.y, constrainedPosition.x);

        const dx = event.clientX - this.lastPosition.x;
        const dy = event.clientY - this.lastPosition.y;

        if (Math.abs(dx) > this.dragThreshold || Math.abs(dy) > this.dragThreshold) {
            this.startAnimation(
                Math.abs(dx) > Math.abs(dy) 
                    ? (dx > 0 ? 'draggedRight' : 'draggedLeft')
                    : (dy > 0 ? 'draggedDown' : 'draggedUp')
            );
        }

        this.lastPosition = { x: event.clientX, y: event.clientY };
    }

    /**
     * Stops dragging the avatar.
     */
    private stopDrag = (): void => {
        this.isDragging = false;
        this.dragOffset = null;
        this.lastPosition = null;
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.stopDrag);
        this.startAnimation(this.isHovering ? 'hovering' : 'breathBack');
    }

    /**
     * Gets the current position of the avatar.
     * @returns The x and y coordinates of the avatar.
     */
    public getPosition(): { x: number, y: number } {
        const transform = new DOMMatrix(getComputedStyle(this.element).transform);
        return { x: transform.m41, y: transform.m42 };
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
        this.element.style.filter = selected ? 'drop-shadow(2px 4px 6px yellow)' : 'none';
        this.startAnimation(selected ? 'clapping' : (this.isHovering ? 'hovering' : 'breathBack'));
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
        if (this.currentSpriteType !== 'jumping') {
            this.startAnimation('jumping');
        }
    }
}