# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
# Cache dependencies
RUN mvn dependency:go-offline -B
COPY src ./src
# Compile and package application (skip tests in docker build for speed)
RUN mvn package -DskipTests -B

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/pathway-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
# Enable Byte Buddy experimental if needed, but since Docker runs on JDK 21, it is 100% native
ENTRYPOINT ["java", "-jar", "app.jar"]
