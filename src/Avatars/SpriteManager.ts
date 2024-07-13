import { AvatarSprite, AvatarSpriteType, AvatarSprites, Rect, Position } from "../Types/Types";

/**
 * Manages sprite animations and collision detection for avatars.
 */
export class SpriteManager {
    private boundingBox: Rect | null = null;
    private currentSpriteType: AvatarSpriteType | null = null;
    private currentSpriteIndex: number = 0;
    private debugElement: HTMLDivElement | null = null;
    private fullSizeDebugElement: HTMLDivElement | null = null;

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
    public async recalculateBoundingBox(imagePath: string): Promise<void> {
        return new Promise((resolve) => {
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
                this.boundingBox = {
                    x: Math.max(0, minX - padding),
                    y: Math.max(0, minY - padding),
                    width: Math.min(this.width, maxX - minX + 1 + padding * 2),
                    height: Math.min(this.height, maxY - minY + 1 + padding * 2)
                };
                resolve();
            };
        });
    }
    
    /**
     * Gets the current bounding box of the sprite.
     * @returns The bounding box.
     */
    public getBoundingBox(): Rect {
        const box = this.boundingBox || { x: 0, y: 0, width: this.width, height: this.height };
        return box;
    }

    /**
     * Gets the collision rectangle for the avatar.
     * @param position - The current position of the avatar.
     * @returns The collision rectangle.
     */
    public getCollisionRect(position: Position): Rect {
        if (this.boundingBox) {
            return {
                x: this.boundingBox.x,
                y: this.boundingBox.y,
                width: this.boundingBox.width,
                height: this.boundingBox.height
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
        if (show) {
            if (!this.debugElement) {
                this.debugElement = document.createElement('div');
                this.debugElement.style.position = 'absolute';
                this.debugElement.style.pointerEvents = 'none';
                parentElement.appendChild(this.debugElement);
            }
            if (!this.fullSizeDebugElement) {
                this.fullSizeDebugElement = document.createElement('div');
                this.fullSizeDebugElement.style.position = 'absolute';
                this.fullSizeDebugElement.style.pointerEvents = 'none';
                parentElement.appendChild(this.fullSizeDebugElement);
            }
            this.updateDebugBoundingBox();
            this.debugElement.style.display = 'block';
            this.fullSizeDebugElement.style.display = 'block';
        } else if (this.debugElement && this.fullSizeDebugElement) {
            this.debugElement.style.display = 'none';
            this.fullSizeDebugElement.style.display = 'none';
        }
    }

    private updateDebugBoundingBox(): void {
        if (this.debugElement && this.fullSizeDebugElement && this.boundingBox) {
            // Actual bounding box (red)
            this.debugElement.style.left = `${this.boundingBox.x}px`;
            this.debugElement.style.top = `${this.boundingBox.y}px`;
            this.debugElement.style.width = `${this.boundingBox.width - 2}px`;
            this.debugElement.style.height = `${this.boundingBox.height - 2}px`;
            this.debugElement.style.border = '2px solid red';
    
            // Full size bounding box (yellow)
            this.fullSizeDebugElement.style.left = '0px';
            this.fullSizeDebugElement.style.top = '0px';
            this.fullSizeDebugElement.style.width = `${this.width - 2}px`;
            this.fullSizeDebugElement.style.height = `${this.height - 2}px`;
            this.fullSizeDebugElement.style.border = '2px solid yellow';
        }
    }
}