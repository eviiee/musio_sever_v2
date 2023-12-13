'use client';

import { HFlex } from '../../../components/layout/wrapper/flex';
import styles from './products_page.module.scss';
import MusioProduct from '../../../models/musio_product';
import ProductCard from '../../../components/layout/product_card';
import Link from 'next/link';
import { getAllMusioProductsFromFirestoreOnServerSide } from '../../../methods/api/product/get_all_products';
import { useEffect, useState } from 'react';
import PhoneModel from '../../../models/phone_model';
import { getAllModels } from '../../../methods/api/product/get_all_models';
import CheckBox from '../../../components/form/checkbox';
import Icon from '../../../components/icon';

export default function ProductsPage() {

    const [products, setProducts] = useState<MusioProduct[]>([])
    const [filteredProducts, setFilteredProducts] = useState<MusioProduct[]>([])
    const [models, setModels] = useState<PhoneModel[]>([])

    useEffect(() => {
        getProductsAndModelsInfo();
    }, [])

    async function getProductsAndModelsInfo() {

        const productsPromise = getAllMusioProductsFromFirestoreOnServerSide();
        const modelsPromise = getAllModels();

        const products = await productsPromise;
        const models = await modelsPromise;

        setProducts(products);
        setFilteredProducts(products);
        setModels(models);
    }

    return (
        <HFlex align='flex-start' className={styles.products_page_layout} gap={1}>
            <LeftSection products={products} setFilteredProducts={setFilteredProducts} models={models} />
            <RightSection products={filteredProducts} />
        </HFlex>
    )
}

function LeftSection({
    models, products, setFilteredProducts,
}: {
    models: PhoneModel[],
    products: MusioProduct[],
    setFilteredProducts: (products: MusioProduct[]) => void,
}) {
    return (
        <section className={styles.left_section}>
            <div className={styles.toolbar_filter_wrapper}>
                <PhoneModelFilter models={models} setFilteredProducts={setFilteredProducts} products={products} />
            </div>
            <div className={styles.toolbar_buttons}>
                <Link href={'/products/edit/new'}>
                    <Icon icon='add' size={14} />
                    <span>상품 등록</span>
                </Link>
                <Link href={'/products/model'}>
                    <Icon icon='mobile' size={14} />
                    <span>기종 관리</span>
                </Link>
            </div>
        </section>
    )
}

function RightSection({ products }: { products: MusioProduct[] }) {
    return (
        <section className={styles.right_section}>
            <div>
                <ProductList products={products} />
            </div>
        </section>
    )
}

function FilterToolBar() {
    return (
        <div className={styles.filter_tool_bar}>
            <h1>FilterToolBar</h1>
        </div>
    )
}

function PhoneModelFilter({
    models, products, setFilteredProducts,
}: {
    models: PhoneModel[],
    products: MusioProduct[],
    setFilteredProducts: (products: MusioProduct[]) => void,
}) {

    const [selectedModel, setSelectedModel] = useState<Set<PhoneModel>>(new Set());

    useEffect(() => {
        setSelectedModel(new Set());
    }, [models])

    useEffect(() => {
        handleFilterChange();
    }, [selectedModel])

    const handleModelClick = (model: PhoneModel) => {
        if (selectedModel.has(model)) {
            selectedModel.delete(model);
        } else {
            selectedModel.add(model);
        }
        setSelectedModel(new Set(selectedModel));
    }
    const handleFilterChange = () => {
        if (selectedModel.size == 0) return setFilteredProducts(products);
        const selectedModelList = [...selectedModel].map(model => model.id);
        const filteredProducts = products.filter(product => satisfiesFilterQuery(product, selectedModelList));
        setFilteredProducts(filteredProducts);
    }

    const satisfiesFilterQuery = (product: MusioProduct, modelIds: string[]): boolean => {
        for (let modelId of modelIds) {
            if (product.model.some(m => m == modelId)) return true;
        }
        return false;
    }

    return (
        <ul className={styles.filter_list}>
            <li className={styles.filter_model}>
                <HFlex align='center' justify='flex-start' gap={10}>
                    <h5>휴대폰 기종</h5>
                    {selectedModel.size > 0 && <span className={styles.filter_reset} onClick={() => setSelectedModel(new Set())}>초기화</span>}
                </HFlex>
                <ul className={styles.filter_model_list}>
                    {models.map(model => <FilterItem key={model.id} label={model.name} onClick={() => handleModelClick(model)} selected={selectedModel.has(model)} />)}
                </ul>
            </li>
        </ul>
    )
}

function FilterItem({
    label, selected, onClick,
}: {
    label: string,
    selected: boolean,
    onClick: () => void,
}) {
    return (
        <li className={styles.filter_item} onClick={onClick}>
            <CheckBox selected={selected} onSelect={() => { }} size={14} />
            <span>{label}</span>
        </li>
    )
}

function ProductList({ products }: { products: MusioProduct[] }) {
    return (
        <div className={styles.product_list}>
            {products.map(product => <ProductCard key={product.productId} product={product} />)}
        </div>
    )
}