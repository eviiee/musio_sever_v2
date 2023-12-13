import { useSensors, useSensor, PointerSensor, DragEndEvent, DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";

import styles from './reorderable_list.module.scss';
import { CSS } from "@dnd-kit/utilities";

interface ReorderableListProps<T> {
    list: T[]
    onChange: (list: T[]) => void
    itemBuilder: (item: T) => React.ReactNode
    onClick?: (item: T) => void
}

export default function ReorderableList<T extends { id: string }>({
    list,
    onChange,
    itemBuilder,
    onClick,
}: ReorderableListProps<T>) {

    const listOfIds = list.map(item => item.id);

    const sensors = useSensors(
        useSensor(PointerSensor)
    )

    const handleDragEnd = (e: DragEndEvent) => {
        const newList = getReorderedList(e);
        onChange(newList);
    }

    const getReorderedList = (e: DragEndEvent) => {
        const { active, over } = e;
        if (active.id !== over!.id) {

            const oldIndex = listOfIds.indexOf(active.id as string);
            const newIndex = listOfIds.indexOf(over!.id as string);

            const newList = arrayMove(list, oldIndex, newIndex);
            return newList

        }
        return list;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={list}
                strategy={verticalListSortingStrategy}
            >
                <ul className={styles.reorderable_list}>
                    {list.map((item) => <SortableItem<T> key={item.id} item={item} itemBuilder={itemBuilder} onClick={onClick} />)}
                </ul>
            </SortableContext>
        </DndContext>
    )
}

function SortableItem<T extends { id: string }>({
    item,
    itemBuilder,
    onClick,
}: {
    item: T,
    itemBuilder: (item: T) => React.ReactNode,
    onClick?: (item: T) => void,
}) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 0,
    } as React.CSSProperties;

    const hovable = onClick != undefined;

    const handleClick = () => {
        if (onClick) {
            onClick(item);
        }
    }

    return (
        <li ref={setNodeRef} style={style} className={`${styles.reorderable_item} ${isDragging ? styles.dragging : ''} ${hovable ? styles.hovable : ''}`} onClick={handleClick}>
            <div className={styles.handle}>
                <svg width={22} height={22} aria-label='handle' {...listeners} {...attributes}>
                    <use xlinkHref={`/icons.svg#handle`} />
                </svg>
            </div>
            {itemBuilder(item)}
        </li>
    )
}