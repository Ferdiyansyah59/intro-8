package main

import (
	"fmt"
	"log"
	"net/http"
	"pert8_npm_intro/configs"
	"pert8_npm_intro/handlers"
	"pert8_npm_intro/middlewares"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
    PORT := 8081

    configs.ConnectDB()
    if configs.DB == nil {
        log.Fatal("Database connection failed")
    }
    defer func() {
        if err := configs.DB.Close(); err != nil {
            log.Printf("Error closing database connection: %v", err)
        }
    }()

    mux := http.NewServeMux()
    
    // API routes with explicit CORS handling
    mux.HandleFunc("/api/events/", func(w http.ResponseWriter, r *http.Request) {
        handlers.HandleEvents(w, r)
    })
    mux.HandleFunc("/api/events", func(w http.ResponseWriter, r *http.Request) {
        handlers.HandleEvents(w, r)
    })
    
    // Static file serving with proper MIME types
    fileServer := http.FileServer(http.Dir("event"))
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        handlers.ServeStaticFile(w, r, "event", fileServer)
    })

    // Apply middleware
    loggedMux := middlewares.LogRequestHandler(mux)

    fmt.Printf("Server berjalan di http://localhost:%d\n", PORT)
    log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", PORT), loggedMux))
}