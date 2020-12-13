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

  @Field()
  @Column({ nullable: true })
  description: string;

  @Field()
  @Column({ type: 'int', default: 0 })
  likes!: number

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.lessons)
  owner: User;

  @OneToMany(() => Step, (step) => step.lesson)
  @Field(() => [Step], { defaultValue: [] })
  steps!: Step[];
}
