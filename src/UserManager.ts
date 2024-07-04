import { User } from "./User";
import { Avatar } from "./Avatar";
import { Floor } from "./Floor";
import { AvatarOptions, AvatarSprites } from "./Types";

export class UserManager {
    private readonly users = new Map<string, User>();
    private readonly floor: Floor;

    constructor(floor: Floor) {
        this.floor = floor;
    }

    public addUser(user: User): void {
        this.users.set(user.userId, user);
    }

    public removeUser(userId: string): void {
        const user = this.users.get(userId);
        if (user) {
            this.floor.removeAvatar(user.avatar);
            this.users.delete(userId);
        }
    }

    public getUsers(): User[] {
        return Array.from(this.users.values());
    }

    public getUserById(userId: string): User | undefined {
        return this.users.get(userId);
    }

    public getUserByUsername(username: string): User | undefined {
        return Array.from(this.users.values()).find(user => user.username === username);
    }

    public createUser(userId: string, username: string, imageUrl: string, avatarOptions: AvatarOptions, avatarSprites: AvatarSprites): User {
        const avatar = new Avatar(this.floor, avatarOptions, avatarSprites);
        const user = new User(userId, username, imageUrl, avatar);
        this.addUser(user);
        return user;
    }

    public updateUserActivity(userId: string): void {
        const user = this.users.get(userId);
        if (user) {
            user.updateLastActivity();
        }
    }
}