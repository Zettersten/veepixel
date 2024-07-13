import json from "./Sprites/adaptable-alien.json";
import type { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types";

export class AdaptableAlien implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "../sprites/adaptable-alien.png",
            name: "AdaptableAlien",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}