import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "../components/auth/AuthShell";
import { TextField } from "../components/auth/TextField";
import { PasswordInput } from "../components/auth/PasswordInput";
import { Spinner } from "../components/ui/Feedback";
import { useI18n } from "../i18n/i18n-context";
import { useAuth } from "../auth/auth-context";
import {
  validateEmail,
  validatePassword,
  validateRequired,
  type FieldError,
} from "../lib/validation";

export function Register() {
  const { t } = useI18n();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirm: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const nameError = touched.name ? validateRequired(name) : null;
  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password ? validatePassword(password) : null;
  const confirmError: FieldError = touched.confirm
    ? confirm && confirm === password
      ? null
      : "auth.error.confirm"
    : null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (
      validateRequired(name) ||
      validateEmail(email) ||
      validatePassword(password) ||
      !confirm ||
      confirm !== password
    ) {
      return;
    }

    setSubmitting(true);
    // Simulated round trip — nothing leaves the browser.
    await new Promise((resolve) => setTimeout(resolve, 500));
    signIn({ name: name.trim(), email: email.trim() });
    navigate("/");
  }

  return (
    <AuthShell titleKey="auth.signUp.title">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        <ArrowLeft size={14} className="rtl:rotate-180" aria-hidden />
        {t("auth.back")}
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {t("auth.signUp.title")}
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {t("auth.signUp.subtitle")}
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
        <TextField
          label={t("auth.name")}
          value={name}
          onChange={setName}
          onBlur={() => setTouched((current) => ({ ...current, name: true }))}
          error={nameError}
          autoComplete="name"
        />
        <TextField
          label={t("auth.email")}
          value={email}
          onChange={setEmail}
          onBlur={() => setTouched((current) => ({ ...current, email: true }))}
          error={emailError}
          type="email"
          autoComplete="email"
          inputMode="email"
        />
        <PasswordInput
          label={t("auth.password")}
          value={password}
          onChange={setPassword}
          onBlur={() => setTouched((current) => ({ ...current, password: true }))}
          error={passwordError}
          hint={t("auth.passwordHint")}
          autoComplete="new-password"
          showStrength
        />
        <PasswordInput
          label={t("auth.confirm")}
          value={confirm}
          onChange={setConfirm}
          onBlur={() => setTouched((current) => ({ ...current, confirm: true }))}
          error={confirmError}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={submitting}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 text-sm font-medium text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Spinner className="size-4 border-zinc-300 border-t-white dark:border-zinc-600" />
              {t("auth.submitting")}
            </>
          ) : (
            t("auth.signUpCta")
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
        {t("auth.hasAccount")}{" "}
        <Link
          to="/login"
          className="font-medium text-brand-600 hover:underline dark:text-brand-300"
        >
          {t("auth.signInLink")}
        </Link>
      </p>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
        {t("auth.demoNote")}
      </p>
    </AuthShell>
  );
}
