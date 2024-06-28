import { Floor } from "./Floor";
import { Avatar } from "./Avatar";

export class Game {
    private readonly timeStep: number = 1000 / 30; // 30 FPS
    private lastTime: number = 0;
    private accumulator: number = 0;
    private gameRunning: boolean = false;
    private floor: Floor;
    private selectedAvatar: Avatar | null = null;

    constructor(floor: Floor) {
        this.floor = floor;
        this.setupKeyboardListeners();
        this.setupMouseListeners();
    }

    start() {
        this.gameRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    stop() {
        this.gameRunning = false;
    }

    private gameLoop() {
        if (!this.gameRunning) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.accumulator += deltaTime;

        while (this.accumulator >= this.timeStep) {
            this.update();
            this.accumulator -= this.timeStep;
        }

        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    private update() {
        this.floor.getAvatars().forEach(avatar => {
            // Perform any necessary updates for each avatar
        });
    }

    private render() {
        // The browser handles rendering of the updated positions
    }

    private setupKeyboardListeners() {
        document.addEventListener('keydown', (event) => {
            if (!this.selectedAvatar) return;

            const moveDistance = 10; // pixels to move per key press

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
            }
        });
    }

    private setupMouseListeners() {
        this.floor.getElement().addEventListener('mousedown', (event) => {
            const clickedElement = event.target as HTMLElement;
            const clickedAvatar = this.floor.getAvatars().find(avatar => avatar.getElement() === clickedElement);
            if (clickedAvatar) {
                this.selectAvatar(clickedAvatar);
            } else {
                // Deselect when clicking outside any avatar
                if (this.selectedAvatar) {
                    this.selectedAvatar.setSelected(false);
                    this.selectedAvatar = null;
                }
            }
        });
    }

    public selectAvatar(avatar: Avatar) {
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

    public addAvatar(avatar: Avatar) {

        this.floor.placeAvatarEvenlySpacedAppart(avatar);

        avatar.startAnimation('breathBack');

        avatar.getElement().addEventListener('mousedown', (event) => {
            avatar.startDrag(event);
        });
    }
}