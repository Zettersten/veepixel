import { Avatar } from "../Avatar";
import { Floor } from "../Floor";
import json from "../../build/sprites/adaptable-alien.json";

export class AdaptableAlien extends Avatar {
    constructor(floor: Floor) {
        super(floor, {
            path: "assets/sprites/adaptable-alien.png",
            name: "Adaptable Alien",
        }, json);
    }
}