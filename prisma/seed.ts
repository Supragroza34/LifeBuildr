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
  visaType?: "F1" | "J1" | "OTHER";
  fundingNotes?: string;
  visaNotes?: string;
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
  // Added because the Kennedy Scholarship (see Task list) specifically funds
  // one year at Harvard or MIT. Not part of the original 7-school list, and
  // contingent on winning the scholarship — hence no confirmed deadline yet.
  {
    name: "Harvard University",
    slug: "harvard",
    website: "https://www.harvard.edu",
    city: "Cambridge",
    state: "MA",
    programName: "MS Computer Science",
    applicationNote:
      "Only relevant if pursuing the Kennedy Scholarship — see Prep Checklist. Not a primary target unless funded this way.",
    fundingNotes:
      "Kennedy Scholarship funds one year at Harvard or MIT — confirm eligibility and F-1 vs J-1 status directly with the Kennedy Memorial Trust.",
    visaNotes:
      "Kennedy Scholarship implies J-1 visa, which conflicts with the F-1/OPT/STEM extension plan used for the other 7 schools. Decide before applying.",
  },
  {
    name: "Massachusetts Institute of Technology",
    slug: "mit",
    website: "https://www.mit.edu",
    city: "Cambridge",
    state: "MA",
    programName: "MS Computer Science",
    applicationNote:
      "Only relevant if pursuing the Kennedy Scholarship — see Prep Checklist. Not a primary target unless funded this way.",
    fundingNotes:
      "Kennedy Scholarship funds one year at Harvard or MIT — confirm eligibility and F-1 vs J-1 status directly with the Kennedy Memorial Trust.",
    visaNotes:
      "Kennedy Scholarship implies J-1 visa, which conflicts with the F-1/OPT/STEM extension plan used for the other 7 schools. Decide before applying.",
  },
];

// Cross-school prep tasks from Masters_Application_Checklist.xlsx
// ("Application Checklist" sheet), with exact dates filled in from
// Masters_Application_Reminders.ics where the calendar specifies one.
const TASKS: {
  title: string;
  category: string;
  targetWindow?: string;
  dueDate?: Date;
  relatedTo?: string;
  notes?: string;
  reminderLeadTime?: string;
}[] = [
  {
    title: "Take/register for GRE (verify per-school requirement)",
    category: "Prep",
    targetWindow: "Now - Mar 2027",
    relatedTo: "All target schools",
    notes:
      "Many CS programs have dropped GRE — confirm current requirement per school before registering.",
    reminderLeadTime: "4 weeks before test",
  },
  {
    title: "Take TOEFL/IELTS",
    category: "Prep",
    targetWindow: "Now - Mar 2027",
    relatedTo: "All target schools",
    notes:
      "Check minimum scores per school (typically 90 TOEFL iBT / 7.0 IELTS).",
    reminderLeadTime: "4 weeks before test",
  },
  {
    title: "Identify target faculty for GSR/RA outreach",
    category: "Prep",
    targetWindow: "Now - Jun 2027",
    relatedTo: "UCLA, Berkeley, UCSD, Georgia Tech, Michigan, Purdue",
    notes:
      "Read recent papers/grants; build a shortlist of 3-5 professors per school.",
    reminderLeadTime: "Ongoing",
  },
  {
    title: "Send initial outreach emails to faculty",
    category: "Prep",
    targetWindow: "Mar - Aug 2027",
    relatedTo: "All target schools",
    notes:
      "Earlier is better — GSR funding runs on 'whoever asks first and fits'.",
    reminderLeadTime: "One-time task",
  },
  {
    title: "Draft Statement of Purpose (master draft, then tailor per school)",
    category: "Prep",
    targetWindow: "Mar - Sep 2027",
    relatedTo: "All target schools",
    notes: "Tailor final paragraph to named faculty/research fit per school.",
    reminderLeadTime: "6 weeks before earliest deadline",
  },
  {
    title: "Request letters of recommendation",
    category: "Prep",
    targetWindow: "Jul - Oct 2027",
    dueDate: new Date("2027-09-01"),
    relatedTo: "All target schools",
    notes: "Give recommenders 2+ months notice.",
    reminderLeadTime: "10 weeks before earliest deadline",
  },
  {
    title: "Fulbright application opens",
    category: "Fulbright UK",
    targetWindow: "Feb 2027",
    dueDate: new Date("2027-02-01"),
    relatedTo: "N/A (Harvard/MIT/any US school, but J-1 visa)",
    notes:
      "J-1 visa conflicts with F-1/OPT/STEM extension plan — decide if still worth pursuing.",
    reminderLeadTime: "2 weeks before opening",
  },
  {
    title: "Fulbright application deadline",
    category: "Fulbright UK",
    targetWindow: "May 2027",
    dueDate: new Date("2027-05-06"),
    relatedTo: "N/A",
    notes: "Earliest deadline of the entire cycle — do not miss if pursuing.",
    reminderLeadTime: "4 weeks before deadline",
  },
  {
    title: "Kennedy Scholarship application opens",
    category: "Kennedy Scholarship",
    targetWindow: "Aug 2027",
    dueDate: new Date("2027-08-01"),
    relatedTo: "Harvard or MIT only",
    notes:
      "Funds 1 year at Harvard/MIT — confirm F-1 vs J-1 status directly with the Trust.",
    reminderLeadTime: "2 weeks before opening",
  },
  {
    title: "Kennedy Scholarship application deadline",
    category: "Kennedy Scholarship",
    targetWindow: "Oct 2027",
    dueDate: new Date("2027-10-15"),
    relatedTo: "Harvard or MIT only",
    reminderLeadTime: "4 weeks before deadline",
  },
  {
    title: "UCLA CS application window opens",
    category: "UCLA",
    targetWindow: "Mid-Sep 2027",
    dueDate: new Date("2027-09-15"),
    relatedTo: "UCLA",
    notes: "Applications only accepted mid-Sep through Dec 15.",
    reminderLeadTime: "1 week before opening",
  },
  {
    title: "UCLA CS application deadline (MS or PhD)",
    category: "UCLA",
    targetWindow: "Dec 15, 2027",
    dueDate: new Date("2027-12-15"),
    relatedTo: "UCLA",
    notes:
      "~4-5% MS admit rate historically — verify current cycle data.",
    reminderLeadTime: "6 weeks / 2 weeks before deadline",
  },
  {
    title: "Georgia Tech / Michigan / Purdue / UT Austin deadlines",
    category: "Other State Schools",
    targetWindow: "Dec 2027 - Jan 2028",
    dueDate: new Date("2027-12-01"),
    relatedTo: "Georgia Tech, Michigan, Purdue, UT Austin, etc.",
    notes:
      "Confirm each individually — dates vary by school and shift year to year. (Due date here is a check-in reminder, not the actual deadline.)",
    reminderLeadTime: "6 weeks / 2 weeks before each deadline",
  },
  {
    title: "Berkeley MEng / MS-PhD track application deadline",
    category: "Berkeley",
    targetWindow: "Mid-Jan 2028",
    dueDate: new Date("2028-01-14"),
    relatedTo: "UC Berkeley",
    notes:
      "Confirm which track (MEng vs research MS/PhD) before applying — different funding odds.",
    reminderLeadTime: "6 weeks / 2 weeks before deadline",
  },
  {
    title: "Interviews (if requested by any program)",
    category: "Decisions",
    targetWindow: "Feb - Mar 2028",
    relatedTo: "All target schools",
    notes: "Not all programs interview — only if contacted.",
    reminderLeadTime: "As scheduled",
  },
  {
    title: "Admission decisions released",
    category: "Decisions",
    targetWindow: "Mar 2028",
    dueDate: new Date("2028-03-01"),
    relatedTo: "All target schools",
    notes:
      "Compare funding offers (GSR/TA/fellowship) across all admits before deciding.",
  },
  {
    title: "Statement of Intent to Register (SIR) deadline",
    category: "Decisions",
    targetWindow: "Mid-Apr 2028",
    dueDate: new Date("2028-04-15"),
    relatedTo: "Chosen school",
    notes:
      "This is your final commitment deadline — compare all offers before this date.",
    reminderLeadTime: "2 weeks before deadline",
  },
  {
    title: "Receive I-20 from chosen school",
    category: "Visa & Logistics",
    targetWindow: "Apr - May 2028",
    relatedTo: "Chosen school",
    notes: "Required to book F-1 visa interview.",
  },
  {
    title: "Book F-1 visa interview",
    category: "Visa & Logistics",
    targetWindow: "As soon as I-20 received",
    dueDate: new Date("2028-05-01"),
    relatedTo: "US Embassy/Consulate UK",
    notes: "Appointment availability varies a lot by season — book early.",
    reminderLeadTime: "Immediately upon I-20 receipt",
  },
  {
    title: "Attend F-1 visa interview",
    category: "Visa & Logistics",
    targetWindow: "May - Jul 2028",
    relatedTo: "US Embassy/Consulate UK",
    reminderLeadTime: "1 week before interview",
  },
  {
    title: "Arrange funding transfer (loan disbursement / remittance)",
    category: "Visa & Logistics",
    targetWindow: "Jun - Aug 2028",
    dueDate: new Date("2028-07-01"),
    relatedTo: "Chosen school",
    notes: "Confirm TCS/LRS rules current at time of transfer.",
    reminderLeadTime: "8 weeks before term start",
  },
  {
    title: "Arrange housing",
    category: "Visa & Logistics",
    targetWindow: "Jun - Aug 2028",
    dueDate: new Date("2028-07-15"),
    relatedTo: "Chosen school city",
    reminderLeadTime: "8 weeks before term start",
  },
  {
    title: "Arrange health insurance",
    category: "Visa & Logistics",
    targetWindow: "Jul - Aug 2028",
    dueDate: new Date("2028-07-15"),
    relatedTo: "Chosen school",
    notes: "Most schools require proof before registration.",
    reminderLeadTime: "4 weeks before term start",
  },
  {
    title: "Orientation / program begins",
    category: "Program Start",
    targetWindow: "Sep 2028",
    dueDate: new Date("2028-09-01"),
    relatedTo: "Chosen school",
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
        fundingNotes: school.fundingNotes,
        visaNotes: school.visaNotes,
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
          visaType: school.visaType ?? "F1",
          notes: school.applicationNote,
        },
      });
    }
  }

  console.log(`Seeded ${STARTER_SCHOOLS.length} universities/programs.`);
}

async function seedTasks() {
  for (const task of TASKS) {
    const existing = await prisma.task.findFirst({
      where: { title: task.title, category: task.category },
    });
    if (!existing) {
      await prisma.task.create({
        data: {
          title: task.title,
          category: task.category,
          targetWindow: task.targetWindow,
          dueDate: task.dueDate,
          relatedTo: task.relatedTo,
          notes: task.notes,
          reminderLeadTime: task.reminderLeadTime,
          status: "NOT_STARTED",
        },
      });
    }
  }

  console.log(`Seeded ${TASKS.length} prep checklist tasks.`);
}

const NEWS_SOURCES: { name: string; keywords: string }[] = [
  { name: "Student visa policy", keywords: "F-1 visa OR OPT policy change" },
  {
    name: "University funding announcements",
    keywords: "graduate student funding fellowship announcement",
  },
  {
    name: "International student news",
    keywords: "international student news US universities",
  },
];

async function seedNewsSources() {
  for (const source of NEWS_SOURCES) {
    const existing = await prisma.newsSource.findFirst({
      where: { name: source.name },
    });
    if (!existing) {
      await prisma.newsSource.create({
        data: {
          name: source.name,
          type: "api",
          keywords: source.keywords,
          enabled: true,
        },
      });
    }
  }

  console.log(`Seeded ${NEWS_SOURCES.length} news keyword sources.`);
}

async function main() {
  await seedAdminUser();
  await seedUniversities();
  await seedTasks();
  await seedNewsSources();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
