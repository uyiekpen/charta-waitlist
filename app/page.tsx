"use client";

import { useState } from "react";
import { ArrowRight, Check, LockKeyhole, Sparkles } from "lucide-react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || isSubmitting || submitted) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to join the waitlist. Please try again.",
        );
      }

      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to join the waitlist. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      id="top"
      className="min-h-[100svh] overflow-x-hidden bg-[#F2F3F8] text-[#15171E]"
    >
      <div className="mx-auto flex min-h-[100svh] max-w-[1440px] flex-col px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="flex items-center justify-between py-5 sm:py-7">
          <a
            href="#top"
            aria-label="Charta home"
            className="inline-flex items-center"
          >
            <img
              src="/charta.png"
              alt="Charta"
              width={160}
              height={40}
              className="h-10 w-auto object-contain sm:h-12"
            />
          </a>
        </header>

        {/* Hero */}
        <section className="grid flex-1 items-center gap-10 pb-12 pt-8 sm:pb-16 sm:pt-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(390px,0.98fr)] lg:gap-20 lg:pb-24 lg:pt-12">
          <div className="w-full max-w-[680px]">
            {/* Brand statement */}
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-[#d7ddd5] bg-white/70 px-3 py-2 text-[10px] font-semibold uppercase leading-4 tracking-[0.09em] text-[#15171E] sm:mb-8 sm:px-3.5 sm:text-xs sm:tracking-[0.13em]">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#8A6A2F]" />
              <span>Your life and business, coordinated.</span>
            </div>

            {/* Main headline */}
            <h1 className="max-w-[690px] text-[clamp(3rem,11.5vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.065em] text-[#15171E] sm:text-[clamp(4rem,7vw,6.5rem)] sm:leading-[0.91] lg:text-[clamp(4.5rem,7vw,7.5rem)]">
              Living abroad?
              <br />
              Get the right{" "}
              <em className="font-serif font-normal text-[#8A6A2F]">people.</em>
            </h1>

            {/* Supporting copy */}
            <p className="mt-6 max-w-[440px] text-base font-semibold leading-7 text-[#15171E] sm:mt-8 sm:text-xl sm:leading-8">
              Manage important things back home without being there.
            </p>

            <p className="mt-3 max-w-[500px] text-[15px] leading-7 text-[#64706a] sm:text-lg">
              Charta helps individuals, families, and business owners coordinate
              trusted people, manage important tasks, and get things done across
              distance.
            </p>

            {/* Waitlist form */}
            <form
              onSubmit={handleSubmit}
              className="mt-7 w-full max-w-[520px] sm:mt-10"
            >
              <label htmlFor="email" className="sr-only">
                Email address
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:rounded-full sm:border sm:border-[#cfd7ce] sm:bg-white/70 sm:p-1.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isSubmitting || submitted}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  className="h-14 w-full min-w-0 rounded-full border border-[#cfd7ce] bg-white px-5 text-base text-[#15171E] outline-none placeholder:text-[#98a29b] focus:border-[#8A6A2F] focus:ring-2 focus:ring-[#D9C084]/70 disabled:opacity-70 sm:flex-1 sm:border-0 sm:bg-transparent sm:focus:ring-0"
                />

                <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className="group flex h-14 w-full shrink-0 items-center justify-center gap-3 rounded-full bg-[#D9C084] px-6 text-sm font-semibold text-[#15171E] transition-colors hover:bg-[#c7aa68] focus:outline-none focus:ring-2 focus:ring-[#8A6A2F] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75 sm:w-auto sm:px-7"
                >
                  {submitted ? (
                    <>
                      You're on the list
                      <Check className="h-4 w-4" />
                    </>
                  ) : isSubmitting ? (
                    "Joining..."
                  ) : (
                    <>
                      Join the waitlist
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              <p className="mt-3 flex items-start gap-2 px-1 text-xs leading-5 text-[#84908a]">
                <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Be first to know when Charta launches.
              </p>

              {error && (
                <p role="alert" className="mt-2 px-1 text-sm text-[#a34d3d]">
                  {error}
                </p>
              )}

              {submitted && (
                <p role="status" className="mt-2 px-1 text-sm text-[#315b43]">
                  Thanks for your interest in Charta.
                </p>
              )}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
