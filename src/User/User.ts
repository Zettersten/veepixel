import { Avatar } from "../Avatars";
import { EventEmitter } from "../Utils";
import type { EventCallback } from "../Types";


/**
 * Represents a user in the game.
 */
export class User {
    private lastActivity: number;
    private readonly eventEmitter: EventEmitter;

    /**
     * Creates a new User instance.
     * @param userId - The unique identifier for the user.
     * @param username - The display name of the user.
     * @param imageUrl - The URL of the user's profile image.
     * @param avatar - The Avatar instance associated with this user.
     */
    constructor(
        public readonly userId: string,
        public readonly username: string,
        public readonly imageUrl: string,
        public readonly avatar: Avatar
    ) {
        this.lastActivity = Date.now();
        this.eventEmitter = new EventEmitter();
    }

    /**
     * Updates the timestamp of the user's last activity.
     */
    public updateLastActivity(): void {
        this.lastActivity = Date.now();
        this.eventEmitter.emit('activityUpdated', this.lastActivity);
    }

    /**
     * Gets the timestamp of the user's last activity.
     * @returns The timestamp of the last activity.
     */
    public getLastActivity(): number {
        return this.lastActivity;
    }

    /**
     * Checks if the user has been inactive for a specified duration.
     * @param inactivityThreshold - The duration in milliseconds to consider a user inactive.
     * @returns True if the user is inactive, false otherwise.
     */
    public isInactive(inactivityThreshold: number): boolean {
        const inactiveDuration = Date.now() - this.lastActivity;
        return inactiveDuration > inactivityThreshold;
    }

    /**
     * Updates the user's username.
     * @param newUsername - The new username to set.
     */
    public updateUsername(newUsername: string): void {
        (this as any).username = newUsername;
        this.eventEmitter.emit('usernameUpdated', newUsername);
    }

    /**
     * Updates the user's profile image URL.
     * @param newImageUrl - The new image URL to set.
     */
    public updateImageUrl(newImageUrl: string): void {
        (this as any).imageUrl = newImageUrl;
        this.eventEmitter.emit('imageUrlUpdated', newImageUrl);
    }

    /**
     * Registers an event listener for user events.
     * @param eventName - The name of the event to listen for.
     * @param callback - The function to call when the event occurs.
     */
    public on(eventName: string, callback: EventCallback): void {
        this.eventEmitter.on(eventName, callback);
    }
}