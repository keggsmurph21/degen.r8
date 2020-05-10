export interface Player {
    balance: number, id: number, name: string,
}

export namespace Player {
export function eq(p: Player, q: Player): boolean {
    return p && q && p.id === q.id && p.name === q.name;
}
}
