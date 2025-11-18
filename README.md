# HouPlatform Backend

Web application backend for finding rental houses and roommates.

## Technology Stack

- **Java**: 17
- **Spring Boot**: 3.5.7
- **Build Tool**: Maven
- **Framework**: Spring Web

## Prerequisites

- Java 17 or higher
- Maven 3.6+ (or use the included Maven wrapper)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/anlecute/houplatform-be.git
cd houplatform-be
```

### Build the Project

Using Maven wrapper (recommended):

```bash
# Windows
mvnw.cmd clean install

# Unix/Linux/Mac
./mvnw clean install
```

Or using Maven:

```bash
mvn clean install
```

### Run the Application

```bash
# Windows
mvnw.cmd spring-boot:run

# Unix/Linux/Mac
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080` by default.

## Project Structure

```
houplatform-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/anle/houplatform_backend/
│   │   │       └── HouplatformBackendApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       └── templates/
│   └── test/
│       └── java/
│           └── com/anle/houplatform_backend/
│               └── HouplatformBackendApplicationTests.java
├── pom.xml
└── README.md
```

## Configuration

Configuration properties can be modified in `src/main/resources/application.properties`.

## Running Tests

```bash
# Windows
mvnw.cmd test

# Unix/Linux/Mac
./mvnw test
```

## Building for Production

```bash
# Windows
mvnw.cmd clean package

# Unix/Linux/Mac
./mvnw clean package
```

The JAR file will be created in the `target/` directory.

## License

[Add your license information here]

## Author

AnLe

## Contributing

[Add contributing guidelines here]
