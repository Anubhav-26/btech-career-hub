import { prisma } from "@/lib/prisma";
import { ResourceUploadForm } from "@/components/admin/ResourceUploadForm";
import { DeleteResourceButton } from "@/components/admin/DeleteResourceButton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditVideoModal } from "@/components/admin/EditVideoModal";
import { DeleteVideoButton } from "@/components/admin/DeleteVideoButton";
import { EditResourceModal } from "@/components/admin/EditResourceModal";
import {
  Search,
  Eye,
  FileText,
  Video,
  FolderOpen,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const [exams, resources, videos, totalResources] = await Promise.all([
    prisma.exam.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        shortTitle: true,
      },
      orderBy: {
        shortTitle: "asc",
      },
    }),

    prisma.resource.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
      include: {
        exam: {
          select: {
            shortTitle: true,
          },
        },
      },
    }),

    // ✅ ADD THIS
    prisma.video.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        exam: {
          select: {
            shortTitle: true,
          },
        },
      },
    }),

    prisma.resource.count(),
  ]);

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Resource Management
          </h1>

          <p className="text-sm text-muted-foreground">
            Upload and manage notes, books, folders, videos and PYQs.
          </p>
        </div>

        <Badge className="text-sm px-4 py-2">
          {totalResources} Resources
        </Badge>
      </div>

      {/* STATS */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-lg border p-5">
          <FileText className="mb-2 h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            Total Resources
          </p>
          <p className="text-3xl font-bold">
            {totalResources}
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <FolderOpen className="mb-2 h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            Active Exams
          </p>
          <p className="text-3xl font-bold">
            {exams.length}
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <Video className="mb-2 h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            Showing
          </p>
          <p className="text-3xl font-bold">
            {resources.length}
          </p>
        </div>

      </div>

      {/* MAIN GRID */}

      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">

        {/* LEFT */}

        <ResourceUploadForm exams={exams} />

        {/* RIGHT */}

        <div className="space-y-4">

          <div className="flex items-center justify-between">

            <h2 className="text-lg font-semibold">
              Uploaded Resources
            </h2>

            <div className="relative w-72">

              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search resources..."
                className="pl-9"
              />

            </div>

          </div>

          <div className="overflow-x-auto rounded-xl border">

            <table className="w-full text-sm">

              <thead className="bg-muted/40">

                <tr>

                  <th className="px-4 py-3 text-left">
                    Resource
                  </th>

                  <th className="px-4 py-3 text-left">
                    Exam
                  </th>

                  <th className="px-4 py-3 text-left">
                    Type
                  </th>

                  <th className="px-4 py-3 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {resources.map((r) => (

                  <tr
                    key={r.id}
                    className="border-t"
                  >

                    <td className="px-4 py-4">

                      <p className="font-medium">
                        {r.title}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {r.subject}
                      </p>

                    </td>

                    <td className="px-4">

                      {r.exam.shortTitle}

                    </td>

                    <td className="px-4">

                      <Badge variant="outline">
                        {r.type.replace("_", " ")}
                      </Badge>

                    </td>

                    <td className="px-4">

                      <div className="flex justify-end gap-2">

                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                        >
                          <a
                            href={r.fileUrl}
                            target="_blank"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>

                        <EditResourceModal
                       resource={{
                         id: r.id,
                        title: r.title,
                        subject: r.subject,
                        type: r.type,
                         branch: r.branch,
                            }}
                           />

                        <DeleteResourceButton
                          id={r.id}
                        />

                      </div>

                    </td>

                  </tr>

                ))}

                {resources.length === 0 && (

                  <tr>

                    <td
                      colSpan={4}
                      className="py-16 text-center text-muted-foreground"
                    >
                      No resources uploaded yet.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-semibold">
             Uploaded Videos
           </h2>

<div className="overflow-x-auto rounded-xl border">

  <table className="w-full text-sm">

    <thead className="bg-muted/40">
      <tr>
        <th className="px-4 py-3 text-left">Thumbnail</th>
        <th className="px-4 py-3 text-left">Title</th>
        <th className="px-4 py-3 text-left">Channel</th>
        <th className="px-4 py-3 text-left">Exam</th>
        <th className="px-4 py-3 text-right">Actions</th>
      </tr>
    </thead>

    <tbody>

      {videos.map((video) => (

        <tr
          key={video.id}
          className="border-t"
        >

          <td className="px-4 py-3">

            <img
              src={video.thumbnailUrl ?? ""}
              alt={video.title}
              className="h-16 w-28 rounded object-cover"
            />

          </td>

          <td className="px-4 py-3">

            <p className="font-medium">
              {video.title}
            </p>

            <p className="text-xs text-muted-foreground">
              {video.subject ?? "-"}
            </p>

          </td>

          <td className="px-4">
            {video.channel}
          </td>

          <td className="px-4">
            {video.exam.shortTitle}
          </td>

          <td className="px-4">

            <div className="flex justify-end gap-2">

              <div className="flex justify-end gap-2">

  <Button
    variant="outline"
    size="icon"
    asChild
  >
    <a
      href={
  video.playlistId
    ? `https://www.youtube.com/playlist?list=${video.playlistId}`
    : `https://www.youtube.com/watch?v=${video.youtubeId}`
}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Eye className="h-4 w-4" />
    </a>
  </Button>

  <EditVideoModal
  video={{
    id: video.id,
    title: video.title,
    youtubeId: video.youtubeId,
    playlistId: video.playlistId,
    channel: video.channel,
    subject: video.subject,
  }}
/>

  <DeleteVideoButton id={video.id} />

</div>
            </div>

          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>
</div>
        </div>

      </div>

    </div>
  );
}