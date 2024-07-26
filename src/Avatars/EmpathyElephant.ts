import json from "./Sprites/empathy-elephant.json";
import type { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types";

export class EmpathyElephant implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "../sprites/empathy-elephant.png",
            name: "EmpathyElephant",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}