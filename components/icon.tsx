

export default function Icon({
    icon,
    size,
    color,
    alt,
    className,
    onClick,
}: {
    icon: string
    size: number
    color?: string
    alt?: string
    className?: string
    onClick?: () => void
}) {

    const handleClick = onClick ?? undefined;

    return (

        <svg width={size} height={size} aria-label={alt ?? ''} fill={color} className={className} onClick={handleClick}>
            <use xlinkHref={`/icons.svg#${icon}`} />
        </svg>
    )
}