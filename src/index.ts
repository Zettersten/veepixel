import "./index.css";
import { Game } from "./Game";
import { Floor } from "./Floor";
import { Music } from "./Music";
import { AnimationManager } from "./AnimationManager";
import { UserManager } from "./UserManager";
import { UserActionHandler } from "./UserActionHandler";
import { AvatarType } from "./Types";

/**
 * Initializes and starts the game.
 */
async function initializeGame(): Promise<void> {
    const floor = new Floor("#floor");
    const userManager = new UserManager(floor);
    const animationManager = new AnimationManager();
    const userActionHandler = new UserActionHandler(userManager);
    const music = new Music('.music-player');
    const game = new Game(floor, animationManager, userManager, userActionHandler);

    const avatarCount = 3;
    const allAvatarTypes : AvatarType[] = ['AdaptableAlien', 'ReflectiveRhino', 'GaryBee'];

    for (let i = 0; i < avatarCount; i++) {

        const randomAvatarType = allAvatarTypes[i];

        await game.addUser(`User ${i}`, randomAvatarType);
    }

    game.start();
    music.play();

    // Make game globally accessible for debugging
    (window as any).game = game;
}

// Start the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeGame);