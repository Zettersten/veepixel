import { EventEmitter } from "./EventEmitter";
import { Game } from "./Game";
import { Music } from "./Music";
import { Avatar } from "./Avatar";

export class GameStateBroadcaster {
    private readonly eventEmitter: EventEmitter;
    private broadcastInterval: number;
    private intervalId: number | null = null;

    constructor(
        private readonly game: Game,
        private readonly music: Music,
        private readonly broadcastUrl: string,
        interval: number = 100 // broadcast every 100ms by default
    ) {
        this.eventEmitter = new EventEmitter();
        this.broadcastInterval = interval;
    }

    public start(): void {
        if (this.intervalId === null) {
            this.intervalId = window.setInterval(() => this.broadcast(), this.broadcastInterval);
        }
    }

    public stop(): void {
        if (this.intervalId !== null) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private async broadcast(): Promise<void> {
        const gameState = {};
        try {
            const response = await fetch(this.broadcastUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameState),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.eventEmitter.emit('broadcastSuccess', gameState);
        } catch (error) {
            this.eventEmitter.emit('broadcastError', error);
        }
    }

    public on(eventName: string, callback: (...args: any[]) => void): void {
        this.eventEmitter.on(eventName, callback);
    }
}