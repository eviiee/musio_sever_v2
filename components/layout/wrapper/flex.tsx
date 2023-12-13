
type align = 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';

type justify = 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';

type direction = 'row' | 'column' | 'row-reverse' | 'column-reverse';

function Flex({
    align = 'center',
    justify = 'center',
    direction = 'row',
    wrap,
    children,
    gap,
    className,
    style = {},
    onClick,
}: {
    align?: align,
    justify?: justify,
    direction?: direction,
    wrap?: boolean,
    children: React.ReactNode
    gap?: number
    className?: string
    style?: React.CSSProperties
    onClick?: () => void
}) {

    const inlineStyle = {
        display: 'flex',
        alignItems: align,
        justifyContent: justify,
        flexDirection: direction,
        flexWrap: wrap,
        gap: `${gap}px`,
        ...style
    } as React.CSSProperties;

    return (
        <div className={className} style={inlineStyle} onClick={onClick}>
            {children}
        </div>
    )
}

export function HFlex({
    align = 'flex-start',
    justify = 'center',
    wrap = false,
    children,
    reverse = false,
    gap = 10,
    className,
    style,
    onClick,
}: {
    align?: align,
    justify?: justify,
    wrap?: boolean,
    children: React.ReactNode
    reverse?: boolean,
    gap?: number
    className?: string
    style?: React.CSSProperties
    onClick?: () => void
}) {

    const direction : direction = reverse ? 'row-reverse' : 'row';

    return (
        <Flex align={align} justify={justify} direction={direction} wrap={wrap} gap={gap} className={className} style={style} onClick={onClick}>
            {children}
        </Flex>
    )
}

export function VFlex({
    align = 'stretch',
    justify = 'center',
    wrap = false,
    children,
    reverse = false,
    gap = 10,
    className,
    style,
    onClick
}: {
    align?: align,
    justify?: justify,
    wrap?: boolean,
    children: React.ReactNode
    reverse?: boolean,
    gap?: number
    className?: string
    style?: React.CSSProperties,
    onClick?: () => void
}) {

    const direction : direction = reverse ? 'column-reverse' : 'column';

    return (
        <Flex align={align} justify={justify} direction={direction} wrap={wrap} gap={gap} className={className} style={style} onClick={onClick}>
            {children}
        </Flex>
    )
}