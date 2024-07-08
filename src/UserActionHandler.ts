import { UserManager } from "./UserManager";
import { UserAction, KeyboardMoveType, EventCallback, AvatarSpriteType } from "./Types";
import { Avatar } from "./Avatar";
import { EventEmitter } from "./EventEmitter";

/**
 * Handles user actions in the game.
 */
export class UserActionHandler {
    private readonly eventEmitter: EventEmitter;

    /**
     * Creates a new UserActionHandler instance.
     * @param userManager - The UserManager instance to use for user lookups.
     */
    constructor(private readonly userManager: UserManager) {
        this.eventEmitter = new EventEmitter();
    }

    /**
     * Handles a single user action.
     * @param action - The user action to handle.
     */
    public handleAction(action: UserAction): void {
        const user = this.userManager.getUserById(action.userId);
        if (!user) {
            this.eventEmitter.emit('actionFailed', { action, reason: 'User not found' });
            return;
        }

        this.userManager.updateUserActivity(action.userId);

        switch (action.action) {
            case 'move':
                this.handleMoveAction(user.avatar, action.data.dx, action.data.dy);
                break;
            case 'jump':
                this.handleJumpAction(user.avatar);
                break;
            case 'animate':
                this.handleAnimateAction(user.avatar, action.data.animationType);
                break;
            case 'keyboardMove':
                this.handleKeyboardMoveAction(user.avatar, action.data.key);
                break;
            default:
                this.eventEmitter.emit('actionFailed', { action, reason: 'Unknown action type' });
        }
    }

    /**
     * Handles keyboard actions for controlling the avatar's movement and actions.
     * @param avatar - The avatar object to be controlled.
     * @param key - The key that triggered the action.
     * @param isKeyDown - Indicates whether the key is pressed down or released.
     */
    // In UserActionHandler.ts

    public handleKeyboardAction(avatar: Avatar, key: string, isKeyDown: boolean): void {
        if (!avatar) return;

        const moveDistance = 5; // pixels to move per frame

        switch (key) {
            case 'ArrowLeft':
                if (isKeyDown) {
                    avatar.move(-moveDistance, 0);
                } else {
                    avatar.stopMovement();
                }
                break;
            case 'ArrowRight':
                if (isKeyDown) {
                    avatar.move(moveDistance, 0);
                } else {
                    avatar.stopMovement();
                }
                break;
            case 'ArrowUp':
                if (isKeyDown) {
                    avatar.move(0, -moveDistance);
                } else {
                    avatar.stopMovement();
                }
                break;
            case 'ArrowDown':
                if (isKeyDown) {
                    avatar.move(0, moveDistance);
                } else {
                    avatar.stopMovement();
                }
                break;
            case ' ': // Spacebar
                if (isKeyDown) {
                    avatar.jump();
                }
                break;
        }

        this.eventEmitter.emit('keyboardAction', { avatar, key, isKeyDown });
    }

    /**
     * Handles a batch of user actions.
     * @param actions - An array of user actions to handle.
     */
    public handleBatchActions(actions: UserAction[]): void {
        actions.forEach(action => this.handleAction(action));
        this.eventEmitter.emit('batchActionsProcessed', actions.length);
    }

    /**
     * Handles a move action for an avatar.
     * @param avatar - The avatar to move.
     * @param dx - The change in x position.
     * @param dy - The change in y position.
     */
    private handleMoveAction(avatar: Avatar, dx?: number, dy?: number): void {
        if (dx !== undefined && dy !== undefined) {
            avatar.move(dx, dy);
            this.eventEmitter.emit('avatarMoved', { avatar, dx, dy });
        } else {
            this.eventEmitter.emit('actionFailed', { action: 'move', reason: 'Invalid move parameters' });
        }
    }

    /**
     * Handles a jump action for an avatar.
     * @param avatar - The avatar to make jump.
     */
    private handleJumpAction(avatar: Avatar): void {
        avatar.jump();
        this.eventEmitter.emit('avatarJumped', avatar);
    }

    /**
     * Handles an animate action for an avatar.
     * @param avatar - The avatar to animate.
     * @param animationType - The type of animation to perform.
     */
    private handleAnimateAction(avatar: Avatar, animationType?: AvatarSpriteType): void {
        if (animationType) {
            avatar.startAnimation(animationType);
            this.eventEmitter.emit('avatarAnimated', { avatar, animationType });
        } else {
            this.eventEmitter.emit('actionFailed', { action: 'animate', reason: 'No animation type specified' });
        }
    }

    /**
     * Handles a keyboard move action for an avatar.
     * @param avatar - The avatar to move.
     * @param key - The keyboard key that was pressed.
     */
    private handleKeyboardMoveAction(avatar: Avatar, key?: KeyboardMoveType): void {
        if (key) {
            const moveDistance = 5; // pixels to move per frame
            switch (key) {
                case 'ArrowLeft':
                    avatar.move(-moveDistance, 0);
                    break;
                case 'ArrowRight':
                    avatar.move(moveDistance, 0);
                    break;
                case 'ArrowUp':
                    avatar.move(0, -moveDistance);
                    break;
                case 'ArrowDown':
                    avatar.move(0, moveDistance);
                    break;
                case ' ': // Spacebar
                    avatar.jump();
                    break;
                default:
                    this.eventEmitter.emit('actionFailed', { action: 'keyboardMove', reason: 'Invalid key' });
                    return;
            }
            this.eventEmitter.emit('avatarKeyboardMoved', { avatar, key });
        } else {
            this.eventEmitter.emit('actionFailed', { action: 'keyboardMove', reason: 'No key specified' });
        }
    }

    /**
     * Registers an event listener for action events.
     * @param eventName - The name of the event to listen for.
     * @param callback - The function to call when the event occurs.
     */
    public on(eventName: string, callback: EventCallback): void {
        this.eventEmitter.on(eventName, callback);
    }
}