-- AlterTable
ALTER TABLE `Concurso` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Prueba` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `concursoId` INTEGER NOT NULL,
    `nota` INTEGER NOT NULL,

    UNIQUE INDEX `Prueba_concursoId_key`(`concursoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentOnPrueba` (
    `studentId` INTEGER NOT NULL,
    `pruebaId` INTEGER NOT NULL,

    PRIMARY KEY (`pruebaId`, `studentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Prueba` ADD CONSTRAINT `Prueba_concursoId_fkey` FOREIGN KEY (`concursoId`) REFERENCES `Concurso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentOnPrueba` ADD CONSTRAINT `StudentOnPrueba_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentOnPrueba` ADD CONSTRAINT `StudentOnPrueba_pruebaId_fkey` FOREIGN KEY (`pruebaId`) REFERENCES `Prueba`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
