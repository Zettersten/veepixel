import "./index.css";
import { Game } from "./Game";
import { AdaptableAlien } from "./Avatars/AdaptableAlien";
import { Floor } from "./Floor";
import { Music } from "./Music";
import { AnimationManager } from "./AnimationManager";
import { UserManager } from "./UserManager";
import { User } from "./User";

/**
 * Initializes and starts the game.
 */
function initializeGame(): void {

    const floor = new Floor();
    const userManager = new UserManager(floor);
    const animationManager = new AnimationManager();
    const music = new Music();
    const game = new Game(floor, animationManager, userManager);

    const avatarCount = 5;
    for (let i = 0; i < avatarCount; i++) {
        setTimeout(() => {
            const { options, sprites } = new AdaptableAlien();
            const avatar = game.addAvatar(options, sprites);
            userManager.addUser(new User(`user-${i}`, `User ${i}`, `https://randomuser.me/api`, avatar));
        }, 1000 * i);
    }

    game.toggleDebugMode(false);
    game.start();

    globalThis.game = game;
}

// Start the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeGame);