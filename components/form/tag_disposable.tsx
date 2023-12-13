import Icon from '../icon';
import styles from './tag.module.scss';

interface TagProps {
    tag: string,
    onDelete: (v : string) => void,
}

export default function DisposableTag({
    tag,
    onDelete,
}: TagProps) {

    const handleClick = () => {
        onDelete(tag);
    }

    return (
        <span className={`${styles.tag} ${styles.disposable}`}>
            <span>
                {tag}
            </span>            
            <Icon icon='cross' size={10} onClick={handleClick} alt={'delete'} />
        </span>
    )
}