import { Avatar } from "./Avatar";

export class Floor {
    private element: HTMLElement;
    private avatars: Avatar[] = [];

    constructor() {
        const element = document.getElementById("floor");
        
        if (!element) {
            throw new Error("Element with id 'floor' not found");
        }

        this.element = element;
        this.setupResizeListener();
    }

    private appendAvatar(avatar: Avatar) {
        this.avatars.push(avatar);
        this.element.appendChild(avatar.getElement());
    }

    public placeAvatarEvenlySpacedAppart(avatar: Avatar) {
        const floorWidth = this.element.clientWidth;
        const floorHeight = this.element.clientHeight;
        const avatarWidth = 192;
        const avatarHeight = 192;
    
        const availableWidth = floorWidth - avatarWidth;
        const availableHeight = floorHeight - avatarHeight;
    
        const x = Math.floor(Math.random() * availableWidth);
        const y = Math.floor(Math.random() * availableHeight);
    
        avatar.setElementPosition(y, x);
        this.appendAvatar(avatar);
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public getAvatars(): Avatar[] {
        return this.avatars;
    }

    private setupResizeListener() {
        window.addEventListener('resize', () => this.adjustAvatarPositions());
    }

    private adjustAvatarPositions() {
        this.avatars.forEach(avatar => {
            const position = avatar.getPosition();
            const constrained = this.constrainPosition(position.x, position.y);
            avatar.setElementPosition(constrained.y, constrained.x);
        });
    }

    public removeAvatar(avatar: Avatar) {
        const index = this.avatars.indexOf(avatar);
        if (index > -1) {
            this.avatars.splice(index, 1);
            this.element.removeChild(avatar.getElement());
        }
    }

    public clearFloor() {
        this.avatars.forEach(avatar => this.element.removeChild(avatar.getElement()));
        this.avatars = [];
    }

    public constrainPosition(x: number, y: number): { x: number, y: number } {
        const floorWidth = this.element.clientWidth;
        const floorHeight = this.element.clientHeight;
        const avatarWidth = 192;
        const avatarHeight = 192;

        return {
            x: Math.max(0, Math.min(x, floorWidth - avatarWidth)),
            y: Math.max(0, Math.min(y, floorHeight - avatarHeight / 1.3))
        };
    }
}