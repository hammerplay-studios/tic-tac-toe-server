import { Schema, Context, type, ArraySchema, MapSchema } from "@colyseus/schema";
import { Player } from "./Player";

export class TicTacToeRoomState extends Schema {

  @type ({map: Player}) players = new MapSchema<Player>();
  @type("boolean") isReady: boolean = false;
  @type("int8") currentTurn: number = 0;
  @type(["int8"]) board = new ArraySchema<number>(
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
  );
  @type("int8") winnerIndex: number = 0;

  private HasEmptySlot(): boolean {
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] == 0)
        return true;
    }

    return false;
  }

  private GetWinner(): number {
    // Horizontal Checks
    // 0, 1, 2
    if (this.board[0] == this.board[1] && this.board[1] == this.board[2] && this.board[2] != 0)
      return this.board[0];
    // 3, 4, 5
    if (this.board[3] == this.board[4] && this.board[4] == this.board[5] && this.board[5] != 0)
      return this.board[3];
    // 6, 7, 8
    if (this.board[6] == this.board[7] && this.board[7] == this.board[8] && this.board[8] != 0)
      return this.board[6];

    // Verticals Checks
    // 0, 3, 6
    if (this.board[0] == this.board[3] && this.board[3] == this.board[6] && this.board[6] != 0)
      return this.board[0];
    // 1, 4, 7
    if (this.board[1] == this.board[4] && this.board[4] == this.board[7] && this.board[7] != 0)
      return this.board[7];
    // 2, 5, 8
    if (this.board[2] == this.board[5] && this.board[5] == this.board[8] && this.board[8] != 0)
      return this.board[8];

    // Diagonals
    // 0, 4, 8
    if (this.board[0] == this.board[4] && this.board[4] == this.board[8] && this.board[8] != 0)
      return this.board[0];
    // 2, 4, 6
    if (this.board[2] == this.board[4] && this.board[4] == this.board[6] && this.board[6] != 0)
      return this.board[2];


    return 0;
  }

  public AssignSlot(playerIndex: number, slotIndex: number): boolean {
    // If it's not his turn return false
    if (this.currentTurn != playerIndex || this.currentTurn == 0) {
      console.log('Not the current, ', this.currentTurn);
      return false;
    }

    if (this.board[slotIndex] == 0) {
      this.board[slotIndex] = playerIndex;
      this.SwitchTurn();
      return true;
    }

    return false;
  }

  private SwitchTurn() {
    let winner = this.GetWinner();

    if (winner == 0) {
      if (this.HasEmptySlot()) {
        this.currentTurn = this.currentTurn == 1 ? -1 : 1;
      }
      else {
        this.currentTurn = 0;
        this.winnerIndex = 2;
        console.log("Draw");
      }
    } else {
      this.currentTurn = 0;
      this.winnerIndex = winner;
      console.log(`this.winner: ${winner}`);
    }
  }

}
