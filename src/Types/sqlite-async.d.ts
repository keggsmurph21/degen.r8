declare module "sqlite-async" {
    export default class Database {
        static open: (path: string) => Promise<Database>;
        run: (query: string, ...params: any) => Promise<RunResult>;
        get: (query: string, ...params: any) => Promise<GetResult|undefined>;
        all: (query: string, ...params: any) => Promise<AllResult|undefined>;
    }

    interface RunResult {
        lastID: number;
        changes: number;
    }
    type GetResult = any;
    type AllResult = any[];
}
