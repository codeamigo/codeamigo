import { Field, ObjectType } from "type-graphql";
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

import { Step } from "./Step";
import { User } from "./User";

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

  @Field()
  @Column()
  title!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

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

  @OneToMany(() => Step, (step) => step.lesson, {
    cascade: true,
  })
  @Field(() => [Step], { defaultValue: [] })
  steps!: Step[];
}
