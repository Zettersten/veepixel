import json from "./Sprites/gary-bee.json";
import type { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types/Types";

export class GaryBee implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "../sprites/gary-bee.png",
            name: "GaryBee",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}