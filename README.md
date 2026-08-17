# Identity Service

A dedicated **Identity Service** responsible for user registration, authentication, authorization, and identity management in the MedVerify microservices architecture.

The service is built using **Java, Spring Boot, Spring Security, JPA/Hibernate, PostgreSQL, and JWT**.

---

## 1. Purpose of This Branch

This branch contains the initial implementation of the **Identity Service**.

The main objective of this service is to separate identity and authentication responsibilities from the other business services in the application.

Instead of every microservice implementing its own authentication logic, the Identity Service acts as the centralized component responsible for:

* User registration
* User authentication
* Password encryption
* JWT generation
* JWT validation
* User identity management
* Role/authority management
* Persistent storage of identity information

### Branch Responsibility

```text
Client
  |
  v
Identity Service
  |
  +-- Registration
  +-- Authentication
  +-- Password Hashing
  +-- JWT Generation
  +-- User Management
  |
  v
PostgreSQL
```

---

# 2. Architecture

The Identity Service follows a layered Spring Boot architecture.

```text
                    ┌─────────────────────┐
                    │       Client        │
                    │  Web / Mobile / API │
                    └──────────┬──────────┘
                               │
                               │ HTTP Request
                               ▼
                    ┌─────────────────────┐
                    │   Identity Service  │
                    │     Spring Boot     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │    Controller Layer  │
                    │                      │
                    │ AuthController       │
                    │ UserController       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Service Layer   │
                    │                      │
                    │ Authentication       │
                    │ Registration         │
                    │ User Management      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Security Layer    │
                    │                      │
                    │ Spring Security      │
                    │ JWT                  │
                    │ Password Encoder     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Repository Layer  │
                    │                      │
                    │ Spring Data JPA      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │   Identity Database │
                    └─────────────────────┘
```

---

# 3. Request Flow

## Registration Flow

When a new user registers:

```text
Client
   |
   | POST /api/v1/auth/register
   |
   v
AuthController
   |
   v
AuthService
   |
   +---- Validate user information
   |
   +---- Check existing user
   |
   +---- Hash password
   |
   +---- Create User entity
   |
   v
UserRepository
   |
   v
PostgreSQL
```

The password is **never stored as plain text**.

For example:

```text
Input Password:
mypassword123

Database:
$2a$10$.................hashed-password
```

---

# 4. Authentication Flow

When an existing user logs in:

```text
Client
   |
   | POST /api/v1/auth/login
   |
   v
AuthController
   |
   v
Authentication Service
   |
   v
UserRepository
   |
   v
PostgreSQL
   |
   v
Password Verification
   |
   v
JWT Generation
   |
   v
Client
```

The successful response contains an authentication token.

Example:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9......",
  "tokenType": "Bearer"
}
```

The client can then send the token when accessing protected services.

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 5. JWT Authentication

The Identity Service uses **JSON Web Tokens (JWT)** for stateless authentication.

The basic flow is:

```text
              Login
                |
                v
       Verify Credentials
                |
                v
          Generate JWT
                |
                v
             Client
                |
                | Authorization: Bearer JWT
                v
       Protected Resource
                |
                v
        Validate JWT
                |
          ┌─────┴─────┐
          │           │
        Valid       Invalid
          │           │
          v           v
       Allow        Reject
```

The JWT can contain information such as:

```text
User ID
Username / Email
Roles
Issued At
Expiration
```

---

# 6. Password Security

Passwords are hashed before being stored in PostgreSQL.

The application uses a password encoder such as:

```java
BCryptPasswordEncoder
```

Conceptually:

```text
Plain Password
      |
      v
BCrypt
      |
      v
Password Hash
      |
      v
PostgreSQL
```

During login:

```text
User Password
      |
      v
BCrypt Verification
      |
      v
Stored Hash
      |
      v
Match?
  /       \
Yes       No
 |         |
JWT      401
```

---

# 7. Technology Stack

| Technology      | Purpose                          |
| --------------- | -------------------------------- |
| Java            | Backend programming language     |
| Spring Boot     | Application framework            |
| Spring Security | Authentication and authorization |
| Spring Data JPA | Database abstraction             |
| Hibernate       | ORM                              |
| PostgreSQL      | Identity database                |
| JWT             | Stateless authentication         |
| Maven           | Dependency and build management  |
| Docker          | Containerization                 |
| Postman         | API testing                      |

---

# 8. Project Structure

The expected project structure follows a standard Spring Boot layered architecture.

```text
identity-service/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── .../
│   │   │       ├── controller/
│   │   │       │   └── AuthController.java
│   │   │       │
│   │   │       ├── service/
│   │   │       │   └── AuthService.java
│   │   │       │
│   │   │       ├── repository/
│   │   │       │   └── UserRepository.java
│   │   │       │
│   │   │       ├── entity/
│   │   │       │   └── User.java
│   │   │       │
│   │   │       ├── dto/
│   │   │       │   ├── LoginRequest.java
│   │   │       │   ├── RegisterRequest.java
│   │   │       │   └── AuthResponse.java
│   │   │       │
│   │   │       ├── security/
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   ├── JwtFilter.java
│   │   │       │   └── JwtService.java
│   │   │       │
│   │   │       └── IdentityServiceApplication.java
│   │   │
│   │   └── resources/
│   │       └── application.yml
│   │
│   └── test/
│
├── pom.xml
├── Dockerfile
└── README.md
```

---

# 9. Database

The Identity Service uses PostgreSQL.

Example database configuration:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/medverify_identity
    username: postgres
    password: postgres123
```

The database is responsible for storing identity-related information.

A simplified user table may look like:

```text
users
------------------------------------------------
id
email
password
first_name
last_name
role
created_at
updated_at
------------------------------------------------
```

Passwords must always be stored in hashed form.

---

# 10. API Endpoints

The initial Identity Service can expose endpoints such as:

### Register

```http
POST /api/v1/auth/register
```

Example request:

```json
{
  "email": "user@example.com",
  "password": "Password@123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Expected response:

```json
{
  "message": "User registered successfully"
}
```

---

### Login

```http
POST /api/v1/auth/login
```

Example request:

```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

Expected response:

```json
{
  "accessToken": "<JWT_TOKEN>",
  "tokenType": "Bearer"
}
```

---

### Protected Endpoint

Example:

```http
GET /api/v1/users/me
```

Request:

```http
Authorization: Bearer <JWT_TOKEN>
```

The Identity Service validates the token before returning protected information.

---

# 11. Running the Application

## Prerequisites

Install the following:

* Java 17+ / the Java version configured by the project
* Maven
* PostgreSQL
* Docker (optional)
* Git

Verify Java:

```bash
java -version
```

Verify Maven:

```bash
mvn -version
```

---

# 12. Configure PostgreSQL

Create the database:

```sql
CREATE DATABASE medverify_identity;
```

Configure the credentials in:

```text
src/main/resources/application.yml
```

Example:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/medverify_identity
    username: postgres
    password: postgres123

  jpa:
    hibernate:
      ddl-auto: update
```

> Do not commit real production passwords, JWT secrets, API keys, or other credentials to GitHub.

For production, use environment variables or a secrets-management solution.

---

# 13. Start the Application

Using Maven:

```bash
mvn spring-boot:run
```

Or build the project first:

```bash
mvn clean package
```

Then:

```bash
java -jar target/identity-service-*.jar
```

---

# 14. Expected Application Output

When the application starts successfully, Spring Boot should initialize the application context, configure the datasource, initialize Hibernate/JPA, and start the embedded server.

A successful startup will look conceptually like:

```text
Started IdentityServiceApplication
Tomcat started on port 8080
HikariPool - Start completed
Initialized JPA EntityManagerFactory
```

The exact log messages and versions may differ depending on the Spring Boot, Hibernate, PostgreSQL driver, and server configuration.

The important result is:

```text
Application Started
        |
        v
Spring Boot Running
        |
        v
PostgreSQL Connected
        |
        v
Identity APIs Available
```

---

# 15. Testing the Branch

The branch can be tested using Postman or another API client.

## Step 1 — Register User

```http
POST http://localhost:8080/api/v1/auth/register
```

Expected:

```text
HTTP 200 / 201
```

and a successful registration response.

---

## Step 2 — Login

```http
POST http://localhost:8080/api/v1/auth/login
```

Expected:

```text
HTTP 200
```

with a JWT access token.

---

## Step 3 — Access Protected API

Send:

```http
Authorization: Bearer <JWT_TOKEN>
```

Expected:

```text
HTTP 200
```

if the JWT is valid.

If the token is missing or invalid, the request should be rejected.

Typical response:

```text
HTTP 401 Unauthorized
```

---

# 16. What This Branch Delivers

The primary output of this branch is a **working Identity Service foundation**.

After running the branch successfully, the system should provide:

```text
┌─────────────────────────────────────────────┐
│             Identity Service                │
├─────────────────────────────────────────────┤
│                                             │
│  User Registration                          │
│          ↓                                  │
│  Password Hashing                           │
│          ↓                                  │
│  PostgreSQL Persistence                    │
│                                             │
│  User Login                                 │
│          ↓                                  │
│  Credential Verification                    │
│          ↓                                  │
│  JWT Generation                             │
│          ↓                                  │
│  Authenticated Client                       │
│                                             │
└─────────────────────────────────────────────┘
```

In other words, this branch establishes the **authentication boundary** for the larger MedVerify microservices system.

Other services should eventually be able to trust the authentication mechanism provided by the Identity Service rather than implementing independent login and password-management logic.

---

# 17. Microservices Integration

The Identity Service is intended to become one component of the larger MedVerify platform.

A future architecture can look like:

```text
                         ┌───────────────┐
                         │    Client     │
                         └───────┬───────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │  API Gateway  │
                         └───────┬───────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
      ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
      │   Identity   │   │    User      │   │   Medical    │
      │   Service    │   │   Service    │   │   Service    │
      └──────┬───────┘   └──────────────┘   └──────────────┘
             │
             ▼
      ┌──────────────┐
      │  PostgreSQL  │
      │    Identity  │
      └──────────────┘
```

The Identity Service issues the JWT.

Other microservices can validate the JWT and use its claims to determine:

* Who the user is
* Which role the user has
* Whether the request is authenticated
* Whether the user has permission to access a resource

---

# 18. Security Considerations

The following security principles should be maintained:

1. Never store plain-text passwords.
2. Never commit database credentials to GitHub.
3. Never commit JWT signing secrets to GitHub.
4. Use environment variables for sensitive configuration.
5. Configure JWT expiration.
6. Validate all incoming requests.
7. Use HTTPS in production.
8. Apply role-based authorization to protected resources.
9. Do not expose unnecessary user information through APIs.
10. Use separate credentials and secrets for development, testing, and production.

---

# 19. Development Status

### Current Branch

```text
identity-service
```

### Current Objective

```text
Identity and Authentication Foundation
```

### Current Components

```text
Spring Boot
     +
Spring Security
     +
JWT
     +
JPA / Hibernate
     +
PostgreSQL
```

### Expected Result

```text
Application starts successfully
          ↓
PostgreSQL connection established
          ↓
User can register
          ↓
User credentials are persisted securely
          ↓
User can authenticate
          ↓
JWT is generated
          ↓
JWT can be used for protected resources
```

---

# 20. Future Improvements

The Identity Service can be extended with:

* Refresh tokens
* Role-based access control (RBAC)
* OAuth 2.0 / OpenID Connect
* Email verification
* Password reset
* Account locking
* Login attempt tracking
* Multi-factor authentication (MFA)
* Redis-based token/session management where appropriate
* Audit logging
* API Gateway integration
* Service-to-service authentication
* Centralized configuration
* Observability with Prometheus/Grafana
* Distributed tracing
* Docker and Kubernetes deployment

---

# 21. Branch Summary

This branch establishes the **Identity Service as the authentication and identity-management component of the MedVerify microservices architecture**.

The main flow implemented by this branch is:

```text
              ┌───────────┐
              │   Client  │
              └─────┬─────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Identity Service│
           └────────┬────────┘
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
     Registration           Login
          │                   │
          ▼                   ▼
     Hash Password       Verify Password
          │                   │
          ▼                   ▼
     PostgreSQL          Generate JWT
          │                   │
          └─────────┬─────────┘
                    │
                    ▼
                  JWT
                    │
                    ▼
             Protected APIs
```

**The final output of this branch is therefore not a frontend screen; it is a backend authentication service exposing REST APIs, persisting identity information in PostgreSQL, and issuing JWTs that can be used to authenticate requests across the future microservices ecosystem.**
