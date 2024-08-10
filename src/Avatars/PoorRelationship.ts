import json from "./Sprites/poor-relationship.json";
import type { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types";

export class PoorRelationship implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "../sprites/poor-relationship.png",
            name: "PoorRelationship",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}