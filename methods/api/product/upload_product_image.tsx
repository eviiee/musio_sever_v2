import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import MusioProduct from "../../../models/musio_product";


export default async function uploadProductImage(productInfo: MusioProduct, imageFile: File) {
    
    const storage = getStorage();
    const storageRef = ref(storage, 'product_images/' + productInfo.productId!);

    const snapshot = await uploadBytes(storageRef,imageFile!);
    const imageUrl = getDownloadURL(snapshot.ref);
    
    return imageUrl;

}