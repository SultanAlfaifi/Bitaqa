<div align="center">

# بِطاقة &nbsp;·&nbsp; Bitaqa

### Your Professional Digital Profile Card

**Showcase your skills, projects, and links — all in one shareable URL**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-bitaqa--production.up.railway.app-6d28d9?style=for-the-badge&logo=railway&logoColor=white)](https://bitaqa-production.up.railway.app)
[![GitHub](https://img.shields.io/badge/GitHub-SultanAlfaifi%2FBitaqa-181717?style=for-the-badge&logo=github)](https://github.com/SultanAlfaifi/Bitaqa)

![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.2-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Railway](https://img.shields.io/badge/Deployed_on-Railway-0B0D0E?style=flat-square&logo=railway)

</div>

---

## What is Bitaqa?

**Bitaqa** (Arabic for "card") is a platform for building a professional digital identity card — think Linktree, but designed for developers and professionals. Create your profile in minutes and get a custom link to share in your CV, LinkedIn, and social media.

```
bitaqa-production.up.railway.app/p/your-username
```

---

## Features

| Feature | Description |
|---------|-------------|
| 🎨 **Public Profile Card** | Beautiful public page showcasing your full profile |
| 🔧 **Skills** | Add skills with proficiency levels (Beginner / Intermediate / Expert) |
| 📁 **Projects** | Showcase your work with descriptions, links, and images |
| 🔗 **Social Links** | GitHub, LinkedIn, Twitter, Instagram, YouTube, and more |
| 📊 **Analytics** | Track daily profile views with an interactive chart |
| 🔒 **Privacy Control** | Toggle your profile between Public and Private |
| 🔑 **Secure Auth** | JWT-based authentication with Access + Refresh token rotation |

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 17 | Core language |
| Spring Boot | 3.2 | Application framework |
| Spring Security | 6 | Authentication & authorization |
| jjwt | 0.12 | JWT token generation & validation |
| Spring Data JPA | — | ORM & database access |
| MySQL | 8 | Relational database |
| HikariCP | — | Connection pooling |
| Lombok | — | Boilerplate reduction |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Utility-first styling |
| React Router | v6 | Client-side routing |
| Axios | — | HTTP client with interceptors |
| Recharts | — | Analytics charts |
| Lucide React | — | Icon library |

### Infrastructure
- **Docker** — Multi-stage build (Node → Maven → JRE Alpine)
- **Railway** — Cloud hosting & MySQL database
- **GitHub Actions** — Auto-deploy on push

---

## Project Structure

```
Bitaqa/
├── Dockerfile                          # Multi-stage Docker build
├── pom.xml                             # Maven + frontend-maven-plugin
├── frontend/                           # React + Vite app
│   └── src/
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── AnalyticsPage.jsx
│       │   └── PublicProfilePage.jsx
│       ├── context/
│       │   └── AuthContext.jsx         # Global auth state
│       └── services/
│           ├── api.js                  # Axios + JWT interceptors
│           └── *.js                    # Feature-specific services
└── src/main/java/com/bitaqa/
    ├── controller/                     # REST controllers
    ├── service/                        # Business logic
    ├── domain/entity/                  # JPA entities
    ├── domain/enums/                   # SkillLevel, Visibility, Platform
    ├── repository/                     # Spring Data repositories
    ├── security/                       # JWT filter + UserDetailsService
    ├── config/                         # SecurityConfig + JwtConfig
    ├── dto/                            # Request & Response DTOs
    └── exception/                      # Global exception handler
```

---

## API Reference

### Authentication — `/api/v1/auth` (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Create a new account → `201 AuthResponse` |
| `POST` | `/login` | Sign in → `200 AuthResponse` |
| `POST` | `/refresh` | Rotate tokens → `200 AuthResponse` |
| `POST` | `/logout` | Revoke refresh token → `204` |
| `POST` | `/logout-all` | Revoke all sessions → `204` |

### Profile — `/api/v1/profile` 🔒 JWT Required
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/me` | Get my profile |
| `PUT` | `/me` | Update profile fields |
| `PATCH` | `/me/username` | Change username |
| `PATCH` | `/me/visibility` | Toggle PUBLIC / PRIVATE |

### Skills, Projects & Links — 🔒 JWT Required
| Method | Endpoints |
|--------|-----------|
| `GET / POST` | `/me/skills` · `/me/projects` · `/me/links` |
| `PUT / DELETE` | `/me/skills/{id}` · `/me/projects/{id}` · `/me/links/{id}` |
| `PATCH` | `/me/projects/reorder` |

### Analytics — 🔒 JWT Required
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/me/analytics` | Summary (total, 7d, 30d views) |
| `GET` | `/me/analytics/daily?days=30` | Daily breakdown |

### Public Profile — No Auth Required
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/p/{username}` | Fetch public profile (404 if private) |

---

## Running Locally

### Prerequisites
- Java 17+
- Node.js 20+
- MySQL 8+
- Maven 3.9+

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/SultanAlfaifi/Bitaqa.git
cd Bitaqa

# 2. Create the database
mysql -u root -p -e "CREATE DATABASE bitaqa_db CHARACTER SET utf8mb4;"

# 3. Configure local properties
cp src/main/resources/application.properties src/main/resources/application-local.properties
# Edit application-local.properties with your DB credentials

# 4. Start the backend (skip frontend build)
mvn spring-boot:run -DskipFrontend=true

# 5. In a new terminal, start the frontend dev server
cd frontend
npm install
npm run dev
```

Open your browser at: **`http://localhost:5173`**

### Environment Variables

```properties
# src/main/resources/application-local.properties
spring.datasource.url=jdbc:mysql://localhost:3306/bitaqa_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
app.jwt.secret-key=your-strong-base64-secret-key-minimum-32-chars
```

---

## Deploying to Railway

This project ships with a production-ready multi-stage `Dockerfile`.

1. **Fork** this repository
2. Create a new project on [Railway](https://railway.app)
3. Connect your GitHub repo — Railway auto-detects the Dockerfile
4. Add a **MySQL** database service
5. In the Bitaqa service → **Variables**, add:
   - `MYSQLHOST` → `${{MySQL.MYSQLHOST}}`
   - `MYSQLPORT` → `${{MySQL.MYSQLPORT}}`
   - `MYSQLDATABASE` → `${{MySQL.MYSQLDATABASE}}`
   - `MYSQLUSER` → `${{MySQL.MYSQLUSER}}`
   - `MYSQLPASSWORD` → `${{MySQL.MYSQLPASSWORD}}`
   - `JWT_SECRET` → a strong Base64 secret (no hyphens)
6. Generate a public domain under **Settings → Networking**
7. Railway builds and deploys automatically on every push ✅

---

## Security Design

- Passwords hashed with **BCrypt** (cost factor 12)
- JWT **Access Token** expires in 15 minutes
- JWT **Refresh Token** expires in 7 days with automatic rotation
- IP addresses stored as **SHA-256 hashes** (privacy-first analytics)
- Ownership checks on all mutations — resources return `404` (not `403`) to avoid enumeration

---

## Content Limits

| Resource | Limit |
|----------|-------|
| Skills per profile | 30 |
| Projects per profile | 20 |
| Social links per profile | 10 |
| Username length | 3–30 chars (`[a-z0-9-]`) |

---

## Author

**Sultan Alfaifi**

[![GitHub](https://img.shields.io/badge/GitHub-SultanAlfaifi-181717?style=flat-square&logo=github)](https://github.com/SultanAlfaifi)
[![Bitaqa Profile](https://img.shields.io/badge/Bitaqa-View%20My%20Card-6d28d9?style=flat-square)](https://bitaqa-production.up.railway.app)

---

<div align="center">

Built with ❤️ for Arab developers

**[Try Bitaqa now →](https://bitaqa-production.up.railway.app)**

</div>
