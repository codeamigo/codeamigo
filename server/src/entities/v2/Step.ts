import { Field, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Checkpoint } from './Checkpoint';
import { CodeModule } from './CodeModule';
import { Lesson } from './Lesson';

export enum StepExecutionTypeEnum {
  riju = 'riju',
  sandpack = 'sandpack',
  stackblitz = 'stackblitz',
}

registerEnumType(StepExecutionTypeEnum, {
  name: 'StepExecutionTypeEnum',
});
@ObjectType()
@Entity()
export class Step extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field(() => String)
  @Column({ nullable: true })
  slug: string;

  @Field(() => String, { defaultValue: `` })
  @Column()
  instructions!: string;

  @Field(() => Boolean, { defaultValue: false, nullable: true })
  @Column({ nullable: true })
  isCompleted?: boolean;

  @Field(() => Number, {
    defaultValue: null,
    nullable: true,
  })
  @Column({ nullable: true })
  originalStepId: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.steps, {
    onDelete: 'CASCADE',
  })
  @Field(() => Lesson)
  lesson: Lesson;

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
}
