import { AnimationManager } from "./Animations";
import { Floor, Game } from "./Game";
import { Music } from "./Muisc";
import "./UI/styles.css";
import 'virtual:stylex.css'
import { UserManager, UserActionHandler } from "./User";
import type { AvatarType } from "./Types";
import { renderLayout } from "./Utils/Renderer";

/**
 * Initializes and starts the game.
 */
async function initializeGame(): Promise<void> {

    renderLayout();

    const floor = new Floor("#floor");
    const userManager = new UserManager(floor);
    const animationManager = new AnimationManager();
    const userActionHandler = new UserActionHandler(userManager);
    const music = new Music();
    const game = new Game(floor, animationManager, userManager, userActionHandler);

    const allAvatarTypes : AvatarType[] = ['AdaptableAlien', 'ReflectiveRhinoceros', 'GaryBee', 'AmbitiousAngel'];

    for (let i = 0; i < allAvatarTypes.length; i++) {
        const randomAvatarType = allAvatarTypes[i];
        await game.addUser(`User ${i}`, randomAvatarType);
    }

    game.start();
    music.play();
}

// Start the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeGame);