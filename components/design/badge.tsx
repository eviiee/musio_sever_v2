import styles from './badge.module.scss';

interface BadgeProps {
    type: 'info' | 'warning' | 'error' | 'success' | 'default' | 'dark' | 'custom';
    text: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    className?: string;
}

export default function Badge({
    type,
    text,
    backgroundColor,
    textColor,
    borderColor,
    className
}: BadgeProps) {
    return (
        <span
            className={`${styles.badge} ${styles[type]} ${className ?? ''}`}
            style={type === 'custom' ? {
                backgroundColor,
                color: textColor,
                borderColor
            } : {}}
        >
            {text}
        </span>
    )
}