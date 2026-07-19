import asyncio
import asyncpg
import requests

async def run():
    conn = await asyncpg.connect('postgresql://postgres:Yash%405204j123@db.abtnmtvtpukfeyimrynz.supabase.co:5432/postgres')
    
    # 3. Trigger a signup with institution.edu
    res = requests.post('https://abtnmtvtpukfeyimrynz.supabase.co/auth/v1/signup', 
        headers={'apikey': 'sb_publishable_xbuN5s7ufpSfXtfvsJocfQ_SavCwTSo'}, 
        json={'email':'debugtest@institution.edu', 'password': 'password123'})
    
    print("Signup Status:", res.status_code)
    print("Signup Body:", res.text)
    
    # 4. Check debug logs
    logs = await conn.fetch('SELECT message FROM public.debug_logs')
    print("Debug Logs:", [l['message'] for l in logs])

asyncio.run(run())
