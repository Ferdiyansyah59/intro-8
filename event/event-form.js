import { LitElement, html, css } from "/lit-core.min.js";

class EventForm extends LitElement {
  static properties = {
    event: { type: Object },
    isEdit: { type: Boolean },
  };

  constructor() {
    super();
    this.event = {
      title: "",
      organizer: "",
      description: "",
      date: "",
      location: "",
      price: 0,
      capacity: 1, // Minimum 1 peserta
      image_url: "",
      status: "draft",
    };
    this.isEdit = false;
  }

  static styles = css`
    :host {
      display: block;
      font-family: "Inter", "Segoe UI", system-ui, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #1a202c;
      padding: 24px;
      box-sizing: border-box;
      min-height: 100vh;
      position: relative;
    }

    :host::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.05"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.05"/><circle cx="50" cy="10" r="0.5" fill="%23ffffff" opacity="0.03"/><circle cx="20" cy="80" r="0.5" fill="%23ffffff" opacity="0.03"/><circle cx="90" cy="30" r="0.5" fill="%23ffffff" opacity="0.03"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      pointer-events: none;
      z-index: 0;
    }

    h2 {
      position: relative;
      z-index: 1;
      text-align: center;
      font-size: 2.75rem;
      font-weight: 700;
      margin-bottom: 40px;
      color: #ffffff;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      letter-spacing: -0.025em;
    }

    .form-container {
      position: relative;
      z-index: 1;
      max-width: 640px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      padding: 48px;
      border-radius: 28px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: transform 0.3s ease;
    }

    .form-container:hover {
      transform: translateY(-4px);
    }

    .form-container::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
      border-radius: 28px 28px 0 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 28px;
    }

    .form-group {
      margin-bottom: 28px;
      position: relative;
    }

    .form-group.full-width {
      grid-column: span 2;
    }

    label {
      display: block;
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 12px;
      color: #2d3748;
      transition: color 0.3s ease;
    }

    input,
    textarea,
    select {
      width: 100%;
      padding: 16px 20px;
      border-radius: 16px;
      border: 2px solid #e2e8f0;
      font-size: 1.05rem;
      box-sizing: border-box;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      font-weight: 500;
      font-family: inherit;
    }

    textarea {
      min-height: 120px;
      resize: vertical;
    }

    input::placeholder,
    textarea::placeholder {
      color: #a0aec0;
      font-weight: 400;
    }

    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
      border-color: #4ecdc4;
      box-shadow: 0 0 0 4px rgba(78, 205, 196, 0.15);
      background: rgba(255, 255, 255, 1);
      transform: translateY(-2px);
    }

    input:focus + label,
    input:not(:placeholder-shown) + label,
    textarea:focus + label,
    textarea:not(:placeholder-shown) + label {
      color: #4ecdc4;
    }

    .form-group:nth-child(1) input:focus {
      border-color: #ff6b6b;
      box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.15);
    }

    .form-group:nth-child(2) input:focus {
      border-color: #4ecdc4;
      box-shadow: 0 0 0 4px rgba(78, 205, 196, 0.15);
    }

    .form-group:nth-child(3) textarea:focus {
      border-color: #45b7d1;
      box-shadow: 0 0 0 4px rgba(69, 183, 209, 0.15);
    }

    .form-group:nth-child(4) input:focus {
      border-color: #96ceb4;
      box-shadow: 0 0 0 4px rgba(150, 206, 180, 0.15);
    }

    button {
      width: 100%;
      padding: 18px 24px;
      border-radius: 16px;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      color: white;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      margin-top: 16px;
      box-shadow: 0 8px 25px rgba(238, 90, 36, 0.3);
      position: relative;
      overflow: hidden;
    }

    button::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.5s;
    }

    button:hover::before {
      left: 100%;
    }

    button:hover {
      background: linear-gradient(135deg, #ee5a24 0%, #e55039 100%);
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(238, 90, 36, 0.4);
    }

    button:active {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(238, 90, 36, 0.3);
    }

    /* Enhanced input animations */
    .form-group {
      position: relative;
      overflow: hidden;
    }

    .form-group::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .form-group:focus-within::after {
      transform: scaleX(1);
    }

    /* Loading state for button */
    button.loading {
      pointer-events: none;
      opacity: 0.8;
    }

    button.loading::after {
      content: "";
      position: absolute;
      width: 20px;
      height: 20px;
      top: 50%;
      left: 50%;
      margin-left: -10px;
      margin-top: -10px;
      border: 2px solid transparent;
      border-top: 2px solid #ffffff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    /* Success state animation */
    @keyframes successPulse {
      0% {
        box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.4);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(72, 187, 120, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
      }
    }

    .form-container.success {
      animation: successPulse 0.6s ease-out;
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .form-container {
        padding: 36px 28px;
        margin: 16px;
        border-radius: 24px;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .form-group.full-width {
        grid-column: span 1;
      }

      h2 {
        font-size: 2.25rem;
        margin-bottom: 32px;
      }

      .form-group {
        margin-bottom: 24px;
      }

      label {
        font-size: 1rem;
      }

      input,
      textarea,
      select {
        padding: 14px 18px;
        font-size: 1rem;
        border-radius: 14px;
      }

      button {
        padding: 16px 20px;
        font-size: 1rem;
        border-radius: 14px;
      }
    }

    @media (max-width: 480px) {
      :host {
        padding: 16px;
      }

      h2 {
        font-size: 2rem;
      }

      .form-container {
        padding: 28px 20px;
        margin: 8px;
        border-radius: 20px;
      }

      input,
      textarea,
      select {
        padding: 12px 16px;
        border-radius: 12px;
      }

      button {
        padding: 14px 18px;
        border-radius: 12px;
      }
    }

    /* Custom focus indicators for accessibility */
    input:focus-visible,
    textarea:focus-visible,
    select:focus-visible {
      outline: 2px solid #4ecdc4;
      outline-offset: 2px;
    }

    button:focus-visible {
      outline: 2px solid #ffffff;
      outline-offset: 2px;
    }
  `;

  async firstUpdated() {
    const eventId = this.getIdFromUrl();
    if (eventId) {
      this.isEdit = true;
      const response = await fetch(
        `http://localhost:8081/api/events/${eventId}`
      );
      const event = await response.json();

      // Format date for datetime-local input
      if (event.date) {
        const date = new Date(event.date);
        event.date = date.toISOString().slice(0, 16);
      }

      this.event = event;
    }
  }

  getIdFromUrl() {
    const path = window.location.pathname;
    const segments = path.split("/");
    return segments[2];
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "title",
      "organizer",
      "description",
      "date",
      "location",
    ];
    const missingFields = requiredFields.filter(
      (field) =>
        !this.event[field] || this.event[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      alert(`Mohon lengkapi field berikut: ${missingFields.join(", ")}`);
      return;
    }

    // Add loading state
    const button = e.target.querySelector('button[type="submit"]');
    button.classList.add("loading");

    // Prepare data for submission
    const eventData = { ...this.event };

    // Convert datetime-local format to ISO string for Go
    if (eventData.date) {
      // datetime-local gives us format: 2025-12-31T10:00
      // We need to add seconds and timezone: 2025-12-31T10:00:00Z
      const dateStr = eventData.date;
      if (!dateStr.includes(":00:00")) {
        eventData.date = dateStr + ":00.000Z";
      }
    }

    // Ensure numeric fields are properly typed
    eventData.price = parseFloat(eventData.price) || 0;
    eventData.capacity = parseInt(eventData.capacity) || 0;

    // Ensure strings are trimmed
    eventData.title = eventData.title.trim();
    eventData.organizer = eventData.organizer.trim();
    eventData.description = eventData.description.trim();
    eventData.location = eventData.location.trim();

    console.log("Submitting event data:", eventData);

    const method = this.isEdit ? "PUT" : "POST";
    const endpoint = this.isEdit
      ? `http://localhost:8081/api/events/${this.event.id}`
      : "http://localhost:8081/api/events";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);

        // Add success animation
        const container = this.shadowRoot.querySelector(".form-container");
        container.classList.add("success");

        setTimeout(() => {
          window.location.href = "/";
        }, 600);
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert(`Error: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Network error: ${error.message}`);
    } finally {
      button.classList.remove("loading");
    }
  }

  handleInput(e) {
    const { name, value, type } = e.target;

    console.log(`Input changed: ${name} = ${value} (type: ${type})`);

    let processedValue = value;

    // Handle different input types
    if (type === "number") {
      if (name === "price") {
        processedValue = parseFloat(value) || 0;
      } else if (name === "capacity") {
        processedValue = parseInt(value) || 0;
      }
    } else if (type === "datetime-local") {
      // Keep as string, will be processed in handleSubmit
      processedValue = value;
    }

    this.event = {
      ...this.event,
      [name]: processedValue,
    };

    console.log("Updated event:", this.event);
  }

  render() {
    return html`
      <h2>${this.isEdit ? "Edit Event" : "Tambah Event Baru"}</h2>
      <div class="form-container">
        <form class="form" @submit="${this.handleSubmit}">
          <div class="form-row">
            <div class="form-group">
              <label for="title">Judul Event</label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Masukkan judul event"
                .value="${this.event.title}"
                @input="${this.handleInput}"
                required
              />
            </div>
            <div class="form-group">
              <label for="organizer">Penyelenggara</label>
              <input
                type="text"
                name="organizer"
                id="organizer"
                placeholder="Masukkan nama penyelenggara"
                .value="${this.event.organizer}"
                @input="${this.handleInput}"
                required
              />
            </div>
          </div>

          <div class="form-group full-width">
            <label for="description">Deskripsi</label>
            <textarea
              name="description"
              id="description"
              placeholder="Masukkan deskripsi event"
              .value="${this.event.description}"
              @input="${this.handleInput}"
              required
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="date">Tanggal & Waktu</label>
              <input
                type="datetime-local"
                name="date"
                id="date"
                .value="${this.event.date}"
                @input="${this.handleInput}"
                required
              />
            </div>
            <div class="form-group">
              <label for="location">Lokasi</label>
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Masukkan lokasi event"
                .value="${this.event.location}"
                @input="${this.handleInput}"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="price">Harga (IDR)</label>
              <input
                type="number"
                name="price"
                id="price"
                placeholder="Masukkan harga tiket"
                .value="${this.event.price}"
                step="1000"
                min="0"
                @input="${this.handleInput}"
                required
              />
            </div>
            <div class="form-group">
              <label for="capacity">Kapasitas</label>
              <input
                type="number"
                name="capacity"
                id="capacity"
                placeholder="Jumlah peserta maksimal"
                .value="${this.event.capacity}"
                min="1"
                @input="${this.handleInput}"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="image_url">URL Gambar</label>
              <input
                type="url"
                name="image_url"
                id="image_url"
                placeholder="https://example.com/image.jpg"
                .value="${this.event.image_url}"
                @input="${this.handleInput}"
              />
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select
                name="status"
                id="status"
                .value="${this.event.status}"
                @change="${this.handleInput}"
                required
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <button type="submit">
            ${this.isEdit ? "Update Event" : "Tambah Event"}
          </button>
        </form>
      </div>
    `;
  }
}

customElements.define("event-form", EventForm);
