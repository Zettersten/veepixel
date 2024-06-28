import { Avatar } from "../Avatar";
import { Floor } from "../Floor";

export class AdaptableAlien extends Avatar {

    constructor(floor: Floor) {
        super(floor, {
            path: "assets/sprites/adaptable-alien/sprite.png",
            name: "Adaptable Alien",
        })
    }
}