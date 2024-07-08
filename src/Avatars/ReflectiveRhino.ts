import json from "../../build/sprites/reflective-rhinoceros.json";
import { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types";

export class ReflectiveRhino implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "assets/sprites/reflective-rhinoceros.png",
            name: "Reflective Rhinoceros",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}