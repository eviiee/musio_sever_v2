import Icon from '../icon';
import styles from './checkbox.module.scss';

export default function CheckBox({
    selected,
    onSelect,
    size,
} : {
    selected: boolean,
    onSelect: (v : boolean) => void,
    size?: number,
}) {
    const handleSelect = () => {
        onSelect(!selected);
    }

    return (
        <div className={styles.checkbox_wrapper}>
            <div className={`${styles.checkbox} ${selected ? styles.selected : ''}`} style={{width:size ?? 20, height:size ?? 20}} onClick={handleSelect}>
                {selected && <Icon icon='check' size={size ? size/2 : 10} color='white' className={styles.check_icon} />}
            </div>
        </div>
    )
}