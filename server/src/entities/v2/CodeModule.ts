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

import { Step } from './Step';
import { User } from './User';

@ObjectType()
@Entity()
export class CodeModule extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field(() => String, { defaultValue: 'app.tsx' })
  @Column()
  name!: string;

  @Field(() => Boolean, { defaultValue: false })
  @Column({ nullable: true })
  isEntry: boolean;

  @Field(() => String, { defaultValue: `` })
  @Column()
  code!: string;

  @ManyToOne(() => Step, (step) => step.codeModules, { onDelete: 'CASCADE' })
  @Field(() => Step)
  step: Step;

  @ManyToOne(() => User, (user) => user.codeModules, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;
}
