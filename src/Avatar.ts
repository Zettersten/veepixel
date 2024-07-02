import { Floor } from "./Floor";
import { AvatarOptions, AvatarSprite, AvatarSpriteType, AvatarSprites, MovementDirectionType, Rect } from "./Types";

/**
 * Represents an avatar in the game.
 */
export class Avatar {

    private originalPosition: { x: number, y: number } | null = null;
    private debugElement: HTMLDivElement | null = null;
    private spriteBoundingBox: Rect | null = null;
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
        this.calculateSpriteBoundingBox();
    }

    /**
     * Draws a debug box around the sprite's bounding box.
     */
    private drawDebugBoundingBox(): void {
        if (!this.spriteBoundingBox) return;
    
        if (!this.debugElement) {
            this.debugElement = document.createElement('div');
            this.debugElement.style.position = 'absolute';
            this.debugElement.style.border = '2px solid red';
            this.debugElement.style.pointerEvents = 'none';
            this.element.appendChild(this.debugElement);
        }
    
        const { x, y, width, height } = this.spriteBoundingBox;
        this.debugElement.style.left = `${x}px`;
        this.debugElement.style.top = `${y}px`;
        this.debugElement.style.width = `${width - 2}px`;  // Subtract border width
        this.debugElement.style.height = `${height - 2}px`;  // Subtract border width
        this.debugElement.style.boxSizing = 'content-box';
    }

    /**
     * Updates the avatar's sprite with a new image path.
     * @param newPath - The new image path for the avatar's sprite.
     */
    public updateSprite(newPath: string): void {
        this.options.path = newPath;
        this.element.style.backgroundImage = `url(${newPath})`;
        this.calculateSpriteBoundingBox();
    }

    /**
     * Calculates the bounding box of the sprite based on non-transparent pixels.
     */
    public calculateSpriteBoundingBox(): void {
        const img = new Image();
        img.src = this.options.path;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d')!;
    
            // Draw only the first frame of the sprite
            ctx.drawImage(img, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
    
            const imageData = ctx.getImageData(0, 0, this.width, this.height);
            const data = imageData.data;
    
            let minX = this.width, minY = this.height, maxX = 0, maxY = 0;
            const alphaThreshold = 10; // Adjust this value to fine-tune detection
    
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    const alpha = data[(y * this.width + x) * 4 + 3];
                    if (alpha > alphaThreshold) {
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }
    
            // Add a small padding to the bounding box
            const padding = 5;
            this.spriteBoundingBox = {
                x: Math.max(0, minX - padding),
                y: Math.max(0, minY - padding),
                width: Math.min(this.width, maxX - minX + 1 + padding * 2),
                height: Math.min(this.height, maxY - minY + 1 + padding * 2)
            };
    
            this.floor.updateAvatarCollision(this);
            this.drawDebugBoundingBox();
        };
    }

    /**
     * Gets the collision rectangle for the avatar.
     * @returns The collision rectangle.
     */
    public getCollisionRect(): Rect {
        const position = this.getPosition();
        if (this.spriteBoundingBox) {
            return {
                x: position.x + this.spriteBoundingBox.x,
                y: position.y + this.spriteBoundingBox.y,
                width: this.spriteBoundingBox.width,
                height: this.spriteBoundingBox.height
            };
        } else {
            // Fallback to full sprite size if bounding box hasn't been calculated yet
            return {
                x: position.x,
                y: position.y,
                width: this.width,
                height: this.height
            };
        }
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
        const transform = `translate3d(${left}px, ${top}px, 0)`;
        this.element.style.transform = transform;
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

        let constrained: { y: any; x: any; };

        if (this.isDragging) {
            constrained = this.floor.constrainPosition(newX, newY);
        } else {
            constrained = this.floor.constrainPositionWithCollision(this, newX, newY);
        }

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

        const position = this.getPosition();
        this.originalPosition = { x: position.x, y: position.y };

        const floorRect = this.floor.getElement().getBoundingClientRect();
        const avatarRect = this.element.getBoundingClientRect();

        this.dragOffset = {
            x: event.clientX - (avatarRect.left - floorRect.left),
            y: event.clientY - (avatarRect.top - floorRect.top)
        };
        this.lastPosition = { x: event.clientX, y: event.clientY };

        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDrag);

        this.element.style.zIndex = '1000';
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

        const currentPosition = this.getPosition();

        if (!this.floor.isPositionFree(currentPosition.x, currentPosition.y, this, this)) {
            // Move back to original position if dropped on another avatar
            if (this.originalPosition) {
                this.setElementPosition(this.originalPosition.y, this.originalPosition.x);
            }
        }

        this.originalPosition = null;
        this.dragOffset = null;
        this.lastPosition = null;
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.stopDrag);
        this.startAnimation(this.isHovering ? 'hovering' : 'breathBack');
        this.element.style.zIndex = '';
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
        // this.element.style.filter = selected ? 'drop-shadow(2px 4px 6px yellow)' : 'none';
        this.element.style.filter = selected ? 'none' : 'none';
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
    /**
     * Gets the width of the avatar.
     * @returns The width of the avatar.
     */
    public getWidth(): number {
        return this.width;
    }

    /**
     * Gets the height of the avatar.
     * @returns The height of the avatar.
     */
    public getHeight(): number {
        return this.height;
    }

    /**
     * Toggles the visibility of the debug bounding box.
     * @param show - Whether to show or hide the debug box.
     */
    public toggleDebugBoundingBox(show: boolean): void {
        if (this.debugElement) {
            this.debugElement.style.display = show ? 'block' : 'none';
            if (show) {
                this.drawDebugBoundingBox();
            }
        } else if (show) {
            this.drawDebugBoundingBox();
        }
    }
}