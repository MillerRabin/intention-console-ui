# Intention Network WebConsole

**Intention Console UI** is a web debugger for **Intention Network**.  
It uses both voice and text prompts to send commands to the internal infrastructure.

---

## 📂 Project Structure

- **`builder/`** — contains the project builder.  
  It generates HTML files from Pug templates.
- **`deploy/`** — contains files for CI/CD.
- **`server/`** — debug server (used only in local environments).
- **`static/`** — web server root.
- **`test/`** — automated tests.

---

## ⚙️ Dependencies

- **Node.js** version **14+**

---

## 🚀 Installation

1. Install dependencies for both the main project and the builder:

   ```sh
   npm install
   cd ./builder
   npm install
