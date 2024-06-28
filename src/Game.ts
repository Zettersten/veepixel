import { Floor } from "./Floor";
import { Avatar } from "./Avatar";

/**
 * Represents the main game logic.
 */
export class Game {
    private readonly timeStep: number = 1000 / 30; // 30 FPS
    private lastTime: number = 0;
    private accumulator: number = 0;
    private gameRunning: boolean = false;
    private readonly floor: Floor;
    private selectedAvatar: Avatar | null = null;

    /**
     * Creates a new Game instance.
     * @param floor - The floor on which the game takes place.
     */
    constructor(floor: Floor) {
        this.floor = floor;
        this.setupKeyboardListeners();
        this.setupMouseListeners();
    }

    /**
     * Starts the game loop.
     */
    start(): void {
        this.gameRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    /**
     * Stops the game loop.
     */
    stop(): void {
        this.gameRunning = false;
    }

    /**
     * The main game loop.
     */
    private gameLoop(): void {
        if (!this.gameRunning) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.accumulator += deltaTime;

        while (this.accumulator >= this.timeStep) {
            this.update();
            this.accumulator -= this.timeStep;
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Updates the game state.
     */
    private update(): void {
        // Perform any necessary updates for each avatar
        // Currently empty as there are no continuous updates needed
    }

    /**
     * Sets up keyboard listeners for avatar movement.
     */
    private setupKeyboardListeners(): void {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    }

    private onKeyDown = (event: KeyboardEvent) => {
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

    private onKeyUp = (event: KeyboardEvent) => {
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
     * Sets up mouse listeners for avatar selection.
     */
    private setupMouseListeners(): void {
        this.floor.getElement().addEventListener('mousedown', (event) => {
            const clickedElement = event.target as HTMLElement;
            const clickedAvatar = this.floor.getAvatars().find(avatar => avatar.getElement() === clickedElement);
            
            if (clickedAvatar) {
                this.selectAvatar(clickedAvatar);
            } else if (this.selectedAvatar) {
                this.selectedAvatar.setSelected(false);
                this.selectedAvatar = null;
            }
        });
    }

    /**
     * Selects an avatar.
     * @param avatar - The avatar to select.
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
     * @param avatar - The avatar to add.
     */
    public addAvatar(avatar: Avatar): void {
        this.floor.placeAvatarRandomly(avatar);
        avatar.startAnimation('breathBack');
        avatar.getElement().addEventListener('mousedown', (event) => {
            avatar.startDrag(event);
        });
    }
}