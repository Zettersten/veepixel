import * as stylex from '@stylexjs/stylex';
    
const avatarStyles = stylex.create({
    vars: (width: number, height: number, path: string, startingPosition: number) => ({
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${path})`,
        backgroundPosition: `${startingPosition}px ${startingPosition}px`,
        transform: `translate3d(${startingPosition}, ${startingPosition}, 0)`,
        zIndex: startingPosition,
    })
});

export const Avatar = (width: number, height: number, path: string) => {
    return (<div class="avatar" {...stylex.props(avatarStyles.vars(width, height, path, 0))}></div>)
};