import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useI18n } from "../../i18n/i18n-context";
import { cn } from "../../lib/cn";
import { passwordStrength, type FieldError } from "../../lib/validation";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: FieldError;
  hint?: string;
  autoComplete?: string;
  /** Show the strength meter (sign-up only). */
  showStrength?: boolean;
}

const STRENGTH_TONE = [
  "bg-zinc-200 dark:bg-zinc-700",
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
] as const;

export function PasswordInput({
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  autoComplete,
  showStrength = false,
}: PasswordInputProps) {
  const { t } = useI18n();
  const id = useId();
  const errorId = useId();
  const [visible, setVisible] = useState(false);
  const showError = Boolean(error);
  const strength = showStrength ? passwordStrength(value) : 0;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? errorId : undefined}
          className={cn(
            "h-10 w-full rounded-lg border bg-white pe-10 px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500",
            showError
              ? "border-rose-400 focus:border-rose-500 dark:border-rose-500/60"
              : "border-zinc-200 focus:border-brand-500 dark:border-zinc-700",
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 end-1.5 my-auto flex size-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          {visible ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
        </button>
      </div>

      {showStrength && value.length > 0 ? (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  index <= strength ? STRENGTH_TONE[strength] : "bg-zinc-200 dark:bg-zinc-700",
                )}
              />
            ))}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {strength === 0
              ? t("auth.passwordHint")
              : strength === 1
                ? t("auth.strength.weak")
                : strength === 2
                  ? t("auth.strength.fair")
                  : t("auth.strength.strong")}
          </p>
        </div>
      ) : showError && error ? (
        <p id={errorId} className="text-xs font-medium text-rose-600 dark:text-rose-400">
          {t(error)}
        </p>
      ) : hint ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      ) : null}
    </div>
  );
}
