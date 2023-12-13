'use client'
import { ReactNode, useEffect, useState } from "react";
import { HFlex } from "../../../components/layout/wrapper/flex";
import MusioProduct from "../../../models/musio_product";
import styles from './stock_page.module.scss';
import { getAllMusioProductsFromFirestoreOnServerSide } from "../../../methods/api/product/get_all_products";
import Toggle from "../../../components/form/toggle";

export default function StockPage() {

    const [products, setProducts] = useState<MusioProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<MusioProduct | null>(null);

    const [tableMode, setTableMode] = useState<boolean>(true);

    useEffect(() => {
        getProductsList();
    }, [])

    const getProductsList = async () => {
        const productsList = await getAllMusioProductsFromFirestoreOnServerSide();
        setProducts(productsList);
        setSelectedProduct(productsList[0]);
    }

    return (
        <HFlex className={styles.stockPage} gap={1}>
            <LeftSection
                products={products}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                tableMode={tableMode}
                setTableMode={setTableMode}
            />
            <RightSection
                selectedProduct={selectedProduct}
                tableMode={tableMode}
            />
        </HFlex>
    )
}

function LeftSection({
    products,
    selectedProduct,
    setSelectedProduct,
    tableMode,
    setTableMode
}: {
    products: MusioProduct[],
    selectedProduct: MusioProduct | null,
    setSelectedProduct: (product: MusioProduct | null) => void,
    tableMode: boolean,
    setTableMode: (mode: boolean) => void
}) {

    const productsList = products.map((product, index) => {
        const selected = selectedProduct === product;
        return <ProductListItem key={product.productId} product={product} selected={selected} onSelect={setSelectedProduct} />
    })


    return (
        <section className={styles.leftSection}>
            <Toggle option1="테이블" option2="목록" onChange={() => setTableMode(!tableMode)} firstOptionSelected={tableMode} />
            <ul className={styles.products_list}>
                {productsList}
            </ul>
        </section>
    )
}

function ProductListItem({
    product,
    selected,
    onSelect,
}: {
    product: MusioProduct,
    selected: boolean,
    onSelect: (v: MusioProduct) => void
}) {
    return (
        <li className={`${styles.product_list_item} ${selected ? styles.selected : ''}`} onClick={() => onSelect(product)}>
            <img src={product.image} alt={product.name} />
            <span>{product.name}</span>
        </li>
    )
}

function RightSection({
    selectedProduct,
    tableMode
}: {
    selectedProduct: MusioProduct | null,
    tableMode: boolean
}) {

    if (selectedProduct === null) return <></>

    return (
        <section className={styles.rightSection}>
            <div className={styles.rightSectionHeader}>
                <h1>Details</h1>
            </div>
            <div className={styles.rightSectionContent}>
            </div>
        </section>
    )
}