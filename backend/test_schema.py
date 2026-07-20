import asyncio, asyncpg

async def run():
    conn = await asyncpg.connect('postgresql://postgres:Yash%405204j123@db.abtnmtvtpukfeyimrynz.supabase.co:5432/postgres')
    tables = ['timetable_settings']
    for t in tables:
        try:
            cols = await conn.fetch(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{t}'")
            print(f"{t} cols:", [f"{c['column_name']}: {c['data_type']}" for c in cols])
        except Exception as e:
            print(f"Table {t} might not exist: {e}")

asyncio.run(run())
