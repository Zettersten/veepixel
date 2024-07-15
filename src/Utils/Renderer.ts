import { Controls, Game, Nav, Player } from "../UI/Components";
import { domUtils } from "./DomUtils";

export const renderLayout = () => {
    const game = domUtils.renderFragment(Game());
    const controls = domUtils.renderFragment(Controls());
    const nav = domUtils.renderFragment(Nav());
    const player = domUtils.renderFragment(Player());

    nav.appendChild(player);
    game.prepend(controls);
    game.prepend(nav);

    document.body.prepend(game);
};