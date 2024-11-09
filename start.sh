#!/bin/bash
        
# Get the absolute path by expanding ~
HOME_DIR="$HOME"
FRONTEND_DIR="$HOME_DIR/Ping-status/ip-pinger-frontend"
AUTH_DIR="$HOME_DIR/Ping-status/ip-pinger-backend/Auth"
BACKEND_DIR="$HOME_DIR/Ping-status/ip-pinger-backend"

# Verify directories exist  
for dir in "$FRONTEND_DIR" "$AUTH_DIR" "$BACKEND_DIR"; do
    if [ ! -d "$dir" ]; then
        echo "Error: Directory $dir does not exist!"
        exit 1
    fi
done

# Function to kill the processes and free up the port
cleanup() {
    echo "Killing all processes..."
    kill $frontend_pid $auth_pid $backend_pid

    # Kill the server on port 8080
    if lsof -i :8080; then
        lsof -ti :8080 | xargs kill -9
        echo "Port 8080 has been freed."
    else
        echo "No process found using port 8080."
    fi

    wait $frontend_pid $auth_pid $backend_pid
    echo "All services have been stopped."
}

# Trap CTRL+C (SIGINT) to call cleanup
trap cleanup SIGINT

# Start all services in parallel
echo "Starting all services..."
cd "$FRONTEND_DIR" && serve -s build &
frontend_pid=$!
cd "$AUTH_DIR" && node server.js &
auth_pid=$!
cd "$BACKEND_DIR" && ./ip-pinger &
backend_pid=$!

# Wait for all background processes
wait $frontend_pid $auth_pid $backend_pid
