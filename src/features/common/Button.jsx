import clsx from "clsx";

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className,
  ...props
}) {
  const baseStyles = {
    padding: "10px 20px",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background-color 0.2s",
  };

  const variantStyles = {
    primary: {
      backgroundColor: disabled ? "#ccc" : "#007bff",
      color: "white",
    },
    secondary: {
      backgroundColor: disabled ? "#ccc" : "#6c757d",
      color: "white",
    },
    outline: {
      backgroundColor: "transparent",
      color: disabled ? "#ccc" : "#007bff",
      border: `1px solid ${disabled ? "#ccc" : "#007bff"}`,
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx("button", className)}
      style={{ ...baseStyles, ...variantStyles[variant] }}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
