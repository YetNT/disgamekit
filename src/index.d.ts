import { EventEmitter } from 'events';
import { Client, Interaction } from 'discord.js';

declare class Game extends EventEmitter {
    var: {
        gaming: boolean;
    };
    client: Client;
    id: string;

    constructor(client: Client, id: string);
    start(): void;
    isGameOn(): boolean;
    end(): void;
    error(error: string): void;
    handleButtons(): void;

    on(event: 'start', listener: () => void): this;
    on(event: 'end', listener: () => void): this;
    on(event: 'error', listener: (error: TypeError) => void): this;
    on(
        event: `${string}-btn`,
        listener: (interaction: Interaction) => void
    ): this;
}

declare class Plane extends EventEmitter {
    constructor(
        game: Game,
        rows: number,
        columns: number,
        blank?: string | null
    );
    createGrid(blank: string | null): string[][];
    coordsAt(x: number, y: number): string | null | undefined;
    lookupObj(inputValue: string): { x: number; y: number } | null;
    lookupCoords(x: number, y: number): string | undefined;
    clear(): void;
    update(...arr: PlaneObject[]): void;
    return(row?: string, column?: string): string;
}

declare class PlaneObject {
    constructor(
        x: number,
        y: number,
        id: string,
        value?: string,
        detectCollision?: boolean
    );
}

export { Game, Plane, PlaneObject };
