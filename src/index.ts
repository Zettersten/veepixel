import "./index.css";
import { Game } from "./Game";
import { AdaptableAlien } from "./Avatars/AdaptableAlien";
import { Floor } from "./Floor";
import { Music } from "./Music";
import { AnimationManager } from "./AnimationManager";
import { UserManager } from "./UserManager";
import { UserActionHandler } from "./UserActionHandler";
import { Avatar } from "./Avatar";
import { AvatarType } from "./Types";

/**
 * Initializes and starts the game.
 */
async function initializeGame(): Promise<void> {
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

        const allAvatarTypes : AvatarType[] = ['AdaptableAlien', 'ReflectiveRhino', 'GaryBee'];
        const randomAvatarType = allAvatarTypes[Math.floor(Math.random() * allAvatarTypes.length)];

        await game.addUser(`User ${i}`, randomAvatarType);
    }

    console.log('Game initialized');

    // Set up event listeners
    game.on('gameStarted', () => console.log('Game started'));
    game.on('gameStopped', () => console.log('Game stopped'));
    userManager.on('userAdded', (user) => console.log(`User added: ${user.username}`));
    userManager.on('userRemoved', (user) => console.log(`User removed: ${user.username}`));
    animationManager.on('entityAdded', (entity) => console.log('Entity added to animation manager'));
    music.on('play', () => console.log('Music started playing'));
    music.on('pause', () => console.log('Music paused'));

    game.start();
    game.toggleDebugMode(true);

    // Make game globally accessible for debugging
    (window as any).game = game;
}

// Start the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeGame);