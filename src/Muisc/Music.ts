import WaveSurfer from 'wavesurfer.js'
import * as stylex from '@stylexjs/stylex';
import type { Song, EventCallback } from '../Types';
import { EventEmitter, domUtils } from '../Utils';
import { playerStyles } from '../UI/Components/Player';

/**
 * Manages music playback and playlist functionality.
 */
export class Music {
    private readonly playlist: Song[];
    private readonly audioPlayer: WaveSurfer;
    private readonly eventEmitter: EventEmitter;
    private readonly element: HTMLElement;
    private readonly parentElement: HTMLElement;
    private currentSongIndex: number = 0;
    private isFirstRender: boolean;

    /**
     * Creates a new Music instance.
     */
    constructor() {
        this.parentElement = domUtils.getManifest()["music"];
        this.element = this.parentElement.querySelector('#playPause')?.nextSibling as HTMLElement;
        this.playlist = this.initializePlaylist();
        this.audioPlayer = this.createAudioPlayer();
        this.eventEmitter = new EventEmitter();
        this.setupEventListeners();
        this.setVolume(0.9);
        this.isFirstRender = true;
    }

    /**
     * Initializes the playlist with default songs.
     * @returns An array of Song objects.
     */
    private initializePlaylist(): Song[] {
        return [
            { id: 1, name: "Bit Adventure", url: "../music/song-bit-adventure.mp3" },
            { id: 2, name: "Bit of Hope", url: "../music/song-bit-of-hope.mp3" },
            { id: 3, name: "Funny Bits", url: "../music/song-funny-bits.mp3" },
            { id: 4, name: "Nostalgia", url: "../music/song-nostalgia.mp3" },
            { id: 5, name: "Platformer", url: "../music/song-platformer.mp3" },
            { id: 6, name: "Retro Funk", url: "../music/song-retro-funk.mp3" },
            { id: 7, name: "Sound Universe Studio", url: "../music/song-8-bit-game-song.mp3" },
            { id: 8, name: "MoodMode", url: "../music/song-8-bit-arcade.mp3" },
            { id: 9, name: "Nick Panek", url: "../music/song-hardboss.mp3" },
            { id: 10, name: "MoodMode", url: "../music/song-8-bit-game.mp3" },
            { id: 11, name: "Lesia Kower", url: "../music/song-battle-time.mp3" }
        ];
    }

    /**
     * Creates and configures the WaveSurfer audio player.
     * @param container - The CSS selector for the audio player container.
     * @returns A configured WaveSurfer instance.
     */
    private createAudioPlayer(): WaveSurfer {
        return WaveSurfer.create({
            container: this.element,
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
    }

    /**
     * Sets up event listeners for the audio player.
     */
    private setupEventListeners(): void {

        this.audioPlayer.on('finish', () => this.next());

        this.audioPlayer.on('play', () => {
            this.setPlayingState(true);
            this.eventEmitter.emit('play');
        });

        this.audioPlayer.on('pause', () => {
            this.setPlayingState(false);
            this.eventEmitter.emit('pause');
        });

        const playPauseButton = document.querySelector('#playPause');
        const nextButton = document.querySelector('#next');

        if (playPauseButton) {
            playPauseButton.addEventListener('click', () => this.togglePlayPause());
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => this.next());
        }
    }

    /**
     * Loads the current song into the audio player.
     */
    private loadCurrentSong(): void {
        this.audioPlayer.load(this.playlist[this.currentSongIndex].url);
        this.eventEmitter.emit('songLoaded', this.getCurrentSong());
    }

    /**
     * Plays the current song.
     */
    public play(): void {

        if (this.isFirstRender) {
            this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
            this.loadCurrentSong();
            this.isFirstRender = false;
        }

        this.audioPlayer.play();
    }

    /**
     * Pauses the current playing song.
     */
    public pause(): void {
        this.audioPlayer.pause();
    }

    /**
     * Toggles between play and pause states.
     */
    public togglePlayPause(): void {
        if (this.audioPlayer.isPlaying()) {
            this.pause();
        } else {
            this.play();
        }
    }

    /**
     * Stops the music and sets the position back to start.
     */
    public stop(): void {
        this.audioPlayer.stop();
        this.eventEmitter.emit('stop');
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
        this.eventEmitter.emit('volumeChanged', volume);
    }

    /**
     * Adds a new song to the playlist.
     * @param name - The name of the song.
     * @param url - The URL of the song file.
     */
    public addNewSong(name: string, url: string): void {
        const newId = Math.max(...this.playlist.map(song => song.id)) + 1;
        this.playlist.push({ id: newId, name, url });
        this.eventEmitter.emit('songAdded', { id: newId, name, url });
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
        return { ...this.playlist[this.currentSongIndex] };
    }

    /**
     * Gets the entire playlist.
     * @returns The array of all songs in the playlist.
     */
    public getPlaylist(): Song[] {
        return [...this.playlist];
    }

    /**
     * Register a callback function to be executed when a specific event occurs.
     * @param eventName - The name of the event to listen for.
     * @param callback - The callback function to be executed when the event occurs.
     */
    public on(eventName: string, callback: EventCallback): void {
        this.eventEmitter.on(eventName, callback);
    }

    private setPlayingState(isPlaying: boolean = true): void {
        const playingAttr = stylex.attrs(playerStyles.parentPlaying);
        const playingClasses = playingAttr.class?.toString().split(' ') as string[];

        const musicPlayerPlayingAttr = stylex.attrs(playerStyles.musicPlayerPlaying);
        const musicPlayerPlayingClasses = musicPlayerPlayingAttr.class?.toString().split(' ') as string[];

        if (isPlaying) {
            this.element.classList.add(...musicPlayerPlayingClasses);
            this.parentElement.classList.add(...playingClasses);
        } else {
            this.element.classList.remove(...musicPlayerPlayingClasses);
            this.parentElement.classList.remove(...playingClasses);
        }
    }
}
