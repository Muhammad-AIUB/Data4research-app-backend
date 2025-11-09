/**
 * Connection String Update Helper
 * 
 * এই script আপনাকে সাহায্য করবে connection string update করতে
 * 
 * Usage:
 * 1. Supabase dashboard থেকে connection string copy করুন
 * 2. এই script run করুন
 * 3. Connection string paste করুন
 * 4. Script automatically .env file update করবে
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function updateEnvFile(connectionString) {
  const envPath = path.join(process.cwd(), '.env');
  
  // Check if .env file exists
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    console.log('💡 Creating .env file...');
    fs.writeFileSync(envPath, '');
  }
  
  // Read .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Add SSL parameter if not present
  if (!connectionString.includes('sslmode=')) {
    const separator = connectionString.includes('?') ? '&' : '?';
    connectionString += `${separator}sslmode=require`;
  }
  
  // Check if DATABASE_URL exists
  if (envContent.includes('DATABASE_URL=')) {
    // Update existing DATABASE_URL
    envContent = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL="${connectionString}"`
    );
  } else {
    // Add new DATABASE_URL
    if (envContent && !envContent.endsWith('\n')) {
      envContent += '\n';
    }
    envContent += `DATABASE_URL="${connectionString}"\n`;
  }
  
  // Write back to .env file
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file updated successfully!');
  
  // Validate connection string
  console.log('\n📊 Connection String Validation:');
  const hasPooler = connectionString.includes('pooler.supabase.com');
  const hasPort6543 = connectionString.includes(':6543');
  const hasPgbouncer = connectionString.includes('pgbouncer=true');
  const hasSSL = connectionString.includes('sslmode=require');
  
  console.log(`   Pooler: ${hasPooler ? '✅' : '❌'} (should use pooler.supabase.com)`);
  console.log(`   Port 6543: ${hasPort6543 ? '✅' : '❌'} (should be 6543, not 5432)`);
  console.log(`   PgBouncer: ${hasPgbouncer ? '✅' : '❌'} (should have ?pgbouncer=true)`);
  console.log(`   SSL: ${hasSSL ? '✅' : '❌'} (should have &sslmode=require)`);
  
  if (hasPooler && hasPort6543 && hasPgbouncer && hasSSL) {
    console.log('\n✅ Connection string looks good!');
    console.log('💡 Run "npm run test:db" to test the connection');
  } else {
    console.log('\n⚠️  Connection string needs adjustment:');
    if (!hasPooler) console.log('   → Use connection pooler (not direct connection)');
    if (!hasPort6543) console.log('   → Use port 6543 (not 5432)');
    if (!hasPgbouncer) console.log('   → Add ?pgbouncer=true');
    if (!hasSSL) console.log('   → Add &sslmode=require');
  }
}

function askConnectionString() {
  console.log('🔍 Connection String Updater\n');
  console.log('📝 Instructions:');
  console.log('   1. Go to Supabase Dashboard → Settings → Database');
  console.log('   2. Scroll down to "Connection string" section');
  console.log('   3. Select "Connection pooling" and "Transaction mode"');
  console.log('   4. Copy the connection string');
  console.log('   5. Paste it here\n');
  
  rl.question('Paste your connection string here: ', (answer) => {
    if (!answer || answer.trim() === '') {
      console.error('❌ Connection string cannot be empty!');
      rl.close();
      return;
    }
    
    const connectionString = answer.trim();
    updateEnvFile(connectionString);
    rl.close();
  });
}

// Run the script
askConnectionString();

