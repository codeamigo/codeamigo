import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { v4 } from "uuid";

import { FORGOT_PASSWORD_PREFIX, SESSION_COOKIE } from "../constants";
import { RoleEnum, User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext, ThemeEnum } from "../types";
import { generateProfileScheme } from "../utils/randomHexColor";
import { sendEmail } from "../utils/sendEmail";

@InputType()
class RegisterInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}

@InputType()
class LoginInput {
  @Field()
  usernameOrEmail: string;
  @Field()
  password: string;
}

@InputType()
class GitHubLoginInput {
  @Field()
  id: number;
  @Field()
  accessToken: string;
  @Field()
  username: string;
}

@InputType()
class GoogleLoginInput {
  @Field()
  id: string;
  @Field()
  email: string;
  @Field()
  username: string;
}

@InputType()
class UpdateUserRoleInput {
  @Field()
  id: number;
  @Field()
  role: RoleEnum;
}

@InputType()
class UpdateUserThemeInput {
  @Field(() => String)
  theme: keyof typeof ThemeEnum;
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => [User], { nullable: true })
  async users() {
    const users = await User.find();

    return users.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    return await User.findOne(req.session.userId, { relations: ["lessons"] });
  }

  @Query(() => String, { nullable: true })
  async profileColorScheme(
    @Arg("id", { nullable: true }) id: number,
    @Ctx() { req }: MyContext
  ) {
    if (!id && !req.session.userId) {
      return null;
    }

    const user = await User.findOne(id || req.session.userId);

    if (!user) {
      return null;
    }

    if (user.profileColorScheme) {
      return user.profileColorScheme;
    }

    const profileColorScheme = generateProfileScheme();

    Object.assign(user, { profileColorScheme });

    await user.save();

    return user.profileColorScheme;
  }

  @Mutation(() => String, { nullable: true })
  async updateProfileColorScheme(
    @Ctx() { req }: MyContext
  ): Promise<String | null> {
    if (!req.session.userId) {
      return null;
    }

    const user = await User.findOne(req.session.userId);

    if (!user) {
      return null;
    }

    const profileColorScheme = generateProfileScheme();

    Object.assign(user, { profileColorScheme });

    await user.save();

    return user.profileColorScheme;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Username must be at least 3 characters.",
          },
        ],
      };
    }

    const hashedPw = await argon2.hash(options.password);

    let user;
    try {
      user = await User.create({
        email: options.email,
        password: hashedPw,
        username: options.username,
      }).save();
    } catch (e) {
      if (e.detail && e.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "username",
              message: "User already exists.",
            },
          ],
        };
      }
    }

    if (!user) {
      return {
        errors: [{ field: "username", message: "Error creating user." }],
      };
    }
    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: LoginInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    let user = await User.findOne({
      where: { username: options.usernameOrEmail },
    });
    if (!user) {
      user = await User.findOne({
        where: { email: options.usernameOrEmail },
      });
    }

    if (!user) {
      return {
        errors: [{ field: "usernameOrEmail", message: "User does not exist." }],
      };
    }

    const valid = await argon2.verify(user.password, options.password);

    if (!valid) {
      return {
        errors: [{ field: "password", message: "Incorrect password." }],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async githubLogin(
    @Arg("options") options: GitHubLoginInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    let user = await User.findOne({
      where: { githubId: options.id },
    });

    if (!user) {
      user = await User.create({
        githubId: options.id,
        username: "github-" + options.username,
      }).save();
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async googleLogin(
    @Arg("options") options: GoogleLoginInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    let user = await User.findOne({
      where: { googleId: options.id },
    });

    if (!user) {
      user = await User.create({
        email: options.email,
        googleId: options.id,
        username: options.username,
      }).save();
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        res.clearCookie(SESSION_COOKIE);
        resolve(true);
      });
    });
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  async updateUserTheme(
    @Arg("options") options: UpdateUserThemeInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(req.session.userId);

    if (!user) {
      return {
        errors: [{ field: "id", message: "No user found." }],
      };
    }

    await User.update(
      {
        id: user.id,
      },
      { theme: ThemeEnum[options.theme] }
    );

    return { user };
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  async updateUserRole(
    @Arg("options") options: UpdateUserRoleInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(options.id);
    const approver = await User.findOne({ id: req.session.userId });

    if (!approver || approver.role !== "ADMIN") {
      return {
        errors: [{ field: "id", message: "Not a valid approver." }],
      };
    }

    if (!user) {
      return {
        errors: [{ field: "id", message: "No user found." }],
      };
    }

    await User.update(
      {
        id: options.id,
      },
      { role: options.role }
    );

    return { user };
  }

  @Mutation(() => String)
  async forgotPassword(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Ctx() { redis }: MyContext
  ): Promise<string> {
    let user = await User.findOne({
      where: { username: usernameOrEmail },
    });
    if (!user) {
      user = await User.findOne({
        where: { email: usernameOrEmail },
      });
    }

    if (!user) {
      return "";
    }

    const token = v4();

    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    );

    const action = `<a href="${process.env.CORS_ORIGIN}/change-password/${token}">Reset password</a>`;

    if (!user.email) {
      return "";
    }

    await sendEmail(user.email, action);
    return user.email;
  }

  @Mutation(() => UserResponse)
  async changePasswordFromToken(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis }: MyContext
  ): Promise<UserResponse> {
    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);

    if (!userId) {
      return {
        errors: [{ field: "token", message: "Invalid token." }],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [{ field: "token", message: "Could not find user." }],
      };
    }

    await User.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword) }
    );

    await redis.del(key);

    return { user };
  }

  @Mutation(() => UserResponse)
  async changePasswordFromPassword(
    @Arg("oldPassword") oldPassword: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(req.session.userId);

    if (!user) {
      return {
        errors: [{ field: "oldPassword", message: "Could not find user." }],
      };
    }

    const valid = await argon2.verify(user.password, oldPassword);

    if (!valid) {
      return {
        errors: [{ field: "oldPassword", message: "Incorrect password." }],
      };
    }

    await User.update(
      { id: user.id },
      { password: await argon2.hash(newPassword) }
    );

    return { user };
  }

  @Mutation(() => UserResponse)
  async changeEmail(
    @Arg("newEmail") newEmail: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(req.session.userId);

    if (!user) {
      return {
        errors: [{ field: "newEmail", message: "Could not find user." }],
      };
    }

    const existingUser = await User.findOne({ where: { email: newEmail } });

    if (existingUser) {
      return {
        errors: [{ field: "newEmail", message: "Email is already taken." }],
      };
    }

    await User.update({ id: user.id }, { email: newEmail });

    return { user };
  }
}
