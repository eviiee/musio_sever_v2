'use client';

import { SWRConfig } from 'swr';
import { useToast } from '../../hooks/usetoasts';
import styles from './toast.module.scss';
import { VFlex } from './wrapper/flex';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

export type toastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProp {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    id?: string;
}

function Toast({ message, type, id }: ToastProp) {

    const initial = { opacity: 0, y: 50, height: 0 };
    const animate = { opacity: 1, y: 0, height: 'auto' };
    const exit = { opacity: 0, y: 0 };

    const { removeToast } = useToast();

    useEffect(()=>{
        let mounted = true;
        setTimeout(() => {
            if(mounted)
                removeToast(id!);
        }, 5000);
        return () => {mounted = false}
    },[])

    return (
        <motion.div className={styles.toast_message} initial={initial} animate={animate} exit={exit} id={id}>
            <span className={styles[type]}>{message}</span>
        </motion.div>
    )
}

export default function ToastContainer() {

    const { toasts } = useToast();

    return (
        <SWRConfig
            value={{
                refreshInterval: 0,
                revalidateIfStale: false,
                revalidateOnFocus: false,
                revalidateOnReconnect: false,
                shouldRetryOnError: false,
                dedupingInterval: 2000,
            }}>
            <VFlex align='center' justify='flex-end' className={styles.toast_container}>
                <AnimatePresence>
                    {
                        toasts.map((toast) => <Toast {...toast} key={`${toast.id}${toasts.length}`} />)
                    }
                </AnimatePresence>
            </VFlex>
        </SWRConfig>
    )
}