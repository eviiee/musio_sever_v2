'use client';
import firestore from "../../../firebase/firestore";
import { collection, addDoc } from "firebase/firestore";


export default function TestPage() {

    console.debug(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)

    const onClick = async () => {
        await addDoc(collection(firestore, 'test'), {
            name: 'test',
            age: 20
        })
    }

    return (
        <div>
            <button onClick={onClick}>click</button>
        </div>
    )
}