/**
 * Database Optimization Script
 * 
 * This script helps optimize database for huge data:
 * - Vacuum database to reclaim space
 * - Analyze tables for better query performance
 * - Update statistics
 * 
 * Run with: npx tsx scripts/optimize-database.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function optimizeDatabase() {
  console.log('🔧 Starting database optimization...\n');

  try {
    // Vacuum database to reclaim space and update statistics
    console.log('📊 Running VACUUM ANALYZE...');
    await prisma.$executeRawUnsafe('VACUUM ANALYZE;');
    console.log('✅ VACUUM ANALYZE completed\n');

    // Update table statistics for better query planning
    console.log('📈 Updating table statistics...');
    await prisma.$executeRawUnsafe('ANALYZE patients;');
    await prisma.$executeRawUnsafe('ANALYZE investigation_sessions;');
    await prisma.$executeRawUnsafe('ANALYZE hematology_results;');
    await prisma.$executeRawUnsafe('ANALYZE lft_results;');
    await prisma.$executeRawUnsafe('ANALYZE rft_results;');
    console.log('✅ Statistics updated\n');

    // Get database size
    console.log('💾 Database size:');
    const dbSize = await prisma.$queryRaw<Array<{ size: string }>>`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size;
    `;
    console.log(`   Total: ${dbSize[0].size}\n`);

    // Get table sizes
    console.log('📊 Table sizes:');
    const tableSizes = await prisma.$queryRaw<Array<{ 
      table_name: string; 
      size: string;
      row_count: bigint;
    }>>`
      SELECT 
        tablename as table_name,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
        (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = tablename) as row_count
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
    `;

    for (const table of tableSizes) {
      const count = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*) as count FROM ${table.table_name};`
      ) as Array<{ count: bigint }>;
      console.log(`   ${table.table_name}: ${table.size} (${count[0].count} rows)`);
    }

    console.log('\n✅ Database optimization completed!');
    console.log('💡 Run this script weekly for best performance with huge data');

  } catch (error: any) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

optimizeDatabase().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

