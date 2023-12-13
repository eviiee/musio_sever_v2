import PhoneModel from "./phone_model";

interface MusioProductOptionInterface {
    model: string,
    color: string,
    stock?: number,
}

export default class MusioProductOption {

    model: string;
    color: string;
    id: string;
    stock: number;

    constructor({
        model,
        color,
        stock,
    }: MusioProductOptionInterface) {
        this.model = model;
        this.color = color;
        this.id = `${model}${color}`;
        this.stock = stock ?? 0;
    }

    toObject() {
        return {
            model: this.model,
            color: this.color,
            stock: this.stock,
        }
    }
}