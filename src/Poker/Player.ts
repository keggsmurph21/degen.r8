export class Player {
    private balance: number = 20.00;
    public incrementBalance(delta: number): void {
        this.balance += delta;
    }
    public decrementBalance(delta: number): void {
        this.balance -= delta;
        if (this.balance < 0)
            throw new Error("Negative balance!");
    }
    public getBalance(): number {
        return this.balance;
    }
    public canAfford(amount: number): boolean {
        return this.balance >= amount;
    }
};
