import {createSVGElement, removeChildren, SVGWidget} from "../SVG";

import {tableRadius} from "./Constants";
import {EmptySeatWidget} from "./EmptySeat";
import {SeatData, SeatWidget} from "./Seat";

// Returns the (x, y) coordinates of the point obtained by rotating (0, radius)
// clockwise[1] around the circle of radius (radius) by (2π * index / nPlayers).
//
// [1] Clockwise b/c in SVG-world, larger y means farther from the top!
function rotatedPosition(index: number, nPlayers: number,
                         radius: number): [number, number] {
    const theta = index * 2 * Math.PI / nPlayers - Math.PI / 2;
    const x = 1.3 * Math.cos(theta) * radius;
    const y = Math.sin(theta) * radius;
    return [x, y];
}

// Simple linear function that gives smaller numbers as nPlayers increases.
// This is meant to be used so that rooms with lots of players don't get too
// crowded.
function scaleFor(nPlayers: number): number { return 1.35 - nPlayers * 0.05; }

type BaseSeatWidget = EmptySeatWidget|SeatWidget;

export type BaseSeatData = {
    canSit: boolean,
    isAvailable: boolean,
    seat: SeatData|null,
    isCurrentPlayer: boolean,
}

export type SeatsData = {
    seats: BaseSeatData[],
}

export class SeatsWidget extends SVGWidget<SeatsData> {
    public container: SVGGElement;
    constructor(data: SeatsData,
                onClick: (name: string, value: number) => void) {
        super(data);
        this.container = createSVGElement<SVGGElement>("g");
        data.seats.forEach((seatData, i) => {
            // NB: Adjusted tableRadius so that player isn't exactly on table
            // edge
            const radius = tableRadius * 1.25;
            const [x, y] = rotatedPosition(i, data.seats.length, radius);
            const scale = scaleFor(data.seats.length);
            let seatWidget: BaseSeatWidget;
            if (seatData.isAvailable) {
                seatWidget = new EmptySeatWidget(
                    {index: i, canSit: seatData.canSit}, onClick);
            } else {
                seatWidget = new SeatWidget(seatData.seat);
                if (seatData.isCurrentPlayer)
                    seatWidget.container.classList.add("current-player");
            }
            seatWidget.transform({translate: {x, y}, scale});
            this.container.appendChild(seatWidget.container);
        });
    }
}
