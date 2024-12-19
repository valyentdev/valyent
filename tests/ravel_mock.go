package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strings"
	"time"
)

type LogEntry struct {
	Timestamp string `json:"timestamp"`
	Message   string `json:"message"`
	FleetID   string `json:"fleetId"`
	MachineID string `json:"machineId"`
	OrgID     string `json:"organizationId"`
}

func streamLogs(w http.ResponseWriter, r *http.Request) {
	pathRegex := regexp.MustCompile(`^/fleets/([^/]+)/machines/([^/]+)/logs$`)
	matches := pathRegex.FindStringSubmatch(r.URL.Path)

	if matches == nil {
		http.Error(w, "Invalid path. Expected /fleets/{fleetId}/machines/{machineId}/logs", http.StatusBadRequest)
		return
	}

	fleetId := matches[1]
	machineId := matches[2]
	organizationId := r.URL.Query().Get("organizationId")

	if organizationId == "" {
		http.Error(w, "organizationId is required", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported!", http.StatusInternalServerError)
		return
	}

	for i := 0; ; i++ {
		select {
		case <-r.Context().Done():
			return
		case <-time.After(time.Second):
			logEntry := LogEntry{
				Timestamp: time.Now().Format(time.RFC3339),
				Message:   fmt.Sprintf("Log entry %d", i),
				FleetID:   fleetId,
				MachineID: machineId,
				OrgID:     organizationId,
			}

			data, err := json.Marshal(logEntry)
			if err != nil {
				log.Printf("Error marshalling JSON: %v", err)
				continue
			}

			fmt.Fprintf(w, "data: %s\n\n", data)
			flusher.Flush()
		}
	}
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	if strings.HasSuffix(r.URL.Path, "/logs") && strings.Contains(r.URL.Path, "/fleets/") && strings.Contains(r.URL.Path, "/machines/") {
		streamLogs(w, r)
		return
	}

	// Handle other paths
	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{
		"message": fmt.Sprintf("Received request for path: %s", r.URL.Path),
		"method":  r.Method,
	}
	json.NewEncoder(w).Encode(response)
}

func main() {
	http.HandleFunc("/", handleRequest)

	port := ":8080"
	fmt.Printf("Server is running on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
