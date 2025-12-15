import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@hospital.local';
  const adminPassword = 'ChangeMe123!';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existingAdmin) {
    return;
  }

  const passwordHash = await argon2.hash(adminPassword);

  await prisma.user.create({
    data: {
      firstName: 'System',
      lastName: 'Administrator',
      email: adminEmail,
      phone: '+10000000000',
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });
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
