import firebasedb from "./firebasedb";
import { getFirestore } from "firebase/firestore";

const fireStore = getFirestore(firebasedb.firebasedb);
export default fireStore;