-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Branch" ADD VALUE 'AI';
ALTER TYPE "Branch" ADD VALUE 'AIDS';
ALTER TYPE "Branch" ADD VALUE 'AIML';
ALTER TYPE "Branch" ADD VALUE 'CSBS';
ALTER TYPE "Branch" ADD VALUE 'EEE';
ALTER TYPE "Branch" ADD VALUE 'ENTC';
ALTER TYPE "Branch" ADD VALUE 'EIE';
ALTER TYPE "Branch" ADD VALUE 'CIVIL';
ALTER TYPE "Branch" ADD VALUE 'PRODUCTION';
ALTER TYPE "Branch" ADD VALUE 'INDUSTRIAL';
ALTER TYPE "Branch" ADD VALUE 'MANUFACTURING';
ALTER TYPE "Branch" ADD VALUE 'INSTRUMENTATION';
ALTER TYPE "Branch" ADD VALUE 'METALLURGY';
ALTER TYPE "Branch" ADD VALUE 'MINING';
ALTER TYPE "Branch" ADD VALUE 'PETROLEUM';
ALTER TYPE "Branch" ADD VALUE 'AEROSPACE';
ALTER TYPE "Branch" ADD VALUE 'AUTOMOBILE';
ALTER TYPE "Branch" ADD VALUE 'BIOTECHNOLOGY';
ALTER TYPE "Branch" ADD VALUE 'FOOD_TECHNOLOGY';
ALTER TYPE "Branch" ADD VALUE 'TEXTILE';
ALTER TYPE "Branch" ADD VALUE 'MCA';
