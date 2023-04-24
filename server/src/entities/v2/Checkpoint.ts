import { Field, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Step } from './Step';
import { User } from './User';

export enum CheckpointTypeEnum {
  spec = 'spec',
  output = 'output',
  match = 'match',
}

registerEnumType(CheckpointTypeEnum, {
  name: 'CheckpointTypeEnum',
});
@ObjectType()
@Entity()
export class Checkpoint extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field(() => String)
  @Column({ default: `` })
  description: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isCompleted!: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  isTested!: boolean;

  @Field(() => CheckpointTypeEnum, {
    defaultValue: CheckpointTypeEnum.spec,
  })
  @Column({ default: CheckpointTypeEnum.spec, type: 'text' })
  type: keyof typeof CheckpointTypeEnum;

  @ManyToOne(() => Step, (step) => step.checkpoints, { onDelete: 'CASCADE' })
  @Field(() => Step)
  step: Step;

  @ManyToOne(() => User, (user) => user.checkpoints, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  // match
  @Field({ nullable: true })
  @Column({ nullable: true })
  matchRegex: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  fileToMatchRegex: string;

  // output
  @Field({ nullable: true })
  @Column({ nullable: true })
  output: string;

  // spec
  @Field({ nullable: true })
  @Column({ nullable: true })
  test: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  moduleId: string;
}
