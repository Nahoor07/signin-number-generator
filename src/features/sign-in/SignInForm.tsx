"use client";

import Link from "next/link";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Heading } from "@/components/Heading/Heading";
import { PasswordField } from "@/components/PasswordField/PasswordField";
import { TextField } from "@/components/TextField/TextField";

import styles from "./SignInForm.module.css";

export function SignInForm() {
  return (
    <Card aria-labelledby="sign-in-title">
      <div className={styles.intro}>
        <Heading id="sign-in-title">Sign in</Heading>
        <p className={styles.subline}>
          <span>{"Don't have an account?"}</span>
          {/* Registration is out of scope, the link only needs to look right. */}
          <a href="#" className={styles.getStarted}>
            Get started
          </a>
        </p>
      </div>

      {/* Authentication is out of scope: submitting must not reload the page
          or put the credentials into the URL as a GET query. */}
      <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
        <TextField label="Email address" type="email" name="email" autoComplete="email" />
        <PasswordField
          label="Password"
          name="password"
          placeholder="6+ characters"
          autoComplete="current-password"
        />
        <div className={styles.generateRow}>
          <Link href="/number-generator" className={styles.generateLink}>
            Generate numbers
          </Link>
        </div>
        <Button type="submit">Sign in</Button>
      </form>
    </Card>
  );
}
