import { Metadata } from "next";
import {
  BookOpen,
  GraduationCap,
  Target,
  Rocket,
  Users,
  Award,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About | BTech Career Hub",
  description:
    "Learn more about BTech Career Hub and how it helps engineering students prepare for careers, placements, and higher studies.",
};

const features = [
  {
    icon: GraduationCap,
    title: "Career Roadmaps",
    description:
      "Step-by-step guidance for placements, GATE, CAT, UPSC, GRE, higher studies, and government exams.",
  },
  {
    icon: BookOpen,
    title: "Learning Resources",
    description:
      "Curated notes, books, PDFs, PYQs, formula sheets, and video lectures in one place.",
  },
  {
    icon: Award,
    title: "Exam Information",
    description:
      "Complete details about eligibility, syllabus, exam pattern, cutoffs, FAQs, and preparation strategy.",
  },
  {
    icon: Rocket,
    title: "Progress Tracking",
    description:
      "Track your goals, roadmap progress, and stay motivated throughout your preparation.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b">
        <div className="container mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <span className="rounded-full border px-4 py-1 text-sm font-medium text-primary">
              About BTech Career Hub
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
              One Platform for Every Engineering Student
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-8">
              BTech Career Hub is an all-in-one platform built to simplify the
              journey of engineering students. Whether you're preparing for
              campus placements, government exams, GATE, CAT, GRE, higher
              studies, or exploring career opportunities, everything you need
              is available in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Target className="mb-5 h-12 w-12 text-primary" />

            <h2 className="text-3xl font-bold">
              Our Mission
            </h2>

            <p className="mt-5 text-muted-foreground leading-8">
              Engineering students often struggle to find reliable information,
              preparation resources, and career guidance scattered across
              multiple websites. Our mission is to bring everything together
              into a single, organized platform that saves time and improves
              learning.
            </p>
          </div>

          <div>
            <Users className="mb-5 h-12 w-12 text-primary" />

            <h2 className="text-3xl font-bold">
              Who Is It For?
            </h2>

            <ul className="mt-5 space-y-3 text-muted-foreground">
              <li>• B.Tech Students</li>
              <li>• Diploma Students</li>
              <li>• Placement Aspirants</li>
              <li>• GATE & Government Exam Aspirants</li>
              <li>• Higher Studies Aspirants</li>
              <li>• Anyone planning their engineering career</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold">
            What You'll Find
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border bg-background p-6 shadow-sm transition hover:shadow-md"
                >
                  <Icon className="mb-4 h-10 w-10 text-primary" />

                  <h3 className="text-xl font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-muted-foreground leading-7">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="container mx-auto max-w-5xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">
          Our Vision
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          We aim to become the most trusted career guidance platform for
          engineering students by providing authentic resources, structured
          preparation paths, and personalized learning experiences that help
          students achieve their career goals with confidence.
        </p>
      </section>
    </main>
  );
}