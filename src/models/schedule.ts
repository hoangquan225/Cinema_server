import { isObject } from "../utils/helpers";
import { Film } from "./film";

const theaterMapping = {
    1: "Thanh Xuân",
    2: "Long Biên",
    3: "Royal City",
    4: "Time City",
    5: "Hà Đông",
    6: "Giải Phóng"
};

class Schedule {
    id?: string | undefined;
    filmId: string | null;
    filmInfo: Film | null;
    romId: string | null;
    showTime: [string];
    showDate: number;
    startTime: number;
    endTime: number;
    nSeat: number;
    createdAt: number;
    theater: number; //1: Thanh xuan, 2: Long Bien, 3: Royal city, 4: Time City, 5: Ha Dong, 6: Giai Phong
    theaterStr: string; //1: Thanh xuan, 2: Long Bien, 3: Royal city, 4: Time City, 5: Ha Dong, 6: Giai Phong
    roomNum: number; 

    constructor(args?: any) {
        if (!args) {
            args = {};
        }
        this.id = args?._id ?? args?.id ?? undefined;
        this.filmId = isObject(args.filmId) ? new Film(args.filmId)?.id : (args?.filmId ?? undefined);
        this.filmInfo = isObject(args.filmId) ? new Film(args.filmId) : (args?.filmInfo ?? undefined);
        this.romId = args?.romId ?? 0;
        this.showTime = args?.showTime ?? [];
        this.showDate = args?.showDate ?? 0;
        this.startTime = args?.startTime ?? 0;
        this.endTime = args?.endTime ?? 0;
        this.nSeat = args?.nSeat ?? 0;
        this.createdAt = args?.createdAt ?? 0;
        this.roomNum = args?.roomNum ?? null;
        this.theater = args?.theater ?? null;
        this.theaterStr =  args?.theater in theaterMapping ? theaterMapping[args.theater] : null;
    }
}

export { Schedule };

