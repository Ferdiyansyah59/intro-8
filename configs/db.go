package configs

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() {
    var err error
    
    // Konfigurasi database - sesuaikan dengan setup MySQL Anda
    user := "root"
	password := "root"        // Ganti dengan password MySQL Anda
	host := "127.0.0.1"
	port := "8889"           // Port MySQL default, sesuaikan jika berbeda
	dbname := "event_management"
    
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, password, host, port, dbname)

	log.Printf("Connecting to database: %s@tcp(%s:%s)/%s", user, host, port, dbname)

	DB, err = sql.Open("mysql", dsn)
    if err != nil {
        log.Fatal("Failed to open database connection:", err)
    }

    // Set connection pool settings
    DB.SetMaxOpenConns(10)
    DB.SetMaxIdleConns(5)
    DB.SetConnMaxLifetime(time.Minute * 5)

    // Test the connection
    err = DB.Ping()
    if err != nil {
        log.Printf("Database ping failed: %v", err)
        log.Printf("Make sure MySQL server is running and database '%s' exists", dbname)
        log.Fatal("Failed to ping database:", err)
    }

    // Test query to events table
    _, err = DB.Query("SELECT 1 FROM events LIMIT 1")
    if err != nil {
        log.Printf("Warning: Events table might not exist yet. Run migration script first.")
        log.Printf("Run: mysql -u %s -p %s < migrations/create_events_table.sql", user, dbname)
    }

    log.Println("Successfully connected to database")
}