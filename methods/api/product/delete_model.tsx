import { deleteDoc, doc } from "firebase/firestore";
import PhoneModel from "../../../models/phone_model";
import fireStore from "../../../firebase/firestore";
import { Collections } from "../../../firebase/firebaseCollections";


export default async function deletePhoneModel(model : PhoneModel) {
    const docRef = doc(fireStore, Collections.phone_models, model.id);
    await deleteDoc(docRef)
}