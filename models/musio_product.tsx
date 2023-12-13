
export interface MusioProductInterface {
    name?: string,
    cost?: number,
    price?: number,
    image?: string,
    model: string[],
    color: string[],
    productId?: string,
    detailImage?: string[],
};


export default class MusioProduct {

    name?: string;
    cost?: number;
    price?: number;
    image?: string;
    model: string[];
    color: string[];
    productId?: string;
    detailImage?: string[];

    constructor({
        name,
        cost,
        price,
        image,
        model,
        color,
        productId,
        detailImage,
    } : MusioProductInterface = {
        name: '',
        model: [],
        color: [],
    }) {
        this.name = name;
        this.cost = cost;
        this.price = price;
        this.image = image;
        this.model = model;
        this.color = color;
        this.productId = productId;
        this.detailImage = detailImage;
    }

    setInfo({
        name,
        cost,
        price,
        image,
        model,
        color,
        detailImage
    } : MusioProductInterface) {
        this.name = name ?? this.name;
        this.cost = cost ?? this.cost;
        this.price = price ?? this.price;
        this.image = image ?? this.image;
        this.model = model ?? this.model;
        this.color = color ?? this.color;
        this.detailImage = detailImage ?? this.detailImage;
        return this;
    }

    setProductId(productId: string) {
        this.productId = productId;
        return this;
    }
    
    isValid () {
        // TODO : 상품정보 검증 구현
        if (this.name === undefined || this.name === '') {
            return false;
        }
        if (this.cost === undefined || this.cost === 0) {
            return false;
        }
        if (this.price === undefined || this.price === 0) {
            return false;
        }
        // if (this.image === undefined || this.image === '') {
        //     return false;
        // }
        if (this.model.length === 0) {
            return false;
        }
        if (this.color.length === 0) {
            return false;
        }
        return true;
    }

    toObject() {
        return {
            name: this.name ?? '',
            cost: this.cost ?? 0,
            price: this.price ?? 0,
            image: this.image ?? null,
            model: this.model ?? [],
            color: this.color ?? [],
            productId: this.productId,
            detailImage: this.detailImage ?? [],
        }
    }
}