import { useToast } from '../../hooks/usetoasts';
import styles from './tag.module.scss';
import DisposableTag from './tag_disposable';
import inputStyle from './input.module.scss';
import { VFlex } from '../layout/wrapper/flex';

interface TagSelectorProps {
    tags: string[],
    onChange: (v: string[]) => void,
    label?: string,
}

export default function TagListInput({
    tags,
    onChange,
    label,
}: TagSelectorProps) {

    const { addToast } = useToast();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter') {
            addTags(e.currentTarget.value);
            clearInput(e.currentTarget);
        } else if (e.key == 'Backspace' && e.currentTarget.value == '') {
            deleteLastTag();
        }
    }

    const clearInput = (input: HTMLInputElement) => {
        input.value = '';
    }

    const deleteLastTag = () => {
        if (tags.length == 0) return;
        onChange(tags.slice(0, tags.length - 1));
    }

    const deleteSpecificTag = (i: number) => {
        onChange(tags.filter((_, index) => index != i));
    }

    const addTags = (tag: string) => {
        tag = tag.trim().replaceAll(' ', '');
        const tagSplit = tag.split(',').filter(t => t != '');

        let currentTags = tags;
        tagSplit.forEach(t => {currentTags = addTag(t, currentTags)})

        onChange(currentTags);
    }

    const addTag = (tag : string, currentTags : string[]) => {
        if (isDuplicate(tag)) {
            addToast({ message: '이미 추가된 태그입니다', type: 'error' });
            return currentTags;
        }
        return [...currentTags, tag];
    }

    const isDuplicate = (tag: string): boolean => {
        return tags.includes(tag);
    }

    const tagsToRender = tags.map((tag, index) => {
        const deleteThisTag = () => deleteSpecificTag(index);
        return <DisposableTag
            tag={tag}
            key={tag}
            onDelete={deleteThisTag}
        />
    });

    return (
        <div className={styles.tag_list_input}>
            {label && <label className={styles.label}>{label}</label>}
            <VFlex align='flex-start' justify='flex-start' gap={14}>
                <input className={inputStyle.tagInput} onKeyDown={handleKeyDown} placeholder='추가할 내용을 입력 후 Enter를 눌러주세요' style={{width:'500px'}} />
                <div className={styles.tags_list}>
                    {tagsToRender}
                </div>
            </VFlex>
        </div>
    )
}