-- CreateTable
CREATE TABLE "PlacementProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resumeUrl" TEXT,
    "skills" TEXT,
    "cgpa" DOUBLE PRECISION,
    "branch" "Branch",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlacementProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlacementProfile_userId_key" ON "PlacementProfile"("userId");

-- CreateIndex
CREATE INDEX "PlacementProfile_userId_idx" ON "PlacementProfile"("userId");

-- AddForeignKey
ALTER TABLE "PlacementProfile" ADD CONSTRAINT "PlacementProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
