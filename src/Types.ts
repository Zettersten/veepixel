export type AvatarSprite = {
    index: number;
    offsetX: number;
    offsetY: number;
};

export type MovementDirectionType = 'left' | 'right' | 'up' | 'down' | null;

export type AvatarSpriteType = 'breathBack' | 'breathFront' | 'clapping' | 'draggedDown' | 'draggedLeft' | 'draggedRight' | 'draggedUp' | 'handsUp' | 'hovering' | 'jumping' | 'swayBack' | 'swayFront' | 'turnAround' | 'talk' | 'blink' | 'walkLeft' | 'walkRight' | 'walkUp' | 'walkDown' | 'boo';

export type AvatarSprites = {
    [key in AvatarSpriteType]: AvatarSprite[];
};

export type AvatarOptions = {
    path: string;
    name: string;
};