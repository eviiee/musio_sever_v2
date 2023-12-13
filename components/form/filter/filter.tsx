import { VFlex } from '../../layout/wrapper/flex';
import styles from './filter.module.scss';

interface FilterProps {
    label: string;
    options: string[];
    selected: Set<string>;
    onChange: (selected: Set<string>) => void;
}

export default function Filter({
    label,
    options,
    selected,
    onChange,
} : FilterProps) {
    
    const handleClick = (option: string) => {
        if (selected.has(option)) {
            deselectOption(option);
        } else {
            selectOption(option);
        }
    }

    const selectOption = (option: string) => {
        const newSelected = new Set(selected);
        newSelected.add(option);
        onChange(newSelected);
    }
    const deselectOption = (option: string) => {
        const newSelected = new Set(selected);
        newSelected.delete(option);
        onChange(newSelected);
    }

    return (
        <VFlex align='stretch' className={styles.filter}>
            <h3>{label}</h3>
            <ol className={styles.filter_options}>
                {options.map((option,index) => <FilterOption key={`${option}${index}`} label={option} selected={selected.has(option)} onClick={() => handleClick(option)} />)}
            </ol>
        </VFlex>
    )

}

function FilterOption ({
    label,
    selected,
    onClick,
} : {
    label: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <li className={`${styles.filter_option} ${selected ? styles.selected : ''}`} onClick={onClick}>
            <div className={styles.selected_indicator}>
                {selected ? <span className={styles.selected_indicator_inner}></span> : null}
            </div>
            {label}
        </li>
    )
}