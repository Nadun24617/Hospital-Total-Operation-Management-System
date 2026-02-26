-- CreateTable
CREATE TABLE `LabRequest` (
    `lab_request_id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(32) NOT NULL,
    `doctor_user_id` VARCHAR(36) NOT NULL,
    `patient_user_id` VARCHAR(36) NULL,
    `technician_user_id` VARCHAR(36) NULL,
    `appointment_id` INTEGER NULL,
    `patient_name` VARCHAR(150) NOT NULL,
    `status` ENUM('PENDING', 'SAMPLE_COLLECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `technician_name` VARCHAR(150) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sample_collected_at` DATETIME(3) NULL,
    `completed_at` DATETIME(3) NULL,

    UNIQUE INDEX `LabRequest_code_key`(`code`),
    INDEX `LabRequest_doctor_user_id_idx`(`doctor_user_id`),
    INDEX `LabRequest_patient_user_id_idx`(`patient_user_id`),
    INDEX `LabRequest_appointment_id_idx`(`appointment_id`),
    INDEX `LabRequest_status_idx`(`status`),
    PRIMARY KEY (`lab_request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LabRequestTest` (
    `lab_request_test_id` INTEGER NOT NULL AUTO_INCREMENT,
    `lab_request_id` INTEGER NOT NULL,
    `test_name` VARCHAR(120) NOT NULL,
    `result_value` VARCHAR(100) NULL,
    `result_remarks` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `LabRequestTest_lab_request_id_idx`(`lab_request_id`),
    UNIQUE INDEX `LabRequestTest_lab_request_id_test_name_key`(`lab_request_id`, `test_name`),
    PRIMARY KEY (`lab_request_test_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LabRequest` ADD CONSTRAINT `LabRequest_doctor_user_id_fkey` FOREIGN KEY (`doctor_user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LabRequest` ADD CONSTRAINT `LabRequest_patient_user_id_fkey` FOREIGN KEY (`patient_user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LabRequest` ADD CONSTRAINT `LabRequest_technician_user_id_fkey` FOREIGN KEY (`technician_user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LabRequest` ADD CONSTRAINT `LabRequest_appointment_id_fkey` FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`appointment_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LabRequestTest` ADD CONSTRAINT `LabRequestTest_lab_request_id_fkey` FOREIGN KEY (`lab_request_id`) REFERENCES `LabRequest`(`lab_request_id`) ON DELETE CASCADE ON UPDATE CASCADE;
