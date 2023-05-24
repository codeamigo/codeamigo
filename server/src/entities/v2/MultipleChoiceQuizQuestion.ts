import { Field, ObjectType } from 'type-graphql';
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

import { MultipleChoiceQuizChoice } from './MultipleChoiceQuizChoice';
import { Step } from './Step';
import { User } from './User';

@ObjectType()
@Entity()
export class MultipleChoiceQuizQuestion extends BaseEntity {
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
  value: string;

  @Field(() => Boolean)
  @Column({ nullable: true })
  isCorrect: boolean;

  @OneToMany(() => MultipleChoiceQuizChoice, (choice) => choice.question, {
    cascade: true,
  })
  @Field(() => [MultipleChoiceQuizChoice])
  choices: MultipleChoiceQuizChoice[];

  @ManyToOne(() => User, (user) => user.multipleChoiceQuizQuestions, {
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Step, (step) => step.questions, { onDelete: 'CASCADE' })
  @Field(() => Step)
  step: Step;
}
