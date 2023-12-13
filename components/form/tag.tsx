import styles from './tag.module.scss';

interface TagProps {
    tag: string,
    tagValue?: string,
    selected: boolean,
    onClick: (v : string) => void,
}

export default function Tag({
    tag,
    tagValue,
    selected,
    onClick,
}: TagProps) {

    const handleClick = () => {
        onClick(tagValue ?? tag);
    }

    return (
        <span className={`${selected ? styles.selected : ''} ${styles.tag}`} onClick={handleClick}>
            {tag}
        </span>
    )
}