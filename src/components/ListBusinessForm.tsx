"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Upload, Loader2 } from "lucide-react";
import { submitBusiness, type SubmitState } from "@/app/actions/business";
import { CITIES } from "@/data/cities";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const initial: SubmitState = { ok: false, message: "" };

export function ListBusinessForm() {
  const { t } = useLanguage();
  const [state, action] = useActionState(submitBusiness, initial);

  if (state.ok) {
    return (
      <div className="glass rounded-3xl p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neon-subtle text-neon-ink">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-gray-900">{t("commerce.form.success.title")}</h2>
        <p className="mx-auto mt-3 max-w-md text-gray-600">{state.message}</p>
        <a href="/directory" className="mt-6 inline-flex rounded-full bg-neon px-6 py-3 font-semibold text-gray-900 hover:brightness-110">
          {t("commerce.form.success.browse")}
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="glass rounded-3xl p-6 md:p-8">
      {state.message && !state.ok && (
        <div className="mb-6 rounded-2xl border border-accent-red/30 bg-accent-red/10 px-4 py-3 text-sm text-accent-red">
          {state.message}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label={t("commerce.form.name.label")} name="name" error={state.errors?.name} placeholder={t("commerce.form.name.placeholder")} required />
        <SelectField label={t("commerce.form.category.label")} name="category" error={state.errors?.category} required
          placeholder={t("commerce.form.select")}
          options={CATEGORIES.map((c) => ({ value: c.slug, label: c.label }))} />
        <Field label={t("commerce.form.contactName.label")} name="contactName" error={state.errors?.contactName} placeholder={t("commerce.form.contactName.placeholder")} required />
        <Field label={t("commerce.form.email.label")} name="email" type="email" error={state.errors?.email} placeholder={t("commerce.form.email.placeholder")} required />
        <Field label={t("commerce.form.phone.label")} name="phone" error={state.errors?.phone} placeholder={t("commerce.form.phone.placeholder")} required />
        <Field label={t("commerce.form.website.label")} name="website" placeholder={t("commerce.form.website.placeholder")} />
        <SelectField label={t("commerce.form.city.label")} name="city" error={state.errors?.city} required
          placeholder={t("commerce.form.select")}
          options={CITIES.map((c) => ({ value: c.slug, label: c.name }))} />
        <Field label={t("commerce.form.address.label")} name="address" placeholder={t("commerce.form.address.placeholder")} />
      </div>

      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {t("commerce.form.description.label")} <span className="text-neon-ink">*</span>
        </label>
        <textarea
          name="description"
          rows={4}
          placeholder={t("commerce.form.description.placeholder")}
          className={cn(
            "w-full rounded-2xl border bg-ink-950/60 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neon/40",
            state.errors?.description ? "border-accent-red/50" : "border-gray-200"
          )}
        />
        {state.errors?.description && <p className="mt-1 text-xs text-accent-red">{state.errors.description}</p>}
      </div>

      {/* Upload placeholders (UI; wired to storage when Supabase configured) */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <UploadBox label={t("commerce.form.upload.logo.label")} hint={t("commerce.form.upload.logo.hint")} />
        <UploadBox label={t("commerce.form.upload.photos.label")} hint={t("commerce.form.upload.photos.hint")} />
      </div>

      <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-400">
          {t("commerce.form.footnote")}
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { t } = useLanguage();
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-neon px-7 py-3.5 font-semibold text-gray-900 transition-all hover:brightness-110 disabled:opacity-60 sm:w-auto"
    >
      {pending ? (<><Loader2 className="h-4 w-4 animate-spin" /> {t("commerce.form.submitting")}</>) : t("commerce.form.submit")}
    </button>
  );
}

function Field({
  label, name, type = "text", placeholder, error, required,
}: { label: string; name: string; type?: string; placeholder?: string; error?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-neon-ink">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-2xl border bg-ink-950/60 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neon/40",
          error ? "border-accent-red/50" : "border-gray-200"
        )}
      />
      {error && <p className="mt-1 text-xs text-accent-red">{error}</p>}
    </div>
  );
}

function SelectField({
  label, name, options, error, required, placeholder,
}: { label: string; name: string; options: { value: string; label: string }[]; error?: string; required?: boolean; placeholder: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-neon-ink">*</span>}
      </label>
      <select
        id={name}
        name={name}
        defaultValue=""
        className={cn(
          "w-full rounded-2xl border bg-ink-950/60 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-neon/40 [&>option]:bg-ink-900",
          error ? "border-accent-red/50" : "border-gray-200"
        )}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="mt-1 text-xs text-accent-red">{error}</p>}
    </div>
  );
}

function UploadBox({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition-colors hover:border-neon-border">
      <Upload className="h-5 w-5 text-gray-400" />
      <span className="text-sm text-gray-700">{label}</span>
      <span className="text-xs text-gray-400">{hint}</span>
    </div>
  );
}
