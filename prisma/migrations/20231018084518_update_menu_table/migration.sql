/*
  Warnings:

  - Added the required column `amounts` to the `OrderMenu` table without a default value. This is not possible if the table is not empty.
  - Made the column `firstName` on table `Users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Menus` MODIFY `status` ENUM('AVAILIABLE', 'UNAVAILABLE') NOT NULL DEFAULT 'AVAILIABLE',
    MODIFY `menuImage` VARCHAR(191) NULL DEFAULT 'https://picsum.photos/200/300';

-- AlterTable
ALTER TABLE `OrderMenu` ADD COLUMN `amounts` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Orders` MODIFY `paymentType` ENUM('CASH', 'QRCODE') NOT NULL DEFAULT 'CASH',
    MODIFY `orderType` ENUM('WALKIN', 'DELIVERY') NOT NULL DEFAULT 'WALKIN',
    MODIFY `status` ENUM('WAITING', 'COMPLETE', 'VOID') NOT NULL DEFAULT 'WAITING';

-- AlterTable
ALTER TABLE `Users` MODIFY `firstName` VARCHAR(191) NOT NULL,
    MODIFY `lastName` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('AVAILIABLE', 'UNAVAILABLE') NOT NULL DEFAULT 'AVAILIABLE',
    MODIFY `role` ENUM('ADMIN', 'STAFF') NOT NULL DEFAULT 'STAFF';
