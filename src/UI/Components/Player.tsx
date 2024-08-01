import * as stylex from '@stylexjs/stylex';

export const playerStyles = stylex.create({
    parentPlaying: {
        width: "220px",
    },
    musicPlayerPlaying: {
        opacity: "1",
        width: "160px",
        pointerEvents: "all",
        transitionDelay: "500ms"
    },
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
    btn: {
        background: "#009688",
        border: "2px solid #267f6e",
        padding: "3px",
        cursor: "pointer",
        borderRadius: "2px",
        width: "23px",
        ":hover": {
            opacity: ".8",
            filter: "hue-rotate(185deg)"
        },
        ":active": {
            transform: "translateY(1px)",
            opacity: "1"
        }
    },
    img: {
        display: "block",
        width: "100%",
        maxWidth: "23px"
    },
    hide: {
        display: "none"
    },
    show: {
        display: "block"
    }
});

export const Player = () => {
    return (
        <div id="music" {...stylex.props(playerStyles.music)}>
            <button id="playPause" {...stylex.props(playerStyles.btn)}>
                <img src="/utils/play.png" alt="Play" {...stylex.props(playerStyles.img, playerStyles.hide)} />
                <img src="/utils/pause.png" alt="Pause" {...stylex.props(playerStyles.img, playerStyles.hide)} />
            </button>
            <div {...stylex.props(playerStyles.player)}></div>
            <button id="next" {...stylex.props(playerStyles.btn)}>
                <img src="/utils/next.png" alt="Next" {...stylex.props(playerStyles.img)} />
            </button>
        </div>
    );
}