import { Field, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Session } from "./Session";
import { Step } from "./Step";
import { User } from "./User";

export enum TemplatesEnum {
  "Angular" = "Angular",
  "C" = "C",
  "Elixir" = "Elixir",
  "Go" = "Go",
  "HTML" = "HTML",
  "Java" = "Java",
  "JavaScript" = "JavaScript",
  "Python" = "Python",
  "React" = "React",
  "Ruby" = "Ruby",
  "Rust" = "Rust",
  "Swift" = "Swift",
  "TypeScript" = "TypeScript",
  "Vue" = "Vue",
}

export enum LessonStatusTypeEnum {
  EDITTING = "EDITTING",
  PENDING_PUBLISH = "PENDING_PUBLISH",
  PUBLISHED = "PUBLISHED",
}

export enum LessonLabelEnum {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

registerEnumType(LessonStatusTypeEnum, {
  name: "LessonStatus",
});
registerEnumType(LessonLabelEnum, {
  name: "LessonLabel",
});
registerEnumType(TemplatesEnum, {
  name: "LessonTemplate",
});
@ObjectType()
@Entity()
export class Lesson extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field({ nullable: true })
  @Column({ nullable: true, type: "text", unique: true })
  title!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  thumbnail: string;

  @Field({ nullable: true })
  @Column({ default: 0, nullable: true })
  views: number;

  @Field(() => LessonStatusTypeEnum, { nullable: true })
  @Column({
    default: LessonStatusTypeEnum.EDITTING,
    nullable: true,
    type: "text",
  })
  status: keyof typeof LessonStatusTypeEnum;

  @Field(() => LessonLabelEnum, { nullable: true })
  @Column({
    nullable: true,
    type: "text",
  })
  label: keyof typeof LessonLabelEnum;

  @Field(() => TemplatesEnum, { nullable: true })
  @Column({
    nullable: true,
    type: "text",
  })
  template: keyof typeof TemplatesEnum;

  @Field()
  @Column({ default: 0, type: "int" })
  likes!: number;

  @ManyToMany(() => User)
  @Field(() => [User], { defaultValue: [] })
  @JoinTable()
  students: User[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.lessons)
  owner: User;

  @OneToMany(() => Session, (session) => session.lesson, {
    cascade: true,
  })
  @Field(() => [Session], { defaultValue: [] })
  sessions!: Session[];

  @OneToMany(() => Step, (step) => step.lesson, {
    cascade: true,
  })
  @Field(() => [Step], { defaultValue: [] })
  steps!: Step[];
}
