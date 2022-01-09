-- AlterTable
ALTER TABLE "User" ALTER COLUMN "emailConfirmed" SET DEFAULT false,
ALTER COLUMN "avatar" DROP NOT NULL;
