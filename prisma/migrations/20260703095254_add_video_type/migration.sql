-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('VIDEO', 'PLAYLIST');

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "videoType" "VideoType" NOT NULL DEFAULT 'VIDEO';

-- CreateIndex
CREATE INDEX "Video_videoType_idx" ON "Video"("videoType");
