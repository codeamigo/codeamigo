import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";
import { v4 } from "uuid";

import { MyContext } from "../types";
import { FORGOT_PASSWORD_PREFIX } from "../constants";
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

@ObjectType()
class FieldError {
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
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    console.log(await User.findOne(req.session.userId, { relations: ['lessons'] }))
    
    return await User.findOne(req.session.userId, { relations: ['lessons'] });
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
        username: options.username,
        password: hashedPw,
      }).save();
      console.log('USER')
    } catch (e) {
      console.log(e)
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

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return false;
    }

    const token = v4();

    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    );

    // TODO, ENV
    const action = `<a href="http://localhost:3000/change-password/${token}">Reset password</a>`;

    await sendEmail(email, action);

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
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
}
