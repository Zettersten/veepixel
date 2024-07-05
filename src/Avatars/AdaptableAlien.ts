import json from "../../build/sprites/adaptable-alien.json";
import { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types";

export class AdaptableAlien implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "assets/sprites/adaptable-alien.png",
            name: "Adaptable Alien",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}