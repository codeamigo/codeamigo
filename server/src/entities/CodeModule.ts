import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Step } from "./Step";

@ObjectType()
@Entity()
export class CodeModule extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field(() => String, { defaultValue: "app.tsx" })
  @Column()
  name!: string;

  @Field(() => Boolean, { defaultValue: false })
  @Column({ nullable: true })
  isEntry: boolean;

  @Field(() => String, { defaultValue: `` })
  @Column()
  value!: string;

  @ManyToOne(() => Step, (step) => step.codeModules, { onDelete: "CASCADE" })
  @Field(() => Step)
  step: Step;
}
