import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Starter schools you're already tracking. Deadlines/tuition/requirements are
// left blank here (flagged unverified) — fill them in via the University
// Catalogue tile once it's built, or edit directly for now.
//
// Dates and notes below come from Masters_Application_Checklist.xlsx and
// Masters_Application_Reminders.ics. Only UCLA has a confirmed exact
// deadline; the rest are approximate or unconfirmed per the source files.
const STARTER_SCHOOLS: {
  name: string;
  slug: string;
  website: string;
  city: string;
  state: string;
  programName: string;
  deadlines?: { label: string; date: Date }[];
  applicationNote: string;
}[] = [
  {
    name: "University of California, Los Angeles",
    slug: "ucla",
    website: "https://www.ucla.edu",
    city: "Los Angeles",
    state: "CA",
    programName: "MS Computer Science",
    deadlines: [
      { label: "Application window opens", date: new Date("2027-09-15") },
      { label: "Application deadline", date: new Date("2027-12-15") },
    ],
    applicationNote:
      "Applications only accepted mid-Sep through Dec 15. ~4-5% MS admit rate historically — verify current cycle data.",
  },
  {
    name: "University of California, Berkeley",
    slug: "uc-berkeley",
    website: "https://www.berkeley.edu",
    city: "Berkeley",
    state: "CA",
    programName: "MS Computer Science",
    deadlines: [
      {
        label: "Application deadline (approximate — confirm exact date)",
        date: new Date("2028-01-14"),
      },
    ],
    applicationNote:
      "Confirm which track (MEng vs research MS/PhD) before applying — different funding odds.",
  },
  {
    name: "University of California, San Diego",
    slug: "ucsd",
    website: "https://www.ucsd.edu",
    city: "San Diego",
    state: "CA",
    programName: "MS Computer Science",
    applicationNote:
      "Deadline not itemized in current checklist — confirm via University Catalogue.",
  },
  {
    name: "Georgia Institute of Technology",
    slug: "georgia-tech",
    website: "https://www.gatech.edu",
    city: "Atlanta",
    state: "GA",
    programName: "MS Computer Science",
    applicationNote:
      "Exact deadline not yet confirmed — typically clusters Dec 2027-Jan 2028. Confirm individually.",
  },
  {
    name: "University of Michigan",
    slug: "university-of-michigan",
    website: "https://umich.edu",
    city: "Ann Arbor",
    state: "MI",
    programName: "MS Computer Science and Engineering",
    applicationNote:
      "Exact deadline not yet confirmed — typically clusters Dec 2027-Jan 2028. Confirm individually.",
  },
  {
    name: "Purdue University",
    slug: "purdue",
    website: "https://www.purdue.edu",
    city: "West Lafayette",
    state: "IN",
    programName: "MS Computer Science",
    applicationNote:
      "Exact deadline not yet confirmed — typically clusters Dec 2027-Jan 2028. Confirm individually.",
  },
  {
    name: "University of Texas at Austin",
    slug: "ut-austin",
    website: "https://www.utexas.edu",
    city: "Austin",
    state: "TX",
    programName: "MS Computer Science",
    applicationNote:
      "Exact deadline not yet confirmed — typically clusters Dec 2027-Jan 2028. Confirm individually.",
  },
];

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`Admin user ready: ${email}`);
}

async function seedUniversities() {
  for (const school of STARTER_SCHOOLS) {
    const university = await prisma.university.upsert({
      where: { slug: school.slug },
      update: {
        name: school.name,
        website: school.website,
        city: school.city,
        state: school.state,
      },
      create: {
        name: school.name,
        slug: school.slug,
        website: school.website,
        city: school.city,
        state: school.state,
      },
    });

    const program = await prisma.program.upsert({
      where: {
        universityId_name: {
          universityId: university.id,
          name: school.programName,
        },
      },
      update: {},
      create: {
        universityId: university.id,
        name: school.programName,
        degreeType: "MS",
        sourceUrl: school.website,
        verifiedFields: {}, // nothing scraped yet — all fields need manual entry
      },
    });

    for (const deadline of school.deadlines ?? []) {
      const existing = await prisma.deadline.findFirst({
        where: { programId: program.id, label: deadline.label },
      });
      if (!existing) {
        await prisma.deadline.create({
          data: {
            programId: program.id,
            label: deadline.label,
            date: deadline.date,
          },
        });
      }
    }

    const existingApplication = await prisma.application.findFirst({
      where: { programId: program.id },
    });
    if (!existingApplication) {
      await prisma.application.create({
        data: {
          programId: program.id,
          status: "NOT_STARTED",
          visaType: "F1",
          notes: school.applicationNote,
        },
      });
    }
  }

  console.log(`Seeded ${STARTER_SCHOOLS.length} universities/programs.`);
}

async function main() {
  await seedAdminUser();
  await seedUniversities();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
