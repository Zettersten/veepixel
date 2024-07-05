import "./index.css";
import { Game } from "./Game";
import { AdaptableAlien } from "./Avatars/AdaptableAlien";
import { Floor } from "./Floor";
import { Music } from "./Music";
import { AnimationManager } from "./AnimationManager";
import { UserManager } from "./UserManager";
import { UserActionHandler } from "./UserActionHandler";
import { EventEmitter } from "./EventEmitter";

/**
 * Initializes and starts the game.
 */
function initializeGame(): void {
    const eventEmitter = new EventEmitter();
    const floorElement = document.getElementById("floor");

    if (!floorElement) {
        throw new Error("Floor element not found");
    }

    const floor = new Floor(floorElement);
    const userManager = new UserManager(floor);
    const animationManager = new AnimationManager();
    const userActionHandler = new UserActionHandler(userManager);
    const music = new Music('.music-player');
    const game = new Game(floor, animationManager, userManager, userActionHandler);

    const avatarCount = 5;
    for (let i = 0; i < avatarCount; i++) {
        setTimeout(() => {
            game.addUser(`User ${i}`, 'AdaptableAlien');
        }, 1000 * i);
    }

    game.toggleDebugMode(false);

    // Set up event listeners
    game.on('gameStarted', () => console.log('Game started'));
    game.on('gameStopped', () => console.log('Game stopped'));
    userManager.on('userAdded', (user) => console.log(`User added: ${user.username}`));
    userManager.on('userRemoved', (user) => console.log(`User removed: ${user.username}`));
    animationManager.on('entityAdded', (entity) => console.log('Entity added to animation manager'));
    music.on('play', () => console.log('Music started playing'));
    music.on('pause', () => console.log('Music paused'));

    game.start();

    // Make game globally accessible for debugging
    (window as any).game = game;
}

// Start the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeGame);