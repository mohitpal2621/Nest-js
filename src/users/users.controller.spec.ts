import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { NotFoundException } from "@nestjs/common";


describe("UsersController", () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => Promise.resolve<User>({ id, email: "test@test.com", password: "test" }),
      find: (email: string) => Promise.resolve<User[]>([{ id: 1, email, password: "test" }]),
      update: (id: number, attrs: Partial<User>) => Promise.resolve<User>({ id, email: "xyz@test.com", password: "test" }),
      remove: (id: number) => Promise.resolve<User>({ id, email: "test@test.com", password: "test" })
    }
    fakeAuthService = {
      signup: (email: string, password: string) => Promise.resolve<User>({ id: 1, email, password }),
      signin: (email: string, password: string) => Promise.resolve<User>({ id: 1, email, password }),
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{
        provide: UsersService,
        useValue: fakeUsersService
      }, {
        provide: AuthService,
        useValue: fakeAuthService
      }]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  })

  it("should be defined", () => {
    expect(controller).toBeDefined();
  })

  it("findAllUsers returns a list of users with the given email", async () => {
    const users = await controller.getUsersByEmail("test@test.com");
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual("test@test.com");
  })

  it("findOneUser returns a user with the given id", async () => {
    const user = await controller.getUser("2");
    expect(user.id).toEqual(2);
    expect(user.email).toEqual("test@test.com");
  })

  it("findOneUser throws error when user isn't found", async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.getUser("2")).rejects.toThrow(new NotFoundException("user not found"));
  })

  it("User should signIn", async () => {
    const session: { userId?: number } = {};
    const user = await controller.signIn({ email: "test@test.com", password: "test" }, session);
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
    expect(user.email).toEqual("test@test.com");
    expect(session).toBeDefined();
    expect(session.userId).toEqual(1);
  })
})
