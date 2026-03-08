import React from "react";

export function Pricing() {
  return (
    <section
      id="pricing"
      className="w-full border-t border-neutral-200 bg-neutral-50 py-16 dark:border-neutral-800 dark:bg-neutral-950"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <p className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
          Pricing
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
          Simple pricing for growing newsletters
        </h2>
        <p className="max-w-2xl text-sm text-neutral-600 dark:text-neutral-400 sm:text-base">
          Start for free while you set up your feeds and workflow. Upgrade only
          when you&apos;re ready to send AI-powered issues on a regular basis.
        </p>

        <div className="mt-6 grid w-full max-w-md gap-4 rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:max-w-lg sm:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                Starter
              </h3>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Perfect for solo founders and side projects.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">
                $0
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                per month
              </div>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li>Up to 3 connected RSS feeds</li>
            <li>Weekly AI-generated newsletter drafts</li>
            <li>Manual review & editing in your editor</li>
            <li>Basic history of previous issues</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

