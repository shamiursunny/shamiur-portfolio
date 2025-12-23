# Supabase Setup Guide

This guide explains how to configure and use Supabase with your Next.js portfolio project.

## Overview

Supabase has been configured to run alongside your existing Prisma + Neon setup. You can use Supabase for:

- Real-time subscriptions
- Authentication (as an alternative to NextAuth)
- File storage
- Edge functions
- Real-time database features

## Local Development Setup

### 1. Start Supabase Locally

```bash
npm run supabase:start
```

This will start all Supabase services locally using Docker:
- PostgreSQL database (port 54322)
- Supabase API (port 54321)
- Supabase Auth
- Supabase Storage
- Supabase Realtime

### 2. Stop Supabase

```bash
npm run supabase:stop
```

### 3. Check Status

```bash
npm run supabase:status
```

## Environment Variables

The following environment variables have been added to `.env.local`:

```env
# Supabase Configuration (Local Development)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
SUPABASE_DB_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

## Usage in Code

### Client-Side Usage

```typescript
import { supabase } from '@/lib/supabase'

// Example: Fetch data
const { data, error } = await supabase
  .from('your_table')
  .select('*')

// Example: Real-time subscription
const channel = supabase
  .channel('db_changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'your_table'
  }, (payload) => {
    console.log('Change received!', payload)
  })
  .subscribe()
```

### Server-Side Usage (API Routes)

```typescript
import { supabaseAdmin } from '@/lib/supabase'

// Use supabaseAdmin for server-side operations
const { data, error } = await supabaseAdmin
  .from('your_table')
  .insert({ column: 'value' })
```

## Testing Connection

Test your Supabase connection by visiting:

```
http://localhost:3000/api/test-supabase
```

This will verify that your application can connect to the local Supabase instance.

## Database Management

### Using Supabase CLI

Once Supabase is running locally, you can:

```bash
# Create a migration
npx supabase migration new create_users_table

# Apply migrations
npx supabase db push

# Generate types
npx supabase gen types typescript --local > types/supabase.ts
```

### Direct Database Access

You can connect directly to the PostgreSQL database using:

```
SUPABASE_DB_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

## Production Deployment

For production, you'll need to:

1. Create a Supabase project at https://supabase.com
2. Update the environment variables with your production Supabase URL and keys
3. Run migrations on your production database
4. Configure authentication and storage as needed

## Troubleshooting

### Common Issues

1. **"Connection refused" errors**: Make sure Supabase is running locally with `npm run supabase:start`

2. **Permission errors**: Check that your RLS (Row Level Security) policies are configured correctly

3. **Docker issues**: Ensure Docker is running and you have sufficient resources

4. **Port conflicts**: The default ports are 54321 (API) and 54322 (DB). Change them in `supabase/config.toml` if needed

### Useful Commands

```bash
# View logs
npx supabase logs

# Reset database
npx supabase db reset

# View database schema
npx supabase db inspect
```

## Next Steps

1. Start Supabase locally: `npm run supabase:start`
2. Test the connection: Visit `/api/test-supabase`
3. Create your first table using the Supabase Dashboard at http://localhost:54323
4. Implement authentication or real-time features as needed

For more information, visit the [Supabase Documentation](https://supabase.com/docs).