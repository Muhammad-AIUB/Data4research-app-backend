import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: 'https://sure-teal-32767.upstash.io',
  token: 'AX__AAIncDJiNTNjNWM4ZjJiMDc0ZDc4YjMzOTY4MjI5N2MwNDVhZnAyMzI3Njc',
});

async function test() {
  try {
    console.log('🔄 Testing Upstash Redis connection...\n');
    
    // Test SET
    await redis.set('test:connection', 'ok', { ex: 10 });
    console.log('✅ SET operation successful');
    
    // Test GET
    const value = await redis.get('test:connection');
    console.log('✅ GET operation successful');
    console.log(`   Value: ${value}`);
    
    // Test DELETE
    await redis.del('test:connection');
    console.log('✅ DELETE operation successful');
    
    console.log('\n✅ All tests passed! Redis connection is working perfectly!');
    console.log('✅ Your credentials are valid and ready to use.\n');
    
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Connection failed:', error.message);
    process.exit(1);
  }
}

test();

