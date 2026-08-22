import sys, base64
data = sys.stdin.buffer.read()
decoded = base64.b64decode(data)
with open('src/app/admin/emails/page.tsx', 'wb') as out:
    out.write(decoded)
print(f"Written {len(decoded)} bytes")
