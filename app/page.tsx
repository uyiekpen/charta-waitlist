"use client";

import { useState, type FormEvent } from "react";
import { Check, ShieldCheck } from "lucide-react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || submitted) return;

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();

    if (!normalizedEmail || !normalizedFirstName || !normalizedLastName) {
      setError("Please complete all fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          firstName: normalizedFirstName,
          lastName: normalizedLastName,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : "Unable to join the waitlist. Please try again.",
        );
      }

      setEmail(normalizedEmail);
      setFirstName(normalizedFirstName);
      setLastName(normalizedLastName);
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error &&
          submissionError.message !== "Failed to fetch"
          ? submissionError.message
          : "Something went wrong. Check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "mt-2 h-11 w-full rounded-lg border border-[#D9DCE5] bg-white px-3 text-sm font-normal outline-none transition focus:border-[#1A3A6B] focus:ring-2 focus:ring-[#1A3A6B]/15 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

  return (
    <main className="min-h-screen bg-[#F2F3F8] p-0 text-[#15171E] sm:p-5 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1335px] overflow-hidden rounded-none bg-white shadow-[0_20px_60px_rgba(31,41,55,0.06)] sm:rounded-[10px]">
        <section className="flex w-full items-center justify-center px-7 py-12 sm:px-12 sm:py-16 lg:w-[51%] lg:px-14 xl:px-20">
          <div className="w-full max-w-[420px]">
            <div className="mb-10">
              <img
                src="/charta.png"
                alt="Charta"
                width={160}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </div>

            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#8A6A2F]">
              One life, across borders
            </p>

            <h1 className="text-[40px] font-medium leading-[1.08] tracking-[-0.045em] sm:text-[48px]">
              Whatever you need, start with Charta.
            </h1>

            <p className="mt-5 max-w-[390px] text-base leading-7 text-[#68707C] sm:text-[17px]">
              From travel and care to business, legal, and craft, connect with
              trusted people who help you get things done, wherever life takes
              you.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 mt-2.5"
              aria-busy={isSubmitting}
            >
              <fieldset
                disabled={isSubmitting || submitted}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label htmlFor="firstName" className="text-xs font-semibold">
                    First name
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      maxLength={100}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className={inputClass}
                    />
                  </label>

                  <label htmlFor="lastName" className="text-xs font-semibold">
                    Last name
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      maxLength={100}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className={inputClass}
                    />
                  </label>
                </div>

                <label htmlFor="email" className="block text-xs font-semibold">
                  Email address
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={inputClass}
                  />
                </label>
              </fieldset>

              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1A3A6B] px-5 text-sm font-semibold text-white transition hover:bg-[#142D53] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3A6B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitted ? (
                  <>
                    You're on the list
                    <Check aria-hidden="true" className="h-4 w-4" />
                  </>
                ) : isSubmitting ? (
                  "Joining..."
                ) : (
                  "Join the waitlist"
                )}
              </button>

              {submitted && (
                <p role="status" className="text-sm font-medium text-[#236B56]">
                  You're on the list! We'll be in touch when Charta is ready.
                </p>
              )}

              <p className="flex items-center gap-2 text-xs text-[#8B919B]">
                <ShieldCheck
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-[#8A6A2F]"
                />
                Your details are safe with us.
              </p>

              {error && (
                <p role="alert" className="text-sm font-medium text-red-600">
                  {error}
                </p>
              )}
            </form>
          </div>
        </section>

        <section className="hidden flex-1 items-center justify-center overflow-hidden bg-[#F4F2EE] p-6 lg:flex xl:justify-start xl:pl-10">
          <div className="relative aspect-[17/15] w-full h-full  overflow-hidden rounded-[20px]  shadow-[0_18px_45px_rgba(30,37,56,0.1)]">
            <img
              src="/Gemini_Generated_Image_8mj7gg8mj7gg8mj7.jpg"
              alt="Preview of a Charta profile"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
