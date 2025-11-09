/**
 * Database Connection Test Script
 * 
 * This script tests the database connection to help diagnose connection issues.
 * Run with: npx tsx scripts/test-db-connection.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

async function testConnection() {
  console.log('🔍 Testing database connection...\n');

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.log('\n📝 Please set DATABASE_URL in your .env file');
    process.exit(1);
  }

  // Parse connection string (without exposing password)
  const dbUrl = process.env.DATABASE_URL;
  const urlPattern = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = dbUrl.match(urlPattern);

  if (match) {
    const [, user, , host, port, database] = match;
    console.log('📊 Connection Details:');
    console.log(`   Host: ${host}`);
    console.log(`   Port: ${port}`);
    console.log(`   Database: ${database}`);
    console.log(`   User: ${user}`);
    console.log(`   SSL: ${dbUrl.includes('sslmode') ? 'Configured' : '⚠️  Not configured'}`);
    console.log(`   Connection Pooler: ${dbUrl.includes('pgbouncer') ? 'Yes' : '⚠️  No (recommended for Supabase)'}`);
    console.log('');
  }

  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  });

  try {
    console.log('🔄 Attempting to connect...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Connection successful!\n');

    // Test a simple query
    console.log('🔄 Testing query...');
    const result = await prisma.$queryRaw`SELECT version() as version`;
    console.log('✅ Query successful!\n');

    // Check if tables exist
    console.log('🔄 Checking database tables...');
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    
    if (tables.length > 0) {
      console.log(`✅ Found ${tables.length} table(s):`);
      tables.forEach((table) => {
        console.log(`   - ${table.tablename}`);
      });
    } else {
      console.log('⚠️  No tables found in public schema');
    }

    console.log('\n✅ All tests passed! Database is ready.');
  } catch (error: any) {
    console.error('\n❌ Connection failed!\n');
    console.error('Error:', error.message);
    
    if (error.message.includes('Can\'t reach database server')) {
      console.log('\n💡 Possible solutions:');
      console.log('   1. Check if your Supabase database is paused (free tier pauses after inactivity)');
      console.log('      → Go to Supabase dashboard and wake up your database');
      console.log('   2. Verify your DATABASE_URL is correct');
      console.log('   3. For Supabase, use connection pooler (port 6543) instead of direct (port 5432)');
      console.log('   4. Add SSL parameters: ?sslmode=require&pgbouncer=true');
      console.log('   5. Check your firewall/network settings');
    } else if (error.message.includes('SSL')) {
      console.log('\n💡 SSL Error:');
      console.log('   → Add ?sslmode=require to your DATABASE_URL');
    } else if (error.message.includes('password')) {
      console.log('\n💡 Authentication Error:');
      console.log('   → Check your database password in DATABASE_URL');
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

