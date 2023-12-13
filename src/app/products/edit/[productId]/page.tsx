'use client';

import { useEffect, useState } from 'react';
import TextInput from '../../../../../components/form/textinput';
import { HFlex, VFlex } from '../../../../../components/layout/wrapper/flex';
import styles from './products_page.module.scss';
import MusioProduct, { MusioProductInterface } from '../../../../../models/musio_product';
import { motion } from 'framer-motion';
import Toggle from '../../../../../components/form/toggle';
import TagSelector from '../../../../../components/form/tag_selector';
import TagListInput from '../../../../../components/form/tag_list_input';
import { useToast } from '../../../../../hooks/usetoasts';
import Button from '../../../../../components/form/button';
import editOrCreateProduct from '../../../../../methods/api/product/edit_product';
import uploadProductImage from '../../../../../methods/api/product/upload_product_image';
import getProductInfoFromFirestore, { MusioProductInfoInterface } from '../../../../../methods/api/product/get_product';
import ImageSelector from '../../../../../components/form/image_selector';
import { getAllModels } from '../../../../../methods/api/product/get_all_models';
import PhoneModel from '../../../../../models/phone_model';
import MusioProductOption from '../../../../../models/musio_product_option';
import CheckBox from '../../../../../components/form/checkbox';
import { useRouter } from 'next/navigation';

export default function ProductsEditPage({
    params
}: {
    params: {
        productId: string,
    }
}) {

    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [productInfo, setProductInfo] = useState<MusioProduct>(new MusioProduct());
    const [optionsInfo, setOptionsInfo] = useState<MusioProductOption[]>([]);
    const onProductInfoChange = (productInfo: MusioProductInterface) => setProductInfo(new MusioProduct({ ...productInfo }));

    useEffect(() => {
        if (isNewProduct()) return;
        getProductInfoFromFirestore(params.productId)
            .then(bindProductInfoToState);
    }, []);

    const isNewProduct = () => params.productId === 'new';

    const bindProductInfoToState = (pInfo: MusioProductInfoInterface) => {
        setProductInfo(pInfo.product);
        setOptionsInfo(pInfo.options);
    }

    return (
        <VFlex align='stretch' justify='flex-start' className={styles.layout} gap={20}>
            <ProductDefaultInfoSection productInfo={productInfo} setProductInfo={onProductInfoChange} />
            <ProductOptionInfoSection productInfo={productInfo} setProductInfo={onProductInfoChange} optionsInfo={optionsInfo} setOptionsInfo={setOptionsInfo} />
            <ProductImageInfoSection productInfo={productInfo} setProductInfo={onProductInfoChange} setImageFile={setImageFile} />
            <SubmitButton productInfo={productInfo} optionsInfo={optionsInfo} imageFile={imageFile} />
        </VFlex>
    )
}

function NewProductSection({
    children,
    title,
}: {
    children: React.ReactNode,
    title: string,
}) {

    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const toggleExpanded = () => setIsExpanded(!isExpanded);
    const animationProperties = {
        animate: {
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
        },
        transition: {
            duration: 0.2,
        },
    }

    return (
        <section>
            <HFlex justify='flex-start' align='center' onClick={toggleExpanded} className={styles.title} gap={15}>
                <h2>{title}</h2>
                <span>{isExpanded ? '접기' : '펼치기'}</span>
            </HFlex>
            <motion.div {...animationProperties} className={styles.motioned_div}>
                <div className={styles.content_wrapper}>
                    {children}
                </div>
            </motion.div>
        </section>
    )
}

function ProductDefaultInfoSection({
    productInfo,
    setProductInfo,
}: {
    productInfo: MusioProduct,
    setProductInfo: (productInfo: MusioProductInterface) => void,
}) {

    const handleProductNameChange = (value: string) => setProductInfo({ ...productInfo, name: value, });
    const handleProductCostChange = (value: string) => setProductInfo({ ...productInfo, cost: value ? parseInt(value) : undefined, });
    const handleProductPriceChange = (value: string) => setProductInfo({ ...productInfo, price: value ? parseInt(value) : undefined, });

    return (
        <NewProductSection title='상품 기본 정보'>
            <TextInput label='상품명' placeholder='스퀘어젤리' value={productInfo.name ?? ''} onChange={handleProductNameChange} name={'name'} maxLength={20} inputWidth={400} />
            <TextInput label='입고가' placeholder='800' value={productInfo.cost?.toString() ?? ''} onChange={handleProductCostChange} name={'cost'} unit='원' inputWidth={250} />
            <TextInput label='판매가' placeholder='7900' value={productInfo.price?.toString() ?? ''} onChange={handleProductPriceChange} name={'price'} unit='원' inputWidth={250} />
        </NewProductSection>
    )
}

function ProductOptionInfoSection({
    productInfo,
    setProductInfo,
    optionsInfo,
    setOptionsInfo,
}: {
    productInfo: MusioProduct,
    setProductInfo: (productInfo: MusioProductInterface) => void,
    optionsInfo: MusioProductOption[],
    setOptionsInfo: (optionsInfo: MusioProductOption[]) => void,
}) {

    const [models, setModels] = useState<PhoneModel[]>([]);
    const { addToast } = useToast();

    useEffect(() => {
        getAllModels().then(setModels);
    }, [])

    const selectedModels = new Set([...productInfo.model]);
    const setSelectedModels = (v: Set<string>) => setProductInfo({
        ...productInfo, model: [...v].sort((a, b) => {
            const aIndex = getModelIndex(a);
            const bIndex = getModelIndex(b);
            return aIndex - bIndex;
        })
    });
    const setColorOptions = (v: string[]) => setProductInfo({ ...productInfo, color: [...v] });

    const getModelIndex = (modelId: string): number => {
        const index = models.find(m => m.id == modelId)?.index!
        return index;
    }

    const handleApply = () => {

        if (productInfo.model.length === 0) {
            addToast({
                message: '기종을 1개 이상 선택해주세요',
                type: 'error',
            })
            return;
        }

        if (productInfo.color.length === 0) {
            addToast({
                message: '색상을 1개 이상 입력해주세요',
                type: 'error',
            })
            return;
        }

        let prevOptions: { [key: string]: number } = {}
        optionsInfo.forEach(o => prevOptions[o.id] = o.stock);

        let newOptions = createNewOptions(prevOptions);

        setOptionsInfo(newOptions);

        addToast({
            message: '옵션이 적용되었습니다',
            type: 'success',
        })
    }

    const createNewOptions = (prevOptions: { [key: string]: number }) => {
        let newOptions: MusioProductOption[] = [];
        productInfo.model.forEach(model => {
            productInfo.color.forEach(color => {
                newOptions.push(new MusioProductOption({
                    model,
                    color,
                    stock: prevOptions[`${model}${color}`] ?? 0,
                }))
            })
        });
        return newOptions;
    }

    const createModelIdToNameMap = () => {
        let modelIdToNameMap: { [key: string]: string } = {};
        models.forEach(m => modelIdToNameMap[m.id] = m.name);
        return modelIdToNameMap;
    }

    return (
        <NewProductSection title='옵션 정보'>
            <Toggle onChange={() => { }} firstOptionSelected={true} option1='케이스' option2='기타' />
            <VFlex gap={40} className={styles.option_section_contents}>
                <TagSelector label='휴대폰 기종' tags={models.map(m => m.name)} tagValues={models.map(m => m.id)} selectedTags={selectedModels} onSelectedTagsChange={setSelectedModels} />
                <TagListInput label='케이스 색상' tags={productInfo.color} onChange={setColorOptions} />
                <ApplyButton onClick={handleApply} />
                <OptionList optionsInfo={optionsInfo} setOptionsInfo={setOptionsInfo} modelIdToNameMap={createModelIdToNameMap()} />
            </VFlex>
        </NewProductSection>
    )
}

function OptionList({
    optionsInfo,
    setOptionsInfo,
    modelIdToNameMap,
}: {
    optionsInfo: MusioProductOption[],
    setOptionsInfo: (optionsInfo: MusioProductOption[]) => void,
    modelIdToNameMap: { [key: string]: string },
}) {

    const [selectedOptions, setSelectedOptions] = useState<Set<MusioProductOption>>(new Set());

    const handleStockChange = (optionId: string, value: string) => {

        let newOptions = [...optionsInfo];

        const optionIndex = newOptions.findIndex(o => o.id === optionId);
        newOptions[optionIndex] = new MusioProductOption({
            ...newOptions[optionIndex],
            stock: value ? parseInt(value) : undefined,
        });

        setOptionsInfo(newOptions);
    }

    const handleDeleteSelected = () => {
        if (selectedOptions.size === 0) return;

        let filteredOptions: MusioProductOption[] = [...optionsInfo];
        let filteredSelection: Set<MusioProductOption> = new Set([...selectedOptions]);

        selectedOptions.forEach(o => {
            [filteredOptions, filteredSelection] = deleteOption(o.id, filteredOptions, filteredSelection);
        })

        setOptionsInfo(filteredOptions!);
        setSelectedOptions(filteredSelection!);
    }

    const handleSingleDelete = (optionId: string) => {
        const [filteredOptions, filteredSelection] = deleteOption(optionId);

        setOptionsInfo(filteredOptions);
        setSelectedOptions(filteredSelection);
    }

    const deleteOption = (optionId: string, originalOptionsList: MusioProductOption[] = optionsInfo, originalSelectedList: Set<MusioProductOption> = selectedOptions): [a: MusioProductOption[], b: Set<MusioProductOption>] => {

        const filteredOptions: MusioProductOption[] = [...originalOptionsList].filter(o => o.id !== optionId);
        const filteredSelection: Set<MusioProductOption> = new Set([...originalSelectedList].filter(o => o.id !== optionId));

        return [filteredOptions, filteredSelection];
    }

    const handleSelectAll = () => {
        if (selectedOptions.size === optionsInfo.length) {
            deselectAllOptions();
        } else {
            selectAllOptions();
        }
    }

    const selectAllOptions = () => {
        setSelectedOptions(new Set(optionsInfo));
    }

    const deselectAllOptions = () => {
        setSelectedOptions(new Set());
    }

    const handleSelection = (optionId: string, selected: boolean) => {
        let newSelectedOptions = new Set(selectedOptions);
        if (selected) {
            newSelectedOptions.add(optionsInfo.find(o => o.id === optionId) as MusioProductOption);
        } else {
            newSelectedOptions.delete(optionsInfo.find(o => o.id === optionId) as MusioProductOption);
        }
        setSelectedOptions(newSelectedOptions);
    }

    return (
        <div className={styles.option_list_wrapper}>
            <label>옵션 목록</label>
            <ul className={styles.options_list}>
                <OptionListToolbar onDeleteSelected={handleDeleteSelected} onChangeSelectedStock={(value) => { }} />
                <OptionListHeader allSelected={selectedOptions.size == optionsInfo.length && selectedOptions.size > 0} handleSelectAll={handleSelectAll} />
                {optionsInfo.map((option, index) => {

                    const selected = (new Set([...selectedOptions].map(e=>e.id))).has(option.id);
                    const handleSelect = (v: boolean) => handleSelection(option.id, v);

                    return <OptionItem
                        key={option.id}
                        selected={selected}
                        onSelect={handleSelect}
                        modelName={modelIdToNameMap[option.model]}
                        colorName={option.color}
                        stock={option.stock}
                        setStock={(stock) => handleStockChange(option.id, stock)}
                        optionId={option.id}
                        onDelete={() => handleSingleDelete(option.id)}
                    />
                })}
            </ul>

        </div>
    )
}

function OptionListToolbar({
    onDeleteSelected,
    onChangeSelectedStock,
}: {
    onDeleteSelected: () => void,
    onChangeSelectedStock: (value: number) => void,
}) {

    const { addToast } = useToast();

    const handleStockChange = (v: string) => {
        if (v == '') {
            addToast({
                message: '재고를 입력해주세요',
                type: 'error',
            })
            return;
        }
        onChangeSelectedStock(parseInt(v));
    }

    return (
        <li className={styles.option_list_toolbar}>
            <button className={`${styles.delete_button}`} onClick={onDeleteSelected}>선택 삭제</button>
            <button className={`${styles.stock_change_button}`} onClick={() => { }}>재고 일괄 변경</button>
        </li>
    )
}

function OptionListHeader({
    allSelected,
    handleSelectAll,
}: {
    allSelected: boolean,
    handleSelectAll: () => void,
}) {
    return (
        <li className={styles.option_list_header}>
            <CheckBox selected={allSelected} onSelect={handleSelectAll} />
            <span>기종</span>
            <span>색상</span>
            <span>재고</span>
            <span className={styles.opID}>옵션 ID</span>
            <span></span>
        </li>
    )
}

function OptionItem({
    modelName,
    colorName,
    stock,
    selected,
    onSelect,
    setStock,
    optionId,
    onDelete,
}: {
    modelName: string,
    colorName: string,
    stock: number,
    selected: boolean,
    onSelect: (v: boolean) => void,
    setStock: (stock: string) => void,
    optionId: string,
    onDelete: () => void,
}) {
    return (
        <li className={styles.product_option_item}>
            <CheckBox selected={selected} onSelect={onSelect} />
            <span>{modelName}</span>
            <span>{colorName}</span>
            <TextInput name={`${modelName}${colorName}재고`} value={stock.toString()} onChange={setStock} inputWidth={100} unit='개' />
            <span className={styles.opID}>{optionId}</span>
            <button onClick={onDelete}>삭제</button>
        </li>
    )
}

function ApplyButton({ onClick }: { onClick: () => void }) {

    return (
        <div className={styles.product_options_apply_button_wrapper}>
            <div></div>
            <Button text='적용' type='light' onClick={onClick} />
        </div>
    )
}

function ProductImageInfoSection({
    productInfo,
    setProductInfo,
    setImageFile
}: {
    productInfo: MusioProduct,
    setProductInfo: (productInfo: MusioProductInterface) => void,
    setImageFile: (imageFile: File) => void,
}) {

    const image = productInfo.image ?? '/images/blank.svg';

    return (
        <NewProductSection title='상품 이미지'>
            <ImageSelector label='상품 이미지' image={image} setImage={(image) => setProductInfo({ ...productInfo, image })} setImageFile={setImageFile} />
        </NewProductSection>
    )
}

function SubmitButton({
    productInfo,
    optionsInfo,
    imageFile
}: {
    productInfo: MusioProduct,
    optionsInfo: MusioProductOption[],
    imageFile: File | undefined,
}) {

    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async () => {

        const valid = productInfo.isValid();
        if (!valid) {
            addToast({ message: '상품 정보가 올바르지 않습니다', type: 'error' })
            return;
        }

        setIsSubmitting(true);

        if (isNewProduct()) {
            productInfo.setProductId(
                Date.now().toString()
            )
        }

        if (imageFile) {
            const imageUrl = await uploadProductImage(productInfo, imageFile);
            changeProductInfoImage(imageUrl)
        }

        editOrCreateProduct({
            product: productInfo,
            options: optionsInfo,
            onSuccess: handleEditSuccess,
            onFailure: displayFailToast,
        })

        setIsSubmitting(false);
    }

    const isNewProduct = () => productInfo.productId === undefined;

    const changeProductInfoImage = (imageUrl: string) => {
        productInfo.setInfo({ ...productInfo, image: imageUrl });
    }

    const handleEditSuccess = () => {
        displaySuccessToast();
        router.replace('/products');
    }

    const displaySuccessToast = () => {
        addToast({ message: '상품이 저장되었습니다', type: 'success' })
    }

    const displayFailToast = () => {
        addToast({ message: '저장에 실패했습니다', type: 'error' })
    }

    return (
        <HFlex justify='flex-end' className={styles.submit_button_wrapper}>
            <Button small text='상품 등록' onClick={handleSubmit} disabled={isSubmitting} type='primary' />
        </HFlex>
    )
}