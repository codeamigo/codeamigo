import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import { MyContext } from "../types";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
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
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
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
    const user = em.create(User, {
      username: options.username,
      password: hashedPw,
    });
    try {
      await em.persistAndFlush(user);
    } catch (e) {
      if (e.detail.includes("already exists")) {
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

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (!user) {
      return {
        errors: [{ field: "username", message: "User does not exist." }],
      };
    }

    const valid = await argon2.verify(user.password, options.password);

    if (!valid) {
      return {
        errors: [{ field: "password", message: "Incorrect password." }],
      };
    }

    return {
      user,
    };
  }
}
