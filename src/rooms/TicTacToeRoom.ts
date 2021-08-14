import { Room, Client } from "colyseus";
import { Player } from "./schema/Player";
import { TicTacToeRoomState } from "./schema/TicTacToeRoomState";

export class TicTacToeRoom extends Room<TicTacToeRoomState> {

  private playerIndexes: Array<number> = new Array<number>(1, -1);
  private playerIndex: number = 0;

  onCreate (options: any) {
    this.setState(new TicTacToeRoomState());

    this.onMessage(1, (client, message) => {
      console.log ('Messaging recieved: ', message);
      let player = this.state.players.get(client.id);
      if (player != null) {
        let processed = this.state.AssignSlot (player.playerIndex, message.slotIndex);
        console.log ('Processed: ', processed);
      }
    });
    console.log(`🏠✨ ROOM CREATED: ${this.roomId}`);
  }

  onJoin (client: Client, options: any) {
    let name = options.name != null ? options.name : '';

    if (this.playerIndex < 2 && !this.state.isReady) {
      let player = new Player(this.playerIndexes[this.playerIndex], name);
      this.state.players.set(client.id, player);
      this.playerIndex++;

      if (this.playerIndex == 2) {
        this.state.isReady = true;
        this.state.currentTurn = 1;
        this.lock();
      }
    }

    console.log(`😀 PLAYER JOINED(${this.roomId}): ${name}(${client.id})`);
  }

  onLeave (client: Client, consented: boolean) {
    let player = this.state.players.get(client.id);

    if (this.state.isReady) {
      this.declareOtherAsWinner (client.id);
    }

    console.log(`😟 PLAYER LEFT(${this.roomId}): ${player.name}(${client.id})`);
  }

  declareOtherAsWinner (disconnectedId: string) {
    if (this.state.winnerIndex == 0) {
      this.state.players.forEach((value, key) => {
        if (key != disconnectedId) {
          var player = this.state.players.get(key);
          this.state.winnerIndex = player.playerIndex;// -1 or 1
        }
      });
    }
  }

  onDispose() {
    console.log(`🏠🔥 ROOM DISPOSED: ${this.roomId}`);
  }

}
