import numWithCommas from '../../methods/number_with_commas';
import MusioProduct from '../../models/musio_product';
import Badge from '../design/badge';
import styles from './product_card.module.scss';
import { HFlex, VFlex } from './wrapper/flex';

interface ProductCardProps {
    product: MusioProduct
}

export default function ProductCard({
    product
} : ProductCardProps) {

    const productId = product.productId!;


    const onEditButtonClick = () => {}
    const onDeleteButtonClick = () => {}
    const onEditStockButtonClick = () => {}

    return (
        <VFlex className={styles.product_card}>
            <img src={product.image} alt={product.name} />
            <div className={styles.product_info}>
                <h3>{product.name}</h3>
                <p>원가 {numWithCommas(product.cost)}원</p>
                <p className={styles.price}>판매가 {numWithCommas(product.price)}원</p>
                <div className={styles.option_count}>
                    <Badge text={`기종 ${product.model.length}개`} type='info' />
                    <Badge text={`색상 ${product.color.length}개`} type='warning' />
                </div>
                
            </div>
        </VFlex>
    )

}