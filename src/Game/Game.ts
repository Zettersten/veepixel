import { AnimationManager } from "../Animations/AnimationManager";
import { AdaptableAlien } from "../Avatars/AdaptableAlien";
import { Avatar } from "../Avatars/Avatar";
import { GaryBee } from "../Avatars/GaryBee";
import { ReflectiveRhino } from "../Avatars/ReflectiveRhino";
import { User, UserActionHandler, UserManager } from "../User";
import { EventEmitter } from "../Utils/EventEmitter";
import { Floor } from "./Floor";
import type { AvatarType, AvatarFactory, UserAction, EventCallback } from "../Types";
import { AmbitiousAngel } from "../Avatars";


/**
 * Represents the main game logic and orchestrates game components.
 */
export class Game {
    private readonly eventEmitter: EventEmitter;
    private selectedAvatar: Avatar | null = null;

    /**
     * Creates a new Game instance.
     * @param floor - The floor on which the game takes place.
     * @param animationManager - Manages animations for game entities.
     * @param userManager - Manages users and their avatars.
     * @param userActionHandler - Handles user actions.
     */
    constructor(
        private readonly floor: Floor,
        private readonly animationManager: AnimationManager,
        private readonly userManager: UserManager,
        private readonly userActionHandler: UserActionHandler
    ) {
        this.eventEmitter = new EventEmitter();
        this.setupEventListeners();
    }

    /**
     * Sets up event listeners for the game.
     */
    private setupEventListeners(): void {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        this.floor.getElement().addEventListener('mousedown', this.onFloorClick);
    }

    /**
     * Starts the game.
     */
    public start(): void {
        this.animationManager.start();
        this.eventEmitter.emit('gameStarted');
    }

    /**
     * Stops the game.
     */
    public stop(): void {
        this.animationManager.stop();
        this.eventEmitter.emit('gameStopped');
    }

    /**
     * Handles keydown events for avatar movement.
     */
    private onKeyDown = (event: KeyboardEvent): void => {
        if (!this.selectedAvatar) return;
        this.userActionHandler.handleKeyboardAction(this.selectedAvatar, event.key, true);
    }

    /**
     * Handles keyup events to stop avatar movement.
     */
    private onKeyUp = (event: KeyboardEvent): void => {
        if (!this.selectedAvatar) return;
        this.userActionHandler.handleKeyboardAction(this.selectedAvatar, event.key, false);
    }

    /**
     * Handles click events on the floor for avatar selection.
     */
    private onFloorClick = (event: MouseEvent): void => {
        const clickedElement = event.target as HTMLElement;
        const clickedAvatar = this.userManager.getAvatarByElement(clickedElement);

        if (clickedAvatar) {
            this.selectAvatar(clickedAvatar);
        } else {
            this.deselectAvatar();
        }
    }

    /**
     * Selects an avatar.
     * @param avatar - The avatar to select.
     */
    public selectAvatar(avatar: Avatar): void {
        if (this.selectedAvatar) {
            this.selectedAvatar.setSelected(false);
        }
        this.selectedAvatar = avatar;
        avatar.setSelected(true);
        this.eventEmitter.emit('avatarSelected', avatar);
    }

    /**
     * Deselects the currently selected avatar.
     */
    public deselectAvatar(): void {
        if (this.selectedAvatar) {
            this.selectedAvatar.setSelected(false);
            this.selectedAvatar = null;
            this.eventEmitter.emit('avatarDeselected');
        }
    }

    public async addUser(username: string, avatarType: AvatarType): Promise<User> {
        const { options, sprites } = this.getAvatarFactory(avatarType);

        const user = await this.userManager.createUser(
            `user-${this.userManager.getUserCount()}`,
            username,
            `https://randomuser.me/api/portraits/lego/${this.userManager.getUserCount() % 10}.jpg`,
            options,
            sprites
        );


        this.floor.placeAvatarRandomly(user.avatar);
        this.animationManager.addEntity(user.avatar);
        user.avatar.startAnimation('breathBack');

        return user;
    }

    private getAvatarFactory(avatarType: AvatarType): AvatarFactory {

        switch (avatarType) {
            case 'ReflectiveRhinoceros':
                return new ReflectiveRhino();
            case 'GaryBee':
                return new GaryBee();
            case 'AdaptableAlien':
                return new AdaptableAlien();
            case 'AmbitiousAngel':
                return new AmbitiousAngel();
            default:
                return new AdaptableAlien();
        }
    }

    /**
     * Removes an avatar from the game.
     * @param avatar - The avatar to remove.
     */
    public removeAvatar(avatar: Avatar): void {
        this.userManager.removeAvatar(avatar);
        this.animationManager.removeEntity(avatar);
        this.floor.removeAvatar(avatar);
        if (this.selectedAvatar === avatar) {
            this.deselectAvatar();
        }
        this.eventEmitter.emit('avatarRemoved', avatar);
    }

    /**
     * Removes all avatars from the game.
     */
    public clearAvatars(): void {
        this.userManager.clearAvatars();
        this.animationManager.clearEntities();
        this.floor.clearAvatars();
        this.deselectAvatar();
        this.eventEmitter.emit('allAvatarsRemoved');
    }

    /**
     * Toggles debug mode for all avatars.
     * @param enable - Whether to enable or disable debug mode.
     */
    public toggleDebugMode(enable: boolean): void {
        this.userManager.toggleDebugMode(enable);
        this.eventEmitter.emit('debugModeToggled', enable);
    }

    /**
     * Handles incoming user actions.
     * @param actions - The array of user actions to handle.
     */
    public handleIncomingActions(actions: UserAction[]): void {
        this.userActionHandler.handleBatchActions(actions);
        this.eventEmitter.emit('actionsProcessed', actions);
    }

    /**
     * Registers an event listener for game events.
     * @param eventName - The name of the event to listen for.
     * @param callback - The function to call when the event occurs.
     */
    public on(eventName: string, callback: EventCallback): void {
        this.eventEmitter.on(eventName, callback);
    }
}