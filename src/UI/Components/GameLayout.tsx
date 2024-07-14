import { MusicPlayer } from "./MusicPlayer";
import { Nav } from "./Nav";

export const GameLayout = () => (<div id="game">
    <Nav>
        <MusicPlayer />
    </Nav>
    <div id="controls"></div>
    <div id="mask"></div>
    <div id="floor"></div>
</div>);