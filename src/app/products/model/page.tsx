'use client';

import Button from '../../../../components/form/button';
import ReorderableList from '../../../../components/form/reorderable_list';
import TextInput from '../../../../components/form/textinput';
import { useToast } from '../../../../hooks/usetoasts';
import deletePhoneModel from '../../../../methods/api/product/delete_model';
import { getAllModels } from '../../../../methods/api/product/get_all_models';
import getAllMusioProductsFromFirestore from '../../../../methods/api/product/get_all_products';
import saveModelsInfo from '../../../../methods/api/product/save_models_info';
import MusioProduct from '../../../../models/musio_product';
import PhoneModel, { PhoneModelInterface } from '../../../../models/phone_model';
import styles from './model_page.module.scss';
import React, { useEffect, useState } from 'react';

export default function ModelManagingPage() {

    const [models, setModels] = useState<PhoneModel[]>([]);
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

    const [products, setProducts] = useState<MusioProduct[]>([]);
    const [productsToUpdate, setProductsToUpdate] = useState<{ modelId: string, products: MusioProduct[] }[]>([]);

    const { addToast } = useToast();

    useEffect(() => {
        getPhoneModels();
        getMusioProducts();
    }, [])

    const getPhoneModels = async () => {
        setModels(await getAllModels());
    }

    const getMusioProducts = async () => {
        setProducts(await getAllMusioProductsFromFirestore());
    }

    const getSelectedModelIndex = (id: string) => {
        const indexOfMutatedModel = models.map(model => model.id).indexOf(id);
        return indexOfMutatedModel;
    }

    const getSelectedModel = (id: string | null) => {
        if (!id) return null;
        const indexOfMutatedModel = getSelectedModelIndex(id);
        return models[indexOfMutatedModel!];
    }

    const mutateModel = (mutator: PhoneModelInterface) => {
        const indexOfMutatedModel = getSelectedModelIndex(selectedModelId!);
        const mutatedModel = models[indexOfMutatedModel!].mutate(mutator);
        const updatedModelList = [...models];
        updatedModelList[indexOfMutatedModel!] = mutatedModel;
        setModels(updatedModelList);
    }

    const selectedModel = getSelectedModel(selectedModelId);

    const deleteModel = async () => {
        try {
            if (selectedModel?.index) {
                await deletePhoneModel(selectedModel!);
            }
            addToast({
                type: 'success',
                message: '삭제되었습니다.',
            })
            setModels(models.filter(model => model.id !== selectedModelId));
            setSelectedModelId(null);
        } catch (e: any) {
            addToast({
                type: 'error',
                message: e.message,
            })
        }
    }

    const onSave = async () => {
        try {
            await saveModelsInfo(models);
            addToast({
                type: 'success',
                message: '저장되었습니다.',
            })
        } catch (e: any) {
            addToast({
                type: 'error',
                message: e.message,
            })
        }
    }

    return (
        <div className={styles.model_page}>
            <ModelList models={models} setModels={setModels} onSelectModel={setSelectedModelId} selectedModelId={selectedModelId} />
            <ModelDetailSection model={selectedModel} onMutateModel={mutateModel} onDeleteModel={deleteModel} />
            <ProductToUpdateList selectedModel={selectedModel} products={products} productsToUpdate={productsToUpdate} setProductsToUpdate={setProductsToUpdate} />
            <Button small onClick={onSave} type='primary' text='저장' />
        </div>
    )
}

function ModelList({
    models,
    setModels,
    onSelectModel,
    selectedModelId,
}: {
    models: PhoneModel[],
    setModels: (models: PhoneModel[]) => void,
    onSelectModel: (modelId: string) => void,
    selectedModelId: string | null,
}) {

    const addNewModel = () => {
        setModels([new PhoneModel({
            name: '새 기종',
        }), ...models]);
    }

    const selectModel = (model: PhoneModel) => {
        onSelectModel(model.id);
    }

    return (
        <section className={styles.model_list_wrapper}>
            <Button onClick={addNewModel} type='light' text='기종 추가' />
            <ReorderableList<PhoneModel> list={models} onChange={setModels} onClick={selectModel} itemBuilder={(item) => <ModelCard model={item} selected={item.id == selectedModelId} />} />
        </section>
    )
}

function ModelCard({ model, selected }: { model: PhoneModel, selected: boolean }) {
    return <span className={selected ? styles.selected : ''}>{model.name}</span>
}

function ModelDetailSection({
    model,
    onMutateModel,
    onDeleteModel,
}: {
    model: PhoneModel | null,
    onMutateModel: (model: PhoneModelInterface) => void,
    onDeleteModel: () => void,
}) {
    return (
        <section className={styles.model_detail_section}>
            <h2 style={{ fontSize: '24px', marginBottom: '36px' }}>기종 상세</h2>
            <div className={styles.model_detail_wrapper}>
                {model ? <ModelDetail model={model} onMutateModel={onMutateModel} /> : <span>기종을 선택해주세요.</span>}
            </div>
            {model && <button onClick={onDeleteModel} className={styles.delete_button}>기종 삭제</button>}
        </section>
    )
}

function ModelDetail({
    model,
    onMutateModel,
}: {
    model: PhoneModel,
    onMutateModel: (model: PhoneModelInterface) => void,
}) {

    const handleNameChange = (newName: string) => {
        onMutateModel({ name: newName })
    }

    const handleNameShortChange = (newShortName: string) => {
        onMutateModel({ name_short: newShortName })
    }

    return (
        <div className={styles.model_detail}>
            <TextInput label='기종명' value={model.name} onChange={handleNameChange} name='name' />
            <TextInput label='기종명(짧게)' value={model.name_short ?? ''} onChange={handleNameShortChange} name='name_short' />
            <span className={styles.model_id}>기종 ID : {model.id}</span>
            <span className={styles.model_index}>변경 전 정렬 순서 : {model.index !== undefined ? model.index + 1 : '신기종'}</span>
        </div>
    )
}

function ProductToUpdateList({
    selectedModel,
    products,
    productsToUpdate,
    setProductsToUpdate,
}: {
    selectedModel: PhoneModel | null,
    products: MusioProduct[],
    productsToUpdate: { modelId: string, products: MusioProduct[] }[],
    setProductsToUpdate: (productsToUpdate: { modelId: string, products: MusioProduct[] }[]) => void,
}) {
    return (
        <section className={styles.products_list_section}>
            <h2  style={{ fontSize: '24px', marginBottom: '36px' }}>기종을 추가할 상품</h2>
            <SelectableProductList
                selectedModel={selectedModel}
                products={products}
                productsToUpdate={productsToUpdate}
                setProductsToUpdate={setProductsToUpdate}
            />
        </section>
    )
}

function SelectableProductList({
    selectedModel,
    products,
    productsToUpdate,
    setProductsToUpdate,
}: {
    selectedModel: PhoneModel | null,
    products: MusioProduct[],
    productsToUpdate: { modelId: string, products: MusioProduct[] }[],
    setProductsToUpdate: (product: { modelId: string, products: MusioProduct[] }[]) => void,
}) {

    const onProductSelect = (product: MusioProduct) => {
        if (selectedModel == null || selectedModel!.index != null) return;
        const exists = productsToUpdate.some(productToUpdate => productToUpdate.modelId == selectedModel!.id);
        if (exists) {
            setProductsToUpdate(productsToUpdate.map(productToUpdate => {
                if (productToUpdate.modelId == selectedModel!.id) {
                    return {
                        ...productToUpdate,
                        products: [...productToUpdate.products, product],
                    }
                }
                return productToUpdate;
            }))
        } else {
            setProductsToUpdate([...productsToUpdate, {
                modelId: selectedModel!.id,
                products: [product],
            }])
        }
    }

    const productsListGrid = products.map(product => {
        const selected = false;
        const handleProductSelection = () => onProductSelect(product);
        return <SelectableProductCard product={product} selected={selected} onSelect={handleProductSelection} />
    })

    return (
        <div className={styles.selectable_product_list}>
            {selectedModel ? productsListGrid : <span>기종을 선택해주세요.</span>}
        </div>
    )
}

function SelectableProductCard({
    product,
    selected,
    onSelect,
}: {
    product: MusioProduct,
    selected: boolean,
    onSelect: () => void,
}) {
    return (
        <div className={`${styles.selectable_product_card} ${selected ? styles.selected : ''}`} onClick={onSelect}>
            <img src={product.image} />
            <span>{product.name}</span>
        </div>
    )
}