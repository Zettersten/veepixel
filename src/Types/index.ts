/**
 * Represents a single sprite frame within an avatar's animation.
 */
export interface AvatarSprite {
    index: number;
    offsetX: number;
    offsetY: number;
}

/**
 * Represents the possible keyboard inputs for avatar movement.
 */
export type KeyboardMoveType = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | ' ';

/**
 * Represents the possible movement directions for an avatar.
 */
export type MovementDirectionType = 'left' | 'right' | 'up' | 'down' | null;

/**
 * Represents the different types of animations an avatar can perform.
 */
export type AvatarSpriteType = 
    'breathBack' | 'breathFront' | 'clapping' | 'draggedDown' | 'draggedLeft' | 
    'draggedRight' | 'draggedUp' | 'handsUp' | 'hovering' | 'jumping' | 
    'swayBack' | 'swayFront' | 'turnAround' | 'talk' | 'blink' | 
    'walkLeft' | 'walkRight' | 'walkUp' | 'walkDown' | 'boo';

/**
 * Represents a collection of sprite animations for an avatar.
 */
export type AvatarSprites = {
    [key in AvatarSpriteType]: AvatarSprite[];
};

/**
 * Represents the options for creating an avatar.
 */
export interface AvatarOptions {
    path: string;
    name: AvatarType;
}

/**
 * Represents a rectangle, typically used for collision detection.
 */
export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Represents an action performed by a user.
 */
export interface UserAction {
    userId: string;
    action: 'move' | 'jump' | 'animate' | 'keyboardMove';
    data: {
        dx?: number;
        dy?: number;
        animationType?: AvatarSpriteType;
        key?: KeyboardMoveType;
    };
}

/**
 * Represents an Avatar Factory.
 */
export interface AvatarFactory {
    options: AvatarOptions;
    sprites: AvatarSprites;
}

/**
 * Represents a position in 2D space.
 */
export interface Position {
    x: number;
    y: number;
}

/**
 * Represents the dimensions of an object.
 */
export interface Dimensions {
    width: number;
    height: number;
}

/**
 * Represents an entity that can be animated.
 */
export interface Animatable {
    /**
     * Updates the entity's state for the current animation frame.
     */
    update(): void;
}

/**
 * Represents a song.
 */
export type Song = {
    id: number; // The unique identifier of the song.
    name: string; // The name of the song.
    url: string; // The URL of the song.
}

/**
 * Represents a callback function that can be triggered with any number of arguments.
 */
export type EventCallback = (...args: any[]) => void;


/**
 * Represents the type of avatar.
 * @typedef {'ReflectiveRhino' | 'GaryBee' | 'AdaptableAlien'} AvatarType
 */
export type AvatarType = 'ReflectiveRhinoceros' | 'GaryBee' |  'AdaptableAlien' | 'AmbitiousAngel' | 'MachoMantaRay' | 'AdventurousAstronaut' | 'RareRobot' | 'EmpathyElephant' | 'ArbitragingAdmiral' | 'HeartTrooper';