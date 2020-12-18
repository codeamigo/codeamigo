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

  @Field()
  @Column()
  test!: string;

  @Field()
  @Column()
  moduleId!: number;

  @ManyToOne(() => Step, (step) => step.checkpoints)
  step: Step;
}
