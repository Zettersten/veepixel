import WaveSurfer from 'wavesurfer.js'

interface Song {
    id: number;
    name: string;
    url: string;
}

export class Music {
    private playlist: Song[] = [
        { id: 1, name: "Bit Adventure", url: "../assets/music/song-bit-adventure.mp3" },
        { id: 2, name: "Bit of Hope", url: "../assets/music/song-bit-of-hope.mp3" },
        { id: 3, name: "Funny Bits", url: "../assets/music/song-funny-bits.mp3" },
        { id: 4, name: "Nostalgia", url: "../assets/music/song-nostalgia.mp3" },
        { id: 5, name: "Platformer", url: "../assets/music/song-platformer.mp3" },
        { id: 6, name: "Retro Funk", url: "../assets/music/song-retro-funk.mp3" },
    ];

    private readonly audioPlayer: WaveSurfer;
    private readonly audioPlayerElement: HTMLElement;

    private currentSongIndex: number = 0;

    constructor() {
        this.audioPlayer = WaveSurfer.create({
            container: '.music-player',
            height: 18,
            width: 160,
            normalize: false,
            waveColor: "#fff",
            progressColor: "#1d5048",
            cursorColor: "#000",
            cursorWidth: 2,
            barWidth: 2,
            barGap: 2,
            barRadius: 0,
            barHeight: 1,
            minPxPerSec: 1,
            fillParent: true,
            mediaControls: false,
            autoplay: true,
            interact: true,
            dragToSeek: false,
            hideScrollbar: true,
            audioRate: 1,
            autoScroll: true,
            autoCenter: true,
        });

        this.audioPlayerElement = document.querySelector('.music')!;
        this.audioPlayer.setVolume(0.01);
        this.loadCurrentSong();
        this.setupEventListeners();
    }

    /**
     * Sets up event listeners for the audio player.
     */
    private setupEventListeners(): void {
        this.audioPlayer.on('finish', () => {
            this.next();
        });

        const playPauseButton = document
            .querySelector('#playPause')!;

        const nextButton = document
            .querySelector('#next')!;

        this.audioPlayer.on('play', () => {
            this.audioPlayerElement.classList.add('playing');
            playPauseButton.classList.remove('btn-play');
            playPauseButton.classList.add('btn-pause');
        });

        this.audioPlayer.on('pause', () => {
            this.audioPlayerElement.classList.remove('playing');
            playPauseButton.classList.add('btn-play');
            playPauseButton.classList.remove('btn-pause');
        });

        if (this.audioPlayer.isPlaying()) {
            playPauseButton?.classList.remove('btn-play');
            playPauseButton?.classList.add('btn-pause');
        } else {
            playPauseButton?.classList.add('btn-play');
            playPauseButton?.classList.remove('btn-pause');
        }

        playPauseButton.addEventListener('click', () => {
            if (this.audioPlayer.isPlaying()) {
                this.pause();
            } else {
                this.play();
            }
        });

        nextButton.addEventListener('click', () => {
            this.next();
        });
    }

    /**
     * Loads the current song into the audio player.
     */
    private loadCurrentSong(): void {
        this.audioPlayer.load(this.playlist[this.currentSongIndex].url);
    }

    /**
     * Plays the current song.
     */
    public play(): void {
        this.audioPlayer.play();
    }

    /**
     * Pauses the current playing song.
     */
    public pause(): void {
        this.audioPlayer.pause();
    }

    /**
     * Stops the music and sets the position back to start.
     */
    public stop(): void {
        this.audioPlayer.stop();
    }

    /**
     * Goes to the next song in the playlist. If at the end, goes to the beginning.
     */
    public next(): void {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
        this.loadCurrentSong();
        this.play();
    }

    /**
     * Goes to the previous song in the playlist. If at the beginning, goes to the end.
     */
    public previous(): void {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadCurrentSong();
        this.play();
    }

    /**
     * Sets the volume of the audio player.
     * @param volume - The volume level (0 to 100).
     */
    public setVolume(volume: number): void {
        if (volume < 0 || volume > 100) {
            throw new Error("Volume must be between 0 and 100");
        }
        this.audioPlayer.setVolume(volume / 100);
    }

    /**
     * Adds a new song to the playlist.
     * @param name - The name of the song.
     * @param url - The URL of the song file.
     */
    public addNewSong(name: string, url: string): void {
        const newId = Math.max(...this.playlist.map(song => song.id)) + 1;
        this.playlist.push({ id: newId, name, url });
    }

    /**
     * Adds a new song to the playlist and immediately plays it.
     * @param name - The name of the song.
     * @param url - The URL of the song file.
     */
    public addNewSongAndPlay(name: string, url: string): void {
        this.addNewSong(name, url);
        this.currentSongIndex = this.playlist.length - 1;
        this.loadCurrentSong();
        this.play();
    }

    /**
     * Gets the current song information.
     * @returns The current song object.
     */
    public getCurrentSong(): Song {
        return this.playlist[this.currentSongIndex];
    }

    /**
     * Gets the entire playlist.
     * @returns The array of all songs in the playlist.
     */
    public getPlaylist(): Song[] {
        return [...this.playlist];
    }
}