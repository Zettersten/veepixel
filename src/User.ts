import { Avatar } from "./Avatar";

export class User {
    public readonly userId: string;
    public readonly username: string;
    public readonly imageUrl: string;
    public readonly avatar: Avatar;
    private lastActivity: number;

    constructor(userId: string, username: string, imageUrl: string, avatar: Avatar) {
        this.userId = userId;
        this.username = username;
        this.imageUrl = imageUrl;
        this.avatar = avatar;
        this.lastActivity = Date.now();
    }

    public updateLastActivity(): void {
        this.lastActivity = Date.now();
    }

    public getLastActivity(): number {
        return this.lastActivity;
    }
}