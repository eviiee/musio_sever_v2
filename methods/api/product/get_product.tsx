import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Collections } from "../../../firebase/firebaseCollections";
import firestore from "../../../firebase/firestore";
import MusioProduct from "../../../models/musio_product";
import MusioProductOption from "../../../models/musio_product_option";

export interface MusioProductInfoInterface {
    product: MusioProduct,
    options: MusioProductOption[],
}

export default async function getProductInfoFromFirestore(productId: string) : Promise<MusioProductInfoInterface> {
    const productInfoDoc = await getDoc(doc(firestore, Collections.musio_product, productId))
    const product = productInfoDoc.data() as MusioProduct
    const optionsSnapshot = await getDocs(collection(firestore, Collections.musio_product, productId, 'options'))
    const options = optionsSnapshot.docs.map(optionDoc => optionDoc.data() as MusioProductOption)
    return {product, options}
}