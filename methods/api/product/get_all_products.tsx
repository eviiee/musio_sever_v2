import { collection, getDocs } from "firebase/firestore";
import { Collections } from "../../../firebase/firebaseCollections";
import firestore from "../../../firebase/firestore";
import MusioProduct from "../../../models/musio_product";
import { cache } from "react";


export default async function getAllMusioProductsFromFirestore() : Promise<MusioProduct[]> {
    const snapshot = await getDocs(collection(firestore, Collections.musio_product));
    const products = snapshot.docs.map(doc => doc.data() as MusioProduct);
    return products;
}

export const getAllMusioProductsFromFirestoreOnServerSide = cache(async () => {
    const data = await getAllMusioProductsFromFirestore();
    return data;
})