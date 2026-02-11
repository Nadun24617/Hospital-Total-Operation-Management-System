-- CreateTable
CREATE TABLE `Doctor` (
    `doctor_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(36) NOT NULL,
    `full_name` VARCHAR(150) NOT NULL,
    `slmc_number` VARCHAR(50) NOT NULL,
    `specialization_id` INTEGER NOT NULL,
    `phone` VARCHAR(20) NULL,
    `email` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `joined_date` DATE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Doctor_user_id_key`(`user_id`),
    UNIQUE INDEX `Doctor_slmc_number_key`(`slmc_number`),
    PRIMARY KEY (`doctor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `appointment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `doctor_id` INTEGER NOT NULL,
    `user_id` VARCHAR(36) NULL,
    `patient_name` VARCHAR(150) NOT NULL,
    `contact_number` VARCHAR(20) NOT NULL,
    `reason` TEXT NULL,
    `appointment_type` VARCHAR(50) NOT NULL,
    `date` DATE NOT NULL,
    `time_slot` VARCHAR(10) NOT NULL,
    `queue_number` INTEGER NOT NULL,
    `status` ENUM('UPCOMING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'UPCOMING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`appointment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
