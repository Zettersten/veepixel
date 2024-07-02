import { Floor } from "./Floor";
import { Avatar } from "./Avatar";
import { AnimationManager } from "./AnimationManager";
import { AvatarOptions, AvatarSprites } from "./Types";

/**
 * Represents the main game logic.
 */
export class Game {
    private debugMode: boolean = false;
    private readonly floor: Floor;
    private selectedAvatar: Avatar | null = null;
    private readonly animationManager: AnimationManager;
    private avatars: Avatar[] = [];

    /**
     * Creates a new Game instance.
     * @param floor - The floor on which the game takes place.
     */
    constructor(floor: Floor, animationManager: AnimationManager) {
        this.floor = floor;
        this.animationManager = animationManager;
        this.setupEventListeners();
    }

    /**
     * Sets up event listeners for the game.
     */
    private setupEventListeners(): void {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        this.floor.getElement().addEventListener('mousedown', this.onFloorClick);
    }

    /**
     * Starts the game.
     */
    public start(): void {
        this.animationManager.start();
    }

    /**
     * Stops the game.
     */
    public stop(): void {
        this.animationManager.stop();
    }

    /**
     * Handles keydown events for avatar movement.
     */
    private onKeyDown = (event: KeyboardEvent): void => {
        if (!this.selectedAvatar) return;

        const moveDistance = 5; // pixels to move per frame

        switch (event.key) {
            case 'ArrowLeft':
                this.selectedAvatar.move(-moveDistance, 0);
                break;
            case 'ArrowRight':
                this.selectedAvatar.move(moveDistance, 0);
                break;
            case 'ArrowUp':
                this.selectedAvatar.move(0, -moveDistance);
                break;
            case 'ArrowDown':
                this.selectedAvatar.move(0, moveDistance);
                break;
            case ' ': // Spacebar
                this.selectedAvatar.jump();
                break;
        }
    }

    /**
     * Handles keyup events to stop avatar movement.
     */
    private onKeyUp = (event: KeyboardEvent): void => {
        if (!this.selectedAvatar) return;

        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
                this.selectedAvatar.stopMovement();
                break;
        }
    }

    /**
     * Handles click events on the floor for avatar selection.
     */
    private onFloorClick = (event: MouseEvent): void => {
        const clickedElement = event.target as HTMLElement;
        const clickedAvatar = this.avatars.find(avatar => avatar.getElement() === clickedElement);

        if (clickedAvatar) {
            this.selectAvatar(clickedAvatar);
        } else if (this.selectedAvatar) {
            this.selectedAvatar.setSelected(false);
            this.selectedAvatar = null;
        }
    }

    /**
     * Selects an avatar or deselects if it's already selected.
     * @param avatar - The avatar to select or deselect.
     */
    public selectAvatar(avatar: Avatar): void {
        if (this.selectedAvatar) {
            this.selectedAvatar.setSelected(false);
        }
        if (this.selectedAvatar !== avatar) {
            this.selectedAvatar = avatar;
            avatar.setSelected(true);
        } else {
            this.selectedAvatar = null;
        }
    }

    /**
     * Adds an avatar to the game.
     * @param options - The options for creating the avatar.
     * @param sprites - The sprite data for the avatar.
     */
    public addAvatar(options: AvatarOptions, sprites: AvatarSprites): void {
        const avatar = new Avatar(this.floor, options, sprites);
        this.floor.placeAvatarRandomly(avatar);
        this.avatars.push(avatar);
        this.animationManager.addEntity(avatar);
        avatar.startAnimation('breathBack');
        avatar.getElement().style.zIndex = this.avatars.length.toString();  // Set z-index based on order
    }

    /**
     * Removes an avatar from the game.
     * @param avatar - The avatar to remove.
     */
    public removeAvatar(avatar: Avatar): void {
        const index = this.avatars.indexOf(avatar);
        if (index > -1) {
            this.avatars.splice(index, 1);
            this.animationManager.removeEntity(avatar);
            this.floor.removeAvatar(avatar);
            if (this.selectedAvatar === avatar) {
                this.selectedAvatar = null;
            }
        }
    }

    /**
     * Removes all avatars from the game.
     */
    public clearAvatars(): void {
        for (const avatar of this.avatars) {
            this.animationManager.removeEntity(avatar);
        }
        this.avatars = [];
        this.floor.clearFloor();
        this.selectedAvatar = null;
    }

    public changeAvatarSprite(avatar: Avatar, newSpritePath: string): void {
        avatar.updateSprite(newSpritePath);
        avatar.calculateSpriteBoundingBox();
    }

    public toggleDebugMode(enable: boolean): void {
        this.debugMode = enable;
        this.avatars.forEach(avatar => avatar.toggleDebugBoundingBox(enable));
    }
}