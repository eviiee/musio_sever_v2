import { cache } from "react";
import { Collections } from "../../../firebase/firebaseCollections";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import fireStore from "../../../firebase/firestore";
import PhoneModel, { PhoneModelInterface } from "../../../models/phone_model";

export const getAllModels = cache(async () : Promise<PhoneModel[]> => {
    const col = collection(fireStore, Collections.phone_models)
    const q = query(col, orderBy('index', 'asc'))
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map(doc => new PhoneModel({...(doc.data() as PhoneModelInterface)}))
    return data
})