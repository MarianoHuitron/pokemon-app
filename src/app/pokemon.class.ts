export class Pokemon {
    id: number;
    name: string;
    image?: string;
    attack: number;
    defense: number;
    hp?: number;
    type?: string;
    id_author?: number;
    idAuthor?: number;

    constructor(name: string, image: string, attack: number, defense: number, type: string) {
        this.name = name;
        this.attack = attack;
        this.image = image;
        this.defense = defense;
        this.hp = attack;
        this.type = type;
        this.idAuthor = 1;
    }
}