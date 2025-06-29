package handlers

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"pert8_npm_intro/configs"
	"pert8_npm_intro/models"
	"pert8_npm_intro/utils"
	"strconv"
	"strings"
	"time"
)

func HandleEvents(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Content-Type", "application/json")
	
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	path := r.URL.Path
	var id int
	var err error

	if len(path) > len("/api/events/") {
		id, err = strconv.Atoi(path[len("/api/events/"):])
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			utils.RespondJSON(w, map[string]string{"error": "ID tidak valid"})
			return
		}
	} else {
		id = 0
	}

	switch r.Method {
	case http.MethodGet:
		handleGetEvents(w, id)
	case http.MethodPost:
		handlePostEvent(w, r)
	case http.MethodPut:
		handleUpdateEvent(w, r, id)
	case http.MethodDelete:
		handleDeleteEvent(w, id)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		utils.RespondJSON(w, map[string]string{"error": "Method not allowed"})
	}
}

func handleGetEvents(w http.ResponseWriter, id int) {
	if id == 0 {
		rows, err := configs.DB.Query(`
			SELECT id, title, organizer, description, date, location, 
			       price, capacity, image_url, status, created_at, updated_at 
			FROM events ORDER BY date ASC`)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			utils.RespondJSON(w, map[string]string{"error": "Gagal mengambil data event"})
			return
		}
		defer rows.Close()

		var events []models.Event
		for rows.Next() {
			var event models.Event
			err := rows.Scan(&event.ID, &event.Title, &event.Organizer, &event.Description,
				&event.Date, &event.Location, &event.Price, &event.Capacity,
				&event.ImageURL, &event.Status, &event.CreatedAt, &event.UpdatedAt)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				utils.RespondJSON(w, map[string]string{"error": "Gagal memproses data event"})
				return
			}
			events = append(events, event)
		}
		
		// Check for iteration errors
		if err = rows.Err(); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			utils.RespondJSON(w, map[string]string{"error": "Gagal memproses data event"})
			return
		}
		
		w.WriteHeader(http.StatusOK)
		utils.RespondJSON(w, events)
	} else {
		var event models.Event
		err := configs.DB.QueryRow(`
			SELECT id, title, organizer, description, date, location, 
			       price, capacity, image_url, status, created_at, updated_at 
			FROM events WHERE id = ?`, id).
			Scan(&event.ID, &event.Title, &event.Organizer, &event.Description,
				&event.Date, &event.Location, &event.Price, &event.Capacity,
				&event.ImageURL, &event.Status, &event.CreatedAt, &event.UpdatedAt)
		if err != nil {
			if err == sql.ErrNoRows {
				w.WriteHeader(http.StatusNotFound)
				utils.RespondJSON(w, map[string]string{"error": "Event tidak ditemukan"})
			} else {
				w.WriteHeader(http.StatusInternalServerError)
				utils.RespondJSON(w, map[string]string{"error": "Gagal mengambil data event"})
			}
			return
		}
		w.WriteHeader(http.StatusOK)
		utils.RespondJSON(w, event)
	}
}

func handlePostEvent(w http.ResponseWriter, r *http.Request) {
	var event models.Event
	
	// Read raw body for debugging
	body := make([]byte, r.ContentLength)
	r.Body.Read(body)
	r.Body.Close()
	
	log.Printf("Received POST data: %s", string(body))
	
	// Create new reader from body
	r.Body = io.NopCloser(strings.NewReader(string(body)))
	
	if err := json.NewDecoder(r.Body).Decode(&event); err != nil {
		log.Printf("JSON decode error: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		utils.RespondJSON(w, map[string]string{"error": "Data tidak valid: " + err.Error()})
		return
	}

	log.Printf("Decoded event: %+v", event)

	// Validate required fields
	if event.Title == "" {
		w.WriteHeader(http.StatusBadRequest)
		utils.RespondJSON(w, map[string]string{"error": "Title tidak boleh kosong"})
		return
	}
	if event.Organizer == "" {
		w.WriteHeader(http.StatusBadRequest)
		utils.RespondJSON(w, map[string]string{"error": "Organizer tidak boleh kosong"})
		return
	}
	if event.Location == "" {
		w.WriteHeader(http.StatusBadRequest)
		utils.RespondJSON(w, map[string]string{"error": "Location tidak boleh kosong"})
		return
	}

	// Set default values
	now := time.Now()
	event.CreatedAt = now
	event.UpdatedAt = now
	if event.Status == "" {
		event.Status = "draft"
	}

	log.Printf("Inserting event with values: title=%s, organizer=%s, date=%v", event.Title, event.Organizer, event.Date)

	_, err := configs.DB.Exec(`
		INSERT INTO events (title, organizer, description, date, location, 
		                   price, capacity, image_url, status, created_at, updated_at) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		event.Title, event.Organizer, event.Description, event.Date, event.Location,
		event.Price, event.Capacity, event.ImageURL, event.Status, event.CreatedAt, event.UpdatedAt)

	if err != nil {
		log.Printf("Database insert error: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		utils.RespondJSON(w, map[string]string{"error": "Database error: " + err.Error()})
		return
	}

	w.WriteHeader(http.StatusCreated)
	utils.RespondJSON(w, map[string]string{"message": "Event berhasil ditambahkan!"})
}

func handleUpdateEvent(w http.ResponseWriter, r *http.Request, id int) {
	var event models.Event
	if err := json.NewDecoder(r.Body).Decode(&event); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		utils.RespondJSON(w, map[string]string{"error": "Data tidak valid"})
		return
	}

	// Set updated timestamp
	event.UpdatedAt = time.Now()

	result, err := configs.DB.Exec(`
		UPDATE events SET title=?, organizer=?, description=?, date=?, location=?, 
		                 price=?, capacity=?, image_url=?, status=?, updated_at=? 
		WHERE id=?`,
		event.Title, event.Organizer, event.Description, event.Date, event.Location,
		event.Price, event.Capacity, event.ImageURL, event.Status, event.UpdatedAt, id)
	
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		utils.RespondJSON(w, map[string]string{"error": "Gagal memperbarui event"})
		return
	}
	
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		utils.RespondJSON(w, map[string]string{"error": "Event dengan ID tersebut tidak ditemukan"})
		return
	}
	
	w.WriteHeader(http.StatusOK)
	utils.RespondJSON(w, map[string]string{"message": "Event berhasil diperbarui!"})
}

func handleDeleteEvent(w http.ResponseWriter, id int) {
	result, err := configs.DB.Exec("DELETE FROM events WHERE id=?", id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		utils.RespondJSON(w, map[string]string{"error": "Gagal menghapus event"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		utils.RespondJSON(w, map[string]string{"error": "Event dengan ID tersebut tidak ditemukan"})
		return
	}

	w.WriteHeader(http.StatusOK)
	utils.RespondJSON(w, map[string]string{"message": "Event berhasil dihapus!"})
}