import bcrypt from 'bcrypt';
import { prismaClient } from '../../src/app/database.js';
async function main() {
  const hashedPassword = await bcrypt.hash('Rahasia123', 10);
  await prismaClient.user.createMany({
    data: [
      {
        name: 'Ahmad Ilham',
        email: 'angilham2@gmail.com',
        password: hashedPassword,
      },
      {
        name: 'Jude Bellingham',
        email: 'judebell@gmail.com',
        password: hashedPassword,
      },
    ],
  });

  console.log('Successfully seeding');
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
