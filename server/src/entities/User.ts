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

import { Lesson } from "./Lesson";
import { Session } from "./Session";

export enum RoleEnum {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum ThemeEnum {
  ALL_HALLOWS_EVE = "ALL_HALLOWS_EVE",
  COBALT = "COBALT",
  GITHUB = "GITHUB",
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
  @Column({ default: ThemeEnum.COBALT, nullable: true, type: "text" })
  theme: keyof typeof ThemeEnum;

  @Field()
  @Column({ type: "text", unique: true })
  username!: string;

  @Field()
  @Column({ type: "text", unique: true })
  email!: string;

  @Column({ type: "text" })
  password!: string;

  @Field(() => [Lesson])
  @OneToMany(() => Lesson, (lesson) => lesson.owner)
  lessons: Lesson[];

  @Field(() => [Session])
  @OneToMany(() => Session, (session) => session.student)
  classes: Session[];
}
