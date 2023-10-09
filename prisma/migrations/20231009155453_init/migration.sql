/*
  Warnings:

  - You are about to drop the `orderMenu` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `orderMenu` DROP FOREIGN KEY `orderMenu_menuId_fkey`;

-- DropForeignKey
ALTER TABLE `orderMenu` DROP FOREIGN KEY `orderMenu_orderId_fkey`;

-- DropTable
DROP TABLE `orderMenu`;

-- CreateTable
CREATE TABLE `OrderMenu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `menuId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderMenu` ADD CONSTRAINT `OrderMenu_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderMenu` ADD CONSTRAINT `OrderMenu_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
