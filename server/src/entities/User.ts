import { Field, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { ThemeEnum } from "../types";
import { Lesson } from "./Lesson";
import { Session } from "./Session";

export enum RoleEnum {
  ADMIN = "ADMIN",
  USER = "USER",
}

registerEnumType(RoleEnum, {
  name: "Role",
});
registerEnumType(ThemeEnum, {
  name: "Theme",
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field(() => RoleEnum)
  @Column({ default: RoleEnum.USER, nullable: true, type: "text" })
  role: keyof typeof RoleEnum;

  @Field(() => ThemeEnum)
  @Column({
    default: ThemeEnum.cobalt,
    enum: ThemeEnum,
    nullable: true,
    type: "enum",
  })
  theme: ThemeEnum;

  @Field(() => String)
  @Column({ nullable: true })
  profilePic: string;

  @Field(() => String)
  @Column({ nullable: true })
  profileColorScheme: string;

  @Column({ nullable: true, type: "text", unique: true })
  githubId: number;

  @Column({ nullable: true, type: "text", unique: true })
  googleId: string;

  @Field()
  @Column({ type: "text", unique: true })
  username!: string;

  @Field()
  @Column({ nullable: true, type: "text", unique: true })
  email: string;

  @Column({ nullable: true, type: "text" })
  password: string;

  @Field(() => [Lesson])
  @OneToMany(() => Lesson, (lesson) => lesson.owner)
  lessons: Lesson[];

  @Field(() => [Session])
  @OneToMany(() => Session, (session) => session.student)
  classes: Session[];
}
