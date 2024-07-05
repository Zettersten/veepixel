import { User } from "./User";
import { Avatar } from "./Avatar";
import { Floor } from "./Floor";
import { AvatarOptions, AvatarSprites, EventCallback } from "./Types";
import { EventEmitter } from "./EventEmitter";

/**
 * Manages users in the game.
 */
export class UserManager {
    private readonly users: Map<string, User> = new Map();
    private readonly eventEmitter: EventEmitter;

    /**
     * Creates a new UserManager instance.
     * @param floor - The Floor instance to use for avatar placement.
     */
    constructor(private readonly floor: Floor) {
        this.eventEmitter = new EventEmitter();
    }

    /**
     * Adds a user to the manager.
     * @param user - The user to add.
     */
    public addUser(user: User): void {
        this.users.set(user.userId, user);
        this.eventEmitter.emit('userAdded', user);
    }

    /**
     * Removes a user from the manager.
     * @param userId - The ID of the user to remove.
     */
    public removeUser(userId: string): void {
        const user = this.users.get(userId);
        if (user) {
            this.floor.removeAvatar(user.avatar);
            this.users.delete(userId);
            this.eventEmitter.emit('userRemoved', user);
        }
    }

    /**
     * Gets all users.
     * @returns An array of all User instances.
     */
    public getUsers(): User[] {
        return Array.from(this.users.values());
    }

    /**
     * Gets a user by their ID.
     * @param userId - The ID of the user to get.
     * @returns The User instance if found, undefined otherwise.
     */
    public getUserById(userId: string): User | undefined {
        return this.users.get(userId);
    }

    /**
     * Gets a user by their username.
     * @param username - The username of the user to get.
     * @returns The User instance if found, undefined otherwise.
     */
    public getUserByUsername(username: string): User | undefined {
        return Array.from(this.users.values()).find(user => user.username === username);
    }

    /**
     * Creates a new user and adds them to the manager.
     * @param userId - The ID for the new user.
     * @param username - The username for the new user.
     * @param imageUrl - The image URL for the new user's avatar.
     * @param avatarOptions - The options for creating the user's avatar.
     * @param avatarSprites - The sprites for the user's avatar.
     * @returns The newly created User instance.
     */
    public createUser(userId: string, username: string, imageUrl: string, avatarOptions: AvatarOptions, avatarSprites: AvatarSprites): User {
        const avatar = this.createAvatar(avatarOptions, avatarSprites);
        const user = new User(userId, username, imageUrl, avatar);
        this.addUser(user);
        return user;
    }

    /**
     * Creates a new avatar with the specified options and sprites, places it randomly on the floor, and emits an event.
     * @param options - The options for the avatar.
     * @param sprites - The sprites for the avatar.
     * @returns The newly created avatar.
     */
    public createAvatar(options: AvatarOptions, sprites: AvatarSprites): Avatar {
        const avatar = new Avatar(this.floor, options, sprites);
        this.floor.placeAvatarRandomly(avatar);
        this.eventEmitter.emit('avatarCreated', avatar);
        return avatar;
    }

    /**
     * Updates the last activity timestamp for a user.
     * @param userId - The ID of the user to update.
     */
    public updateUserActivity(userId: string): void {
        const user = this.users.get(userId);
        if (user) {
            user.updateLastActivity();
            this.eventEmitter.emit('userActivityUpdated', user);
        }
    }

    /**
     * Gets an avatar by its DOM element.
     * @param element - The DOM element of the avatar.
     * @returns The Avatar instance if found, undefined otherwise.
     */
    public getAvatarByElement(element: HTMLElement): Avatar | undefined {
        for (const user of this.users.values()) {
            if (user.avatar.getElement() === element) {
                return user.avatar;
            }
        }
        return undefined;
    }

    /**
     * Returns the number of users in the collection.
     * @returns The number of users.
     */
    public getUserCount(): number {
        return this.users.size;
    }

    /**
     * Removes an avatar from the floor.
     * @param avatar - The avatar to remove.
     */
    public removeAvatar(avatar: Avatar): void {
        for (const [userId, user] of this.users.entries()) {
            if (user.avatar === avatar) {
                this.removeUser(userId);
                return;
            }
        }
    }

    /**
     * Removes all avatars from the floor.
     */
    public clearAvatars(): void {
        this.users.clear();
        this.floor.clearAvatars();
        this.eventEmitter.emit('allAvatarsCleared');
    }

    /**
     * Toggles debug mode for all avatars.
     * @param enable - Whether to enable or disable debug mode.
     */
    public toggleDebugMode(enable: boolean): void {
        for (const user of this.users.values()) {
            user.avatar.toggleDebugBoundingBox(enable);
        }
        this.eventEmitter.emit('debugModeToggled', enable);
    }

    /**
     * Registers an event listener for user manager events.
     * @param eventName - The name of the event to listen for.
     * @param callback - The function to call when the event occurs.
     */
    public on(eventName: string, callback: EventCallback): void {
        this.eventEmitter.on(eventName, callback);
    }
}