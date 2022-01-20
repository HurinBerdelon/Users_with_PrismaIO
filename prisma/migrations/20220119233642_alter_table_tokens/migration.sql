/*
  Warnings:

  - You are about to drop the column `name` on the `Tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[value]` on the table `Tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tokens_name_key";

-- AlterTable
ALTER TABLE "Tokens" DROP COLUMN "name",
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_value_key" ON "Tokens"("value");
