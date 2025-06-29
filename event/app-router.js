import { LitElement, html } from "/lit-core.min.js";
import "/event-data.js";
import "/event-form.js";

class AppRouter extends LitElement {
  static properties = {
    route: { type: String },
    eventId: { type: String },
  };

  constructor() {
    super();
    this.updateRoute();
    window.onpopstate = () => {
      this.updateRoute();
    };
  }

  updateRoute() {
    const path = window.location.pathname.replace(/^\/+/, "");
    const parts = path.split("/");
    this.route = parts[0] || "catalog";
    this.eventId = parts[1] || null;
    this.requestUpdate();
  }

  navigateTo(route) {
    window.history.pushState({}, "", route);
    this.updateRoute();
  }

  render() {
    return html`
      ${this.route === "catalog"
        ? html`
            <event-data
              .navigateTo="${this.navigateTo.bind(this)}"
            ></event-data>
          `
        : this.route === "add"
        ? html` <event-form></event-form> `
        : this.route === "edit" && this.eventId
        ? html`
            <event-form
              .eventId="${this.eventId}"
              .isEdit="${true}"
            ></event-form>
          `
        : html` <p>Page not found</p> `}
    `;
  }
}

customElements.define("app-router", AppRouter);
