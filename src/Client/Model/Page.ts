import {User} from "./User";

declare global {
    interface Window {
        main: (user: User, roomId: number) => void;
    }
}
