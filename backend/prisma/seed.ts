import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DOCTORS = [
  { firstName: 'Nimal',    lastName: 'Perera',          email: 'nimal.perera@hospital.local',      phone: '+94771000001', slmc: 'SLMC-20145', specId: 1,  desc: 'Senior Cardiologist with 15 years of experience in interventional cardiology.' },
  { firstName: 'Kumari',   lastName: 'Fernando',        email: 'kumari.fernando@hospital.local',   phone: '+94771000002', slmc: 'SLMC-20278', specId: 2,  desc: 'Consultant Dermatologist specializing in clinical and cosmetic dermatology.' },
  { firstName: 'Ruwan',    lastName: 'Jayasinghe',      email: 'ruwan.jayasinghe@hospital.local',  phone: '+94771000003', slmc: 'SLMC-19832', specId: 3,  desc: 'Orthopedic Surgeon with expertise in joint replacement and sports injuries.' },
  { firstName: 'Sanduni',  lastName: 'Wickramasinghe',  email: 'sanduni.w@hospital.local',         phone: '+94771000004', slmc: 'SLMC-21056', specId: 4,  desc: 'Pediatrician dedicated to child healthcare and developmental medicine.' },
  { firstName: 'Dilani',   lastName: 'Rajapaksa',       email: 'dilani.rajapaksa@hospital.local',  phone: '+94771000005', slmc: 'SLMC-20489', specId: 5,  desc: 'Obstetrician and Gynecologist with a focus on high-risk pregnancies.' },
  { firstName: 'Prasad',   lastName: 'De Silva',        email: 'prasad.desilva@hospital.local',    phone: '+94771000006', slmc: 'SLMC-19654', specId: 6,  desc: 'General Surgeon experienced in laparoscopic and minimally invasive procedures.' },
  { firstName: 'Chaminda', lastName: 'Bandara',         email: 'chaminda.bandara@hospital.local',  phone: '+94771000007', slmc: 'SLMC-20712', specId: 7,  desc: 'Neurologist specializing in stroke management and epilepsy.' },
  { firstName: 'Anusha',   lastName: 'Gunawardena',     email: 'anusha.g@hospital.local',          phone: '+94771000008', slmc: 'SLMC-21198', specId: 8,  desc: 'Consultant Psychiatrist focused on anxiety, depression, and stress disorders.' },
  { firstName: 'Kamal',    lastName: 'Dissanayake',     email: 'kamal.dissanayake@hospital.local', phone: '+94771000009', slmc: 'SLMC-20923', specId: 9,  desc: 'Endocrinologist managing diabetes, thyroid, and hormonal disorders.' },
  { firstName: 'Sunethra', lastName: 'Amarasekara',     email: 'sunethra.a@hospital.local',        phone: '+94771000010', slmc: 'SLMC-19401', specId: 10, desc: 'General Practitioner with 20 years of community healthcare experience.' },
];

async function main() {
  // --- Admin ---
  const adminEmail = 'admin@hospital.local';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const adminHash = await argon2.hash('ChangeMe123!');
    await prisma.user.create({
      data: {
        firstName: 'System',
        lastName: 'Administrator',
        email: adminEmail,
        phone: '+10000000000',
        passwordHash: adminHash,
        role: 'ADMIN',
        status: 'ACTIVE',
        isConfirmed: true,
      },
    });
  }

  // --- Doctors ---
  const doctorHash = await argon2.hash('Doctor123!');

  for (const doc of DOCTORS) {
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {},
      create: {
        firstName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
        phone: doc.phone,
        passwordHash: doctorHash,
        role: 'DOCTOR',
        status: 'ACTIVE',
        isConfirmed: true,
      },
    });

    await prisma.doctor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        fullName: `Dr. ${doc.firstName} ${doc.lastName}`,
        slmcNumber: doc.slmc,
        specializationId: doc.specId,
        phone: doc.phone,
        email: doc.email,
        description: doc.desc,
      },
    });
  }
}

main()
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
