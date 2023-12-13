'use client';

import Link from 'next/link';
import styles from './side_nav.module.scss';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../icon';
import { usePathname } from 'next/navigation';

function Tab({
    href,
    label,
    icon,
    open,
}: {
    href: string,
    label: string,
    icon: string,
    open: boolean
}) {

    const currentPath = usePathname().split('/')[1];
    const active = currentPath === href.slice(1);

    const animate = open ? { width: 'auto', opacity: 1 } : { width: '0px', opacity: 0 };

    return (
        <li>
            <Link href={href} className={active ? styles.active : ''}>
                <Icon icon={icon} size={20} alt={icon} />
                <motion.div animate={animate}><span>{label}</span></motion.div>
            </Link>
        </li>
    )
}

export default function SideNav() {

    const [open, setOpen] = useState<boolean>(false);

    const tabs = [
        { href: '/', label: '홈', icon: 'home' },
        { href: '/products', label: '상품목록', icon: 'products' },
        { href: '/stock', label: '재고현황', icon: 'stock' },
        { href: '/sales', label: '판매량', icon: 'sales' },
        { href: '/trend', label: '판매추이', icon: 'trend' },
        { href: '/rocket', label: '로켓그로스', icon: 'rocket' },
        { href: '/calc', label: '마진계산기', icon: 'calculator' },
    ]

    const mouseEnter = () => {
        setOpen(true)
        console.debug('enter')
    };

    return (
        <aside className={styles.side_nav} onMouseEnter={mouseEnter} onMouseLeave={() => setOpen(false)}>
            <ul>
                {
                    tabs.map((tab) => <Tab key={tab.label} href={tab.href} label={tab.label} icon={tab.icon} open={open} />)
                }
            </ul>
        </aside>
    )
}