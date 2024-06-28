import { Floor } from "./Floor";
import { AvatarOptions, AvatarSprite, AvatarSpriteType, AvatarSprites, MovementDirectionType } from "./Types";


/**
 * Represents an avatar in the game.
 */
export class Avatar {
    private currentMovementDirection: MovementDirectionType = null;
    private oneTimeAnimations: Set<AvatarSpriteType> = new Set(['turnAround']);
    private nextAnimation: AvatarSpriteType | null = null;
    private readonly height: number = 192;
    private readonly width: number = 192;
    private readonly options: AvatarOptions;
    private element: HTMLDivElement;
    private currentSpriteType: AvatarSpriteType | null;
    private animationInterval: number | null = null;
    private dragOffset: { x: number, y: number } | null = null;
    private lastPosition: { x: number, y: number } | null = null;
    private readonly dragThreshold: number = 1;
    private isDragging: boolean = false;
    private isHovering: boolean = false;
    private isSelected: boolean = false;
    private readonly floor: Floor;
    private sprites: AvatarSprites;
    private isJumping: boolean = false;

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
        this.setupHoverListeners();
    }

    /**
     * Creates the avatar's DOM element.
     * @returns The created HTMLDivElement for the avatar.
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
     * Sets the sprite position for the avatar.
     * @param sprite - The sprite to set.
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

        // Determine the movement direction
        if (Math.abs(dx) > Math.abs(dy)) {
            this.currentMovementDirection = dx > 0 ? 'right' : 'left';
        } else if (dy !== 0) {
            this.currentMovementDirection = dy > 0 ? 'down' : 'up';
        }

        // Start the appropriate walking animation
        this.startWalkingAnimation();
    }

    /**
         * Starts the jumping animation, playing it only once.
         */
    public jump(): void {
        if (!this.isJumping) {
            this.isJumping = true;
            this.startAnimation('jumping');
        }
    }

    /**
     * Starts an animation for the avatar.
     * @param spriteType - The type of sprite animation to start.
     * @param nextAnimation - The next animation to play after the current one (optional).
     */
    public startAnimation(spriteType: AvatarSpriteType, nextAnimation: AvatarSpriteType | null = null): void {
        if (this.currentSpriteType === spriteType && this.nextAnimation === nextAnimation) return;
        
        this.stopAnimation();
        this.currentSpriteType = spriteType;
        this.nextAnimation = nextAnimation;

        let index = 0;
        const sprites = this.sprites[spriteType];

        const animate = () => {
            this.setSpritePosition(sprites[index]);
            index++;

            if (index >= sprites.length) {
                if (spriteType === 'jumping') {
                    this.isJumping = false;
                    this.startAnimation(this.isHovering ? 'hovering' : 'breathBack');
                    return;
                } else if (this.oneTimeAnimations.has(spriteType) && this.nextAnimation) {
                    this.startAnimation(this.nextAnimation);
                    return;
                } else {
                    // Loop the current animation
                    index = 0;
                }
            }
        };

        this.animationInterval = window.setInterval(animate, 100);
    }

    /**
     * Stops the current animation.
     */
    public stopAnimation(): void {
        if (this.animationInterval !== null) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    /**
     * Starts dragging the avatar.
     * @param event - The mouse event that triggered the drag.
     */
    public startDrag(event: MouseEvent): void {
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
     * @param event - The mouse event during dragging.
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
            if (Math.abs(dx) > Math.abs(dy)) {
                this.startAnimation(dx > 0 ? 'draggedRight' : 'draggedLeft');
            } else {
                this.startAnimation(dy > 0 ? 'draggedDown' : 'draggedUp');
            }
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
     * Starts the appropriate walking animation based on the current movement direction.
     */
    private startWalkingAnimation(): void {
        switch (this.currentMovementDirection) {
            case 'left':
                this.startAnimation('swayBack');
                break;
            case 'right':
                this.startAnimation('swayBack');
                break;
            case 'up':
                this.startAnimation('swayBack');
                break;
            case 'down':
                this.startAnimation('swayFront');
                break;
        }
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
        if (selected) {
            this.startAnimation('clapping');
        } else {
            this.stopMovement(); // This will set the appropriate animation
        }
    }

    /**
     * Sets up hover listeners for the avatar.
     */
    private setupHoverListeners(): void {
        this.element.addEventListener('mouseenter', this.onMouseEnter);
        this.element.addEventListener('mouseleave', this.onMouseLeave);
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
}