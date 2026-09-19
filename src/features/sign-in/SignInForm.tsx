"use client";

import Link from "next/link";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Heading } from "@/components/Heading/Heading";
import { PasswordField } from "@/components/PasswordField/PasswordField";
import { TextField } from "@/components/TextField/TextField";
import { useDocumentTitle, useLocale } from "@/i18n/LanguageProvider";

import styles from "./SignInForm.module.css";

export function SignInForm() {
  const { locale, t } = useLocale("en");
  useDocumentTitle(t.signIn.title);

  return (
    <Card aria-labelledby="sign-in-title" lang={locale}>
      <div className={styles.intro}>
        <Heading id="sign-in-title">{t.signIn.title}</Heading>
        <p className={styles.subline}>
          <span>{t.signIn.noAccount}</span>
          {/* Registration is out of scope, the link only needs to look right. */}
          <a href="#" className={styles.getStarted}>
            {t.signIn.getStarted}
          </a>
        </p>
      </div>

      {/* Authentication is out of scope: submitting must not reload the page
          or put the credentials into the URL as a GET query. */}
      <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
        <TextField label={t.signIn.email} type="email" name="email" autoComplete="email" />
        <PasswordField
          label={t.signIn.password}
          name="password"
          placeholder={t.signIn.passwordPlaceholder}
          autoComplete="current-password"
          showLabel={t.signIn.showPassword}
          hideLabel={t.signIn.hidePassword}
        />
        <div className={styles.generateRow}>
          <Link href="/number-generator" className={styles.generateLink}>
            {t.signIn.generateNumbers}
          </Link>
        </div>
        <Button type="submit">{t.signIn.submit}</Button>
      </form>
    </Card>
  );
}
