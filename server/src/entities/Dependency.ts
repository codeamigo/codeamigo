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
export class Dependency extends BaseEntity {
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
  @Column()
  package!: string;

  @Field(() => String, { defaultValue: `` })
  @Column()
  version!: string;

  @ManyToOne(() => Step, (step) => step.dependencies, { onDelete: "CASCADE" })
  @Field(() => Step)
  step: Step;
}
