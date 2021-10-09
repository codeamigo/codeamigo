import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Lesson } from "./Lesson";
import { Step } from "./Step";
import { User } from "./User";

@ObjectType()
@Entity()
export class Session extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field()
  @Column()
  currentStep: number;

  @Field()
  @Column()
  lessonId!: number;

  @Field(() => Boolean, {
    defaultValue: null,
    nullable: true,
  })
  @Column({ nullable: true })
  requiresUpdate: boolean;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.classes)
  student: User;

  @Field(() => Lesson)
  @ManyToOne(() => Lesson, (lesson) => lesson.sessions, { onDelete: "CASCADE" })
  lesson: Lesson;

  @OneToMany(() => Step, (step) => step.session, {
    cascade: true,
  })
  @Field(() => [Step], { defaultValue: [] })
  steps!: Step[];
}
