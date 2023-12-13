import Tag from './tag';
import styles from './tag.module.scss';

interface TagSelectorProps {
    tagValues?: string[],
    tags: string[],
    selectedTags: Set<string>,
    onSelectedTagsChange: (tags: Set<string>) => void,
    label?: string,
}

export default function TagSelector({
    tagValues,
    tags,
    selectedTags,
    onSelectedTagsChange,
    label,
}: TagSelectorProps) {

    const handleTagClick = (tag: string) => {
        const alreadySelected = selectedTags.has(tag);
        let newSelectedTags = new Set(selectedTags);
        if (alreadySelected) {
            newSelectedTags.delete(tag);
        } else {
            newSelectedTags.add(tag);
        }
        onSelectedTagsChange(newSelectedTags);
    }

    return (
        <div className={styles.tag_selector}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.tags_list}>
                {tags.map((tag, index) => {
                    const tagValue = tagValues ? tagValues[index] : tag;
                    return <Tag
                        key={index}
                        tag={tag}
                        tagValue={tagValue}
                        selected={selectedTags.has(tagValue)}
                        onClick={handleTagClick}
                    />
                })}
            </div>
        </div>
    )
}