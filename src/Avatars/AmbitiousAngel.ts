import json from "./Sprites/adaptable-alien.json";
import type { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types/Types";

export class AmbitiousAngel implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "../sprites/adaptable-alien.png",
            name: "AmbitiousAngel",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}