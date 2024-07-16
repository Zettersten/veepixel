import json from "./Sprites/macho-manta-ray.json";
import type { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types";

export class MachoMantaRay implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "../sprites/macho-manta-ray.png",
            name: "MachoMantaRay",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}