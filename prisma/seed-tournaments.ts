import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tournaments = [
  {
    name: "North Bombay District Championship 2026",
    location: "Kandivali Sports Complex, Mumbai",
    startDate: new Date("2026-02-10"),
    endDate: new Date("2026-02-12"),
    registrationStartDate: new Date("2026-01-01"),
    registrationEndDate: new Date("2026-02-05"),
    weightClass: "All Categories",
    categories: JSON.stringify(["Sub-Junior (Under 14)", "Junior (Under 17)", "Youth (Under 19)", "Elite (Senior)"]),
    description: "Annual district-level boxing championship open to all registered boxers under NBDABA. Medals and certificates for top 3 positions in each category.",
    disclaimer: "Participation is subject to valid NBDABA membership and medical fitness certificate. The association reserves the right to modify the schedule.",
    status: "open",
    entryFee: 500,
    isFeatured: true,
    customQuestions: JSON.stringify([
      "Have you participated in any NBDABA tournament before? If yes, please mention the tournament name and year.",
      "Do you have any existing injuries or medical conditions we should be aware of?",
      "What is your current competition category (e.g., Sub-Junior, Junior, Youth, Senior)?",
    ]),
  },
  {
    name: "Mumbai Open Boxing Tournament 2026",
    location: "Borivali Indoor Stadium, Mumbai",
    startDate: new Date("2026-03-15"),
    endDate: new Date("2026-03-17"),
    registrationStartDate: new Date("2026-02-01"),
    registrationEndDate: new Date("2026-03-10"),
    weightClass: "46kg – 91kg",
    categories: JSON.stringify(["Youth (Under 19)", "Under 22", "Elite (Senior)"]),
    description: "Open tournament welcoming boxers from all districts of Mumbai. Cash prizes for winners in senior categories.",
    disclaimer: "All participants must carry original Aadhaar and medical fitness certificate on the day of the event.",
    status: "open",
    entryFee: 600,
    isFeatured: false,
    customQuestions: JSON.stringify([
      "Which district are you representing in this tournament?",
      "Have you won any medals at district or state level in the past 2 years?",
    ]),
  },
  {
    name: "Sub-Junior State Qualifier 2026",
    location: "Malad Sports Ground, Mumbai",
    startDate: new Date("2026-04-05"),
    endDate: new Date("2026-04-06"),
    registrationStartDate: new Date("2026-03-01"),
    registrationEndDate: new Date("2026-03-30"),
    weightClass: "28kg – 46kg",
    categories: JSON.stringify(["Sub-Junior (Under 14)"]),
    description: "State qualifier for sub-junior boxers. Top 2 from each weight category will represent the district at the state level.",
    disclaimer: "Age proof (birth certificate) is mandatory. No on-spot registrations will be accepted.",
    status: "open",
    entryFee: 300,
    isFeatured: false,
    customQuestions: JSON.stringify([
      "Name of your school and class/grade.",
      "How long have you been training in boxing?",
      "Is your parent/guardian aware of and consenting to this participation?",
    ]),
  },
  {
    name: "NBDABA Inter-Academy Cup 2026",
    location: "Dahisar Sports Hall, Mumbai",
    startDate: new Date("2026-05-20"),
    endDate: new Date("2026-05-22"),
    registrationStartDate: new Date("2026-04-10"),
    registrationEndDate: new Date("2026-05-15"),
    weightClass: "All Categories",
    categories: JSON.stringify(["Sub-Junior (Under 14)", "Junior (Under 17)", "Youth (Under 19)", "Under 22", "Elite (Senior)", "Masters (35+)"]),
    description: "Inter-academy competition to promote healthy rivalry and talent identification across all registered academies in North Bombay.",
    disclaimer: "Each academy can register a maximum of 3 boxers per weight category. Entry fee is non-refundable.",
    status: "open",
    entryFee: 500,
    isFeatured: false,
    customQuestions: JSON.stringify([
      "Name of your academy / club.",
      "How many inter-academy tournaments have you competed in previously?",
    ]),
  },
  {
    name: "Junior Boxing Championship 2025",
    location: "Goregaon Sports Club, Mumbai",
    startDate: new Date("2025-11-08"),
    endDate: new Date("2025-11-10"),
    registrationStartDate: new Date("2025-10-01"),
    registrationEndDate: new Date("2025-11-03"),
    weightClass: "38kg – 64kg",
    categories: JSON.stringify(["Junior (Under 17)"]),
    description: "Annual junior championship for boxers aged 14–17. Trophies and medals for all podium finishers.",
    disclaimer: "Boxers must be registered with NBDABA for the 2025 calendar year to be eligible.",
    status: "open",
    entryFee: 400,
    isFeatured: false,
    customQuestions: null,
  },
  {
    name: "Elite Senior Open 2025",
    location: "Andheri Sports Complex, Mumbai",
    startDate: new Date("2025-09-12"),
    endDate: new Date("2025-09-14"),
    registrationStartDate: new Date("2025-08-01"),
    registrationEndDate: new Date("2025-09-07"),
    weightClass: "60kg – 92kg+",
    categories: JSON.stringify(["Elite (Senior)"]),
    description: "Premier senior open tournament with participation from across Maharashtra. Cash prizes for gold medalists.",
    disclaimer: "Valid BFI registration required for participation. Medical fitness certificate mandatory.",
    status: "open",
    entryFee: 700,
    isFeatured: false,
    customQuestions: null,
  },
  {
    name: "Masters Boxing League 2026",
    location: "Mulund Community Hall, Mumbai",
    startDate: new Date("2026-06-14"),
    endDate: new Date("2026-06-15"),
    registrationStartDate: new Date("2026-05-01"),
    registrationEndDate: new Date("2026-06-10"),
    weightClass: "All Categories",
    categories: JSON.stringify(["Masters (35+)"]),
    description: "Dedicated tournament for masters category boxers aged 35 and above. Promoting fitness and sportsmanship among veteran athletes.",
    disclaimer: "Participants must submit a doctor's fitness certificate issued within 30 days of the event date.",
    status: "open",
    entryFee: 500,
    isFeatured: false,
    customQuestions: JSON.stringify([
      "Do you have any chronic health conditions (e.g., hypertension, diabetes)? If yes, please describe.",
      "Have you competed at Masters level before? If yes, list the tournaments.",
      "Name and contact number of your emergency contact person.",
    ]),
  },
  {
    name: "Youth State Selection Trial 2026",
    location: "Bandra Kurla Sports Arena, Mumbai",
    startDate: new Date("2026-07-18"),
    endDate: new Date("2026-07-20"),
    registrationStartDate: new Date("2026-06-01"),
    registrationEndDate: new Date("2026-07-12"),
    weightClass: "46kg – 80kg",
    categories: JSON.stringify(["Youth (Under 19)"]),
    description: "State selection trials for youth category. Selected boxers will represent Maharashtra at the national youth championship.",
    disclaimer: "Only boxers who have participated in at least one district-level tournament in 2025 or 2026 are eligible.",
    status: "open",
    entryFee: 500,
    isFeatured: false,
    customQuestions: JSON.stringify([
      "List the district/state tournaments you have participated in during 2025 or 2026.",
      "Are you available to travel for national-level representation if selected?",
      "Name and contact of your current boxing coach.",
    ]),
  },
  {
    name: "Under-22 Development Tournament 2026",
    location: "Vikhroli Indoor Arena, Mumbai",
    startDate: new Date("2026-08-22"),
    endDate: new Date("2026-08-23"),
    registrationStartDate: new Date("2026-07-15"),
    registrationEndDate: new Date("2026-08-17"),
    weightClass: "54kg – 86kg",
    categories: JSON.stringify(["Under 22"]),
    description: "Development tournament focused on Under-22 boxers transitioning from youth to senior level. Coaching feedback sessions included.",
    disclaimer: "Age proof mandatory. Boxers above 22 years as of January 1, 2026 are not eligible.",
    status: "open",
    entryFee: 450,
    isFeatured: false,
    customQuestions: JSON.stringify([
      "How many years of competitive boxing experience do you have?",
      "What are your goals for transitioning from Youth to Senior category?",
    ]),
  },
  {
    name: "NBDABA Annual Grand Prix 2026",
    location: "NSCI Dome, Worli, Mumbai",
    startDate: new Date("2026-12-05"),
    endDate: new Date("2026-12-08"),
    registrationStartDate: new Date("2026-10-01"),
    registrationEndDate: new Date("2026-11-25"),
    weightClass: "All Categories",
    categories: JSON.stringify(["Sub-Junior (Under 14)", "Junior (Under 17)", "Youth (Under 19)", "Under 22", "Elite (Senior)", "Masters (35+)"]),
    description: "The flagship annual event of NBDABA featuring all age categories. Best boxers of the year award presented at the closing ceremony.",
    disclaimer: "Participation limited to boxers with active NBDABA membership valid through December 2026. Entry fee is non-refundable after registration closes.",
    status: "open",
    entryFee: 800,
    isFeatured: false,
    customQuestions: JSON.stringify([
      "Which age category are you entering (Sub-Junior / Junior / Youth / Under-22 / Senior / Masters)?",
      "Have you participated in the NBDABA Grand Prix in any previous year? If yes, what was your best result?",
      "Do you have a T-shirt size preference for the event kit? (XS / S / M / L / XL / XXL)",
      "Any dietary requirements or special accommodation needs for the event days?",
    ]),
  },
  {
    name: "North Bombay Women's Boxing Championship 2027",
    location: "Borivali Indoor Stadium, Mumbai",
    startDate: new Date("2027-02-14"),
    endDate: new Date("2027-02-16"),
    registrationStartDate: new Date("2027-01-05"),
    registrationEndDate: new Date("2027-02-08"),
    weightClass: "48kg – 81kg",
    categories: JSON.stringify(["Junior (Under 17)", "Youth (Under 19)", "Under 22", "Elite (Senior)"]),
    description: "Dedicated women's boxing championship organised by NBDABA to promote and celebrate female boxing talent across North Bombay. Cash prizes and trophies for gold and silver medalists in each weight category.",
    disclaimer: "Only female boxers with valid NBDABA membership are eligible. Medical fitness certificate issued within 60 days of the event is mandatory. Entry fee is non-refundable.",
    status: "open",
    entryFee: 500,
    isFeatured: true,
    customQuestions: JSON.stringify([
      "Which weight category are you competing in (e.g. 48kg, 52kg, 57kg, 63kg, 70kg, 75kg, 81kg)?",
      "Have you competed in any women's boxing tournament at district or state level before? If yes, please mention the event name and year.",
      "Do you have a valid BFI or NSRS registration? If yes, please provide your registration number.",
      "Name and contact number of your current boxing coach.",
      "Do you have any existing injuries or medical conditions we should be aware of?",
    ]),
  },
];

async function main() {
  console.log("Seeding 11 tournaments...");

  for (const t of tournaments) {
    await prisma.tournament.create({ data: t });
    console.log("✅ Created:", t.name);
  }

  console.log("\nDone. 11 tournaments seeded.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
