from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define a thread pool with a maximum number of workers
executor = ThreadPoolExecutor(max_workers=500)  # Adjust based on system capacity

# Function to ping a single IP (Windows-specific)
def ping_ip(ip):
    try:
        # Use Windows-compatible ping command with a 2-second timeout
        output = subprocess.run(["ping", "-n", "1", ip], capture_output=True, timeout=4)

        # Decode the stdout to check the ping output
        ping_output = output.stdout.decode()

        # Check for "TTL" in the output, indicating the host is reachable
        if "TTL" in ping_output or "ttl" in ping_output:
            return (ip, "active")
        else:
            return (ip, "inactive")
    except subprocess.TimeoutExpired:
        return (ip, "inactive")  # Timed out IPs are considered inactive
    except Exception as e:
        print(f"Error pinging IP {ip}: {e}")  # Log the error
        return (ip, "inactive")

@app.route('/ping', methods=['GET'])
def ping():
    # Get the list of IPs from the request query parameter (e.g., ?ips=192.168.1.1,192.168.1.2,...)
    ip_param = request.args.get('ips')
    
    # Validate if the 'ips' parameter exists
    if not ip_param:
        return jsonify({"error": "No IPs provided"}), 400

    ips = ip_param.split(',')

    # Ensure the list is not empty
    if not ips:
        return jsonify({"error": "Empty IP list"}), 400

    # Submit tasks to the thread pool
    future_to_ip = {executor.submit(ping_ip, ip): ip for ip in ips}

    # Collect results as they complete
    results = {}
    for future in as_completed(future_to_ip):
        ip, status = future.result()
        results[ip] = status

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
