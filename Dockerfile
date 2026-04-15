# ─────────────────────────────────────────────────────────────
# Stage 1: Build React frontend
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

# Cache npm dependencies
COPY frontend/package*.json ./
RUN npm ci

# Build
COPY frontend/ ./
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 2: Build Spring Boot JAR (skip frontend-maven-plugin)
# ─────────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app

# Cache Maven dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -DskipFrontend=true -q

# Copy source
COPY src ./src

# Copy the already-built frontend into the static resources folder
COPY --from=frontend-build /app/frontend/dist/ ./src/main/resources/static/

# Build the JAR (skip tests + skip frontend plugin since we already built it)
RUN mvn package -DskipTests -DskipFrontend=true -q

# ─────────────────────────────────────────────────────────────
# Stage 3: Minimal runtime image
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the fat JAR
COPY --from=backend-build /app/target/*.jar app.jar

# Railway injects PORT at runtime
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
