import { ChangeEvent, useRef } from 'react';
import styles from './image_selector.module.scss';

interface ImageSelectorProps {
    label: string,
    image: string,
    setImage: (image: string) => void,
    setImageFile: (imageFile: File) => void,
}

export default function ImageSelector({
    label,
    image,
    setImage,
    setImageFile,
} : ImageSelectorProps) {

    const fileInput = useRef<HTMLInputElement>(null);
    
    const clickActualFileInput = () => {
        fileInput.current?.click();
    }

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {

        const image = e.target.files?.[0];
        if (!image) return;

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            setImage(reader.result as string);
            setImageFile(image);
        }
    }

    return (
        <div className={styles.image_selector_wrapper}>
            <label>{label}</label>
            <div className={styles.image_selector}>
                <div onClick={clickActualFileInput}>
                    <img src={image} className={image == '/images/blank.svg' ? styles.blank : ''} alt={label} />
                </div>
            </div>
            <input type="file" name='product_image' id='product_image_input' accept='image/*' style={{ display: 'none' }} ref={fileInput} onChange={handleImage} />
        </div>
    )
}