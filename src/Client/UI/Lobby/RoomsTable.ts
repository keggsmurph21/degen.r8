import {RoomSummary} from "Poker/Room";

class RoomRow {
    public readonly tr: HTMLTableRowElement;
    public cells: {[columnName: string]: HTMLTableCellElement} = {};
    public dataColumnNames: ReadonlyArray<string> = [
        "id",
        "numSitting",
        "capacity",
        "numStanding",
        "minimumBet",
    ];
    constructor(public room: RoomSummary, onJoin: (roomId: number) => void) {
        this.tr = document.createElement("tr") as HTMLTableRowElement;

        this.dataColumnNames.forEach(name => {
            this.cells[name] =
                document.createElement("td") as HTMLTableCellElement;
            this.cells[name].innerText = room[name].toString();
            this.tr.appendChild(this.cells[name]);
        });

        const joinCell = document.createElement("td") as HTMLTableCellElement;
        const joinButton =
            document.createElement("button") as HTMLButtonElement;
        joinButton.setAttribute("type", "button");
        joinButton.innerText = "join";
        joinButton.addEventListener("click", _ => onJoin(this.room.id));
        joinCell.appendChild(joinButton);
        this.tr.appendChild(joinCell);
    }
    update(room: RoomSummary): void {
        this.dataColumnNames.forEach(name => {
            if (room[name] === this.room[name])
                return;
            this.cells[name].innerText = room[name].toString();
        });
        this.room = room;
    }
}

export class RoomsTable {
    public readonly container: HTMLElement;
    public readonly table: HTMLTableElement;
    public readonly tbody: HTMLTableSectionElement;
    public headerNames: ReadonlyArray<string> = [
        "id",
        "sitting",
        "capacity",
        "standing",
        "minimum bet",
        "join",
    ];
    public rows: {[id: number]: RoomRow} = {};
    constructor(public readonly onJoin: (roomId: number) => void) {
        this.container = document.getElementById("rooms-container");

        this.table = document.createElement("table") as HTMLTableElement;
        const thead = document.createElement("thead");
        const tr = document.createElement("tr") as HTMLTableRowElement;
        this.headerNames.forEach(name => {
            const th =
                document.createElement("th") as HTMLTableHeaderCellElement;
            th.innerText = name;
            tr.appendChild(th);
        });
        thead.appendChild(tr);
        this.table.appendChild(thead);
        this.container.appendChild(this.table);

        this.tbody = document.createElement("tbody") as HTMLTableSectionElement;
        this.table.appendChild(this.tbody);
    }
    update(rooms: RoomSummary[]) {
        rooms.forEach(room => {
            if (this.rows[room.id] !== undefined) {
                this.rows[room.id].update(room);
            } else {
                const roomRow = new RoomRow(room, this.onJoin);
                this.rows[roomRow.room.id] = roomRow;
                this.tbody.appendChild(roomRow.tr);
            }
        });
    }
}

