import json from "./Sprites/arbitraging-admiral.json";
import type { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types";

export class ArbitragingAdmiral implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "../sprites/arbitraging-admiral.png",
            name: "ArbitragingAdmiral",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}