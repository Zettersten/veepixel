import json from "./Sprites/reflective-rhinoceros.json";
import type { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types/Types";

export class ReflectiveRhino implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "../sprites/reflective-rhinoceros.png",
            name: "ReflectiveRhinoceros",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}