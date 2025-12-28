import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("AuthService", () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 99999), email, password };
        users.push(user);
        return Promise.resolve(user);
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, {
        provide: UsersService,
        useValue: fakeUsersService
      }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  })

  it("Can create an instance of auth service", async () => {
    expect(service).toBeDefined();
  })

  it("Creates a new user with salted and hashed password", async () => {
    const user = await service.signup("abcd@test.com", "test");
    expect(user).toBeDefined();
    expect(user.password).toHaveLength(81); // By calculating the length of 'salt' + '.' + 'hash'
    expect(user.password).not.toEqual("test");
    const [salt, hash] = user.password.split(".");
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  })

  it("Does not create a user if email already exists in signup", async () => {
    await service.signup("abcd@test.com", "test");
    await expect(service.signup("abcd@test.com", "test")).rejects.toThrow(new BadRequestException("Email already taken"));
  })

  it("Should throw error if sign in is called with unregistered email", async () => {
    await expect(service.signin("abcd@test.com", "test")).rejects.toThrow(new NotFoundException("User not found"));
  })

  it("Should throw error if invalid password is provided in signin", async () => {
    await service.signup("abcd@test.com", "test");
    await expect(service.signin("abcd@test.com", "test123")).rejects.toThrow(new BadRequestException("Bad password"));
  })

  it("Returns a user if correct password is provided in signin", async () => {
    await service.signup("abcd@test.com", "test");

    const user = await service.signin("abcd@test.com", "test");
    expect(user).toBeDefined();
  })
});