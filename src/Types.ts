export type AvatarSprite = {
    index: number;
    offsetX: number;
    offsetY: number;
};

export type AvatarSpriteType = 'breathBack' | 'breathFront' | 'clapping' | 'draggedDown' | 'draggedLeft' | 'draggedRight' | 'draggedUp' | 'handsUp' | 'hovering' | 'jumping' | 'swayBack' | 'swayFront' | 'turnAround' | 'talk' | 'blink';

export type AvatarSprites = {
    [key in AvatarSpriteType]: AvatarSprite[];
};

export type AvatarOptions = {
    path: string;
    name: string;
};