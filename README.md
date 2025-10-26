# My Cars - NestJS Learning Project

## Project Overview
A NestJS application demonstrating user authentication and authorization concepts using TypeORM with SQLite database.

## Key Concepts Learned

### 1. **NestJS Modules**
- Modular architecture organizing related components
- `AppModule` serves as the root module
- Feature modules (e.g., Users module) encapsulate specific functionality
- Module imports, providers, and exports for dependency injection

### 2. **Controllers**
- Handle incoming HTTP requests and return responses
- `@Controller()` decorator defines route prefix
- Route handlers using decorators: `@Get()`, `@Post()`, `@Patch()`, `@Delete()`
- Parameter extraction: `@Body()`, `@Param()`, `@Query()`, `@Session()`
- Example: `UsersController` handles all `/auth` routes

### 3. **Services (Providers)**
- Injectable classes containing business logic
- `@Injectable()` decorator enables dependency injection
- **UsersService**: Database operations (CRUD)
- **AuthService**: Authentication logic (signup/signin, password hashing)

### 4. **Dependency Injection**
- Constructor-based injection
- Services injected into controllers and other services
- Example: `UsersService` and `AuthService` injected into `UsersController`

### 5. **TypeORM Integration**
- Database ORM for TypeScript
- **Entities**: Classes representing database tables
  - `@Entity()` decorator
  - `@PrimaryGeneratedColumn()` for auto-incrementing IDs
  - `@Column()` for table columns
- `@nestjs/typeorm` package for NestJS integration

### 6. **Data Transfer Objects (DTOs)**
- Define structure of data sent/received
- **CreateUserDto**: Validates incoming user data
- **UpdateUserDto**: Validates update requests
- **UserDto**: Controls exposed user data in responses

### 7. **Validation**
- `class-validator` for input validation
- `class-transformer` for object transformation
- `ValidationPipe` applied globally in `main.ts`
- Decorators: `@IsEmail()`, `@IsString()`
- `whitelist: true` removes non-whitelisted properties

### 8. **Interceptors**
- Transform/manipulate requests and responses
- **SerializeInterceptor**: Transforms entities to DTOs for responses
  - Uses `plainToInstance` from `class-transformer`
  - `excludeExtraneousValues: true` for security
- **CurrentUserInterceptor**: Fetches current user from session
  - Runs before route handler
  - Attaches user to request object

### 9. **Guards**
- Control route access based on conditions
- **AuthGuard**: Checks if user is authenticated
  - Implements `CanActivate` interface
  - Returns true/false based on session userId
- `@UseGuards()` decorator applies guards to routes

### 10. **Custom Decorators**
- **@CurrentUser()**: Parameter decorator to extract current user
- Uses `createParamDecorator` from `@nestjs/common`
- Accesses `request.currentUser` set by interceptor

### 11. **Session Management**
- `cookie-session` middleware for session handling
- Session data stored in encrypted cookies
- `userId` stored in session after signup/signin
- Signout clears session data

### 12. **Authentication & Security**
- Password hashing using `scrypt` with salt
- Salt generation: `randomBytes(8)`
- Password stored as: `salt.hash`
- Password verification compares hashed passwords
- Never store plain-text passwords

### 13. **Error Handling**
- Built-in NestJS exceptions:
  - `NotFoundException`: Resource not found
  - `BadRequestException`: Invalid request data
- Automatically returns appropriate HTTP status codes

### 14. **Middleware & Configuration**
- Global pipes configured in `main.ts`
- Cookie session middleware setup
- Port configuration with fallback

## Architecture Pattern
```
Controller → Service → Repository (TypeORM)
     ↓
  Guards (Authorization)
     ↓
  Interceptors (Transform Data)
     ↓
  Pipes (Validation)
```

## Tech Stack
- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: SQLite
- **Validation**: class-validator, class-transformer
- **Session**: cookie-session
- **Testing**: Jest

## Key Files Structure
```
src/
├── main.ts                          # Application entry point
├── users/
│   ├── user.entity.ts              # User database entity
│   ├── users.controller.ts         # User routes/endpoints
│   ├── users.service.ts            # User business logic
│   ├── auth.service.ts             # Authentication logic
│   ├── dtos/
│   │   ├── create-user.dto.ts      # Input validation
│   │   └── user.dto.ts             # Output serialization
│   ├── decorators/
│   │   └── current-user.decorator.ts
│   └── interceptors/
│       └── current-user.interceptor.ts
├── guards/
│   └── auth.guards.ts              # Route protection
└── interceptors/
    └── serialize.interceptor.ts    # Response transformation
```

## Learning Outcomes
✅ Modular application structure  
✅ Dependency injection pattern  
✅ Database integration with TypeORM  
✅ Request/response transformation  
✅ Input validation and sanitization  
✅ Authentication and authorization  
✅ Password hashing and security  
✅ Session management  
✅ Custom decorators and guards  
✅ Error handling best practices