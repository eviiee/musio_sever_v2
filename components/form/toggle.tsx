'use client';

import { motion } from 'framer-motion';
import styles from './toggle.module.scss';

interface toggleProps {
    displayLabel?: boolean;
    option1?: string;
    option2?: string;
    firstOptionSelected: boolean;
    onChange: () => void;
    big?: boolean;
}

export default function Toggle({
    displayLabel = true,
    option1,
    option2,
    firstOptionSelected,
    onChange,
    big = false,
}: toggleProps) {

    const handleClick = (i: number) => {
        if ((firstOptionSelected ? 0 : 1) == i) return;
        onChange();
    }

    const indicatorStyle = {
        left: firstOptionSelected ? 'calc(0% + 4px)' : 'calc(100% - 4px)',
        x: firstOptionSelected ? '0%' : '-100%'
    };

    return (
        <div className={`${styles.toggle} ${displayLabel ? '' : styles.nolabel} ${big ? styles.big : ''}`}>
            <ol>
                <motion.div className={styles.indicator} animate={indicatorStyle} transition={{ ease: 'easeOut', duration: 0.2 }}></motion.div>
                <li><button tabIndex={-1} className={firstOptionSelected ? styles.active : ''} onClick={() => handleClick(0)}>{displayLabel ? option1 : ''}</button></li>
                <li><button tabIndex={-1} className={!firstOptionSelected ? styles.active : ''} onClick={() => handleClick(1)}>{displayLabel ? option2 : ''}</button></li>
            </ol>
        </div>
    )
}