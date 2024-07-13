import type { Rect } from "../Types";

/**
 * Handles collision detection between rectangles.
 */
export class CollisionDetector {
    /**
     * Checks if two rectangles are colliding.
     * @param rect1 - The first rectangle.
     * @param rect2 - The second rectangle.
     * @returns True if the rectangles are colliding, false otherwise.
     */
    public isColliding(rect1: Rect, rect2: Rect): boolean {
        const colliding = (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
        return colliding;
    }

    /**
     * Checks if a point is inside a rectangle.
     * @param point - The point to check.
     * @param rect - The rectangle to check against.
     * @returns True if the point is inside the rectangle, false otherwise.
     */
    public isPointInside(point: { x: number, y: number }, rect: Rect): boolean {
        return (
            point.x >= rect.x &&
            point.x <= rect.x + rect.width &&
            point.y >= rect.y &&
            point.y <= rect.y + rect.height
        );
    }

    /**
     * Calculates the overlap between two rectangles.
     * @param rect1 - The first rectangle.
     * @param rect2 - The second rectangle.
     * @returns The overlap rectangle, or null if there's no collision.
     */
    public getOverlap(rect1: Rect, rect2: Rect): Rect | null {
        if (!this.isColliding(rect1, rect2)) {
            return null;
        }

        return {
            x: Math.max(rect1.x, rect2.x),
            y: Math.max(rect1.y, rect2.y),
            width: Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x),
            height: Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y)
        };
    }
}