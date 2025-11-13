// scripts/seedInDemand.ts
// got seed data from chatGPT
import "dotenv/config";
import { db, schema } from "../db/client.ts";

async function seed() {
  console.log("⚡ Seeding...");

  // const jobsData = [
  //   // ───────────────────────────────────────────────
  //   {
  //     title: "Electrician",
  //     description:
  //       "Electricians install, maintain, and repair electrical systems in homes, businesses, and industrial sites.",
  //     icon: "electrician",
  //     dailyRoutines: [
  //       "Inspect and test electrical systems",
  //       "Install new wiring and lighting fixtures",
  //       "Read and interpret blueprints",
  //       "Troubleshoot and repair electrical issues",
  //     ],
  //     skills: [
  //       { skill: "Blueprint Reading", priority: "Essential" },
  //       { skill: "Problem Solving", priority: "Essential" },
  //       { skill: "Communication", priority: "Important" },
  //     ],
  //     career: [
  //       {
  //         level: "Apprentice",
  //         description:
  //           "Start learning the trade under supervision while completing your technical training.",
  //         minIncome: 35000,
  //         income: 42000,
  //         year: "1–2 years",
  //         trainingRequired: "Level 1–2 Technical Training",
  //         trainingYear: "Year 1–2",
  //       },
  //       {
  //         level: "Journeyperson",
  //         description:
  //           "Work independently on a variety of projects with a Red Seal qualification.",
  //         minIncome: 60000,
  //         income: 75000,
  //         year: "3–5 years",
  //         trainingRequired: "Level 3–4 Technical Training + Red Seal Exam",
  //         trainingYear: "Year 3–5",
  //       },
  //       {
  //         level: "Master",
  //         description:
  //           "Run your own business, supervise apprentices, or specialize in industrial systems.",
  //         minIncome: 85000,
  //         income: 110000,
  //         year: "6+ years",
  //         trainingRequired: "Master Electrician Certification (optional)",
  //         trainingYear: "Year 6+",
  //       },
  //     ],
  //   },

  //   // ───────────────────────────────────────────────
  //   {
  //     title: "Plumber",
  //     description:
  //       "Plumbers install, repair, and maintain water, drainage, and gas piping systems in residential and commercial buildings.",
  //     icon: "plumber",
  //     dailyRoutines: [
  //       "Install and maintain plumbing systems",
  //       "Repair leaks and blockages",
  //       "Read blueprints and building specifications",
  //       "Test systems for leaks and compliance",
  //     ],
  //     skills: [
  //       { skill: "Pipe Installation", priority: "Essential" },
  //       { skill: "System Diagnostics", priority: "Essential" },
  //       { skill: "Blueprint Reading", priority: "Important" },
  //     ],
  //     career: [
  //       {
  //         level: "Apprentice",
  //         description:
  //           "Assist licensed plumbers, learn to install fixtures and understand code requirements.",
  //         minIncome: 36000,
  //         income: 45000,
  //         year: "1–2 years",
  //         trainingRequired: "Level 1–2 Technical Training",
  //         trainingYear: "Year 1–2",
  //       },
  //       {
  //         level: "Journeyperson",
  //         description:
  //           "Work independently installing and repairing systems with Red Seal certification.",
  //         minIncome: 58000,
  //         income: 76000,
  //         year: "3–5 years",
  //         trainingRequired: "Level 3–4 Technical Training + Red Seal Exam",
  //         trainingYear: "Year 3–5",
  //       },
  //       {
  //         level: "Master",
  //         description:
  //           "Operate your own business, manage complex installations, or train apprentices.",
  //         minIncome: 85000,
  //         income: 105000,
  //         year: "6+ years",
  //         trainingRequired: "Advanced leadership training (optional)",
  //         trainingYear: "Year 6+",
  //       },
  //     ],
  //   },

  //   // ───────────────────────────────────────────────
  //   {
  //     title: "Welder",
  //     description:
  //       "Welders join metal parts using high heat tools and specialized techniques for manufacturing, construction, and repair work.",
  //     icon: "welder",
  //     dailyRoutines: [
  //       "Read blueprints and determine welding requirements",
  //       "Set up and operate welding equipment",
  //       "Inspect welded surfaces for defects",
  //       "Maintain tools and ensure workplace safety",
  //     ],
  //     skills: [
  //       { skill: "Arc & MIG Welding", priority: "Essential" },
  //       { skill: "Blueprint Reading", priority: "Essential" },
  //       { skill: "Attention to Detail", priority: "Important" },
  //     ],
  //     career: [
  //       {
  //         level: "Apprentice",
  //         description:
  //           "Learn various welding processes and safety protocols under supervision.",
  //         minIncome: 34000,
  //         income: 42000,
  //         year: "1–2 years",
  //         trainingRequired: "Level 1–2 Technical Training",
  //         trainingYear: "Year 1–2",
  //       },
  //       {
  //         level: "Journeyperson",
  //         description:
  //           "Perform structural and fabrication welding independently with Red Seal certification.",
  //         minIncome: 55000,
  //         income: 75000,
  //         year: "3–5 years",
  //         trainingRequired: "Level 3–4 Technical Training + Red Seal Exam",
  //         trainingYear: "Year 3–5",
  //       },
  //       {
  //         level: "Master",
  //         description:
  //           "Specialize in advanced welding (TIG, underwater) or move into inspection and supervision roles.",
  //         minIncome: 85000,
  //         income: 110000,
  //         year: "6+ years",
  //         trainingRequired: "Advanced Certification or Inspection License",
  //         trainingYear: "Year 6+",
  //       },
  //     ],
  //   },
  // ];

  const employersData = [
    /* ---------------------- ELECTRICIAN ---------------------- */
    {
      careerName: "electrician",
      title: "Pacific Power Electrical Ltd.",
      description: "Commercial and light industrial electrical work",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "electrician",
      title: "BrightWay Electric",
      description: "Residential wiring and service upgrades",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "electrician",
      title: "NorthStar Electric Corp.",
      description: "Industrial plant maintenance and controls",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "electrician",
      title: "Vancouver Electrical Services",
      description: "Repairs, troubleshooting, and renovations",
      logoUrl: null,
      order: 4,
    },

    /* ---------------------- PLUMBER ---------------------- */
    {
      careerName: "plumber",
      title: "FlowWorks Plumbing Ltd.",
      description: "Residential plumbing repairs and installs",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "plumber",
      title: "AquaTech Drain & Pipe",
      description: "Drain cleaning and pipe maintenance",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "plumber",
      title: "Coastal Heating & Plumbing",
      description: "Boilers, water heaters, and gas fitting",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "plumber",
      title: "BC Pro Plumbing Services",
      description: "Small commercial plumbing support",
      logoUrl: null,
      order: 4,
    },

    /* ---------------------- WELDER ---------------------- */
    {
      careerName: "welder",
      title: "Fraser River Welding Works",
      description: "Structural steel fabrication",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "welder",
      title: "MountainSide Metal Fabricators",
      description: "Custom metal parts & MIG/TIG welding",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "welder",
      title: "Burnaby Industrial Welding",
      description: "On-site construction welding support",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "welder",
      title: "Coastline Steel & Welding",
      description: "Repair welding and mobile service",
      logoUrl: null,
      order: 4,
    },

    /* ---------------------- CARPENTER ---------------------- */
    {
      careerName: "carpenter",
      title: "Evergreen Carpentry Services",
      description: "Finish carpentry & interior woodwork",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "carpenter",
      title: "Pacific Frame & Carpenters",
      description: "Framing for homes & townhouses",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "carpenter",
      title: "Coastal Timber Builders",
      description: "Decks, fences, and outdoor structures",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "carpenter",
      title: "NorthShore Woodcraft",
      description: "Custom trim, doors & cabinetry installs",
      logoUrl: null,
      order: 4,
    },

    /* ---------------------- HVAC TECHNICIAN ---------------------- */
    {
      careerName: "HVAC technician",
      title: "Lower Mainland HVAC Experts",
      description: "Heating and cooling system installs",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "HVAC technician",
      title: "Northern Air Conditioning & Heating",
      description: "Furnace & AC maintenance",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "HVAC technician",
      title: "BC Climate Control Ltd.",
      description: "Commercial HVAC service",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "HVAC technician",
      title: "WestTech Mechanical",
      description: "Ventilation & ducting solutions",
      logoUrl: null,
      order: 4,
    },

    /* ---------------------- CABINETMAKER ---------------------- */
    {
      careerName: "cabinetmaker",
      title: "West Coast Cabinetry Works",
      description: "Custom kitchen & bathroom cabinets",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "cabinetmaker",
      title: "Interior Woodworks Design",
      description: "Built-in closets and shelving",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "cabinetmaker",
      title: "BC Custom Millwork",
      description: "Commercial millwork and fixtures",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "cabinetmaker",
      title: "NorthShore Cabinet Studio",
      description: "Residential cabinetry and small renos",
      logoUrl: null,
      order: 4,
    },
  ];

  // ───────────────────────────────────────────────
  // Insert each job and its related data
  // for (const job of jobsData) {
  //   const [insertedJob] = await db
  //     .insert(schema.jobs)
  //     .values({
  //       title: job.title,
  //       description: job.description,
  //       icon: job.icon,
  //     })
  //     .returning();

  //   if (!insertedJob) {
  //     console.error(`❌ Failed to insert ${job.title}`);
  //     continue;
  //   }

  //   // Daily routines
  //   await db.insert(schema.dailyRoutines).values(
  //     job.dailyRoutines.map((text) => ({
  //       jobId: insertedJob.id,
  //       text,
  //     }))
  //   );

  //   // Skills
  //   await db.insert(schema.jobSkills).values(
  //     job.skills.map((s) => ({
  //       jobId: insertedJob.id,
  //       skill: s.skill,
  //       priority: s.priority,
  //     }))
  //   );

  //   // Career path
  //   await db.insert(schema.careerPaths).values(
  //     job.career.map((c) => ({
  //       jobId: insertedJob.id,
  //       level: c.level,
  //       description: c.description,
  //       minIncome: c.minIncome,
  //       income: c.income,
  //       year: c.year,
  //       trainingRequired: c.trainingRequired,
  //       trainingYear: c.trainingYear,
  //     }))
  //   );

  //   console.log(`✅ Inserted ${job.title}`);
  // }

  await db.insert(schema.employers).values(employersData);
  console.log("🏢 Employers seeded successfully!");

  // console.log("🎉 All jobs seeded successfully!");
}

seed()
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
