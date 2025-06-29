import { LitElement, html, css } from "/lit-core.min.js";

class EventData extends LitElement {
  static properties = {
    events: { type: Array },
  };

  constructor() {
    super();
    this.events = [];
    this.fetchEvents();
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

    .container {
      position: relative;
      z-index: 1;
      overflow: hidden !important;
      max-height: 100vh;
    }

    h2 {
      color: #ffffff;
      font-size: 2.75rem;
      font-weight: 700;
      margin-bottom: 40px;
      text-align: center;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      letter-spacing: -0.025em;
    }

    .top-bar {
      display: flex;
      justify-content: center;
      margin-bottom: 40px;
    }

    .top-bar button {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      color: white;
      border: none;
      border-radius: 16px;
      padding: 16px 32px;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 25px rgba(238, 90, 36, 0.3);
      position: relative;
      overflow: hidden;
    }

    .top-bar button::before {
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

    .top-bar button:hover::before {
      left: 100%;
    }

    .top-bar button:hover {
      background: linear-gradient(135deg, #ee5a24 0%, #e55039 100%);
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(238, 90, 36, 0.4);
    }

    .event-data-e {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
      max-height: calc(100vh - 200px);
      overflow-y: auto;
      padding-right: 8px;
    }

    .event-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      max-width: 400px;
      margin: 0 auto;
    }

    .event-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
    }

    .event-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.18);
    }

    .event-image {
      width: 100%;
      height: 200px;
      border-radius: 16px;
      object-fit: cover;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .event-card h3 {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 12px;
      color: #2d3748;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .event-organizer {
      font-size: 1rem;
      color: #4299e1;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .event-date {
      font-size: 0.95rem;
      color: #e53e3e;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .event-location {
      font-size: 0.95rem;
      color: #38a169;
      font-weight: 500;
      margin-bottom: 12px;
    }

    .event-card p {
      font-size: 1rem;
      color: #4a5568;
      line-height: 1.6;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .event-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 12px;
      background: rgba(79, 172, 254, 0.1);
      border-radius: 12px;
    }

    .event-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: #2d3748;
    }

    .event-capacity {
      font-size: 0.9rem;
      color: #718096;
      font-weight: 500;
    }

    .event-status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .event-status.published {
      background: rgba(72, 187, 120, 0.2);
      color: #38a169;
    }

    .event-status.draft {
      background: rgba(237, 137, 54, 0.2);
      color: #d69e2e;
    }

    .event-status.cancelled {
      background: rgba(245, 101, 101, 0.2);
      color: #e53e3e;
    }

    .event-status.completed {
      background: rgba(102, 126, 234, 0.2);
      color: #667eea;
    }

    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .event-card button {
      flex: 1;
      padding: 12px 16px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .edit-btn {
      background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
    }

    .edit-btn:hover {
      background: linear-gradient(135deg, #44a08d 0%, #093637 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
    }

    .delete-btn {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    }

    .delete-btn:hover {
      background: linear-gradient(135deg, #ee5a24 0%, #e55039 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
    }

    .toast {
      position: fixed;
      top: 24px;
      right: 24px;
      padding: 20px 24px;
      border-radius: 16px;
      color: white;
      font-weight: 600;
      font-size: 1rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      z-index: 1000;
      transform: translateX(400px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      min-width: 300px;
    }

    .toast.show {
      transform: translateX(0);
      opacity: 1;
    }

    .toast .icon {
      font-size: 1.5rem;
      margin-right: 16px;
    }

    .toast.success {
      background: linear-gradient(
        135deg,
        rgba(72, 187, 120, 0.95) 0%,
        rgba(56, 161, 105, 0.95) 100%
      );
      color: white;
      border-left: 4px solid #48bb78;
    }

    .toast.error {
      background: linear-gradient(
        135deg,
        rgba(245, 101, 101, 0.95) 0%,
        rgba(229, 62, 62, 0.95) 100%
      );
      color: white;
      border-left: 4px solid #f56565;
    }

    .toast.info {
      background: linear-gradient(
        135deg,
        rgba(66, 153, 225, 0.95) 0%,
        rgba(49, 130, 206, 0.95) 100%
      );
      color: white;
      border-left: 4px solid #4299e1;
    }

    .toast.warning {
      background: linear-gradient(
        135deg,
        rgba(237, 137, 54, 0.95) 0%,
        rgba(221, 107, 32, 0.95) 100%
      );
      color: white;
      border-left: 4px solid #ed8936;
    }

    /* Scrollbar styling */
    .event-data-e::-webkit-scrollbar {
      width: 8px;
    }

    .event-data-e::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
    }

    .event-data-e::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 8px;
    }

    .event-data-e::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
      h2 {
        font-size: 2.25rem;
      }

      .top-bar button {
        font-size: 1rem;
        padding: 14px 28px;
      }

      .event-data-e {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
      }

      .event-card {
        padding: 24px;
        max-width: 320px;
      }

      .event-card h3 {
        font-size: 1.25rem;
      }

      .event-card p {
        font-size: 0.95rem;
      }

      .event-card button {
        font-size: 0.9rem;
        padding: 10px 14px;
      }

      .toast {
        padding: 16px 20px;
        font-size: 0.95rem;
        min-width: 250px;
      }

      .toast .icon {
        font-size: 1.4rem;
        margin-right: 12px;
      }
    }

    @media (max-width: 480px) {
      :host {
        padding: 16px;
      }

      h2 {
        font-size: 2rem;
        margin-bottom: 32px;
      }

      .event-data-e {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .event-card {
        max-width: 100%;
      }
    }
  `;

  async fetchEvents() {
    const response = await fetch("http://localhost:8081/api/events");
    const data = await response.json();
    this.events = data;
  }

  async deleteEvent(id) {
    const response = await fetch(`http://localhost:8081/api/events/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      this.showToast("Event berhasil dihapus!", "success");
      this.fetchEvents();
    } else {
      this.showToast("Gagal menghapus event!", "error");
    }
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = {
      success: "✓",
      error: "✗",
      warning: "⚠",
      info: "ℹ",
    };

    toast.innerHTML = `
      <span class="icon">${icons[type] || icons.info}</span>
      <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add("show"), 100);

    // Remove toast
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => document.body.removeChild(toast), 400);
    }, 3000);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  formatPrice(price) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  }

  navigateToAdd() {
    this.navigateTo("/add");
  }

  navigateToEdit(id) {
    this.navigateTo(`/edit/${id}`);
  }

  render() {
    return html`
      <div class="container">
        <h2>Event Management System</h2>
        <div class="top-bar">
          <button @click="${this.navigateToAdd}">➕ Tambah Event Baru</button>
        </div>
        <div class="event-data-e">
          ${this.events.map(
            (event) => html`
              <div class="event-card">
                ${event.image_url
                  ? html`
                      <img
                        src="${event.image_url}"
                        alt="${event.title}"
                        class="event-image"
                      />
                    `
                  : html` <div class="event-image"></div> `}
                <div class="event-status ${event.status}">${event.status}</div>
                <h3>${event.title}</h3>
                <div class="event-organizer">👤 ${event.organizer}</div>
                <div class="event-date">📅 ${this.formatDate(event.date)}</div>
                <div class="event-location">📍 ${event.location}</div>
                <p>${event.description}</p>
                <div class="event-meta">
                  <div class="event-price">
                    ${this.formatPrice(event.price)}
                  </div>
                  <div class="event-capacity">👥 ${event.capacity} peserta</div>
                </div>
                <div class="button-group">
                  <button
                    class="edit-btn"
                    @click="${() => this.navigateToEdit(event.id)}"
                  >
                    Edit
                  </button>
                  <button
                    class="delete-btn"
                    @click="${() => this.deleteEvent(event.id)}"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}

customElements.define("event-data", EventData);
