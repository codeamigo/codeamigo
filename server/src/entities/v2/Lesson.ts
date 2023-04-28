import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Step } from './Step';
import { User } from './User';
@ObjectType()
@Entity()
export class Lesson extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text', unique: true })
  title!: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text', unique: true })
  slug!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  thumbnail: string;

  @Field({ nullable: true })
  @Column({ default: 0, nullable: true })
  views: number;

  @Field()
  @Column({ default: 0, type: 'int' })
  likes!: number;

  @ManyToMany(() => User)
  @Field(() => [User], { defaultValue: [] })
  @JoinTable()
  users: User[];

  @OneToMany(() => Step, (step) => step.lesson, {
    cascade: true,
  })
  @Field(() => [Step], { defaultValue: [] })
  steps!: Step[];
}
