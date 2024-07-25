import json from "./Sprites/rare-robot.json";
import type { AvatarFactory, AvatarOptions, AvatarSprites } from "../Types";

export class RareRobot implements AvatarFactory {

    get options(): AvatarOptions {
        return {
            path: "../sprites/rare-robot.png",
            name: "RareRobot",
        };
    }

    get sprites(): AvatarSprites {
        return json;
    }
}