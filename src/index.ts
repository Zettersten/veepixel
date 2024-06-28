import "./index.css";
import { Game } from "./Game";
import { AdaptableAlien } from "./Avatars/AdaptableAlien";
import { Floor } from "./Floor";

/**
 * Initializes and starts the game.
 */
function initializeGame(): void {
    const floor = new Floor();
    const game = new Game(floor);

    const avatarCount = 10;
    for (let i = 0; i < avatarCount; i++) {
        game.addAvatar(new AdaptableAlien(floor));
    }

    game.start();
}

// Start the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeGame);