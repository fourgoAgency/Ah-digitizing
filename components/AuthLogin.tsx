"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaFacebookF, FaGithub, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import {
  signInWithEmailPassword,
  sendPasswordReset,
  signInWithGoogle,
  signInWithFacebook,
  signInWithLinkedIn,
  updateUserProfile,
} from "@/lib/firebase";

function SocialButtons({
  onGoogle,
  onFacebook,
  onLinkedIn,
  disabled,
}: {
  onGoogle: () => Promise<void>;
  onFacebook: () => Promise<void>;
  onLinkedIn: () => Promise<void>;
  disabled: boolean;
}) {
  const socialOptions = [
    { label: "Google", icon: <FaGoogle size={14} />, onClick: onGoogle },
    { label: "Facebook", icon: <FaFacebookF size={14} />, onClick: onFacebook },
    { label: "LinkedIn", icon: <FaLinkedinIn size={14} />, onClick: onLinkedIn },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-3">
        {socialOptions.map((option) => (
          <div key={option.label} className="group relative">
            <button
              type="button"
              aria-label={`Continue with ${option.label}`}
              disabled={disabled}
              onClick={option.onClick}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border cursor-pointer text-foreground/80 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {option.icon}
            </button>
            <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
              Continue with {option.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-[13px] text-foreground/80">Or sign in with one of the providers above</p>
    </div>
  );
}

function Input({
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required
    />
  );
}

function FeedbackMessage({ type, message }: { type: 'error' | 'success'; message: string }) {
  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm ${
        type === 'error'
          ? 'border-destructive/40 bg-destructive/10 text-destructive'
          : 'border-success/40 bg-success/10 text-success'
      }`}
    >
      {message}
    </div>
  );
}

export default function AuthSlider() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const resetFeedback = () => {
    setError(null);
    setMessage(null);
  };

  const parseJsonResponse = async (response: Response) => {
    try {
      return await response.json();
    } catch (parseError) {
      const text = await response.text().catch(() => 'Unexpected server response');
      return { error: `Server returned invalid response: ${text}` };
    }
  };

  const handleSignIn = async () => {
    resetFeedback();
    setLoading(true);
    try {
      // Try admin Firebase Auth sign-in first
      try {
        const adminUser = await signInWithEmailPassword(email, password);
        // exchange ID token for a secure server-side admin session cookie
        try {
          const idToken = await adminUser.getIdToken();
          const r = await fetch('/api/auth/admin-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          });
          if (r.ok) {
            router.push('/admin');
            return;
          }

          const errorJson = await parseJsonResponse(r);
          setError(errorJson?.error || 'Unable to create admin session.');
          return;
        } catch (e) {
          setError('Unable to create admin session. Please try again.');
          return;
        }
      } catch (adminErr) {
        // not an admin or auth failed — fall through to Firestore login
      }

      // Firestore custom login
      const res = await fetch('/api/auth/firelogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const j = await parseJsonResponse(res);
      if (!res.ok) {
        setError(j?.error || 'Login failed');
      } else {
        // redirect based on role
        if (j.role === 'designer') router.push('/designer');
        else router.push('/');
      }
    } catch (err) {
      setError((err as Error).message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    resetFeedback();
    setLoading(true);

    try {
      // Register user in Firestore via server endpoint (hashing done server-side)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'user' }),
      });
      const j = await parseJsonResponse(res);
      if (!res.ok) {
        setError(j?.error || 'Unable to create account');
      } else {
        setMessage('Account created. Please sign in.');
        setIsSignup(false);
      }
    } catch (err) {
      setError((err as Error).message || "Unable to create an account.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    resetFeedback();
    if (!email) {
      setError("Enter your email address to reset your password.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordReset(email);
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError((err as Error).message || "Unable to send a password reset email.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    resetFeedback();
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      const idToken = await user.getIdToken();
      const r = await fetch('/api/auth/admin-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (r.ok) {
        router.push('/');
        return;
      }
      const errorJson = await parseJsonResponse(r);
      setError(errorJson?.error || 'Unable to sign in as admin.');
    } catch (err) {
      setError((err as Error).message || 'Unable to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    resetFeedback();
    setLoading(true);
    try {
      const user = await signInWithFacebook();
      const idToken = await user.getIdToken();
      const r = await fetch('/api/auth/admin-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (r.ok) {
        router.push('/');
        return;
      }
      const errorJson = await parseJsonResponse(r);
      setError(errorJson?.error || 'Unable to sign in as admin.');
    } catch (err) {
      setError((err as Error).message || 'Unable to sign in with Facebook.');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    resetFeedback();
    setLoading(true);
    try {
      const user = await signInWithLinkedIn();
      const idToken = await user.getIdToken();
      const r = await fetch('/api/auth/admin-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (r.ok) {
        router.push('/');
        return;
      }
      const errorJson = await parseJsonResponse(r);
      setError(errorJson?.error || 'Unable to sign in as admin.');
    } catch (err) {
      setError((err as Error).message || 'Unable to sign in with LinkedIn.');
    } finally {
      setLoading(false);
    }
  };

  // Social sign-ins are considered admin flows; they redirect to admin dashboard on success.

  const handleSubmitSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSignIn();
  };

  const handleSubmitSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSignUp();
  };

  return (
    <section className="font-inter flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl overflow-hidden rounded-[26px] bg-background shadow-[0_20px_60px_rgba(0,0,0,0.35)] ring-1 ring-border">
        <div className="relative hidden h-155 md:block">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`absolute left-0 top-0 flex h-full w-1/2 items-center justify-center bg-background px-10 transition-all duration-700 ease-out will-change-transform ${
                isSignup
                  ? "translate-x-full opacity-0 pointer-events-none"
                  : "translate-x-0 opacity-100 pointer-events-auto"
              }`}
            >
              <form className="w-full max-w-sm space-y-5" onSubmit={handleSubmitSignIn}>
                <h2 className="text-center text-4xl font-bold tracking-tight text-foreground">Sign In</h2>
                {error ? <FeedbackMessage type="error" message={error} /> : null}
                {message ? <FeedbackMessage type="success" message={message} /> : null}
                <SocialButtons
                  onGoogle={handleGoogleSignIn}
                  onFacebook={handleFacebookSignIn}
                  onLinkedIn={handleLinkedInSignIn}
                  disabled={loading}
                />
                <Input type="email" placeholder="Enter E-mail" value={email} onChange={setEmail} />
                <Input type="password" placeholder="Enter Password" value={password} onChange={setPassword} />
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="block w-full cursor-pointer text-center text-base text-foreground/80 transition hover:text-primary"
                >
                  Forget Password?
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="mx-auto block cursor-pointer w-40 rounded-xl bg-primary py-3 text-base font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            </div>

            <div
              className={`absolute left-0 top-0 flex h-full w-1/2 items-center justify-center bg-background px-10 transition-all duration-700 ease-out will-change-transform backface-hidden transform-[translateZ(0)] ${
                isSignup
                  ? "translate-x-full opacity-100 pointer-events-auto"
                  : "translate-x-[200%] opacity-0 pointer-events-none"
              }`}
            >
              <form className="w-full max-w-sm space-y-5" onSubmit={handleSubmitSignUp}>
                <h2 className="text-center text-4xl font-bold tracking-tight text-foreground">Sign Up</h2>
                {error ? <FeedbackMessage type="error" message={error} /> : null}
                {message ? <FeedbackMessage type="success" message={message} /> : null}
                <SocialButtons
                  onGoogle={handleGoogleSignIn}
                  onFacebook={handleFacebookSignIn}
                  onLinkedIn={handleLinkedInSignIn}
                  disabled={loading}
                />
                <Input placeholder="Enter Name" value={name} onChange={setName} />
                <Input type="email" placeholder="Enter E-mail" value={email} onChange={setEmail} />
                <Input type="password" placeholder="Enter Password" value={password} onChange={setPassword} />
                <button
                  type="submit"
                  disabled={loading}
                  className="mx-auto block w-40 rounded-xl bg-primary py-3 cursor-pointer text-base font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>
              </form>
            </div>
          </div>

          <div
            className={`absolute left-1/2 top-0 z-30 h-full w-1/2 overflow-hidden transition-transform duration-700 ease-out will-change-transform ${
              isSignup ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <div
              className={`absolute -left-full top-0 flex h-full w-[200%] transition-transform duration-700 ease-out will-change-transform ${
                isSignup ? "translate-x-1/2" : "translate-x-0"
              }`}
            >
              <div className="flex h-full w-1/2 items-center justify-center bg-primary px-10 text-primary-foreground">
                <div className="space-y-6 text-center">
                  <h3 className="text-5xl font-bold">Welcome to AH Digitizing</h3>
                  <p className="text-lg text-primary-foreground/95">Sign in now and enjoy our site</p>
                  <button
                    type="button"
                    onClick={() => setIsSignup(false)}
                    className="rounded-xl border-2 border-primary-foreground px-14 py-3 text-base cursor-pointer font-bold uppercase transition hover:bg-primary-foreground hover:text-primary"
                  >
                    Sign In
                  </button>
                </div>
              </div>

              <div className="flex h-full w-1/2 items-center justify-center bg-primary px-10 text-primary-foreground">
                <div className="space-y-6 text-center">
                  <h3 className="text-5xl font-bold">Hello</h3>
                  <p className="text-lg text-primary-foreground/95">Sign up now and enjoy our products</p>
                  <button
                    type="button"
                    onClick={() => setIsSignup(true)}
                    className="rounded-xl border-2 border-primary-foreground px-14 py-3 text-base cursor-pointer font-bold uppercase transition hover:bg-primary-foreground hover:text-primary"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="block bg-background p-6 md:hidden">
          <div className="mb-6 grid grid-cols-2 overflow-hidden rounded-full border border-border">
            <button
              type="button"
              onClick={() => setIsSignup(false)}
              className={`py-2 text-sm font-semibold transition cursor-pointer ${
                !isSignup ? "bg-primary text-primary-foreground" : "bg-background text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignup(true)}
              className={`py-2 text-sm font-semibold cursor-pointer transition ${
                isSignup ? "bg-primary text-primary-foreground" : "bg-background text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {!isSignup ? (
            <form className="space-y-4" onSubmit={handleSubmitSignIn}>
              <h2 className="text-center text-3xl font-bold text-foreground">Sign In</h2>
              {error ? <FeedbackMessage type="error" message={error} /> : null}
              {message ? <FeedbackMessage type="success" message={message} /> : null}
              <SocialButtons
                onGoogle={handleGoogleSignIn}
                onFacebook={handleFacebookSignIn}
                onLinkedIn={handleLinkedInSignIn}
                disabled={loading}
              />
              <Input type="email" placeholder="Enter E-mail" value={email} onChange={setEmail} />
              <Input type="password" placeholder="Enter Password" value={password} onChange={setPassword} />
              <button
                className="block w-full text-center text-base text-foreground/80 transition hover:text-primary"
                type="button"
                onClick={handleResetPassword}
              >
                Forget Password?
              </button>
              <button
                type="submit"
                disabled={loading}
                className="mx-auto block w-40 rounded-xl cursor-pointer bg-primary py-3 text-base font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmitSignUp}>
              <h2 className="text-center text-3xl font-bold text-foreground">Sign Up</h2>
              {error ? <FeedbackMessage type="error" message={error} /> : null}
              {message ? <FeedbackMessage type="success" message={message} /> : null}
              <SocialButtons
                onGoogle={handleGoogleSignIn}
                onFacebook={handleFacebookSignIn}
                onLinkedIn={handleLinkedInSignIn}
                disabled={loading}
              />
              <Input placeholder="Enter Name" value={name} onChange={setName} />
              <Input type="email" placeholder="Enter E-mail" value={email} onChange={setEmail} />
              <Input type="password" placeholder="Enter Password" value={password} onChange={setPassword} />
              <button
                type="submit"
                disabled={loading}
                className="mx-auto block w-40 cursor-pointer rounded-xl bg-primary py-3 text-base font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
