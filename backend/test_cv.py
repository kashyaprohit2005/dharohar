import requests

image_path = r"C:\Users\Rohit\Downloads\WhatsApp Image 2026-09-16 at 3.15.33 PM.jpeg"

with open(image_path, "rb") as f:
    files = {"image": f}
    response = requests.post("http://127.0.0.1:5001/analyze", files=files)

print(response.json())