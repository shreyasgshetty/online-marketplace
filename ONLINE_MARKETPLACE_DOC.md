
# Online Marketplace - Complete Project Documentation

## 1) Project Overview
This repository is a full-stack online marketplace system with:
- A Spring Boot backend using MongoDB for data persistence
- A React + Vite frontend for user interaction
- Local file upload support for product and banner images
- Role-ready authentication model (USER, ADMIN, FINANCE_MANAGER)

The project supports:
- User registration/login (including Google-sign-in integration on frontend)
- Profile management with map-based location selection
- Product listing and browsing (trending/recommended/category-based)
- Banner management for homepage hero carousel
- Basic dashboard routes for admin and finance manager

---

## 2) Complete Folder Structure

```text
online-marketplace/
├── .DS_Store
├── .git/
│   ├── FETCH_HEAD
│   ├── HEAD
│   ├── ORIG_HEAD
│   ├── config
│   ├── description
│   ├── hooks/
│   ├── index
│   ├── info/
│   ├── logs/
│   ├── objects/
│   ├── packed-refs
│   └── refs/
├── ONLINE_MARKETPLACE_DOC.md
├── README.md
├── backend/
│   ├── .DS_Store
│   ├── .vscode/
│   │   └── settings.json
│   └── marketplace/
│       ├── .DS_Store
│       ├── .gitattributes
│       ├── .gitignore
│       ├── .mvn/
│       │   └── wrapper/
│       │       └── maven-wrapper.properties
│       ├── mvnw
│       ├── mvnw.cmd
│       ├── pom.xml
│       ├── src/
│       │   └── main/
│       │       ├── java/
│       │       │   └── com/
│       │       │       └── online/
│       │       │           └── marketplace/
│       │       │               ├── MarketplaceApplication.java
│       │       │               ├── builder/
│       │       │               │   └── ProductBuilder.java
│       │       │               ├── config/
│       │       │               │   ├── SecurityConfig.java
│       │       │               │   └── WebConfig.java
│       │       │               ├── controller/
│       │       │               │   ├── AuthController.java
│       │       │               │   ├── BannerController.java
│       │       │               │   ├── FileController.java
│       │       │               │   └── ProductController.java
│       │       │               ├── factory/
│       │       │               │   └── UserFactory.java
│       │       │               ├── model/
│       │       │               │   ├── Banner.java
│       │       │               │   ├── Product.java
│       │       │               │   ├── Role.java
│       │       │               │   └── User.java
│       │       │               ├── repository/
│       │       │               │   ├── BannerRepository.java
│       │       │               │   ├── ProductRepository.java
│       │       │               │   └── UserRepository.java
│       │       │               └── service/
│       │       │                   ├── ProductService.java
│       │       │                   └── UserService.java
│       │       └── resources/
│       │           └── application.properties
│       └── target/
│           ├── classes/
│           │   ├── application.properties
│           │   └── com/
│           │       └── online/
│           │           └── marketplace/
│           │               ├── MarketplaceApplication.class
│           │               ├── builder/
│           │               ├── config/
│           │               ├── controller/
│           │               ├── factory/
│           │               ├── model/
│           │               ├── repository/
│           │               └── service/
│           ├── generated-sources/
│           │   └── annotations/
│           ├── generated-test-sources/
│           │   └── test-annotations/
│           ├── marketplace-0.0.1-SNAPSHOT.jar
│           ├── marketplace-0.0.1-SNAPSHOT.jar.original
│           ├── maven-archiver/
│           │   └── pom.properties
│           ├── maven-status/
│           │   └── maven-compiler-plugin/
│           │       └── compile/
│           │           └── default-compile/
│           │               ├── createdFiles.lst
│           │               └── inputFiles.lst
│           └── test-classes/
└── frontend/
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── node_modules/                       # dependency tree (very large)
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    ├── public/
    │   ├── vite.svg
    │   └── categories/
    │       ├── automobile.jpg
    │       ├── books.jpg
    │       ├── electronics.jpg
    │       ├── fashion.jpg
    │       ├── home.jpg
    │       ├── malignant_breakhis.png
    │       └── sports.jpg
    └── src/
        ├── App.css
        ├── App.jsx
        ├── firebase.js
        ├── index.css
        ├── main.jsx
        ├── assets/
        │   └── react.svg
        ├── components/
        │   ├── CategoryBanners.jsx
        │   ├── HeroCarousel.jsx
        │   ├── Navbar.jsx
        │   ├── ProductCard.jsx
        │   ├── ProductCarousel.jsx
        │   ├── ProductGrid.jsx
        │   └── ProductSkeleton.jsx
        ├── data/
        │   └── locationData.js
        ├── pages/
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Profile.jsx
        │   ├── Register.jsx
        │   ├── SellProduct.jsx
        │   ├── Admin/
        │   │   └── AdminDashboard.jsx
        │   └── FinanceManager/
        │       └── FinanceDashboard.jsx
        └── services/
            └── api.js
```

---

## 3) Architecture Summary

### 3.1 Backend Architecture
- Framework: Spring Boot 3.3.5
- Java: 21
- Database: MongoDB (Spring Data MongoDB)
- API style: REST controllers
- Security: Spring Security configured with BCrypt encoder and `permitAll` for all routes
- Storage:
  - MongoDB for entities
  - Local disk (`uploads/`) for media files

### 3.2 Frontend Architecture
- Framework: React 19 with Vite
- Routing: React Router
- API client: Axios (`baseURL = http://localhost:8080`)
- Styling: Tailwind + custom CSS
- Animation/UI: Framer Motion, react-slick
- Maps: React Leaflet + OpenStreetMap tiles
- Auth provider integration: Firebase Auth (Google popup sign-in)

---

## 4) Backend Technical Documentation

### 4.1 Maven Dependencies (Core)
- `spring-boot-starter-web`
- `spring-boot-starter-data-mongodb`
- `spring-boot-starter-security`
- `spring-boot-starter-validation`
- `spring-boot-devtools`
- `lombok`
- `spring-boot-starter-test`

### 4.2 Package Responsibilities
- `config`: web/static and security config
- `controller`: HTTP endpoint definitions
- `service`: business logic and validation
- `repository`: MongoDB data access interfaces
- `model`: persistence/domain classes
- `builder`: Product builder pattern implementation
- `factory`: User factory pattern implementation

### 4.3 Configuration
From `application.properties`:
- `spring.application.name=marketplace`
- `spring.data.mongodb.uri=...`
- `spring.data.mongodb.database=OnlineMarketPlace`
- `server.port=8080`

### 4.4 API Endpoints

#### AuthController (`/api/auth`)
- `POST /register`
  - Registers user or returns existing one (useful for Google auth flow)
- `POST /login`
  - Validates email/password (or handles `GOOGLE_AUTH`)
- `GET /profile/{email}`
  - Returns user profile by email
- `PUT /profile/{email}`
  - Updates profile fields (phone, address, city, state, lat/lng, picture URL)

#### ProductController (`/api/products`)
- `POST /sell`
  - Creates product listing
  - Applies business validation:
    - `fixed` requires `price`
    - `auction` requires `baseBidPrice`, `auctionStart`, `auctionEnd`
- `GET /`
  - Returns all products
- `GET /trending`
  - Returns first 10 products
- `GET /recommended`
  - Returns next 10 products
- `GET /category/{category}`
  - Returns products filtered by category

#### BannerController (`/api/banners`)
- `GET /`
  - Returns all banners
- `POST /upload`
  - Multipart upload for banner image and metadata
- `DELETE /{id}`
  - Deletes banner document by id

#### FileController (`/api/files`)
- `POST /upload`
  - Generic image/file upload endpoint
  - Returns public URL: `http://localhost:8080/uploads/<fileName>`

### 4.5 Data Models

#### Product
Key fields:
- Seller/meta: `sellerEmail`, `title`, `category`, `brand`, `condition`, `description`
- Media/taxonomy: `images[]`, `tags[]`
- Pricing:
  - fixed: `price`
  - auction: `baseBidPrice`, `bidIncrement`, `auctionStart`, `auctionEnd`
- geo/time: `city`, `state`, `createdAt`
- negotiation: `negotiable`

#### User
Key fields:
- identity: `name`, `email`, `password`, `role`
- profile: `phone`, `address`, `profilePictureUrl`, `city`, `state`
- geo: `latitude`, `longitude`

#### Banner
Key fields:
- `imageUrl`
- `redirectCategory`
- `title`
- `description`
- `tag`

#### Role enum
- `USER`
- `ADMIN`
- `FINANCE_MANAGER`

### 4.6 Design Patterns Used
- Builder Pattern:
  - `ProductBuilder` creates product object incrementally based on selling mode.
- Factory Pattern:
  - `UserFactory` creates user and enforces role/password setup logic.

---

## 5) Frontend Technical Documentation

### 5.1 Routing
Defined in `App.jsx`:
- `/` -> Home
- `/register` -> Register
- `/login` -> Login
- `/profile` -> Profile
- `/sell` -> SellProduct
- `/admin` -> AdminDashboard
- `/finance` -> FinanceDashboard

### 5.2 Main Pages

#### Home
- Loads trending and recommended products from backend
- Renders:
  - Navbar
  - Hero banner carousel (dynamic from backend banners)
  - Product carousels
  - Category banner grid

#### Register
- Supports email/password registration and Google popup sign-in
- Displays toast notifications
- Redirects to home after success

#### Login
- Supports standard login and Google sign-in flow
- Stores user data in localStorage
- Redirects by role:
  - USER -> `/`
  - ADMIN -> `/admin`
  - FINANCE_MANAGER -> `/finance`

#### Profile
- Fetches user profile from backend using email from localStorage
- Editable profile fields: phone/address/city/state/location/picture
- Map modal to pick exact latitude/longitude
- Uploads profile image via `/api/files/upload`

#### SellProduct
- Form for creating listings with rich UI
- Uploads up to 10 product images
- Supports both fixed-price and auction listing modes
- Sends final listing payload to `/api/products/sell`

#### Admin / Finance dashboards
- Current placeholders for role-specific screens

### 5.3 Core Components

- Navbar:
  - Category nav, profile menu, mobile menu, logout support
- HeroCarousel:
  - Reads banners from backend and shows animated hero slides
- ProductCarousel:
  - Slick slider for product cards
- ProductCard:
  - Shows first image, title, category, and price or base bid
- ProductGrid:
  - Infinite scroll layout wrapper
- CategoryBanners:
  - Category cards with animation and route navigation
- ProductSkeleton:
  - Loading placeholder card

### 5.4 Frontend Service Layer
- `src/services/api.js`
  - Axios instance with `baseURL: http://localhost:8080`
  - Centralized API usage

### 5.5 External Integrations
- Firebase Auth:
  - Google popup sign-in configured in `firebase.js`
- React Leaflet:
  - Used for map rendering and location selection
- Framer Motion + react-slick:
  - Animation and carousel behavior

---

## 6) Data Flow (User Journeys)

### 6.1 Register/Login Journey
1. User submits auth form (or Google popup).
2. Frontend calls backend auth endpoint.
3. Backend creates/finds user and returns user object.
4. Frontend stores user in localStorage and redirects.

### 6.2 Sell Product Journey
1. User uploads images to `/api/files/upload`.
2. Backend saves files under `uploads/` and returns public URLs.
3. Frontend includes URLs in product payload and posts to `/api/products/sell`.
4. Backend validates by selling type, builds object with `ProductBuilder`, saves to MongoDB.

### 6.3 Profile Update Journey
1. Frontend fetches profile by email.
2. User edits details and optionally map location.
3. User saves -> `PUT /api/auth/profile/{email}`.
4. Backend persists updated fields.

### 6.4 Home Screen Data Loading
1. Home mounts.
2. Calls:
   - `/api/products/trending`
   - `/api/products/recommended`
   - Hero carousel internally calls `/api/banners`
3. UI updates with fetched data.

---

## 7) Security and Risk Notes

Current implementation characteristics:
- All routes are `permitAll` in security config.
- MongoDB credentials and Firebase config appear in source.
- CORS configured broadly (`@CrossOrigin("*")` in multiple controllers).

Recommendations:
- Add JWT/session-based auth and endpoint protection.
- Move secrets to environment variables.
- Restrict CORS by known frontend origins.
- Add DTO validation and structured exception handling.
- Add authorization checks for admin-only operations.

---

## 8) Build and Run

## Backend
From `backend/marketplace`:
```bash
mvn clean install
mvn spring-boot:run
```

Alternative:
```bash
java -jar target/marketplace-0.0.1-SNAPSHOT.jar
```

## Frontend
From `frontend`:
```bash
npm install
npm run dev
```

Other useful commands:
```bash
npm run build
npm run preview
npm run lint
```

---

## 9) Current Project Status Snapshot

Implemented:
- User auth flows
- Product listing flow with fixed/auction logic
- Profile management with map and image upload
- Banner management and homepage integration

Partially implemented / placeholder:
- Admin and finance dashboards (UI placeholder only)
- Advanced search/filter/wishlist backend integration
- Real auction lifecycle logic (bidding engine, timers, winners)

---

## 10) Suggested Next Development Steps
1. Implement protected routes and backend authorization.
2. Add API pagination and sorting for product feeds.
3. Build category route pages currently linked from navbar.
4. Create admin tools for moderating users/products/banners.
5. Add unit + integration tests for services/controllers.
6. Add centralized error handling in backend (`@ControllerAdvice`).
7. Add CI for frontend lint + backend test/build.

---

## 11) Key File References
- Backend entrypoint: [backend/marketplace/src/main/java/com/online/marketplace/MarketplaceApplication.java](backend/marketplace/src/main/java/com/online/marketplace/MarketplaceApplication.java)
- Security config: [backend/marketplace/src/main/java/com/online/marketplace/config/SecurityConfig.java](backend/marketplace/src/main/java/com/online/marketplace/config/SecurityConfig.java)
- Product API: [backend/marketplace/src/main/java/com/online/marketplace/controller/ProductController.java](backend/marketplace/src/main/java/com/online/marketplace/controller/ProductController.java)
- Product service: [backend/marketplace/src/main/java/com/online/marketplace/service/ProductService.java](backend/marketplace/src/main/java/com/online/marketplace/service/ProductService.java)
- Frontend app routes: [frontend/src/App.jsx](frontend/src/App.jsx)
- Sell page: [frontend/src/pages/SellProduct.jsx](frontend/src/pages/SellProduct.jsx)
- Profile page: [frontend/src/pages/Profile.jsx](frontend/src/pages/Profile.jsx)
- API client: [frontend/src/services/api.js](frontend/src/services/api.js)

EOF
```