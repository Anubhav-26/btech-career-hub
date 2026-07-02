import { prisma } from "@/lib/prisma";
import type { Branch, ResourceType } from "@prisma/client";
import type { ResourceCardItem } from "@/types";

const TYPE_LABEL: Record<ResourceType, string> = {
  NOTES: "Notes",
  FORMULA_SHEET: "Formula Sheet",
  BOOK: "Book",
  PDF: "PDF",
  LINK: "Link",
};

/** Maps a Resource row (with its exam relation selected) to the card shape */
export function toResourceCardItem(r: {
  id: string;
  title: string;
  subject: string;
  type: ResourceType;
  branch: Branch | null;
  exam: { slug: string; shortTitle: string };
}): ResourceCardItem {
  return {
    id: r.id,
    kind: "RESOURCE",
    title: r.title,
    subtitle: r.subject,
    badgeLabel: TYPE_LABEL[r.type],
    href: (r as any).fileUrl,
    examShortTitle: r.exam.shortTitle,
    branch: r.branch,
  };
}

export interface ResourceFilters {
  examSlug?: string;
  branch?: Branch;
  subject?: string;
  type?: ResourceType;
  page: number;
  pageSize: number;
}

export async function listResources(filters: ResourceFilters) {
  const where = {
    branch: filters.branch,
    subject: filters.subject
      ? { contains: filters.subject, mode: "insensitive" as const }
      : undefined,
    type: filters.type,
    exam: filters.examSlug ? { slug: filters.examSlug } : undefined,
  };

  const [items, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      include: {
        exam: {
          select: {
            slug: true,
            shortTitle: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
    }),
    prisma.resource.count({ where }),
  ]);

  return {
    items,
    total,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

export function toPyqCardItem(p: {
  id: string;
  year: number;
  session: string | null;
  subject: string | null;
  hasSolution: boolean;
  exam: { slug: string; shortTitle: string };
}): ResourceCardItem {
  return {
    id: p.id,
    kind: "PYQ",
    title: `${p.exam.shortTitle} ${p.year}${
      p.session ? ` — ${p.session}` : ""
    }`,
    subtitle: p.hasSolution ? "With solutions" : "Question paper",
    badgeLabel: "PYQ",
    href: `/exam/${p.exam.slug}?tab=pyqs`,
    examShortTitle: p.exam.shortTitle,
  };
}

/* ===========================
   VIDEO CARD
=========================== */

export function toVideoCardItem(v: {
  id: string;
  title: string;
  youtubeId: string;
  channel: string;
  exam: { slug: string; shortTitle: string };
}): ResourceCardItem {
  return {
    id: v.id,
    kind: "VIDEO",
    title: v.title,
    subtitle: v.channel,
    badgeLabel: "Video",

    // 👇 Direct YouTube link
    href: `https://www.youtube.com/watch?v=${v.youtubeId}`,

    examShortTitle: v.exam.shortTitle,
  };
}

export async function listPyqs(filters: {
  examSlug?: string;
  year?: number;
  subject?: string;
}) {
  return prisma.pYQ.findMany({
    where: {
      year: filters.year,
      subject: filters.subject,
      exam: filters.examSlug
        ? {
            slug: filters.examSlug,
          }
        : undefined,
    },
    include: {
      exam: {
        select: {
          slug: true,
          shortTitle: true,
        },
      },
    },
    orderBy: {
      year: "desc",
    },
  });
}

export async function listVideos(filters: {
  examSlug?: string;
  subject?: string;
}) {
  return prisma.video.findMany({
    where: {
      subject: filters.subject,
      exam: filters.examSlug
        ? {
            slug: filters.examSlug,
          }
        : undefined,
    },
    include: {
      exam: {
        select: {
          slug: true,
          shortTitle: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCompanyBySlug(slug: string) {
  return prisma.company.findUnique({
    where: { slug },
    include: {
      exams: {
        include: {
          exam: {
            select: {
              slug: true,
              shortTitle: true,
            },
          },
        },
      },
    },
  });
}

export async function listCompanies(filters: {
  companyType?: "PSU" | "PLACEMENT";
  examSlug?: string;
}) {
  return prisma.company.findMany({
    where: {
      companyType: filters.companyType,
      exams: filters.examSlug
        ? {
            some: {
              exam: {
                slug: filters.examSlug,
              },
            },
          }
        : undefined,
    },
    orderBy: {
      name: "asc",
    },
  });
}