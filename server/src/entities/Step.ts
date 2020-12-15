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
import { Checkpoint } from "./Checkpoint";
import { Lesson } from "./Lesson";

@ObjectType()
@Entity()
export class Step extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field(() => String, { defaultValue: '' })
  @Column()
  instructions!: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.steps)
  @Field(() => Lesson)
  lesson: Lesson;

  @OneToMany(() => Checkpoint, (checkpoint) => checkpoint.step)
  @Field(() => [Checkpoint], { defaultValue: [] })
  checkpoints!: Checkpoint[];
}
