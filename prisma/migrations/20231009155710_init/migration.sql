/*
  Warnings:

  - You are about to drop the column `usersId` on the `Orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_usersId_fkey`;

-- AlterTable
ALTER TABLE `Orders` DROP COLUMN `usersId`;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
