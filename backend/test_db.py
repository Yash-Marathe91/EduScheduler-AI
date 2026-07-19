import asyncio
import asyncpg

async def run():
    conn = await asyncpg.connect('postgresql://postgres:Yash%405204j123@db.abtnmtvtpukfeyimrynz.supabase.co:5432/postgres')
    
    enums = await conn.fetch('''
        SELECT enumlabel 
        FROM pg_enum 
        JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
        WHERE typname = 'user_role'
    ''')
    print('Enum values for user_role:', [e['enumlabel'] for e in enums])
        
asyncio.run(run())
