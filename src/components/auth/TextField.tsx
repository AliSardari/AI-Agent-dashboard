import { useId } from "react";
import { useI18n } from "../../i18n/i18n-context";
import { cn } from "../../lib/cn";
import type { FieldError } from "../../lib/validation";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: string;
  error?: FieldError;
  hint?: string;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: "email" | "text" | "tel" | "url" | "numeric";
}

export function TextField({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  error,
  hint,
  autoComplete,
  placeholder,
  inputMode,
}: TextFieldProps) {
  const { t } = useI18n();
  const id = useId();
  const errorId = useId();
  const showError = Boolean(error);

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        aria-invalid={showError || undefined}
        aria-describedby={showError ? errorId : undefined}
        className={cn(
          "h-10 w-full rounded-lg border bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500",
          showError
            ? "border-rose-400 focus:border-rose-500 dark:border-rose-500/60"
            : "border-zinc-200 focus:border-brand-500 dark:border-zinc-700",
        )}
      />
      {showError && error ? (
        <p id={errorId} className="text-xs font-medium text-rose-600 dark:text-rose-400">
          {t(error)}
        </p>
      ) : hint ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      ) : null}
    </div>
  );
}
