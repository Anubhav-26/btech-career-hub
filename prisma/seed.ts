import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


async function main() {

  await prisma.fAQ.deleteMany();
  // ---------------------------------------------------------------------
  // GATE CSE
  // ---------------------------------------------------------------------
  const gateCse = await prisma.exam.upsert({
    where: { slug: "gate-cse" },
    update: {},
    create: {
      slug: "gate-cse",
      title: "GATE — Computer Science & Information Technology",
      shortTitle: "GATE CSE",
      category: "GATE",
      branch: "CSE",
      overview:
        "GATE CSE tests core Computer Science and IT fundamentals and is the gateway to M.Tech admissions at IITs/NITs and direct recruitment at PSUs such as BHEL, IOCL, and ONGC.",
      eligibility:
        "Open to final-year B.Tech/B.E. students and graduates in CSE, IT, or a closely related discipline. No age limit. No minimum CGPA requirement to appear.",
      examPattern:
        "Computer-based test, 3 hours, 65 questions, 100 marks. Includes MCQs, MSQs, and Numerical Answer Type questions. 1/3 negative marking on 1-mark MCQs, 2/3 on 2-mark MCQs; no negative marking on MSQs or NAT questions.",
      syllabus:
        "Engineering Mathematics, Digital Logic, Computer Organization & Architecture, Programming & Data Structures, Algorithms, Theory of Computation, Compiler Design, Operating Systems, Databases, Computer Networks.",
      examDate: new Date("2027-02-07"),
      applicationDeadline: new Date("2026-09-26"),
      metadata: { negativeMarking: true, papers: ["CS"], totalMarks: 100, numQuestions: 65 },
      cutoffs: {
        create: [
          { year: 2026, category: "General", value: 28.6, unit: "score" },
          { year: 2026, category: "OBC-NCL", value: 25.7, unit: "score" },
          { year: 2026, category: "SC/ST", value: 19.0, unit: "score" },
          { year: 2025, category: "General", value: 29.2, unit: "score" },
        ],
      },
     faqs: {
        create: [
          { order: 1, question: "Can a 3rd year student appear for GATE?", answer: "Yes — final-year students of B.Tech/B.E. in CSE/IT or related disciplines are eligible to appear for GATE CSE." },
          { order: 2, question: "Is GATE CSE useful without an M.Tech plan?", answer: "Yes — many PSUs (BHEL, IOCL, ONGC, NTPC) hire directly through GATE CSE scores without requiring an M.Tech." },
        ],
      },
    },
  });
  //        ---------------------------------------------------------------------
  // PSU (general track, branch-agnostic)
  // ---------------------------------------------------------------------
  await prisma.exam.upsert({
    where: { slug: "psu" },
    update: {},
    create: {
      slug: "psu",
      title: "PSU Recruitment",
      shortTitle: "PSU",
      category: "PSU",
      overview:
        "Public Sector Undertakings (PSUs) recruit engineering graduates either directly or via GATE scores. This track maps which PSUs hire via which route, their typical packages, and application windows.",
      eligibility:
        "Varies by PSU and branch — most require a valid GATE score in the relevant discipline (within 2-3 years) plus the PSU's own CGPA/percentage cutoff at the recruitment stage.",
      examPattern:
        "Two recruitment routes: (1) GATE-score based shortlisting followed by Group Discussion/Interview, or (2) PSU's own written exam plus interview for direct recruitment drives.",
      syllabus:
        "For the GATE route, the relevant GATE paper's syllabus applies. For direct recruitment, expect core branch subjects plus General Awareness, Reasoning, and English.",
      metadata: { recruitsViaGate: true, directRecruitment: true, typicalPackageLpa: 12 },
      faqs: {
        create: [
          { order: 1, question: "Which PSUs recruit via GATE?", answer: "BHEL, IOCL, ONGC, NTPC, PGCIL, GAIL, NHPC and several others use GATE scores for their primary shortlisting round." },
        ],
      },
    },
  });

  // ---------------------------------------------------------------------
  // CAT
  // ---------------------------------------------------------------------
  await prisma.exam.upsert({
    where: { slug: "cat" },
    update: {},
    create: {
      slug: "cat",
      title: "CAT — Common Admission Test",
      shortTitle: "CAT",
      category: "CAT",
      overview:
        "CAT is the gateway to MBA admission at the IIMs and 1000+ other B-schools. It tests Verbal Ability & Reading Comprehension, Data Interpretation & Logical Reasoning, and Quantitative Ability.",
      eligibility: "A bachelor's degree with at least 50% marks (45% for reserved categories) from a recognized university. Final-year students may also apply.",
      examPattern:
        "Computer-based test, 2 hours (40 minutes per section, non-transferable). 66 questions across 3 sections. +3 for a correct MCQ, -1 for an incorrect MCQ, no negative marking on TITA questions.",
      syllabus: "VARC: reading comprehension, para-jumbles, summary. DILR: data tables, charts, logical puzzles, seating arrangements. QA: arithmetic, algebra, geometry, number systems.",
      examDate: new Date("2026-11-29"),
      applicationDeadline: new Date("2026-09-20"),
      metadata: {
        sectionalCutoffs: true,
        sections: [
          { name: "VARC", weightagePercent: 36 },
          { name: "DILR", weightagePercent: 32 },
          { name: "QA", weightagePercent: 32 },
        ],
        totalMarks: 198,
      },
      cutoffs: {
        create: [
          { year: 2025, category: "IIM A — General", value: 99.5, unit: "percentile" },
          { year: 2025, category: "IIM B — General", value: 99.0, unit: "percentile" },
        ],
      },
    },
  });

  // ---------------------------------------------------------------------
  // Placements
  // ---------------------------------------------------------------------
  const placements = await prisma.exam.upsert({
    where: { slug: "placements" },
    update: {},
    create: {
      slug: "placements",
      title: "Campus Placements",
      shortTitle: "Placements",
      category: "PLACEMENT",
      overview:
        "Everything for on-campus recruitment — a DSA roadmap, resume templates tuned for Indian placement formats, commonly asked interview questions, and company-specific prep guides.",
      eligibility: "Eligibility criteria vary by company and college placement policy — typically a minimum CGPA with no active academic backlogs.",
      examPattern: "Most companies run 3-4 rounds: an online coding/aptitude test, one or two technical interviews, and an HR round. Service-based companies tend to add a group discussion round.",
      syllabus: "Data Structures & Algorithms, Operating Systems, DBMS, Computer Networks, OOP concepts, and one or two projects deep enough to defend in an interview.",
      metadata: { averagePackageLpa: 8.5, topRecruiterCount: 40 },
    },
  });

  const dsaRoadmap = await prisma.roadmap.create({
    data: {
      examId: placements.id,
      title: "DSA Roadmap",
      description: "A sequential path through data structures and algorithms, ordered the way most placement interviews build difficulty.",
      steps: {
        create: [
          { order: 1, title: "Arrays & Strings", description: "Two pointers, sliding window, prefix sums." },
          { order: 2, title: "Recursion & Backtracking", description: "Subsets, permutations, N-Queens style problems." },
          { order: 3, title: "Linked Lists", description: "Reversal, cycle detection, merge operations." },
          { order: 4, title: "Stacks & Queues", description: "Monotonic stacks, queue-based simulations." },
          { order: 5, title: "Trees & Binary Search Trees", description: "Traversals, height/diameter, BST operations." },
          { order: 6, title: "Graphs", description: "BFS/DFS, shortest paths, topological sort." },
          { order: 7, title: "Dynamic Programming", description: "1D/2D DP, knapsack family, string DP." },
          { order: 8, title: "Mock Interviews", description: "Timed practice on a whiteboard or shared doc, not just an IDE." },
        ],
      },
    },
  });
  void dsaRoadmap;

  // ---------------------------------------------------------------------
  // Companies
  // ---------------------------------------------------------------------
  const bhel = await prisma.company.upsert({
    where: { slug: "bhel" },
    update: {},
    create: {
      slug: "bhel",
      name: "Bharat Heavy Electricals Limited (BHEL)",
      companyType: "PSU",
      description: "Recruits engineer trainees primarily through GATE scores across Mechanical, Electrical, and CSE disciplines.",
      website: "https://www.bhel.com",
      recruitsViaGate: true,
      avgPackageLpa: 8.5,
      rolesHiredFor: ["Engineer Trainee"],
    },
  });

  const tcs = await prisma.company.upsert({
    where: { slug: "tcs" },
    update: {},
    create: {
      slug: "tcs",
      name: "Tata Consultancy Services (TCS)",
      companyType: "PLACEMENT",
      description: "One of the largest on-campus recruiters in India, hiring across most engineering branches via TCS NQT.",
      website: "https://www.tcs.com",
      avgPackageLpa: 7,
      rolesHiredFor: ["Assistant System Engineer"],
    },
  });

  await prisma.examCompany.upsert({
    where: { examId_companyId: { examId: gateCse.id, companyId: bhel.id } },
    update: {},
    create: { examId: gateCse.id, companyId: bhel.id },
  });
  await prisma.examCompany.upsert({
    where: { examId_companyId: { examId: placements.id, companyId: tcs.id } },
    update: {},
    create: { examId: placements.id, companyId: tcs.id },
  });

  // ---------------------------------------------------------------------
  // Sample Resources / PYQs / Videos
  // ---------------------------------------------------------------------
  await prisma.resource.createMany({
    data: [
      {
        title: "Operating Systems — Complete Notes",
        type: "NOTES",
        fileUrl: "https://res.cloudinary.com/demo/raw/upload/sample.pdf",
        fileType: "pdf",
        examId: gateCse.id,
        branch: "CSE",
        subject: "Operating Systems",
      },
      {
        title: "GATE CSE Formula & Theorem Sheet",
        type: "FORMULA_SHEET",
        fileUrl: "https://res.cloudinary.com/demo/raw/upload/sample.pdf",
        fileType: "pdf",
        examId: gateCse.id,
        branch: "CSE",
        subject: "Algorithms",
      },
      {
        title: "One-Page Resume Template — Tech Roles",
        type: "PDF",
        fileUrl: "https://res.cloudinary.com/demo/raw/upload/sample.pdf",
        fileType: "pdf",
        examId: placements.id,
        subject: "Resume Templates",
      },
      {
        title: "Top 50 DSA Interview Questions",
        type: "PDF",
        fileUrl: "https://res.cloudinary.com/demo/raw/upload/sample.pdf",
        fileType: "pdf",
        examId: placements.id,
        subject: "Interview Questions — Technical",
      },
    ],
  });

  await prisma.pYQ.createMany({
    data: [
      { examId: gateCse.id, year: 2025, session: "Forenoon", subject: "Algorithms", questionUrl: "https://res.cloudinary.com/demo/raw/upload/sample.pdf", hasSolution: false },
      { examId: gateCse.id, year: 2024, session: "Forenoon", subject: "Operating Systems", questionUrl: "https://res.cloudinary.com/demo/raw/upload/sample.pdf", solutionUrl: "https://res.cloudinary.com/demo/raw/upload/sample.pdf", hasSolution: true },
    ],
  });

  await prisma.video.create({
    data: {
      examId: gateCse.id,
      title: "Operating Systems Crash Course for GATE CSE",
      youtubeId: "dQw4w9WgXcQ",
      channel: "GATE Prep Channel",
      subject: "Operating Systems",
      thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    },
  });

  console.log("Seed complete:", { gateCse: gateCse.slug, placements: placements.slug, companies: [bhel.slug, tcs.slug] });

  // ── Phase 1 Seed Data ──────────────────────────────────────────────────────

  // Exam Countdowns (admin-created, visible to all)
  await prisma.examCountdown.deleteMany();
  await prisma.examCountdown.createMany({
    data: [
      { title: "GATE 2027", examDate: new Date("2027-02-07"), category: "GATE", description: "Graduate Aptitude Test in Engineering", isActive: true, isPinnable: true },
      { title: "CAT 2026", examDate: new Date("2026-11-29"), category: "CAT", description: "Common Admission Test for IIMs", isActive: true, isPinnable: true },
      { title: "GATE Application Deadline", examDate: new Date("2026-09-26"), category: "GATE", description: "Last date to apply for GATE 2027", isActive: true, isPinnable: true },
      { title: "Campus Placement Season", examDate: new Date("2026-08-01"), category: "PLACEMENT", description: "On-campus recruitment season begins", isActive: true, isPinnable: true },
    ],
    skipDuplicates: true,
  });

  console.log("Phase 1 seed complete: countdowns created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
