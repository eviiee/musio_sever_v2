import { setDoc, doc, writeBatch, getDocs, collection, Transaction, runTransaction } from "firebase/firestore";
import { Collections } from "../../../firebase/firebaseCollections";
import firestore from "../../../firebase/firestore";
import MusioProduct from "../../../models/musio_product";
import MusioProductOption from "../../../models/musio_product_option";

interface EditOrCreateProductProps {
    product: MusioProduct
    options: MusioProductOption[]
    onSuccess: () => void
    onFailure: () => void
}

export default async function editOrCreateProduct({
    product,
    options,
    onSuccess,
    onFailure,
}: EditOrCreateProductProps
): Promise<boolean> {
    try {
        await saveInfo(product, options)
        onSuccess()
        return true
    } catch (e) {
        console.log(e)
        onFailure()
        return false
    }
}

async function saveInfo(product: MusioProduct, options: MusioProductOption[]) {
    runTransaction(firestore, async (transaction) => {
        await deleteRemovedOptionsFromCollection(transaction, product.productId!, options)
        product = updateProductModelAndColorList(product, options)
        setProductDoc(transaction, product)
        setOptionDocs(transaction, product.productId!, options)
    })
}

function updateProductModelAndColorList(product: MusioProduct, options: MusioProductOption[]): MusioProduct {
    product.model = [...new Set(options.map(option => option.model))]
    product.color = [...new Set(options.map(option => option.color))]
    return product
}

async function deleteRemovedOptionsFromCollection(transaction: Transaction, productId: string, options: MusioProductOption[]) {

    const productDoc = await transaction.get(doc(firestore, Collections.musio_product, productId))
    if (!productDoc.exists()) return

    const optionIds = new Set(options.map(option => option.id))
    const optionSnapshot = await getDocs(collection(firestore, Collections.musio_product, productId, 'options'))
    optionSnapshot.forEach(optionDoc => {
        if (!optionIds.has(optionDoc.id)) {
            transaction.delete(optionDoc.ref)
        }
    })
}

function setOptionDocs(transaction: Transaction, productId: string, options: MusioProductOption[]) {
    options.forEach(option => {
        const opDoc = doc(firestore, Collections.musio_product, productId, 'options', option.id)
        transaction.set(opDoc, option.toObject())
    })
}

function setProductDoc(transaction: Transaction, product: MusioProduct) {
    const productDoc = doc(firestore, Collections.musio_product, product.productId!)
    transaction.set(productDoc, product.toObject())
}