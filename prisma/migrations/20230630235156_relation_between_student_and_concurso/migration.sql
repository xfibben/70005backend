-- CreateTable
CREATE TABLE `Concurso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentOnConcurso` (
    `studentId` INTEGER NOT NULL,
    `concursoId` INTEGER NOT NULL,

    PRIMARY KEY (`studentId`, `concursoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentOnConcurso` ADD CONSTRAINT `StudentOnConcurso_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentOnConcurso` ADD CONSTRAINT `StudentOnConcurso_concursoId_fkey` FOREIGN KEY (`concursoId`) REFERENCES `Concurso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
