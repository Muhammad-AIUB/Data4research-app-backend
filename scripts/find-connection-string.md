# Supabase Connection String কোথায় পাবেন - Step by Step

## সমস্যা
Connection string খুঁজে পাচ্ছেন না। Dashboard এ সব দেখতে পাচ্ছেন কিন্তু connection string section টা পাচ্ছেন না।

## সমাধান - Exact Steps

### Method 1: Settings Page থেকে (সবচেয়ে সহজ)

1. **Supabase Dashboard** open করুন: https://supabase.com/dashboard/project/yflbjisjvllzrgyevycq

2. **Left Sidebar** এ:
   - **"Settings"** (⚙️ gear icon) click করুন
   - **"Database"** section click করুন

3. **Scroll Down** করুন - অনেক sections আছে:
   - Database password
   - Connection pooling configuration
   - **Connection string** ← এই section টা খুঁজুন
   - SSL Configuration
   - Network Restrictions

4. **Connection string** section এ দেখবেন:
   - **Connection pooling** tab (এইটা select করুন)
   - **Transaction mode** select করুন
   - Connection string দেখাবে
   - **Copy** button আছে

### Method 2: Project Settings থেকে

1. Dashboard এর **top right** corner এ **"Project Settings"** (gear icon) click করুন

2. **"Database"** tab click করুন

3. Scroll down করে **"Connection string"** section খুঁজুন

### Method 3: API Settings থেকে

1. **Settings** → **API**
2. Scroll down করুন
3. **"Database"** section এ connection string পাবেন

## Connection String Format

আপনার connection string এ দেখবেন:

```
postgresql://postgres.yflbjisjvllzrgyevycq:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important:**
- Port **6543** থাকতে হবে (5432 নয়)
- `pooler.supabase.com` থাকতে হবে (`db.xxx.supabase.co` নয়)
- `?pgbouncer=true` থাকতে হবে

## .env File এ Update করুন

1. Connection string copy করুন
2. `.env` file open করুন
3. `DATABASE_URL` update করুন:

```env
DATABASE_URL="postgresql://postgres.yflbjisjvllzrgyevycq:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
```

4. `&sslmode=require` যোগ করুন

## যদি Connection String Section না পান?

### Option 1: Browser Refresh
- **Ctrl + F5** (hard refresh)
- বা browser cache clear করুন

### Option 2: Different Browser
- Chrome/Firefox/Edge try করুন
- বা Incognito mode try করুন

### Option 3: Search Function
- Browser এ **Ctrl + F** press করুন
- "Connection string" search করুন

## Database Password

যদি password মনে না থাকে:
1. **Settings** → **Database**
2. **"Database password"** section
3. **"Reset database password"** click করুন
4. New password set করুন
5. Connection string এ new password use করুন

## Test করুন

Connection string update করার পর:

```bash
npm run test:db
```

Success হলে দেখবেন:
- ✅ Connection successful!
- Port: 6543
- Connection Pooler: Yes
- SSL: Configured

## Quick Checklist

- [ ] Settings → Database এ গেছেন
- [ ] Scroll down করেছেন
- [ ] Connection string section খুঁজে পেয়েছেন
- [ ] Connection pooling select করেছেন
- [ ] Transaction mode select করেছেন
- [ ] Port 6543 আছে (5432 নয়)
- [ ] `?pgbouncer=true` আছে
- [ ] `.env` file এ `&sslmode=require` যোগ করেছেন

## Screenshot Reference

Connection string section এ দেখবেন:
- **Connection pooling** option (select this)
- **Transaction mode** (select this)
- **Connection string** text box (copy this)
- **Copy** button

## Why বারবার Connect করতে হয়?

**Supabase Free Tier:**
- Database **১ সপ্তাহ inactivity** পরে **pause** হয়ে যায়
- Pause হলে manually wake up করতে হয়
- বা প্রথম connection attempt এ automatically wake up হয় (২-৩ মিনিট লাগে)

**Solution:**
- **Connection pooler** (6543) use করুন - এইটা more stable
- Database regularly use করুন - pause হবে না
- বা paid plan use করুন - pause হবে না

## Help

যদি এখনও খুঁজে না পান:
1. Supabase documentation check করুন
2. বা Supabase support এ contact করুন
3. বা screenshot share করুন - আমি exact location বলব

