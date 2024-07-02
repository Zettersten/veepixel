import "./index.css";
import { Game } from "./Game";
import { AdaptableAlien } from "./Avatars/AdaptableAlien";
import { Floor } from "./Floor";
import { Music } from "./Music";
import { AnimationManager } from "./AnimationManager";

/**
 * Initializes and starts the game.
 */
function initializeGame(): void {

    const animationManager = new AnimationManager();
    const music = new Music();
    const floor = new Floor();
    const game = new Game(floor, animationManager);

    const avatarCount = 5;
    for (let i = 0; i < avatarCount; i++) {
        const avatar = new AdaptableAlien();
        game.addAvatar(avatar.options, avatar.sprites);
    }

    game.toggleDebugMode(false);
    game.start();
}

// Start the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeGame);