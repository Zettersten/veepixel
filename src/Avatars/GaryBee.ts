import json from "../../build/sprites/gary-bee.json";
import { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types";

export class GaryBee implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "assets/sprites/gary-bee.png",
            name: "Gary Bee",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}