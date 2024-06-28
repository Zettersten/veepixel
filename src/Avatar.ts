import { Floor } from "./Floor";
import { AvatarOptions, AvatarSprite, AvatarSpriteType, AvatarSprites } from "./Types";

const defaultAvatarSprites: AvatarSprites = {
    breathBack: [{
        index: 0,
        offsetX: 0,
        offsetY: -192
    },
    {
        index: 1,
        offsetX: -192,
        offsetY: -192
    },
    {
        index: 2,
        offsetX: -384,
        offsetY: -192
    },
    {
        index: 3,
        offsetX: -576,
        offsetY: -192
    },
    {
        index: 4,
        offsetX: -768,
        offsetY: -192
    },
    {
        index: 5,
        offsetX: -960,
        offsetY: -192
    },
    {
        index: 6,
        offsetX: -1152,
        offsetY: -192
    },
    {
        index: 7,
        offsetX: -1344,
        offsetY: -192
    },
    {
        index: 8,
        offsetX: -1536,
        offsetY: -192
    },
    {
        index: 9,
        offsetX: -1728,
        offsetY: -192
    },
    {
        index: 10,
        offsetX: -1920,
        offsetY: -192
    },
    {
        index: 11,
        offsetX: -2112,
        offsetY: -192
    }],
    breathFront: [
        {
            index: 0,
            offsetX: 0,
            offsetY: -384
        },
        {
            index: 1,
            offsetX: -192,
            offsetY: -384
        },
        {
            index: 2,
            offsetX: -384,
            offsetY: -384
        },
        {
            index: 3,
            offsetX: -576,
            offsetY: -384
        },
        {
            index: 4,
            offsetX: -768,
            offsetY: -384
        },
        {
            index: 5,
            offsetX: -960,
            offsetY: -384
        },
        {
            index: 6,
            offsetX: -1152,
            offsetY: -384
        },
        {
            index: 7,
            offsetX: -1344,
            offsetY: -384
        },
        {
            index: 8,
            offsetX: -1536,
            offsetY: -384
        },
        {
            index: 9,
            offsetX: -1728,
            offsetY: -384
        },
        {
            index: 10,
            offsetX: -1920,
            offsetY: -384
        },
        {
            index: 11,
            offsetX: -2112,
            offsetY: -384
        }
    ],
    clapping: [
        {
            index: 0,
            offsetX: 0,
            offsetY: -576
        },
        {
            index: 1,
            offsetX: -192,
            offsetY: -576
        },
        {
            index: 2,
            offsetX: -384,
            offsetY: -576
        },
        {
            index: 3,
            offsetX: -576,
            offsetY: -576
        },
        {
            index: 4,
            offsetX: -768,
            offsetY: -576
        },
        {
            index: 5,
            offsetX: -960,
            offsetY: -576
        },
        {
            index: 6,
            offsetX: -1152,
            offsetY: -576
        },
        {
            index: 7,
            offsetX: -1344,
            offsetY: -576
        },
        {
            index: 8,
            offsetX: -1536,
            offsetY: -576
        },
        {
            index: 9,
            offsetX: -1728,
            offsetY: -576
        },
        {
            index: 10,
            offsetX: -1920,
            offsetY: -576
        },
        {
            index: 11,
            offsetX: -2112,
            offsetY: -576
        },
    ],
    draggedDown: [
        {
            index: 0,
            offsetX: 0,
            offsetY: -768,
        },
        {
            index: 1,
            offsetX: -192,
            offsetY: -768,
        },
        {
            index: 2,
            offsetX: -384,
            offsetY: -768,
        }
    ],
    draggedLeft: [
        {
            index: 0,
            offsetX: -576,
            offsetY: -768
        },
        {
            index: 1,
            offsetX: -768,
            offsetY: -768
        },
    ],
    draggedRight: [
        {
            index: 0,
            offsetX: -960,
            offsetY: -768
        },
        {
            index: 1,
            offsetX: -1152,
            offsetY: -768
        },
    ],
    draggedUp: [
        {
            index: 0,
            offsetX: -1344,
            offsetY: -768
        },
        {
            index: 1,
            offsetX: -1536,
            offsetY: -768
        }
    ],
    handsUp: [
        {
            index: 0,
            offsetX: -1728,
            offsetY: -768
        },
        {
            index: 1,
            offsetX: -1920,
            offsetY: -768
        },
        {
            index: 2,
            offsetX: -2112,
            offsetY: -768
        },
        {
            index: 3,
            offsetX: 0,
            offsetY: -960
        },
        {
            index: 4,
            offsetX: -192,
            offsetY: -960
        },
        {
            index: 5,
            offsetX: -384,
            offsetY: -960
        },
        {
            index: 6,
            offsetX: -576,
            offsetY: -960
        },
        {
            index: 7,
            offsetX: -768,
            offsetY: -960
        },
        {
            index: 8,
            offsetX: -960,
            offsetY: -960
        },
        {
            index: 9,
            offsetX: -1152,
            offsetY: -960
        },
        {
            index: 10,
            offsetX: -1344,
            offsetY: -960
        },
        {
            index: 11,
            offsetX: -1536,
            offsetY: -960
        },
    ],
    hovering: [
        {
            index: 0,
            offsetX: -1728,
            offsetY: -960
        },
        {
            index: 1,
            offsetX: -1920,
            offsetY: -960
        },
        {
            index: 2,
            offsetX: -2112,
            offsetY: -960
        },
        {
            index: 3,
            offsetX: 0,
            offsetY: -1152
        },
        {
            index: 4,
            offsetX: -192,
            offsetY: -1152
        },
        {
            index: 5,
            offsetX: -384,
            offsetY: -1152
        },
        {
            index: 6,
            offsetX: -576,
            offsetY: -1152
        },
        {
            index: 7,
            offsetX: -768,
            offsetY: -1152
        },
        {
            index: 8,
            offsetX: -960,
            offsetY: -1152
        },
        {
            index: 9,
            offsetX: -1152,
            offsetY: -1152
        },
        {
            index: 10,
            offsetX: -1344,
            offsetY: -1152
        },
        {
            index: 11,
            offsetX: -1536,
            offsetY: -1152
        },
        {
            index: 12,
            offsetX: -1728,
            offsetY: -1152
        },
    ],
    jumping: [
        {
            index: 0,
            offsetX: -1920,
            offsetY: -1152,
        },
        {
            index: 1,
            offsetX: -2112,
            offsetY: -1152,
        },
        {
            index: 2,
            offsetX: 0,
            offsetY: -1344,
        },
        {
            index: 3,
            offsetX: -192,
            offsetY: -1344,
        },
        {
            index: 4,
            offsetX: -384,
            offsetY: -1344,
        },
        {
            index: 5,
            offsetX: -576,
            offsetY: -1344,
        },
        {
            index: 6,
            offsetX: -768,
            offsetY: -1344,
        },
        {
            index: 7,
            offsetX: -960,
            offsetY: -1344,
        },
        {
            index: 8,
            offsetX: -1152,
            offsetY: -1344,
        },
        {
            index: 9,
            offsetX: -1344,
            offsetY: -1344,
        },
        {
            index: 10,
            offsetX: -1536,
            offsetY: -1344,
        },
        {
            index: 11,
            offsetX: -1728,
            offsetY: -1344,
        },
        {
            index: 12,
            offsetX: -1920,
            offsetY: -1344,
        },
    ],
    swayBack: [
        {
            index: 0,
            offsetX: -2112,
            offsetY: -1344
        },
        {
            index: 1,
            offsetX: 0,
            offsetY: -1536
        },
        {
            index: 2,
            offsetX: -192,
            offsetY: -1536
        },
        {
            index: 3,
            offsetX: -384,
            offsetY: -1536
        },
        {
            index: 4,
            offsetX: -576,
            offsetY: -1536
        },
        {
            index: 5,
            offsetX: -768,
            offsetY: -1536
        },
        {
            index: 6,
            offsetX: -960,
            offsetY: -1536
        },
        {
            index: 7,
            offsetX: -1152,
            offsetY: -1536
        },
        {
            index: 8,
            offsetX: -1344,
            offsetY: -1536
        },
        {
            index: 9,
            offsetX: -1536,
            offsetY: -1536
        },
        {
            index: 10,
            offsetX: -1728,
            offsetY: -1536
        },
        {
            index: 11,
            offsetX: -1920,
            offsetY: -1536
        },
        {
            index: 12,
            offsetX: -2112,
            offsetY: -1536
        }
    ],
    swayFront: [
        {
            index: 0,
            offsetX: 0,
            offsetY: -1728
        },
        {
            index: 1,
            offsetX: -192,
            offsetY: -1728
        },
        {
            index: 2,
            offsetX: -384,
            offsetY: -1728
        },
        {
            index: 3,
            offsetX: -576,
            offsetY: -1728
        },
        {
            index: 4,
            offsetX: -768,
            offsetY: -1728
        },
        {
            index: 5,
            offsetX: -960,
            offsetY: -1728
        },
        {
            index: 6,
            offsetX: -1152,
            offsetY: -1728
        },
        {
            index: 7,
            offsetX: -1344,
            offsetY: -1728
        },
        {
            index: 8,
            offsetX: -1536,
            offsetY: -1728
        },
        {
            index: 9,
            offsetX: -1728,
            offsetY: -1728
        },
        {
            index: 10,
            offsetX: -1920,
            offsetY: -1728
        },
        {
            index: 11,
            offsetX: -2112,
            offsetY: -1728
        },
        {
            index: 12,
            offsetX: 0,
            offsetY: -1920
        }
    ],
    turnAround: [
        {
            index: 0,
            offsetX: -192,
            offsetY: -2112
        },
        {
            index: 1,
            offsetX: -384,
            offsetY: -2112
        },
        {
            index: 2,
            offsetX: -576,
            offsetY: -2112
        },
        {
            index: 3,
            offsetX: -768,
            offsetY: -2112
        },
        {
            index: 4,
            offsetX: -960,
            offsetY: -2112
        },
        {
            index: 5,
            offsetX: -1152,
            offsetY: -2112
        },
        {
            index: 6,
            offsetX: -1344,
            offsetY: -2112
        },
        {
            index: 7,
            offsetX: -1536,
            offsetY: -2112
        },
        {
            index: 8,
            offsetX: -1728,
            offsetY: -2112
        },
        {
            index: 9,
            offsetX: -1920,
            offsetY: -2112
        },
        {
            index: 10,
            offsetX: -2112,
            offsetY: -2112
        },
        {
            index: 11,
            offsetX: -2304,
            offsetY: 0
        },
        {
            index: 12,
            offsetX: -2304,
            offsetY: -192
        },
        {
            index: 13,
            offsetX: -2304,
            offsetY: -384
        }
    ],
    talk: [
        {
            index: 0,
            offsetX: -192,
            offsetY: -1920
        },
        {
            index: 1,
            offsetX: -384,
            offsetY: -1920
        },
        {
            index: 2,
            offsetX: -576,
            offsetY: -1920
        },
        {
            index: 3,
            offsetX: -768,
            offsetY: -1920
        },
        {
            index: 4,
            offsetX: -960,
            offsetY: -1920
        },
        {
            index: 5,
            offsetX: -1152,
            offsetY: -1920
        },
        {
            index: 6,
            offsetX: -1344,
            offsetY: -1920
        },
        {
            index: 7,
            offsetX: -1536,
            offsetY: -1920
        },
        {
            index: 8,
            offsetX: -1728,
            offsetY: -1920
        },
        {
            index: 9,
            offsetX: -1920,
            offsetY: -1920
        },
        {
            index: 10,
            offsetX: -2112,
            offsetY: -1920
        },
        {
            index: 11,
            offsetX: 0,
            offsetY: -2112
        }
    ],
    blink: [
        {
            index: 0,
            offsetX: 0,
            offsetY: 0
        },
        {
            index: 1,
            offsetX: -192,
            offsetY: 0
        },
        {
            index: 2,
            offsetX: -384,
            offsetY: 0
        },
        {
            index: 3,
            offsetX: -576,
            offsetY: 0
        },
        {
            index: 4,
            offsetX: -768,
            offsetY: 0
        },
        {
            index: 5,
            offsetX: -960,
            offsetY: 0
        },
        {
            index: 6,
            offsetX: -1152,
            offsetY: 0
        },
        {
            index: 7,
            offsetX: -1344,
            offsetY: 0
        },
        {
            index: 8,
            offsetX: -1536,
            offsetY: 0
        },
        {
            index: 9,
            offsetX: -1728,
            offsetY: 0
        },
        {
            index: 10,
            offsetX: -1920,
            offsetY: 0
        },
        {
            index: 11,
            offsetX: -2112,
            offsetY: 0
        }
    ],
};

/**
 * Represents an avatar in the game.
 */
export class Avatar {
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

    /**
     * Creates a new Avatar instance.
     * @param floor - The floor on which the avatar is placed.
     * @param options - Avatar options including path and name.
     */
    constructor(floor: Floor, options: AvatarOptions) {
        this.options = options;
        this.floor = floor;
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
     * Moves the avatar by a given delta.
     * @param dx - The change in x position.
     * @param dy - The change in y position.
     */
    public move(dx: number, dy: number): void {
        const currentTransform = new DOMMatrix(getComputedStyle(this.element).transform);
        const newX = currentTransform.m41 + dx;
        const newY = currentTransform.m42 + dy;
        const constrained = this.floor.constrainPosition(newX, newY);
        this.setElementPosition(constrained.y, constrained.x);
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
        const sprites = defaultAvatarSprites[spriteType];

        const animate = () => {
            this.setSpritePosition(sprites[index]);
            index = (index + 1) % sprites.length;

            if (index === 0 && this.oneTimeAnimations.has(spriteType) && this.nextAnimation) {
                this.startAnimation(this.nextAnimation);
                return;
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
     * Sets the selected state of the avatar.
     * @param selected - Whether the avatar is selected or not.
     */
    public setSelected(selected: boolean): void {
        this.isSelected = selected;
        this.element.style.filter = selected ? 'drop-shadow(2px 4px 6px yellow)' : 'none';
        this.startAnimation(selected ? 'clapping' : (this.isHovering ? 'hovering' : 'breathBack'));
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