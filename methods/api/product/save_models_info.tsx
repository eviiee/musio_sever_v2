import { WriteBatch, doc, writeBatch } from "firebase/firestore";
import { Collections } from "../../../firebase/firebaseCollections";
import fireStore from "../../../firebase/firestore";
import PhoneModel from "../../../models/phone_model";

export default async function saveModelsInfo(models: PhoneModel[]) {
    validateInfo(models);
    setIndexes(models);
    const batch = saveModelOnBatch(models);
    await batch.commit();
}

const validateInfo = (models: PhoneModel[]) => {
    const isValid = models.every(model => model.isValid());
    if (!isValid) throw new Error('정보를 다시 확인해주세요.');
}

const setIndexes = (models: PhoneModel[]) => {
    models.forEach((model, index) => {
        model.setIndex(index);
    });
}

const saveModelOnBatch = (models: PhoneModel[]) : WriteBatch => {
    const batch = writeBatch(fireStore);
    models.forEach(model => {
        const docRef = doc(fireStore, Collections.phone_models, model.id);
        batch.set(docRef, model.toObject());
    });
    return batch;
}