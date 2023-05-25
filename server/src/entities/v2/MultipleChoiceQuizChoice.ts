import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { MultipleChoiceQuizQuestion } from './MultipleChoiceQuizQuestion';

@ObjectType()
@Entity()
export class MultipleChoiceQuizChoice extends BaseEntity {
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
  isCorrectAnswer: boolean;

  @Field(() => String)
  @Column({ nullable: true })
  hint: string;

  @ManyToOne(
    () => MultipleChoiceQuizQuestion,
    (multipleChoiceQuizQuestion) => multipleChoiceQuizQuestion.choices,
    {
      onDelete: 'CASCADE',
    }
  )
  @Field(() => MultipleChoiceQuizQuestion)
  question: MultipleChoiceQuizQuestion;
}
