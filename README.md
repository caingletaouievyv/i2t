# i2t System Documentation  

**i2t** is a full-stack OCR application built with **React (frontend)** and **ASP.NET Core (backend)**.  
It showcases a **demo-friendly and extensible architecture** with:  

- OCR via **Tesseract**  
- Dictionary auto-correction via **Hunspell**  
- JWT-based authentication  
- Image cropping & bounding box re-OCR  
- API-first backend with secure endpoints  

Designed for **rapid prototyping and scalable OCR workflows**.  

---

## Live Demo / API  
- **Frontend:** [https://i2t.netlify.app/](https://i2t.netlify.app/)  
- **Backend:** [https://i2t-27gz.onrender.com](https://i2t-27gz.onrender.com)  

---

## Repository  
- GitHub: [caingletaouievyv/i2t](https://github.com/caingletaouievyv/i2t)  
  - **Frontend:** `/i2t-Client`  
  - **Backend:** `/i2t-Api`  

---

## System Architecture  

### Frontend  
- **Framework:** React (Vite)  
- **UI Framework:** TailwindCSS + custom components  
- **Routing:** React Router  
- **HTTP Client:** Axios with `authHeaders()` helper  
- **State/Token Storage:** LocalStorage for JWT  
- **Features:**  
  - Bounding box selection  
  - Re-OCR with dictionary toggle  
  - Context menu for copy & reprocessing  

### Backend  
- **Framework:** ASP.NET Core Web API  
- **OCR Engine:** Tesseract OCR (`TesseractEngine`)  
- **Dictionary Support:** Hunspell (`WeCantSpell.Hunspell`)  
- **Image Processing:** SixLabors ImageSharp  
- **Authentication:** JWT (with issuer/audience validation)  
- **Deployment:** Render / Azure App Service  

---

## Authentication  

- **Auth Type:** JWT Bearer  
- **Token Storage Method:** LocalStorage  
- **Token Refresh Handling Strategy:** Manual (no auto-refresh yet)  
- **Client Interceptors:** Axios injects `Authorization: Bearer <token>`  

---

## Tech Stack Summary  

| Layer     | Technology |
|-----------|------------|
| Frontend  | React (Vite), Tailwind, Axios |
| Backend   | ASP.NET Core Web API |
| Database  | InMemory (no persistent DB yet) |
| OCR       | Tesseract OCR |
| Dictionary| Hunspell (WeCantSpell) |
| Auth      | JWT (Bearer Tokens) |
| Export    | N/A (planned future) |
| Hosting   | Render / Azure |

---

## Project Folder Structure  

### Client (`i2t-client`)  
- `src/components/` – Reusable UI components (BoundingBoxCanvas, ImageUploader, etc.)  
- `src/views/` – Page-level views (Login, Dashboard, OCR results)  
- `src/services/` – API integration logic (OCR, Auth)  
- `src/config/` – API URLs & JWT helpers  
- `src/routes/` – Routing with protected routes  
- `src/tests/` – Jest + React Testing Library  

### API (`i2t-api`)  
- `Controllers/` – REST endpoints (AuthController, OcrController)  
- `Services/` – Business logic (TesseractOcrService)  
- `Models/` – Domain entities (OcrResult, OcrBox, AuthRequest)  
- `DTO/` – Request/response binding models  
- `Data/` – Future DB context (currently in-memory)  
- `Tests/` – xUnit test cases  

---

## Auth Flow  

1. User logs in with username + password.  
2. Backend issues a **JWT token** (2-hour expiry).  
3. Client stores token in **LocalStorage**.  
4. Axios automatically attaches `Authorization: Bearer <token>` header.  
5. Backend validates with configured **Issuer, Audience, Key**.  
6. User session ends when token expires (manual re-login).  

---

## Core Features  

- Upload single/multiple images for OCR  
- Automatic bounding box detection  
- Context menu per bounding box:  
  - 📋 Copy word  
  - 🔄 Re-OCR (exact box)  
  - 🔍 Re-OCR (expanded box)  
- Hunspell dictionary correction toggle  
- JWT-secured API endpoints  

---

## Database & Seeding  

- **Database:** InMemory (no persistence yet)  
- **Seeding:** Demo user → `demo/password`  
- To enable persistent DB → update `Program.cs` & `appsettings.json` with EF Core + SQL provider.  

---

## Environment Setup  

### Frontend `.env`  
VITE_API_BASE_URL=http://localhost:5000

### Backend appsettings.json
- "Jwt": {
-  "Key": "UltraMaxSuperSecretKey12345_ChangeMe!!",
-  "Issuer": "i2tApi",
-   "Audience": "i2tClient"
- }

## Deployment

- Frontend: Netlify / Render / Vercel
- Backend: Render / Azure App Service
- CI/CD: GitHub Actions (build + deploy)
- Secrets/Env Vars:
- .env (frontend)
- Render Dashboard (backend)

## Future Plans

- Add persistent database (SQL Server / PostgreSQL)
- Role-based authentication (admin/user)
- Export OCR results (CSV, Excel, PDF)
- Auto token refresh & session management
- Real-time OCR progress via SignalR
- Expand dictionary to support multiple languages