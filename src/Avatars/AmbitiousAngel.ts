import json from "./Sprites/ambitious-angel.json";
import type { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types";

export class AmbitiousAngel implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "../sprites/ambitious-angel.png",
            name: "AmbitiousAngel",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}