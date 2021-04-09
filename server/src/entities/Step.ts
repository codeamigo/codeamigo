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
import { CodeModule } from "./CodeModule";
import { Dependency } from "./Dependency";
import { Lesson } from "./Lesson";
import { Session } from "./Session";

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

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field(() => String, { defaultValue: `` })
  @Column()
  instructions!: string;

  @Field(() => Number, { defaultValue: null, nullable: true })
  @Column({ nullable: true })
  currentCheckpointId?: number;

  @Field(() => Boolean, { defaultValue: false, nullable: true })
  @Column({ nullable: true })
  isCompleted?: boolean;

  @ManyToOne(() => Lesson, (lesson) => lesson.steps, {
    onDelete: "CASCADE",
  })
  @Field(() => Lesson)
  lesson: Lesson;

  @ManyToOne(() => Session, (session) => session.steps, { onDelete: "CASCADE" })
  @Field(() => Session)
  session: Session;

  // code modules
  @OneToMany(() => CodeModule, (codeModule) => codeModule.step, {
    cascade: true,
  })
  @Field(() => [CodeModule], { defaultValue: [] })
  codeModules!: CodeModule[];

  // checkpoints
  @OneToMany(() => Checkpoint, (checkpoint) => checkpoint.step, {
    cascade: true,
  })
  @Field(() => [Checkpoint], { defaultValue: [] })
  checkpoints!: Checkpoint[];

  // dependencies
  @OneToMany(() => Dependency, (dependency) => dependency.step, {
    cascade: true,
  })
  @Field(() => [Dependency], { defaultValue: [] })
  dependencies!: Dependency[];
}
