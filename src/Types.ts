export type AvatarSprite = {
    index: number;
    offsetX: number;
    offsetY: number;
};

export type KeyBoardMoveType = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | ' ';

export type MovementDirectionType = 'left' | 'right' | 'up' | 'down' | null;

export type AvatarSpriteType = 'breathBack' | 'breathFront' | 'clapping' | 'draggedDown' | 'draggedLeft' | 'draggedRight' | 'draggedUp' | 'handsUp' | 'hovering' | 'jumping' | 'swayBack' | 'swayFront' | 'turnAround' | 'talk' | 'blink' | 'walkLeft' | 'walkRight' | 'walkUp' | 'walkDown' | 'boo';

export type AvatarSprites = {
    [key in AvatarSpriteType]: AvatarSprite[];
};

export type AvatarOptions = {
    path: string;
    name: string;
};

export type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type UserAction = {
    userId: string;
    action: 'move' | 'jump' | 'animate' | 'keyboardMove';
    data: {
        dx?: number;
        dy?: number;
        animationType?: AvatarSpriteType;
        key?: KeyBoardMoveType;
    };
}
