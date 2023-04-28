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

import { User } from './User';

@ObjectType()
@Entity()
export class UserLessonPosition extends BaseEntity {
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
  @Column({ type: 'text' })
  lastSlugSeen: string;

  @Field(() => Number)
  @Column({ default: 0, type: 'int' })
  currentPosition: number;

  @Field(() => String)
  @Column({ type: 'text' })
  lessonId: string;

  @ManyToOne(() => User, (user) => user.userLessonPositions, {
    onDelete: 'CASCADE',
  })
  user: User;
}
