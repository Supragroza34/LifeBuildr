import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  addFundingOffer,
  deleteFundingOffer,
  updateApplicationDetails,
} from "@/app/actions/applications";
import { StatusSelect } from "../StatusSelect";

export default async function ApplicationDetailPage(
  props: PageProps<"/dashboard/tracker/[id]">,
) {
  const { id } = await props.params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      program: { include: { university: true, deadlines: true } },
      fundingOffers: true,
    },
  });

  if (!application) {
    notFound();
  }

  const updateDetails = updateApplicationDetails.bind(null, application.id);
  const addOffer = addFundingOffer.bind(null, application.id);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/tracker"
        className="mb-4 inline-block text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
      >
        ← Back to tracker
      </Link>

      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        {application.program.university.name}
      </h1>
      <p className="mb-6 text-sm text-neutral-500">
        {application.program.name}
      </p>

      {application.program.deadlines.length > 0 && (
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-950">
          <div className="mb-1 font-medium text-neutral-700 dark:text-neutral-300">
            Deadlines
          </div>
          <ul className="space-y-1 text-neutral-500">
            {application.program.deadlines.map((d) => (
              <li key={d.id}>
                {d.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                — {d.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Status
        </label>
        <StatusSelect
          applicationId={application.id}
          status={application.status}
        />
      </div>

      <form
        action={updateDetails}
        className="mb-6 space-y-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div>
          <label
            htmlFor="visaType"
            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Visa type
          </label>
          <select
            id="visaType"
            name="visaType"
            defaultValue={application.visaType ?? ""}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
          >
            <option value="">Not set</option>
            <option value="F1">F-1</option>
            <option value="J1">J-1</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={5}
            defaultValue={application.notes ?? ""}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
        >
          Save
        </button>
      </form>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Funding offers
        </h2>

        {application.fundingOffers.length > 0 && (
          <ul className="mb-4 space-y-2">
            {application.fundingOffers.map((offer) => (
              <li
                key={offer.id}
                className="flex items-start justify-between gap-3 rounded-md border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800"
              >
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    {offer.type}
                    {offer.amount ? ` — ${offer.amount}` : ""}
                  </div>
                  {offer.notes && (
                    <div className="text-xs text-neutral-500">
                      {offer.notes}
                    </div>
                  )}
                </div>
                <form
                  action={deleteFundingOffer.bind(
                    null,
                    application.id,
                    offer.id,
                  )}
                >
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <form action={addOffer} className="flex flex-wrap items-end gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Type
            </label>
            <input
              name="type"
              placeholder="TA / RA / Fellowship / GSR"
              required
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Amount
            </label>
            <input
              name="amount"
              placeholder="$20,000/yr"
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Notes
            </label>
            <input
              name="notes"
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
          </div>
          <button
            type="submit"
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
