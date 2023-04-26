import { Field, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Checkpoint } from './Checkpoint';
import { CodeModule } from './CodeModule';

export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(RoleEnum, {
  name: 'Role',
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field(() => RoleEnum)
  @Column({ default: RoleEnum.USER, nullable: true, type: 'text' })
  role: keyof typeof RoleEnum;

  @Field(() => String)
  @Column({ nullable: true })
  profilePic: string;

  @Column({ nullable: true, type: 'text', unique: true })
  githubId: number;

  @Column({ nullable: true, type: 'text', unique: true })
  googleId: string;

  @Field()
  @Column({ type: 'text', unique: true })
  username!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: 'text', unique: true })
  email: string;

  @Column({ nullable: true, type: 'text' })
  password: string;

  @OneToMany(() => Checkpoint, (checkpoint) => checkpoint.user, {
    cascade: true,
  })
  @Field(() => [Checkpoint], { defaultValue: [] })
  checkpoints: Checkpoint[];

  @OneToMany(() => CodeModule, (codeModule) => codeModule.user, {
    cascade: true,
  })
  @Field(() => [CodeModule], { defaultValue: [] })
  codeModules: CodeModule[];
}