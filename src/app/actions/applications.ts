"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { APPLICATION_STATUSES } from "@/lib/status";
import type { VisaType } from "@prisma/client";

const VISA_TYPES: VisaType[] = ["F1", "J1", "OTHER"];

export async function updateApplicationStatus(
  applicationId: string,
  status: string,
) {
  await verifySession();

  if (!APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number])) {
    throw new Error("Invalid status");
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: status as (typeof APPLICATION_STATUSES)[number] },
  });

  revalidatePath("/dashboard/tracker");
  revalidatePath(`/dashboard/tracker/${applicationId}`);
}

export async function updateApplicationDetails(
  applicationId: string,
  formData: FormData,
) {
  await verifySession();

  const visaTypeRaw = formData.get("visaType");
  const visaType =
    typeof visaTypeRaw === "string" && VISA_TYPES.includes(visaTypeRaw as VisaType)
      ? (visaTypeRaw as VisaType)
      : null;
  const notes = formData.get("notes");

  await prisma.application.update({
    where: { id: applicationId },
    data: {
      visaType,
      notes: typeof notes === "string" ? notes : null,
    },
  });

  revalidatePath("/dashboard/tracker");
  revalidatePath(`/dashboard/tracker/${applicationId}`);
}

export async function addFundingOffer(
  applicationId: string,
  formData: FormData,
) {
  await verifySession();

  const type = formData.get("type");
  const amount = formData.get("amount");
  const notes = formData.get("notes");

  if (typeof type !== "string" || type.trim() === "") {
    return;
  }

  await prisma.fundingOffer.create({
    data: {
      applicationId,
      type: type.trim(),
      amount: typeof amount === "string" && amount.trim() !== "" ? amount.trim() : null,
      notes: typeof notes === "string" && notes.trim() !== "" ? notes.trim() : null,
    },
  });

  revalidatePath(`/dashboard/tracker/${applicationId}`);
}

export async function deleteFundingOffer(
  applicationId: string,
  offerId: string,
) {
  await verifySession();

  await prisma.fundingOffer.delete({ where: { id: offerId } });

  revalidatePath(`/dashboard/tracker/${applicationId}`);
}
