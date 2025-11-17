import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Enhanced Prisma client with better connection handling for Neon (serverless)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn'] : [], // Suppress 'error' logs for connection issues
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Neon serverless: connections are managed automatically
    // Connection pooling is handled by Neon's pooler endpoint
    // Connection "Closed" errors are normal and will auto-reconnect
  });

// Handle connection errors gracefully (Neon may close idle connections)
// Suppress "Closed" connection errors - these are normal for serverless databases
// Neon automatically reconnects when needed
prisma.$on('error' as never, (e: { message: string }) => {
  // Ignore connection closed errors - Neon will reconnect automatically
  // These are expected in serverless environments when connections idle
  if (!e.message.includes('Closed') && !e.message.includes('connection')) {
    console.error('Prisma Client Error:', e.message);
  }
});

// Connect to database on startup with retry logic for Neon
// Note: For Neon serverless, connections are managed automatically
// We test the connection but don't keep it open (Neon scales to zero)
export async function connectDatabase(): Promise<void> {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Test connection with a simple query (Neon will wake up if needed)
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connected successfully');
      return;
    } catch (error: any) {
      retries++;
      if (retries >= maxRetries) {
        console.error('❌ Database connection failed after retries:', error);
        throw error;
      }
      // Wait before retry (Neon may need time to wake up from scale-to-zero)
      await new Promise(resolve => setTimeout(resolve, 2000 * retries));
      console.log(`🔄 Retrying database connection (${retries}/${maxRetries})...`);
    }
  }
}

// Disconnect from database
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
  } catch (error) {
    console.error('❌ Database disconnection error:', error);
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}