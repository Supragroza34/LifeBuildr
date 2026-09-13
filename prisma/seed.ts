import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Starter schools you're already tracking. Deadlines/tuition/requirements are
// left blank here (flagged unverified) — fill them in via the University
// Catalogue tile once it's built, or edit directly for now.
const STARTER_SCHOOLS: {
  name: string;
  slug: string;
  website: string;
  city: string;
  state: string;
  programName: string;
}[] = [
  {
    name: "University of California, Los Angeles",
    slug: "ucla",
    website: "https://www.ucla.edu",
    city: "Los Angeles",
    state: "CA",
    programName: "MS Computer Science",
  },
  {
    name: "University of California, Berkeley",
    slug: "uc-berkeley",
    website: "https://www.berkeley.edu",
    city: "Berkeley",
    state: "CA",
    programName: "MS Computer Science",
  },
  {
    name: "University of California, San Diego",
    slug: "ucsd",
    website: "https://www.ucsd.edu",
    city: "San Diego",
    state: "CA",
    programName: "MS Computer Science",
  },
  {
    name: "Georgia Institute of Technology",
    slug: "georgia-tech",
    website: "https://www.gatech.edu",
    city: "Atlanta",
    state: "GA",
    programName: "MS Computer Science",
  },
  {
    name: "University of Michigan",
    slug: "university-of-michigan",
    website: "https://umich.edu",
    city: "Ann Arbor",
    state: "MI",
    programName: "MS Computer Science and Engineering",
  },
  {
    name: "Purdue University",
    slug: "purdue",
    website: "https://www.purdue.edu",
    city: "West Lafayette",
    state: "IN",
    programName: "MS Computer Science",
  },
  {
    name: "University of Texas at Austin",
    slug: "ut-austin",
    website: "https://www.utexas.edu",
    city: "Austin",
    state: "TX",
    programName: "MS Computer Science",
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

    await prisma.program.upsert({
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
