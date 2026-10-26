export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'red',
    size = 'md',
    disabled = false,
    className = '',
    ...props
}) {
    // Styles de base
    const baseStyles = "font-bold border-2 border-black transition-all uppercase flex items-center justify-center text-black gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    // Variantes de couleurs & ombres
    const variants = {
        yellow: "bg-ny-yellow shadow-brut-yellow hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1",
        red: "bg-ny-red shadow-brut-red hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1",
        dark: "bg-ny-card shadow-brut-black hover:bg-ny-border",
        outline: "bg-transparent border-ny-border hover:border-ny-yellow hover:text-ny-yellow shadow-[2px_2px_0px_0px_#2a2a30]"
    };

    // Tailles
    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };


    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}