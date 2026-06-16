interface ChartIconButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "stats" | "history";
}

export function ChartIconButton({
  label,
  onClick,
  disabled = false,
  variant = "stats",
}: ChartIconButtonProps) {
  return (
    <button
      type="button"
      className="chart-icon-button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
    >
      {variant === "history" ? (
        <svg className="chart-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M7 16l4-5 3 3 5-7" />
          <circle cx="7" cy="16" r="1.5" />
          <circle cx="11" cy="11" r="1.5" />
          <circle cx="14" cy="14" r="1.5" />
          <circle cx="19" cy="7" r="1.5" />
        </svg>
      ) : (
        <svg className="chart-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 17V11" />
          <path d="M12 17V8" />
          <path d="M16 17V13" />
        </svg>
      )}
    </button>
  );
}
