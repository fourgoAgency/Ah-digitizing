"use client";

import { useState } from "react";
import { FaFacebookF, FaGithub, FaGoogle, FaLinkedinIn } from "react-icons/fa";

function SocialButtons() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Continue with Google"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground/80 transition hover:border-primary hover:text-primary"
        >
          <FaGoogle size={14} />
        </button>
        <button
          type="button"
          aria-label="Continue with Facebook"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground/80 transition hover:border-primary hover:text-primary"
        >
          <FaFacebookF size={14} />
        </button>
        <button
          type="button"
          aria-label="Continue with GitHub"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground/80 transition hover:border-primary hover:text-primary"
        >
          <FaGithub size={14} />
        </button>
        <button
          type="button"
          aria-label="Continue with LinkedIn"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground/80 transition hover:border-primary hover:text-primary"
        >
          <FaLinkedinIn size={14} />
        </button>
      </div>
      <p className="text-center text-[13px] text-foreground/80">Sign in With Email &amp; Password</p>
    </div>
  );
}

function Input({ placeholder, type = "text" }: { placeholder: string; type?: string }) {
  return (
    <input
      className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      type={type}
      placeholder={placeholder}
      required
    />
  );
}

export default function AuthSlider() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <section className="font-inter flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl overflow-hidden rounded-[26px] bg-background shadow-[0_20px_60px_rgba(0,0,0,0.35)] ring-1 ring-border">
        <div className="relative hidden h-[620px] md:block">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`absolute left-0 top-0 z-20 flex h-full w-1/2 items-center justify-center bg-background px-10 transition-transform duration-700 ease-in-out ${
                isSignup ? "translate-x-full" : "translate-x-0"
              }`}
            >
              <form className="w-full max-w-sm space-y-5" onSubmit={(e) => e.preventDefault()}>
                <h2 className="text-center text-4xl font-bold tracking-tight text-foreground">Sign In</h2>
                <SocialButtons />
                <Input type="email" placeholder="Enter E-mail" />
                <Input type="password" placeholder="Enter Password" />
                <button
                  type="button"
                  className="block w-full text-center text-base text-foreground/80 transition hover:text-primary"
                >
                  Forget Password?
                </button>
                <button
                  type="submit"
                  className="mx-auto block w-40 rounded-xl bg-primary py-3 text-base font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  Sign In
                </button>
              </form>
            </div>

            <div
              className={`absolute left-0 top-0 flex h-full w-1/2 items-center justify-center bg-background px-10 transition-transform duration-700 ease-in-out will-change-transform [backface-visibility:hidden] [transform:translateZ(0)] ${
                isSignup
                  ? "z-20 translate-x-full"
                  : "z-10 translate-x-[200%] pointer-events-none"
              }`}
            >
              <form className="w-full max-w-sm space-y-5" onSubmit={(e) => e.preventDefault()}>
                <h2 className="text-center text-4xl font-bold tracking-tight text-foreground">Sign Up</h2>
                <SocialButtons />
                <Input placeholder="Enter Name" />
                <Input type="email" placeholder="Enter E-mail" />
                <Input type="password" placeholder="Enter Password" />
                <button
                  type="submit"
                  className="mx-auto block w-40 rounded-xl bg-primary py-3 text-base font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>

          <div
            className={`absolute left-1/2 top-0 z-30 h-full w-1/2 overflow-hidden transition-transform duration-700 ease-in-out ${
              isSignup ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <div
              className={`absolute -left-full top-0 flex h-full w-[200%] transition-transform duration-700 ease-in-out ${
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
                    className="rounded-xl border-2 border-primary-foreground px-14 py-3 text-base font-bold uppercase transition hover:bg-primary-foreground hover:text-primary"
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
                    className="rounded-xl border-2 border-primary-foreground px-14 py-3 text-base font-bold uppercase transition hover:bg-primary-foreground hover:text-primary"
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
              className={`py-2 text-sm font-semibold transition ${
                !isSignup ? "bg-primary text-primary-foreground" : "bg-background text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignup(true)}
              className={`py-2 text-sm font-semibold transition ${
                isSignup ? "bg-primary text-primary-foreground" : "bg-background text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {!isSignup ? (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <h2 className="text-center text-3xl font-bold text-foreground">Sign In</h2>
              <SocialButtons />
              <Input type="email" placeholder="Enter E-mail" />
              <Input type="password" placeholder="Enter Password" />
              <button className="block w-full text-center text-base text-foreground/80 transition hover:text-primary" type="button">
                Forget Password?
              </button>
              <button type="submit" className="mx-auto block w-40 rounded-xl bg-primary py-3 text-base font-bold text-primary-foreground transition hover:bg-primary/90">
                Sign In
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <h2 className="text-center text-3xl font-bold text-foreground">Sign Up</h2>
              <SocialButtons />
              <Input placeholder="Enter Name" />
              <Input type="email" placeholder="Enter E-mail" />
              <Input type="password" placeholder="Enter Password" />
              <button type="submit" className="mx-auto block w-40 rounded-xl bg-primary py-3 text-base font-bold text-primary-foreground transition hover:bg-primary/90">
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
