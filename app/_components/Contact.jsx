"use client";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); 

  const sendEmail = (e) => {
    e.preventDefault();
    if (!form.current) return;

    setLoading(true);
    emailjs
      .sendForm("service_6azqnjb", "template_ayosqiw", form.current, {
        publicKey: "hhvE1Wq3yZ6l1CahC",
      })
      .then(
        () => {
          setStatus("success");
          form.current.reset();
        },
        (error) => {
          if (error) {
            if (error.text) {
              console.error("FAILED…", error.text);
            } else if (error.message) {
              console.error("FAILED…", error.message);
            } else {
              console.error("FAILED…", error);
            }
          } else {
            console.error("FAILED… Unknown error");
          }
          setStatus("error");
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <section className="mx-auto max-w-xl p-8 sm:p-10 rounded-3xl shadow-xl bg-white/90 dark:bg-gray-900/80 backdrop-blur">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
        Let’s get in touch
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Have a question or proposal? Send me a message →
      </p>

      <form ref={form} onSubmit={sendEmail} className="mt-8 flex flex-col gap-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            name="from_name"
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="from_email"
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone
          </label>
          <input
            type="tel"
            name="from_phone"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="+97671234567"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Message
          </label>
          <textarea
            name="message"
            rows="5"
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 font-medium text-white transition hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg
                className="mr-2 h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Sending…
            </>
          ) : (
            "Send Message"
          )}
        </button>

        {status === "success" && (
          <p className="text-sm text-green-600">Thanks! Your message was sent.</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600">
            Oops! Something went wrong — try again in a moment.
          </p>
        )}
      </form>

      {/* NOTE: Replace "template_xxxxxx" above with your real Template ID from https://dashboard.emailjs.com/admin/templates */}
    </section>
  );
};

export default ContactUs;
