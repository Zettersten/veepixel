import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
    music: {
        height: "36px",
        width: "49px",
        margin: "20px",
        background: "#00c08b",
        padding: "0 5px",
        border: "3px solid black",
        boxSizing: "content-box",
        boxShadow: "-4px 4px 0 0 #007f6e",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "3px",
        transition: "width 500ms ease",
        overflow: "hidden"
    },
    player: {
        opacity: 0,
        pointerEvents: "none",
        transition: "opacity 500ms ease",
        width: "1px"
    },
    playing: {
        width: "220px",
    }
});

export const MusicPlayer = () => {
    return (
        <div {...stylex.props(styles.music)}>
            <button id="playPause" class="btn btn-play">
                <img src="/utils/play.png" alt="Play" />
                <img src="/utils/pause.png" alt="Pause" />
            </button>
            <div {...stylex.props(styles.player)}></div>
            <button id="next" class="btn btn-next">
                <img src="/utils/next.png" alt="Next" />
            </button>
        </div>
    );
}