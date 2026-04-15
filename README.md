<div align="center">

# بِطاقة — Bitaqa

### منصة البطاقة الرقمية الاحترافية

**اعرض مهاراتك ومشاريعك للعالم في رابط واحد**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-bitaqa--production.up.railway.app-6d28d9?style=for-the-badge&logo=railway&logoColor=white)](https://bitaqa-production.up.railway.app)
[![GitHub](https://img.shields.io/badge/GitHub-SultanAlfaifi%2FBitaqa-181717?style=for-the-badge&logo=github)](https://github.com/SultanAlfaifi/Bitaqa)

![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.2-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Railway](https://img.shields.io/badge/Deployed_on-Railway-0B0D0E?style=flat-square&logo=railway)

</div>

---

## ما هو بِطاقة؟

**بِطاقة** هو منصة لإنشاء بطاقة تعريفية رقمية احترافية — مثل Linktree ولكن مصممة للمطورين والمهنيين العرب. أنشئ ملفك الشخصي في دقائق واحصل على رابط مخصص تشاركه في سيرتك الذاتية ووسائل التواصل الاجتماعي.

```
bitaqa-production.up.railway.app/p/اسمك
```

---

## المميزات

| الميزة | التفاصيل |
|--------|----------|
| 🎨 **بطاقة شخصية** | صفحة عامة بتصميم احترافي تعرض ملفك الشخصي |
| 🔧 **المهارات** | أضف مهاراتك مع تحديد المستوى (مبتدئ / متوسط / خبير) |
| 📁 **المشاريع** | اعرض مشاريعك مع الوصف والروابط والصور |
| 🔗 **روابط التواصل** | GitHub, LinkedIn, Twitter, Instagram والمزيد |
| 📊 **الإحصائيات** | تتبع عدد زيارات بطاقتك يومياً مع رسم بياني |
| 🔒 **الخصوصية** | تحكم في ظهور بطاقتك (عام / خاص) |
| 🔑 **JWT Auth** | مصادقة آمنة بـ Access + Refresh tokens |

---

## التقنيات المستخدمة

### الباك-إند
- **Java 17** + **Spring Boot 3.2**
- **Spring Security** + **JWT** (jjwt 0.12)
- **Spring Data JPA** + **Hibernate**
- **MySQL** (HikariCP connection pool)
- **Lombok** لتقليل الكود المتكرر

### الفرونت-إند
- **React 18** + **Vite**
- **Tailwind CSS** للتصميم
- **React Router v6** للتنقل
- **Axios** مع JWT interceptors
- **Recharts** للرسوم البيانية

### البنية التحتية
- **Docker** (multi-stage build)
- **Railway** للنشر والاستضافة
- **MySQL** على Railway

---

## هيكل المشروع

```
Bitaqa/
├── Dockerfile                          # Multi-stage Docker build
├── pom.xml                             # Maven + frontend-maven-plugin
├── frontend/                           # React + Vite
│   └── src/
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── AnalyticsPage.jsx
│       │   └── PublicProfilePage.jsx
│       ├── context/AuthContext.jsx
│       └── services/                   # API calls
└── src/main/java/com/bitaqa/
    ├── controller/                     # REST endpoints
    ├── service/                        # Business logic
    ├── domain/entity/                  # JPA entities
    ├── security/                       # JWT filter + UserDetails
    ├── config/                         # Security + JWT config
    ├── dto/                            # Request/Response DTOs
    └── exception/                      # Global error handling
```

---

## API Endpoints

### المصادقة — `/api/v1/auth`
| Method | Endpoint | الوصف |
|--------|----------|-------|
| `POST` | `/register` | تسجيل مستخدم جديد |
| `POST` | `/login` | تسجيل الدخول |
| `POST` | `/refresh` | تجديد الـ access token |
| `POST` | `/logout` | تسجيل الخروج |

### الملف الشخصي — `/api/v1/profile` 🔒
| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/me` | جلب ملفي الشخصي |
| `PUT` | `/me` | تحديث البيانات |
| `PATCH` | `/me/username` | تغيير اسم المستخدم |
| `PATCH` | `/me/visibility` | تبديل العام/الخاص |
| `GET/POST/PUT/DELETE` | `/me/skills` | إدارة المهارات |
| `GET/POST/PUT/DELETE` | `/me/projects` | إدارة المشاريع |
| `GET/POST/PUT/DELETE` | `/me/links` | إدارة الروابط |
| `GET` | `/me/analytics` | ملخص الإحصائيات |

### الملف العام — `/api/v1/p`
| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/{username}` | جلب الملف العام (بدون مصادقة) |

---

## التشغيل محلياً

### المتطلبات
- Java 17+
- Node.js 20+
- MySQL 8+
- Maven 3.9+

### الخطوات

```bash
# 1. استنسخ المشروع
git clone https://github.com/SultanAlfaifi/Bitaqa.git
cd Bitaqa

# 2. أنشئ قاعدة البيانات
mysql -u root -p -e "CREATE DATABASE bitaqa_db CHARACTER SET utf8mb4;"

# 3. شغّل الباك-إند
mvn spring-boot:run -DskipFrontend=true

# 4. في terminal جديد، شغّل الفرونت-إند
cd frontend
npm install
npm run dev
```

افتح المتصفح على: `http://localhost:5173`

### متغيرات البيئة

أنشئ ملف `application-local.properties` في `src/main/resources/`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bitaqa_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
app.jwt.secret-key=your-strong-secret-key-minimum-32-characters
```

---

## النشر على Railway

المشروع جاهز للنشر على Railway بـ Dockerfile متعدد المراحل:

1. **Fork** المشروع على GitHub
2. أنشئ مشروعاً جديداً على [Railway](https://railway.app)
3. اربط الـ GitHub repo
4. أضف خدمة **MySQL**
5. أضف متغير البيئة `JWT_SECRET`
6. Railway سيبني وينشر تلقائياً ✅

---

## الأمان

- كلمات المرور مشفرة بـ **BCrypt** (cost factor 12)
- JWT Access Token: صلاحية **15 دقيقة**
- JWT Refresh Token: صلاحية **7 أيام** مع rotation
- عناوين IP محفوظة كـ **SHA-256 hash** في الإحصائيات
- فحص ملكية الموارد لمنع الوصول غير المصرح به

---

## صاحب المشروع

**Sultan Alfaifi**

[![GitHub](https://img.shields.io/badge/GitHub-SultanAlfaifi-181717?style=flat-square&logo=github)](https://github.com/SultanAlfaifi)

---

<div align="center">

صُنع بِ ❤️ للمطورين العرب

**[جرّب بِطاقة الآن →](https://bitaqa-production.up.railway.app)**

</div>
