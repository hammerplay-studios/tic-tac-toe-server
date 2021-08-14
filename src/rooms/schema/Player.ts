import { Schema, Context, type, ArraySchema } from "@colyseus/schema";

export class Player extends Schema {
    @type("int8") public playerIndex = 0;
    @type("string") name: string = '';

    constructor (playerIndex: number, name: string = '') {
        super ();
        this.playerIndex = playerIndex;
        this.name = name
    }
}