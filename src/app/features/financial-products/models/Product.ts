export interface IProduct {
    id:string;
    name:string;
    logoUrl:string;
    description:string;
    date_release: string;
    date_revision: string;
}

export class Product implements IProduct {
    constructor(
        public id: string,
        public name: string,
        public logoUrl: string,
        public description: string,
        public date_release: string,
        public date_revision: string
    ) {}
}
