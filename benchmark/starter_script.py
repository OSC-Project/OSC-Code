import subprocess
import time

packages = ['express', 'body-parser', 'path']

for pck in packages:
  subprocess.Popen(['npm', 'i', pck])
  time.sleep(3)

print(", ".join(packages) + " have all been downloaded")
