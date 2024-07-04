import { UserManager } from "./UserManager";
import { UserAction } from "./Types";
import { Avatar } from "./Avatar";

export class UserActionHandler {
    private readonly userManager: UserManager;
    private readonly moveDistance: number = 5; // pixels to move per frame

    constructor(userManager: UserManager) {
        this.userManager = userManager;
    }

    public handleAction(action: UserAction): void {
        const user = this.userManager.getUserById(action.userId);
        if (!user) return;

        this.userManager.updateUserActivity(action.userId);

        switch (action.action) {
            case 'move':
                if (action.data.dx !== undefined && action.data.dy !== undefined) {
                    user.avatar.move(action.data.dx, action.data.dy);
                }
                break;
            case 'keyboardMove':
                this.handleKeyboardMove(user.avatar, action.data.key);
                break;
            case 'jump':
                user.avatar.jump();
                break;
            case 'animate':
                if (action.data.animationType) {
                    user.avatar.startAnimation(action.data.animationType);
                }
                break;
        }
    }

    public handleBatchActions(actions: UserAction[]): void {
        actions.forEach(action => this.handleAction(action));
    }

    private handleKeyboardMove(avatar: Avatar, key?: string): void {
        switch (key) {
            case 'ArrowLeft':
                avatar.move(-this.moveDistance, 0);
                break;
            case 'ArrowRight':
                avatar.move(this.moveDistance, 0);
                break;
            case 'ArrowUp':
                avatar.move(0, -this.moveDistance);
                break;
            case 'ArrowDown':
                avatar.move(0, this.moveDistance);
                break;
            case ' ': // Spacebar
                avatar.jump();
                break;
        }
    }
}