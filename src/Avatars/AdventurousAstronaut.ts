import json from "./Sprites/adventurous-astronaut.json";
import type { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types";

export class AdventurousAstronaut implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "../sprites/adventurous-astronaut.png",
            name: "AdventurousAstronaut",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}