package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os/exec"
	"runtime"
	"strings"
	"sync"
	"time"

	"github.com/rs/cors"
)

// PingResult holds the result of pinging an IP
type PingResult struct {
	IP     string `json:"ip"`
	Status string `json:"status"`
}

// Ping a single IP with a 4-second timeout
func pingIP(ip string) PingResult {
	var cmd *exec.Cmd

	// Choose the correct ping command based on OS
	switch runtime.GOOS {
	case "darwin", "linux":
		// macOS/Linux: Ping 1 packet with a 4-second timeout
		cmd = exec.Command("ping", "-c", "1", "-W", "4", ip)
	case "windows":
		// Windows: Ping 1 packet with a 4-second timeout in milliseconds
		cmd = exec.Command("ping", "-n", "1", "-w", "4000", ip)
	default:
		log.Printf("Unsupported OS: %s", runtime.GOOS)
		return PingResult{IP: ip, Status: "unsupported"}
	}

	// Run the command and capture the output
	out, _ := cmd.CombinedOutput()
	output := string(out)

	// Log the output of the ping command
	log.Printf("Ping output for IP %s: %s", ip, output)

	// Regardless of exit status, check if at least one packet was received
	if strings.Contains(output, "1 packets received") || strings.Contains(output, "1 received") {
		return PingResult{IP: ip, Status: "active"}
	}

	// If no packets were received, mark it as inactive
	return PingResult{IP: ip, Status: "inactive"}
}

// Handler for the /ping endpoint
func pingHandler(w http.ResponseWriter, r *http.Request) {
	// Get the IPs from the query parameter
	ipsParam := r.URL.Query().Get("ips")
	if ipsParam == "" {
		http.Error(w, "No IPs provided", http.StatusBadRequest)
		return
	}

	// Split the IPs by comma and filter out any empty strings
	ips := strings.Split(ipsParam, ",")
	validIPs := []string{}
	for _, ip := range ips {
		ip = strings.TrimSpace(ip)
		if ip != "" {
			validIPs = append(validIPs, ip)
		}
	}

	// Return an error if no valid IPs are provided
	if len(validIPs) == 0 {
		http.Error(w, "No valid IPs provided", http.StatusBadRequest)
		return
	}

	// Create a wait group and a mutex for concurrent goroutines
	var wg sync.WaitGroup
	results := make(map[string]string)
	mu := sync.Mutex{} // Protects shared resource (results map)

	// Limit the number of concurrent workers (similar to Python's ThreadPoolExecutor)
	sem := make(chan struct{}, 800) // Adjust this number as needed

	// Ping each valid IP concurrently
	for _, ip := range validIPs {
		wg.Add(1)
		go func(ip string) {
			defer wg.Done()
			sem <- struct{}{} // Acquire a worker

			// Ping the IP and store the result
			result := pingIP(ip)

			// Safely write results to the shared map
			mu.Lock()
			results[ip] = result.Status
			mu.Unlock()

			<-sem // Release a worker
		}(ip)
	}

	// Wait for all goroutines to finish
	wg.Wait()

	// Send the results as a JSON response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(results); err != nil {
		http.Error(w, "Failed to encode results", http.StatusInternalServerError)
	}
}

func main() {
	// Enable CORS
	handler := cors.Default().Handler(http.HandlerFunc(pingHandler))

	// Start the server
	server := &http.Server{
		Addr:              ":8080",
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Println("Starting server on :8080")
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Could not start server: %v", err)
	}
}
