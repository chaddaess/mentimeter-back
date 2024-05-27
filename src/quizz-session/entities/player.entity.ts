import {Option } from "../../options/entities/option.entity";

export class Player {
    pseudo: string;
    avatar: string;
    score: number;
    answers: Option[];

    constructor(pseudo: string, avatar: string) {
        this.pseudo = pseudo;
        this.avatar = avatar;
        this.score = 0;
        this.answers = [];
    }
}
