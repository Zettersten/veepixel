import { AvatarSprite, AvatarSpriteType, AvatarSprites, Rect, Position } from "./Types";

/**
 * Manages sprite animations and collision detection for avatars.
 */
export class SpriteManager {
    private currentSpriteType: AvatarSpriteType | null = null;
    private currentSpriteIndex: number = 0;
    private spriteBoundingBox: Rect | null = null;
    private debugElement: HTMLDivElement | null = null;

    /**
     * Creates a new SpriteManager instance.
     * @param sprites - All sprite animations for the avatar.
     * @param width - The width of the sprite.
     * @param height - The height of the sprite.
     */
    constructor(
        private readonly sprites: AvatarSprites,
        public readonly width: number = 192,
        public readonly height: number = 192
    ) { }

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
     * Updates the current animation frame.
     * @returns The new sprite frame, or null if no change.
     */
    public update(): AvatarSprite | null {
        if (this.currentSpriteType && this.sprites[this.currentSpriteType]) {
            const sprites = this.sprites[this.currentSpriteType];
            this.currentSpriteIndex = (this.currentSpriteIndex + 1) % sprites.length;
            return sprites[this.currentSpriteIndex];
        }
        return null;
    }

    /**
     * Recalculates the bounding box of the sprite based on non-transparent pixels.
     * @param imagePath - The path to the sprite image.
     */
    public recalculateBoundingBox(imagePath: string): void {
        const img = new Image();
        img.src = imagePath;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d')!;

            ctx.drawImage(img, 0, 0, this.width, this.height, 0, 0, this.width, this.height);

            const imageData = ctx.getImageData(0, 0, this.width, this.height);
            const data = imageData.data;

            let minX = this.width, minY = this.height, maxX = 0, maxY = 0;
            const alphaThreshold = 10;

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

            const padding = 5;
            this.spriteBoundingBox = {
                x: Math.max(0, minX - padding),
                y: Math.max(0, minY - padding),
                width: Math.min(this.width, maxX - minX + 1 + padding * 2),
                height: Math.min(this.height, maxY - minY + 1 + padding * 2)
            };
        };
    }

    /**
     * Gets the collision rectangle for the avatar.
     * @param position - The current position of the avatar.
     * @returns The collision rectangle.
     */
    public getCollisionRect(position: Position): Rect {
        if (this.spriteBoundingBox) {
            return {
                x: position.x + this.spriteBoundingBox.x,
                y: position.y + this.spriteBoundingBox.y,
                width: this.spriteBoundingBox.width,
                height: this.spriteBoundingBox.height
            };
        } else {
            return {
                x: position.x,
                y: position.y,
                width: this.width,
                height: this.height
            };
        }
    }

    /**
     * Toggles the visibility of the debug bounding box.
     * @param show - Whether to show or hide the debug box.
     * @param parentElement - The parent element to append the debug box to.
     */
    public toggleDebugBoundingBox(show: boolean, parentElement: HTMLElement): void {
        console.log('toggleDebugBoundingBox', show, parentElement, this.debugElement);
        if (show) {
            if (!this.debugElement) {
                this.debugElement = document.createElement('div');
                this.debugElement.style.position = 'absolute';
                this.debugElement.style.border = '2px solid red';
                this.debugElement.style.pointerEvents = 'none';
                parentElement.appendChild(this.debugElement);
            }
            this.updateDebugBoundingBox();
            this.debugElement.style.display = 'block';
        } else if (this.debugElement) {
            this.debugElement.style.display = 'none';
        }
    }

    /**
     * Updates the position and size of the debug bounding box.
     */
    private updateDebugBoundingBox(): void {
        if (this.debugElement && this.spriteBoundingBox) {
            const { x, y, width, height } = this.spriteBoundingBox;
            this.debugElement.style.left = `${x}px`;
            this.debugElement.style.top = `${y}px`;
            this.debugElement.style.width = `${width - 2}px`;
            this.debugElement.style.height = `${height - 2}px`;
        }
    }
}