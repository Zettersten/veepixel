import json from "./Sprites/heart-trooper.json";
import type { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types";

export class HeartTrooper implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "../sprites/heart-trooper.png",
            name: "HeartTrooper",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}