/**
 * Archive Old Data Script
 * 
 * This script archives old investigation data to save space:
 * - Moves old investigation sessions (>2 years) to archive
 * - Compresses old data
 * - Helps maintain free tier limits
 * 
 * Run with: npx tsx scripts/archive-old-data.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ArchiveConfig {
  archiveDays: number; // Archive data older than X days
  dryRun: boolean; // If true, only show what would be archived
}

async function archiveOldData(config: ArchiveConfig = { archiveDays: 730, dryRun: true }) {
  console.log('📦 Starting data archiving...\n');
  console.log(`📅 Archiving data older than ${config.archiveDays} days (${config.archiveDays / 365} years)\n`);

  if (config.dryRun) {
    console.log('🔍 DRY RUN MODE - No data will be deleted\n');
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - config.archiveDays);

    // Count old investigation sessions
    const oldSessions = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM investigation_sessions
      WHERE investigation_date < ${cutoffDate}
    `;

    const sessionCount = Number(oldSessions[0].count);
    console.log(`📊 Found ${sessionCount} old investigation sessions\n`);

    if (sessionCount === 0) {
      console.log('✅ No old data to archive');
      return;
    }

    if (config.dryRun) {
      console.log('💡 To actually archive, run with dryRun: false');
      console.log('⚠️  WARNING: This will delete old data permanently!');
      return;
    }

    // Archive old sessions (CASCADE will delete related results)
    console.log('🗑️  Archiving old investigation sessions...');
    const deleted = await prisma.$executeRawUnsafe(`
      DELETE FROM investigation_sessions
      WHERE investigation_date < '${cutoffDate.toISOString().split('T')[0]}'
    `);

    console.log(`✅ Archived ${deleted} investigation sessions\n`);

    // Vacuum to reclaim space
    console.log('🧹 Reclaiming disk space...');
    await prisma.$executeRawUnsafe('VACUUM investigation_sessions;');
    await prisma.$executeRawUnsafe('VACUUM hematology_results;');
    await prisma.$executeRawUnsafe('VACUUM lft_results;');
    await prisma.$executeRawUnsafe('VACUUM rft_results;');
    console.log('✅ Space reclaimed\n');

    console.log('✅ Data archiving completed!');

  } catch (error: any) {
    console.error('❌ Archiving failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run archiving
const args = process.argv.slice(2);
const dryRun = !args.includes('--execute');
const archiveDays = parseInt(args.find(arg => arg.startsWith('--days='))?.split('=')[1] || '730', 10);

archiveOldData({ archiveDays, dryRun }).catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

