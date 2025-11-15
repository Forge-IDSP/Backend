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

  // const employersData = [
  //   /* ---------------------- ELECTRICIAN ---------------------- */
  //   {
  //     careerName: "electrician",
  //     title: "Pacific Power Electrical Ltd.",
  //     description: "Commercial and light industrial electrical work",
  //     logoUrl: null,
  //     order: 1,
  //   },
  //   {
  //     careerName: "electrician",
  //     title: "BrightWay Electric",
  //     description: "Residential wiring and service upgrades",
  //     logoUrl: null,
  //     order: 2,
  //   },
  //   {
  //     careerName: "electrician",
  //     title: "NorthStar Electric Corp.",
  //     description: "Industrial plant maintenance and controls",
  //     logoUrl: null,
  //     order: 3,
  //   },
  //   {
  //     careerName: "electrician",
  //     title: "Vancouver Electrical Services",
  //     description: "Repairs, troubleshooting, and renovations",
  //     logoUrl: null,
  //     order: 4,
  //   },

  //   /* ---------------------- PLUMBER ---------------------- */
  //   {
  //     careerName: "plumber",
  //     title: "FlowWorks Plumbing Ltd.",
  //     description: "Residential plumbing repairs and installs",
  //     logoUrl: null,
  //     order: 1,
  //   },
  //   {
  //     careerName: "plumber",
  //     title: "AquaTech Drain & Pipe",
  //     description: "Drain cleaning and pipe maintenance",
  //     logoUrl: null,
  //     order: 2,
  //   },
  //   {
  //     careerName: "plumber",
  //     title: "Coastal Heating & Plumbing",
  //     description: "Boilers, water heaters, and gas fitting",
  //     logoUrl: null,
  //     order: 3,
  //   },
  //   {
  //     careerName: "plumber",
  //     title: "BC Pro Plumbing Services",
  //     description: "Small commercial plumbing support",
  //     logoUrl: null,
  //     order: 4,
  //   },

  //   /* ---------------------- WELDER ---------------------- */
  //   {
  //     careerName: "welder",
  //     title: "Fraser River Welding Works",
  //     description: "Structural steel fabrication",
  //     logoUrl: null,
  //     order: 1,
  //   },
  //   {
  //     careerName: "welder",
  //     title: "MountainSide Metal Fabricators",
  //     description: "Custom metal parts & MIG/TIG welding",
  //     logoUrl: null,
  //     order: 2,
  //   },
  //   {
  //     careerName: "welder",
  //     title: "Burnaby Industrial Welding",
  //     description: "On-site construction welding support",
  //     logoUrl: null,
  //     order: 3,
  //   },
  //   {
  //     careerName: "welder",
  //     title: "Coastline Steel & Welding",
  //     description: "Repair welding and mobile service",
  //     logoUrl: null,
  //     order: 4,
  //   },

  //   /* ---------------------- CARPENTER ---------------------- */
  //   {
  //     careerName: "carpenter",
  //     title: "Evergreen Carpentry Services",
  //     description: "Finish carpentry & interior woodwork",
  //     logoUrl: null,
  //     order: 1,
  //   },
  //   {
  //     careerName: "carpenter",
  //     title: "Pacific Frame & Carpenters",
  //     description: "Framing for homes & townhouses",
  //     logoUrl: null,
  //     order: 2,
  //   },
  //   {
  //     careerName: "carpenter",
  //     title: "Coastal Timber Builders",
  //     description: "Decks, fences, and outdoor structures",
  //     logoUrl: null,
  //     order: 3,
  //   },
  //   {
  //     careerName: "carpenter",
  //     title: "NorthShore Woodcraft",
  //     description: "Custom trim, doors & cabinetry installs",
  //     logoUrl: null,
  //     order: 4,
  //   },

  //   /* ---------------------- HVAC TECHNICIAN ---------------------- */
  //   {
  //     careerName: "HVAC technician",
  //     title: "Lower Mainland HVAC Experts",
  //     description: "Heating and cooling system installs",
  //     logoUrl: null,
  //     order: 1,
  //   },
  //   {
  //     careerName: "HVAC technician",
  //     title: "Northern Air Conditioning & Heating",
  //     description: "Furnace & AC maintenance",
  //     logoUrl: null,
  //     order: 2,
  //   },
  //   {
  //     careerName: "HVAC technician",
  //     title: "BC Climate Control Ltd.",
  //     description: "Commercial HVAC service",
  //     logoUrl: null,
  //     order: 3,
  //   },
  //   {
  //     careerName: "HVAC technician",
  //     title: "WestTech Mechanical",
  //     description: "Ventilation & ducting solutions",
  //     logoUrl: null,
  //     order: 4,
  //   },

  //   /* ---------------------- CABINETMAKER ---------------------- */
  //   {
  //     careerName: "cabinetmaker",
  //     title: "West Coast Cabinetry Works",
  //     description: "Custom kitchen & bathroom cabinets",
  //     logoUrl: null,
  //     order: 1,
  //   },
  //   {
  //     careerName: "cabinetmaker",
  //     title: "Interior Woodworks Design",
  //     description: "Built-in closets and shelving",
  //     logoUrl: null,
  //     order: 2,
  //   },
  //   {
  //     careerName: "cabinetmaker",
  //     title: "BC Custom Millwork",
  //     description: "Commercial millwork and fixtures",
  //     logoUrl: null,
  //     order: 3,
  //   },
  //   {
  //     careerName: "cabinetmaker",
  //     title: "NorthShore Cabinet Studio",
  //     description: "Residential cabinetry and small renos",
  //     logoUrl: null,
  //     order: 4,
  //   },
  // ];

  const employersData = [
    /* ---------------------- POWERLINE TECHNICIAN ---------------------- */ {
      careerName: "powerline technician",
      title: "BC Hydro Line Services",
      description: "Overhead and underground power line work",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "powerline technician",
      title: "Coastline Utility Lines",
      description: "Pole replacements and distribution systems",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "powerline technician",
      title: "North Mountain Linework",
      description: "Storm response and grid repair",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "powerline technician",
      title: "Fraser Valley Power Contractors",
      description: "Substation maintenance support",
      logoUrl: null,
      order: 4,
    },
    {
      careerName: "industrial mechanic",
      title: "Pacific Millwrighting Services",
      description: "Industrial machinery installation and maintenance",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "industrial mechanic",
      title: "Fraser Manufacturing Repairs",
      description: "Conveyor, motors, and mechanical systems",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "industrial mechanic",
      title: "Coastal Precision Millwrights",
      description: "Machine alignment and vibration analysis",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "industrial mechanic",
      title: "Metro Plant Maintenance",
      description: "Factory support and equipment overhaul",
      logoUrl: null,
      order: 4,
    },
    {
      careerName: "refrigeration technician",
      title: "BC Refrigeration Solutions",
      description: "Commercial coolers and freezer repair",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "refrigeration technician",
      title: "NorthShore Cooling Systems",
      description: "HVAC-R maintenance & troubleshooting",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "refrigeration technician",
      title: "Fraser Valley Refrigeration",
      description: "Supermarket refrigeration service",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "refrigeration technician",
      title: "Coastal ColdTech",
      description: "Industrial refrigeration and chillers",
      logoUrl: null,
      order: 4,
    },
    {
      careerName: "bricklayer",
      title: "Stoneworks Masonry Ltd.",
      description: "Brick, block, and stone installation",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "bricklayer",
      title: "Urban Masonry Group",
      description: "Commercial exterior wall systems",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "bricklayer",
      title: "Heritage Masonry BC",
      description: "Restoration and historical building repair",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "bricklayer",
      title: "Coastal Brick & Block",
      description: "Residential masonry and chimneys",
      logoUrl: null,
      order: 4,
    },
    {
      careerName: "construction craft worker",
      title: "BC General Labour Group",
      description: "Construction site support and material handling",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "construction craft worker",
      title: "Fraser Valley Site Services",
      description: "Concrete prep, cleanup, and jobsite tasks",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "construction craft worker",
      title: "Pacific Workforce Contractors",
      description: "Assisting trades on active construction sites",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "construction craft worker",
      title: "Coastal Construction Helpers",
      description: "Tools, safety setup, and general labour",
      logoUrl: null,
      order: 4,
    },
    {
      careerName: "gasfitter",
      title: "BC Gas & Heating Solutions",
      description: "Gas line installs and appliance service",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "gasfitter",
      title: "Coastal Gas Technicians",
      description: "Commercial gas equipment installation",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "gasfitter",
      title: "Northern Gas & Furnace",
      description: "Furnace service and gas safety checks",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "gasfitter",
      title: "Metro Gas Services",
      description: "Gas fitting for renovations and upgrades",
      logoUrl: null,
      order: 4,
    },
    {
      careerName: "power engineer",
      title: "BC Plant Energy Systems",
      description: "Boiler and energy plant operations",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "power engineer",
      title: "Coastal Steam & Power",
      description: "Steam plant monitoring and maintenance",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "power engineer",
      title: "Metro Energy Operations",
      description: "Building energy systems & controls",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "power engineer",
      title: "Northern Industrial Power",
      description: "Large facility energy management",
      logoUrl: null,
      order: 4,
    },
    {
      careerName: "pipe fitter",
      title: "Fraser Mechanical Piping",
      description: "Industrial pipe installation and repair",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "pipe fitter",
      title: "Coastal Steam & Piping",
      description: "High-pressure steam systems",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "pipe fitter",
      title: "Pacific Piping Contractors",
      description: "Commercial mechanical piping",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "pipe fitter",
      title: "Metro Industrial Pipeworks",
      description: "Plant piping upgrades & maintenance",
      logoUrl: null,
      order: 4,
    },
    {
      careerName: "glazier",
      title: "Coastal Glass & Installations",
      description: "Residential and commercial window installations",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "glazier",
      title: "Pacific Aluminum & Glass",
      description: "Curtain wall and storefront fabrication",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "glazier",
      title: "Skyline Glassworks",
      description: "Skylights, glass walls, and architectural glazing",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "glazier",
      title: "Downtown Window Services",
      description: "Glass repair and replacement",
      logoUrl: null,
      order: 4,
    },
    {
      careerName: "residential electrician",
      title: "BrightWay Electric",
      description: "Homes, renovations, EV chargers, service upgrades",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "residential electrician",
      title: "HomeSafe Electrical Ltd.",
      description: "Lighting upgrades, panel changes, troubleshooting",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "residential electrician",
      title: "Coastal Home Wiring",
      description: "New home construction and basement suite wiring",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "residential electrician",
      title: "Evergreen Residential Electric",
      description: "Smart home installs, heating controls, renovations",
      logoUrl: null,
      order: 4,
    },
    {
      careerName: "commercial electrician",
      title: "Pacific Power Electrical Ltd.",
      description: "Commercial lighting, HVAC electrical, fire alarm",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "commercial electrician",
      title: "Metro Commercial Electric",
      description: "Restaurants, offices, retail electrical installs",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "commercial electrician",
      title: "Fraser Valley Electrical Group",
      description: "Tenant improvements and building maintenance",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "commercial electrician",
      title: "WestCoast Business Electric",
      description: "Data wiring, lighting upgrades, control systems",
      logoUrl: null,
      order: 4,
    },
    {
      careerName: "industrial electrician",
      title: "NorthStar Electric Corp.",
      description: "Plant maintenance, motors, controls, automation",
      logoUrl: null,
      order: 1,
    },
    {
      careerName: "industrial electrician",
      title: "BC Industrial Power Systems",
      description: "Large machinery troubleshooting and PLC support",
      logoUrl: null,
      order: 2,
    },
    {
      careerName: "industrial electrician",
      title: "Coastal Mill Electrical Services",
      description: "Industrial shutdowns, conveyor systems, drives",
      logoUrl: null,
      order: 3,
    },
    {
      careerName: "industrial electrician",
      title: "Fraser Industrial Controls Ltd.",
      description: "Industrial wiring, automation, and safety systems",
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
