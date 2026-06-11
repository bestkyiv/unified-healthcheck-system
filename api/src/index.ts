import { prisma } from './lib/prisma';
import { buildApp } from './app.js';

const registerShutdownHandlers = () => {
  const shutdown = async () => {
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

registerShutdownHandlers();

export default await buildApp();
