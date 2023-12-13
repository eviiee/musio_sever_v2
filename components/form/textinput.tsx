import { ChangeEvent } from 'react';
import { HFlex } from '../layout/wrapper/flex';
import styles from './input.module.scss';

interface TextInputProps {
    name: string;
    value: string;
    onChange: (value: string) => void;
    onEnter?: () => void;
    placeholder?: string;
    className?: string;
    label?: string;
    style?: React.CSSProperties;
    canTabToFocus?: boolean;
    unit?: string;
    maxLength?: number;
    inputWidth?: number;
}

export default function TextInput({
    name,
    value,
    onChange,
    onEnter,
    placeholder,
    className,
    label,
    style,
    canTabToFocus = true,
    unit,
    maxLength,
    inputWidth
} : TextInputProps) {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter' && onEnter) {
            onEnter();
        }
    }

    let wrapperStyle : {[key : string] : string} = {};

    if (maxLength) {
        wrapperStyle['--unit'] = `'${value.length}/${maxLength.toString()}`;
    }
    if (unit) {
        wrapperStyle['--unit'] = `'${unit}'`;
    }

    const onFocus = (e : React.FocusEvent<HTMLElement>) => {
        (e.target as HTMLInputElement).parentElement?.classList.add(styles.focus);
    }
    const onBlur = (e : React.FocusEvent<HTMLElement>) => {
        (e.target as HTMLInputElement).parentElement?.classList.remove(styles.focus);
    }
    
    const handleValueChange = (e : ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (maxLength && value.length > maxLength) {
            return;
        }
        onChange(value);
    }

    style = style ?? {};
    if (inputWidth) {
        style['width'] = `${inputWidth}px`;
    } else {
        style['flexGrow'] = 1;
    }

    return (
        <HFlex style={wrapperStyle as React.CSSProperties} className={`${className ?? ''} ${styles.textInput}`} align='center'>
            {label && <label>{label}</label>}
            <input tabIndex={canTabToFocus ? 0 : -1} style={style} type="text" name={name} value={value} onChange={handleValueChange} onKeyDown={handleKeyDown} placeholder={placeholder} onFocus={onFocus} onBlur={onBlur} />
        </HFlex>
    )
}