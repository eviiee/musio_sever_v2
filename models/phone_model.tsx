
export interface PhoneModelInterface {
    name?: string | undefined,
    name_short?: string,
    index?: number,
    id?: string,
}

export default class PhoneModel {

    name: string
    name_short?: string
    index?: number
    id: string

    constructor({
        name,
        name_short,
        index,
        id,
    } : PhoneModelInterface = {
        name: '',
        name_short: '',
        index: 0,
    }) {
        this.name = name ?? '';
        this.name_short = name_short;
        this.index = index;
        this.id = id ?? this.generateModelId();
    }

    isValid() {
        return this.name && this.name_short;
    }

    generateModelId() {
        this.id = Date.now().toString();
        return this.id;
    }

    setIndex(index: number) {
        this.index = index;
        return this;
    }

    mutate({
        name,
        name_short,
        index,
        id,
    } : PhoneModelInterface) : PhoneModel {
        this.name = name ?? this.name;
        this.name_short = name_short ?? this.name_short;
        this.index = index ?? this.index;
        this.id = id ?? this.id;

        const mutatedModel = new PhoneModel({
            name: this.name,
            name_short: this.name_short,
            index: this.index,
            id: this.id,
        })

        return mutatedModel;
    }

    toObject() : PhoneModelInterface {
        return {
            name: this.name,
            name_short: this.name_short,
            index: this.index,
            id: this.id,
        }
    }
}