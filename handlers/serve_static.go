package handlers

import (
	"net/http"
	"path/filepath"
	"strings"
)

func ServeStaticFile(w http.ResponseWriter, r *http.Request, dir string, fileServer http.Handler) {
	path := r.URL.Path
	
	// Set proper CORS headers for all requests
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Set proper MIME types for JavaScript files
	if strings.HasSuffix(path, ".js") {
		w.Header().Set("Content-Type", "application/javascript")
	} else if strings.HasSuffix(path, ".css") {
		w.Header().Set("Content-Type", "text/css")
	} else if strings.HasSuffix(path, ".html") {
		w.Header().Set("Content-Type", "text/html")
	}

	// Handle root path - serve index.html
	if path == "/" {
		w.Header().Set("Content-Type", "text/html")
		http.ServeFile(w, r, filepath.Join(dir, "index.html"))
		return
	}

	// Handle SPA routing - serve index.html for non-file requests (but not API calls)
	if !strings.Contains(path, ".") && !strings.HasPrefix(path, "/api/") {
		w.Header().Set("Content-Type", "text/html")
		http.ServeFile(w, r, filepath.Join(dir, "index.html"))
		return
	}

	// Serve static files (CSS, JS, images, etc.)
	fileServer.ServeHTTP(w, r)
}