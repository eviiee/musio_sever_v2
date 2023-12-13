import styles from './button.module.scss';

type ButtonType = 'primary' | 'danger' | 'warning' | 'success' | 'info' | 'light' | 'dark';

interface buttonProps {
    type?: ButtonType;
    className?: string;
    text: string;
    onClick?: () => void;
    disabled?: boolean;
    small?: boolean;
}

export default function Button({
    type = 'primary',
    className,
    text,
    onClick,
    disabled = false,
    small = false,
}: buttonProps) {
    return (
        <button
            className={`${styles.button} ${styles[type]} ${className ?? ''} ${small ? styles.small : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}