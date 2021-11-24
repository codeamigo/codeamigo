import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  checkpoint?: Maybe<Checkpoint>;
  checkpoints: Array<Checkpoint>;
  codeModule?: Maybe<CodeModule>;
  codeModules: Array<CodeModule>;
  dependencies: Array<Dependency>;
  dependency?: Maybe<Dependency>;
  deps: Array<Scalars['String']>;
  lesson?: Maybe<Lesson>;
  lessons: Array<Lesson>;
  me?: Maybe<User>;
  modal?: Maybe<Modal>;
  profileColorScheme?: Maybe<Scalars['String']>;
  session?: Maybe<Session>;
  sessions: Array<Session>;
  step?: Maybe<Step>;
  steps: Array<Step>;
  users?: Maybe<Array<User>>;
};


export type QueryCheckpointArgs = {
  id: Scalars['Int'];
};


export type QueryCheckpointsArgs = {
  stepId: Scalars['Float'];
};


export type QueryCodeModuleArgs = {
  id: Scalars['Int'];
};


export type QueryDependencyArgs = {
  id: Scalars['Int'];
};


export type QueryLessonArgs = {
  id: Scalars['Int'];
};


export type QueryLessonsArgs = {
  options: LessonsInput;
};


export type QueryProfileColorSchemeArgs = {
  id?: Maybe<Scalars['Float']>;
};


export type QuerySessionArgs = {
  lessonId: Scalars['Int'];
};


export type QueryStepArgs = {
  id: Scalars['Int'];
};

export type Checkpoint = {
  __typename?: 'Checkpoint';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  description: Scalars['String'];
  isCompleted: Scalars['Boolean'];
  isTested: Scalars['Boolean'];
  type?: Maybe<CheckpointTypeEnum>;
  matchRegex?: Maybe<Scalars['String']>;
  fileToMatchRegex?: Maybe<Scalars['String']>;
  output?: Maybe<Scalars['String']>;
  test?: Maybe<Scalars['String']>;
  moduleId?: Maybe<Scalars['String']>;
};

export enum CheckpointTypeEnum {
  Spec = 'spec',
  Output = 'output',
  Match = 'match'
}

export type CodeModule = {
  __typename?: 'CodeModule';
  uuid: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  isEntry?: Maybe<Scalars['Boolean']>;
  value?: Maybe<Scalars['String']>;
  step: Step;
};

export type Step = {
  __typename?: 'Step';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  instructions?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Float']>;
  currentCheckpointId?: Maybe<Scalars['Float']>;
  isCompleted?: Maybe<Scalars['Boolean']>;
  executionType?: Maybe<StepExecutionTypeEnum>;
  lang?: Maybe<Scalars['String']>;
  originalStepId?: Maybe<Scalars['Float']>;
  lesson: Lesson;
  session: Session;
  codeModules?: Maybe<Array<CodeModule>>;
  checkpoints?: Maybe<Array<Checkpoint>>;
  dependencies?: Maybe<Array<Dependency>>;
};

export enum StepExecutionTypeEnum {
  Riju = 'riju',
  Sandpack = 'sandpack'
}

export type Lesson = {
  __typename?: 'Lesson';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  views?: Maybe<Scalars['Float']>;
  status?: Maybe<LessonStatus>;
  label?: Maybe<LessonLabel>;
  template?: Maybe<LessonTemplate>;
  likes: Scalars['Float'];
  students?: Maybe<Array<User>>;
  owner: User;
  sessions?: Maybe<Array<Session>>;
  steps?: Maybe<Array<Step>>;
  tags?: Maybe<Array<Tag>>;
};

export enum LessonStatus {
  Editting = 'EDITTING',
  PendingPublish = 'PENDING_PUBLISH',
  Published = 'PUBLISHED'
}

export enum LessonLabel {
  Beginner = 'BEGINNER',
  Intermediate = 'INTERMEDIATE',
  Advanced = 'ADVANCED'
}

export enum LessonTemplate {
  Angular = 'Angular',
  C = 'C',
  Elixir = 'Elixir',
  Go = 'Go',
  Html = 'HTML',
  Java = 'Java',
  JavaScript = 'JavaScript',
  Python = 'Python',
  React = 'React',
  Ruby = 'Ruby',
  Rust = 'Rust',
  Swift = 'Swift',
  TypeScript = 'TypeScript',
  Vue = 'Vue'
}

export type User = {
  __typename?: 'User';
  classes: Array<Session>;
  createdAt: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
  isAuthenticated?: Maybe<Scalars['Boolean']>;
  lessons: Array<Lesson>;
  profileColorScheme: Scalars['String'];
  profilePic: Scalars['String'];
  role: Role;
  theme: Theme;
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export enum Theme {
  Active4d = 'active4d',
  AllHallowsEve = 'all_hallows_eve',
  Amy = 'amy',
  BirdsOfParadise = 'birds_of_paradise',
  Blackboard = 'blackboard',
  BrillianceBlack = 'brilliance_black',
  BrillianceDull = 'brilliance_dull',
  ChromeDevtools = 'chrome_devtools',
  CloudsMidnight = 'clouds_midnight',
  Clouds = 'clouds',
  Cobalt = 'cobalt',
  Dawn = 'dawn',
  Dreamweaver = 'dreamweaver',
  Eiffel = 'eiffel',
  EspressoLibre = 'espresso_libre',
  Github = 'github',
  Idle = 'idle',
  Katzenmilch = 'katzenmilch',
  KuroirTheme = 'kuroir_theme',
  Lazy = 'lazy',
  MagicwbAmiga = 'magicwb__amiga_',
  MerbivoreSoft = 'merbivore_soft',
  Merbivore = 'merbivore',
  MonokaiBright = 'monokai_bright',
  Monokai = 'monokai',
  NightOwl = 'night_owl',
  OceanicNext = 'oceanic_next',
  PastelsOnDark = 'pastels_on_dark',
  SlushAndPoppies = 'slush_and_poppies',
  SolarizedDark = 'solarized_dark',
  SolarizedLight = 'solarized_light',
  Spacecadet = 'spacecadet',
  Sunburst = 'sunburst',
  TextmateMacClassic = 'textmate_mac_classic_',
  TomorrowNightBlue = 'tomorrow_night_blue',
  TomorrowNightBright = 'tomorrow_night_bright',
  TomorrowNightEighties = 'tomorrow_night_eighties',
  TomorrowNight = 'tomorrow_night',
  Tomorrow = 'tomorrow',
  Twilight = 'twilight',
  UpstreamSunburst = 'upstream_sunburst',
  VibrantInk = 'vibrant_ink',
  XcodeDefault = 'xcode_default',
  Zenburnesque = 'zenburnesque',
  Iplastic = 'iplastic',
  Idlefingers = 'idlefingers',
  Krtheme = 'krtheme',
  Monoindustrial = 'monoindustrial'
}

export type Session = {
  __typename?: 'Session';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  currentStep: Scalars['Float'];
  lessonId: Scalars['Float'];
  requiresUpdate?: Maybe<Scalars['Boolean']>;
  student: User;
  lesson: Lesson;
  steps?: Maybe<Array<Step>>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  name: Scalars['String'];
  lessons?: Maybe<Array<Lesson>>;
};

export type Dependency = {
  __typename?: 'Dependency';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  package: Scalars['String'];
  version?: Maybe<Scalars['String']>;
  step: Step;
};

export type LessonsInput = {
  status: Scalars['String'];
  ownerId?: Maybe<Scalars['Float']>;
  labels?: Maybe<Scalars['String']>;
  dependencies?: Maybe<Scalars['String']>;
  template?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createSpecCheckpoint?: Maybe<Checkpoint>;
  createMatchCheckpoint?: Maybe<Checkpoint>;
  createOutputCheckpoint?: Maybe<Checkpoint>;
  updateCheckpoint?: Maybe<Checkpoint>;
  completeCheckpoint?: Maybe<Checkpoint>;
  passCheckpoint?: Maybe<Checkpoint>;
  deleteCheckpoint: Scalars['Boolean'];
  createCodeModule?: Maybe<CodeModule>;
  updateCodeModule?: Maybe<CodeModule>;
  updateCodeModuleEntryFile?: Maybe<CodeModule>;
  deleteCodeModule: Scalars['Boolean'];
  createDependency?: Maybe<Dependency>;
  updateDependency?: Maybe<Dependency>;
  updateDependencyVersion?: Maybe<Dependency>;
  deleteDependency: Scalars['Boolean'];
  updateProfileColorScheme?: Maybe<Scalars['String']>;
  deleteUser: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  githubLogin: UserResponse;
  googleLogin: UserResponse;
  logout: Scalars['Boolean'];
  updateUserTheme: UserResponse;
  updateUserRole: UserResponse;
  forgotPassword: Scalars['String'];
  changePasswordFromToken: UserResponse;
  changePasswordFromPassword: UserResponse;
  changeEmail: UserResponse;
  updateStepName?: Maybe<Step>;
  deleteStep: Scalars['Boolean'];
  createStep?: Maybe<Step>;
  completeStep?: Maybe<Step>;
  updateStepCheckpoint?: Maybe<Step>;
  updateStepInstructions?: Maybe<Step>;
  updateStepPosition?: Maybe<Step>;
  createLesson: CreateLessonResponse;
  updateLessonViews?: Maybe<Lesson>;
  updateLessonTitle?: Maybe<Lesson>;
  updateLessonDescription?: Maybe<Lesson>;
  updateLessonLabel?: Maybe<Lesson>;
  updateLessonStatus?: Maybe<Lesson>;
  updateLessonThumbnail?: Maybe<Lesson>;
  createLessonTag: Lesson;
  deleteLessonTag: Lesson;
  deleteLesson: Scalars['Boolean'];
  createSession?: Maybe<Session>;
  updateSession?: Maybe<Session>;
  deleteSession: Scalars['Boolean'];
  setNextStep?: Maybe<Session>;
};


export type MutationCreateSpecCheckpointArgs = {
  options: CreateSpecCheckpointInput;
};


export type MutationCreateMatchCheckpointArgs = {
  options: CreateMatchCheckpointInput;
};


export type MutationCreateOutputCheckpointArgs = {
  options: CreateOutputCheckpointInput;
};


export type MutationUpdateCheckpointArgs = {
  options: UpdateCheckpointInput;
  id: Scalars['Float'];
};


export type MutationCompleteCheckpointArgs = {
  id: Scalars['Float'];
};


export type MutationPassCheckpointArgs = {
  id: Scalars['Float'];
};


export type MutationDeleteCheckpointArgs = {
  id: Scalars['Float'];
};


export type MutationCreateCodeModuleArgs = {
  options: CodeModuleInput;
  stepId: Scalars['Float'];
};


export type MutationUpdateCodeModuleArgs = {
  options: CodeModuleUpdateInput;
  uuid: Scalars['String'];
};


export type MutationUpdateCodeModuleEntryFileArgs = {
  options: CodeModuleUpdateEntryInput;
};


export type MutationDeleteCodeModuleArgs = {
  uuid: Scalars['String'];
};


export type MutationCreateDependencyArgs = {
  options: DependencyInput;
  stepId: Scalars['Float'];
};


export type MutationUpdateDependencyArgs = {
  options: DependencyInput;
  id: Scalars['Float'];
};


export type MutationUpdateDependencyVersionArgs = {
  version: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationDeleteDependencyArgs = {
  id: Scalars['Float'];
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationLoginArgs = {
  options: LoginInput;
};


export type MutationGithubLoginArgs = {
  options: GitHubLoginInput;
};


export type MutationGoogleLoginArgs = {
  options: GoogleLoginInput;
};


export type MutationUpdateUserThemeArgs = {
  options: UpdateUserThemeInput;
};


export type MutationUpdateUserRoleArgs = {
  options: UpdateUserRoleInput;
};


export type MutationForgotPasswordArgs = {
  usernameOrEmail: Scalars['String'];
};


export type MutationChangePasswordFromTokenArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationChangePasswordFromPasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationChangeEmailArgs = {
  newEmail: Scalars['String'];
};


export type MutationUpdateStepNameArgs = {
  options: StepNameInput;
};


export type MutationDeleteStepArgs = {
  options: DeleteStepInput;
};


export type MutationCreateStepArgs = {
  options: CreateStepInput;
};


export type MutationCompleteStepArgs = {
  options: UpdateStepInput;
};


export type MutationUpdateStepCheckpointArgs = {
  options: UpdateStepCheckpointInput;
};


export type MutationUpdateStepInstructionsArgs = {
  options: StepInstructionsInput;
};


export type MutationUpdateStepPositionArgs = {
  options: UpdateStepPositionInput;
};


export type MutationCreateLessonArgs = {
  options: LessonInput;
};


export type MutationUpdateLessonViewsArgs = {
  id: Scalars['Float'];
};


export type MutationUpdateLessonTitleArgs = {
  title: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationUpdateLessonDescriptionArgs = {
  description: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationUpdateLessonLabelArgs = {
  label: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationUpdateLessonStatusArgs = {
  status: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationUpdateLessonThumbnailArgs = {
  thumbnail?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
};


export type MutationCreateLessonTagArgs = {
  name: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationDeleteLessonTagArgs = {
  name: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationDeleteLessonArgs = {
  id: Scalars['Float'];
};


export type MutationCreateSessionArgs = {
  options: SessionInput;
};


export type MutationUpdateSessionArgs = {
  options: UpdateSessionInput;
};


export type MutationDeleteSessionArgs = {
  id: Scalars['Float'];
};


export type MutationSetNextStepArgs = {
  options: NextStepInput;
};

export type CreateSpecCheckpointInput = {
  checkpointId: Scalars['Float'];
  stepId: Scalars['Float'];
};

export type CreateMatchCheckpointInput = {
  matchRegex: Scalars['String'];
  fileToMatchRegex: Scalars['String'];
  stepId: Scalars['Float'];
};

export type CreateOutputCheckpointInput = {
  output: Scalars['String'];
  stepId: Scalars['Float'];
};

export type UpdateCheckpointInput = {
  description: Scalars['String'];
};

export type CodeModuleInput = {
  name: Scalars['String'];
  value: Scalars['String'];
  lessonId?: Maybe<Scalars['Float']>;
};

export type CodeModuleUpdateInput = {
  name: Scalars['String'];
  value: Scalars['String'];
  sessionId?: Maybe<Scalars['Float']>;
  lessonId?: Maybe<Scalars['Float']>;
};

export type CodeModuleUpdateEntryInput = {
  newId?: Maybe<Scalars['String']>;
  oldId?: Maybe<Scalars['String']>;
};

export type DependencyInput = {
  package: Scalars['String'];
  version: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type RegisterInput = {
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};

export type LoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type GitHubLoginInput = {
  id: Scalars['Float'];
  accessToken: Scalars['String'];
  username: Scalars['String'];
};

export type GoogleLoginInput = {
  id: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
};

export type UpdateUserThemeInput = {
  theme: Scalars['String'];
};

export type UpdateUserRoleInput = {
  id: Scalars['Float'];
  role: Scalars['String'];
};

export type StepNameInput = {
  id: Scalars['Float'];
  lessonId: Scalars['Float'];
  name: Scalars['String'];
};

export type DeleteStepInput = {
  id: Scalars['Float'];
  lessonId: Scalars['Float'];
};

export type CreateStepInput = {
  name: Scalars['String'];
  lessonId: Scalars['Float'];
  currentStepId?: Maybe<Scalars['Float']>;
  template?: Maybe<Scalars['String']>;
};

export type UpdateStepInput = {
  id: Scalars['Float'];
};

export type UpdateStepCheckpointInput = {
  id: Scalars['Float'];
  checkpointId: Scalars['Float'];
};

export type StepInstructionsInput = {
  id: Scalars['Float'];
  instructions: Scalars['String'];
};

export type UpdateStepPositionInput = {
  id: Scalars['Float'];
  lessonId: Scalars['Float'];
  changeY: Scalars['Float'];
};

export type CreateLessonResponse = {
  __typename?: 'CreateLessonResponse';
  errors?: Maybe<Array<FieldError>>;
  lesson?: Maybe<Lesson>;
};

export type LessonInput = {
  title: Scalars['String'];
  description: Scalars['String'];
  template?: Maybe<Scalars['String']>;
};

export type SessionInput = {
  lessonId: Scalars['Float'];
  currentStepId?: Maybe<Scalars['Float']>;
};

export type UpdateSessionInput = {
  lessonId: Scalars['Float'];
  sessionId: Scalars['Float'];
};

export type NextStepInput = {
  sessionId: Scalars['Float'];
  stepId: Scalars['Float'];
};

export type Modal = {
  __typename?: 'Modal';
  name?: Maybe<Scalars['String']>;
  callback?: Maybe<Scalars['String']>;
};

export type RegularCheckpointFragment = (
  { __typename?: 'Checkpoint' }
  & Pick<Checkpoint, 'id' | 'createdAt' | 'description' | 'fileToMatchRegex' | 'matchRegex' | 'output' | 'isCompleted' | 'isTested' | 'test' | 'type'>
);

export type RegularCodeModuleFragment = (
  { __typename?: 'CodeModule' }
  & Pick<CodeModule, 'uuid' | 'isEntry' | 'name' | 'value'>
);

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularLessonFragment = (
  { __typename?: 'Lesson' }
  & Pick<Lesson, 'id' | 'description' | 'label' | 'status' | 'template' | 'thumbnail' | 'title'>
  & { owner: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ) }
);

export type RegularLessonItemFragment = (
  { __typename?: 'Lesson' }
  & Pick<Lesson, 'id' | 'createdAt' | 'label' | 'likes' | 'status' | 'template' | 'title' | 'thumbnail' | 'updatedAt' | 'views'>
  & { tags?: Maybe<Array<(
    { __typename?: 'Tag' }
    & Pick<Tag, 'name'>
  )>>, students?: Maybe<Array<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )>>, owner: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ) }
);

export type RegularStepFragment = (
  { __typename?: 'Step' }
  & Pick<Step, 'id' | 'createdAt' | 'currentCheckpointId' | 'executionType' | 'lang' | 'instructions' | 'isCompleted' | 'name' | 'position'>
  & { codeModules?: Maybe<Array<(
    { __typename?: 'CodeModule' }
    & RegularCodeModuleFragment
  )>>, checkpoints?: Maybe<Array<(
    { __typename?: 'Checkpoint' }
    & RegularCheckpointFragment
  )>> }
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'email' | 'role' | 'theme' | 'username' | 'isAuthenticated'>
);

export type ChangeEmailMutationVariables = Exact<{
  newEmail: Scalars['String'];
}>;


export type ChangeEmailMutation = (
  { __typename?: 'Mutation' }
  & { changeEmail: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email' | 'username'>
    )> }
  ) }
);

export type ChangePasswordFromTokenMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordFromTokenMutation = (
  { __typename?: 'Mutation' }
  & { changePasswordFromToken: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    )> }
  ) }
);

export type ChangePasswordFromPasswordMutationVariables = Exact<{
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordFromPasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePasswordFromPassword: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    )> }
  ) }
);

export type CreateSpecCheckpointMutationVariables = Exact<{
  checkpointId: Scalars['Float'];
  stepId: Scalars['Float'];
}>;


export type CreateSpecCheckpointMutation = (
  { __typename?: 'Mutation' }
  & { createSpecCheckpoint?: Maybe<(
    { __typename?: 'Checkpoint' }
    & RegularCheckpointFragment
  )> }
);

export type CreateMatchCheckpointMutationVariables = Exact<{
  matchRegex: Scalars['String'];
  fileToMatchRegex: Scalars['String'];
  stepId: Scalars['Float'];
}>;


export type CreateMatchCheckpointMutation = (
  { __typename?: 'Mutation' }
  & { createMatchCheckpoint?: Maybe<(
    { __typename?: 'Checkpoint' }
    & RegularCheckpointFragment
  )> }
);

export type CreateOutputCheckpointMutationVariables = Exact<{
  output: Scalars['String'];
  stepId: Scalars['Float'];
}>;


export type CreateOutputCheckpointMutation = (
  { __typename?: 'Mutation' }
  & { createOutputCheckpoint?: Maybe<(
    { __typename?: 'Checkpoint' }
    & RegularCheckpointFragment
  )> }
);

export type CreateCodeModuleMutationVariables = Exact<{
  stepId: Scalars['Float'];
  lessonId?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  value: Scalars['String'];
}>;


export type CreateCodeModuleMutation = (
  { __typename?: 'Mutation' }
  & { createCodeModule?: Maybe<(
    { __typename?: 'CodeModule' }
    & RegularCodeModuleFragment
  )> }
);

export type CreateLessonMutationVariables = Exact<{
  title: Scalars['String'];
  description: Scalars['String'];
  template?: Maybe<Scalars['String']>;
}>;


export type CreateLessonMutation = (
  { __typename?: 'Mutation' }
  & { createLesson: (
    { __typename?: 'CreateLessonResponse' }
    & { lesson?: Maybe<(
      { __typename?: 'Lesson' }
      & Pick<Lesson, 'id' | 'title'>
      & { owner: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username'>
      ) }
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>> }
  ) }
);

export type CreateSessionMutationVariables = Exact<{
  lessonId: Scalars['Float'];
  currentStepId?: Maybe<Scalars['Float']>;
}>;


export type CreateSessionMutation = (
  { __typename?: 'Mutation' }
  & { createSession?: Maybe<(
    { __typename?: 'Session' }
    & Pick<Session, 'id'>
  )> }
);

export type CreateStepMutationVariables = Exact<{
  lessonId: Scalars['Float'];
  currentStepId: Scalars['Float'];
  name: Scalars['String'];
}>;


export type CreateStepMutation = (
  { __typename?: 'Mutation' }
  & { createStep?: Maybe<(
    { __typename?: 'Step' }
    & RegularStepFragment
  )> }
);

export type DeleteCheckpointMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteCheckpointMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteCheckpoint'>
);

export type DeleteCodeModuleMutationVariables = Exact<{
  uuid: Scalars['String'];
}>;


export type DeleteCodeModuleMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteCodeModule'>
);

export type DeleteDependencyMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteDependencyMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteDependency'>
);

export type DeleteLessonMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteLessonMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteLesson'>
);

export type DeleteSessionMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteSessionMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteSession'>
);

export type DeleteStepMutationVariables = Exact<{
  id: Scalars['Float'];
  lessonId: Scalars['Float'];
}>;


export type DeleteStepMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteStep'>
);

export type DeleteUserMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteUser'>
);

export type ForgotPasswordMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'message' | 'field'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'createdAt'>
    )> }
  ) }
);

export type GitHubLoginMutationVariables = Exact<{
  id: Scalars['Float'];
  accessToken: Scalars['String'];
  username: Scalars['String'];
}>;


export type GitHubLoginMutation = (
  { __typename?: 'Mutation' }
  & { githubLogin: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'message' | 'field'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'createdAt'>
    )> }
  ) }
);

export type GoogleLoginMutationVariables = Exact<{
  id: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
}>;


export type GoogleLoginMutation = (
  { __typename?: 'Mutation' }
  & { googleLogin: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'createdAt'>
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email' | 'username'>
    )> }
  ) }
);

export type UpdateCheckpointMutationVariables = Exact<{
  id: Scalars['Float'];
  description: Scalars['String'];
}>;


export type UpdateCheckpointMutation = (
  { __typename?: 'Mutation' }
  & { updateCheckpoint?: Maybe<(
    { __typename?: 'Checkpoint' }
    & Pick<Checkpoint, 'id' | 'description'>
  )> }
);

export type CompleteCheckpointMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type CompleteCheckpointMutation = (
  { __typename?: 'Mutation' }
  & { completeCheckpoint?: Maybe<(
    { __typename?: 'Checkpoint' }
    & RegularCheckpointFragment
  )> }
);

export type PassCheckpointMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type PassCheckpointMutation = (
  { __typename?: 'Mutation' }
  & { passCheckpoint?: Maybe<(
    { __typename?: 'Checkpoint' }
    & RegularCheckpointFragment
  )> }
);

export type UpdateCodeModuleMutationVariables = Exact<{
  uuid: Scalars['String'];
  name: Scalars['String'];
  value: Scalars['String'];
  lessonId?: Maybe<Scalars['Float']>;
  sessionId?: Maybe<Scalars['Float']>;
}>;


export type UpdateCodeModuleMutation = (
  { __typename?: 'Mutation' }
  & { updateCodeModule?: Maybe<(
    { __typename?: 'CodeModule' }
    & RegularCodeModuleFragment
  )> }
);

export type UpdateCodeModuleEntryFileMutationVariables = Exact<{
  newId?: Maybe<Scalars['String']>;
  oldId?: Maybe<Scalars['String']>;
}>;


export type UpdateCodeModuleEntryFileMutation = (
  { __typename?: 'Mutation' }
  & { updateCodeModuleEntryFile?: Maybe<(
    { __typename?: 'CodeModule' }
    & RegularCodeModuleFragment
  )> }
);

export type UpdateLessonTitleMutationVariables = Exact<{
  id: Scalars['Float'];
  title: Scalars['String'];
}>;


export type UpdateLessonTitleMutation = (
  { __typename?: 'Mutation' }
  & { updateLessonTitle?: Maybe<(
    { __typename?: 'Lesson' }
    & Pick<Lesson, 'id'>
  )> }
);

export type UpdateLessonDescriptionMutationVariables = Exact<{
  id: Scalars['Float'];
  description: Scalars['String'];
}>;


export type UpdateLessonDescriptionMutation = (
  { __typename?: 'Mutation' }
  & { updateLessonDescription?: Maybe<(
    { __typename?: 'Lesson' }
    & Pick<Lesson, 'id'>
  )> }
);

export type UpdateLessonLabelMutationVariables = Exact<{
  id: Scalars['Float'];
  label: Scalars['String'];
}>;


export type UpdateLessonLabelMutation = (
  { __typename?: 'Mutation' }
  & { updateLessonLabel?: Maybe<(
    { __typename?: 'Lesson' }
    & Pick<Lesson, 'id'>
  )> }
);

export type UpdateLessonViewsMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type UpdateLessonViewsMutation = (
  { __typename?: 'Mutation' }
  & { updateLessonViews?: Maybe<(
    { __typename?: 'Lesson' }
    & Pick<Lesson, 'id'>
  )> }
);

export type UpdateLessonStatusMutationVariables = Exact<{
  id: Scalars['Float'];
  status: Scalars['String'];
}>;


export type UpdateLessonStatusMutation = (
  { __typename?: 'Mutation' }
  & { updateLessonStatus?: Maybe<(
    { __typename?: 'Lesson' }
    & RegularLessonFragment
  )> }
);

export type UpdateLessonThumbnailMutationVariables = Exact<{
  id: Scalars['Float'];
  thumbnail?: Maybe<Scalars['String']>;
}>;


export type UpdateLessonThumbnailMutation = (
  { __typename?: 'Mutation' }
  & { updateLessonThumbnail?: Maybe<(
    { __typename?: 'Lesson' }
    & RegularLessonFragment
  )> }
);

export type CreateLessonTagMutationVariables = Exact<{
  id: Scalars['Float'];
  name: Scalars['String'];
}>;


export type CreateLessonTagMutation = (
  { __typename?: 'Mutation' }
  & { createLessonTag: (
    { __typename?: 'Lesson' }
    & RegularLessonFragment
  ) }
);

export type DeleteLessonTagMutationVariables = Exact<{
  id: Scalars['Float'];
  name: Scalars['String'];
}>;


export type DeleteLessonTagMutation = (
  { __typename?: 'Mutation' }
  & { deleteLessonTag: (
    { __typename?: 'Lesson' }
    & RegularLessonFragment
  ) }
);

export type SetNextStepMutationVariables = Exact<{
  sessionId: Scalars['Float'];
  stepId: Scalars['Float'];
}>;


export type SetNextStepMutation = (
  { __typename?: 'Mutation' }
  & { setNextStep?: Maybe<(
    { __typename?: 'Session' }
    & Pick<Session, 'id'>
  )> }
);

export type UpdateSessionMutationVariables = Exact<{
  lessonId: Scalars['Float'];
  sessionId: Scalars['Float'];
}>;


export type UpdateSessionMutation = (
  { __typename?: 'Mutation' }
  & { updateSession?: Maybe<(
    { __typename?: 'Session' }
    & Pick<Session, 'id'>
  )> }
);

export type UpdateStepInstructionsMutationVariables = Exact<{
  id: Scalars['Float'];
  instructions: Scalars['String'];
}>;


export type UpdateStepInstructionsMutation = (
  { __typename?: 'Mutation' }
  & { updateStepInstructions?: Maybe<(
    { __typename?: 'Step' }
    & Pick<Step, 'id'>
  )> }
);

export type UpdateStepNameMutationVariables = Exact<{
  id: Scalars['Float'];
  name: Scalars['String'];
  lessonId: Scalars['Float'];
}>;


export type UpdateStepNameMutation = (
  { __typename?: 'Mutation' }
  & { updateStepName?: Maybe<(
    { __typename?: 'Step' }
    & Pick<Step, 'id'>
  )> }
);

export type UpdateStepCheckpointMutationVariables = Exact<{
  id: Scalars['Float'];
  checkpointId: Scalars['Float'];
}>;


export type UpdateStepCheckpointMutation = (
  { __typename?: 'Mutation' }
  & { updateStepCheckpoint?: Maybe<(
    { __typename?: 'Step' }
    & Pick<Step, 'id'>
  )> }
);

export type CompleteStepMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type CompleteStepMutation = (
  { __typename?: 'Mutation' }
  & { completeStep?: Maybe<(
    { __typename?: 'Step' }
    & Pick<Step, 'id'>
  )> }
);

export type UpdateStepPositionMutationVariables = Exact<{
  id: Scalars['Float'];
  changeY: Scalars['Float'];
  lessonId: Scalars['Float'];
}>;


export type UpdateStepPositionMutation = (
  { __typename?: 'Mutation' }
  & { updateStepPosition?: Maybe<(
    { __typename?: 'Step' }
    & Pick<Step, 'id'>
  )> }
);

export type UpdateUserRoleMutationVariables = Exact<{
  id: Scalars['Float'];
  role: Scalars['String'];
}>;


export type UpdateUserRoleMutation = (
  { __typename?: 'Mutation' }
  & { updateUserRole: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type UpdateUserThemeMutationVariables = Exact<{
  theme: Scalars['String'];
}>;


export type UpdateUserThemeMutation = (
  { __typename?: 'Mutation' }
  & { updateUserTheme: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type UpdateProfileColorSchemeMutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateProfileColorSchemeMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateProfileColorScheme'>
);

export type CheckpointsQueryVariables = Exact<{
  stepId: Scalars['Float'];
}>;


export type CheckpointsQuery = (
  { __typename?: 'Query' }
  & { checkpoints: Array<(
    { __typename?: 'Checkpoint' }
    & RegularCheckpointFragment
  )> }
);

export type DepsFromPkgsQueryVariables = Exact<{ [key: string]: never; }>;


export type DepsFromPkgsQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'deps'>
);

export type LessonQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type LessonQuery = (
  { __typename?: 'Query' }
  & { lesson?: Maybe<(
    { __typename?: 'Lesson' }
    & Pick<Lesson, 'id' | 'description' | 'label' | 'status' | 'thumbnail' | 'title'>
    & { tags?: Maybe<Array<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'name'>
    )>>, owner: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ), steps?: Maybe<Array<(
      { __typename?: 'Step' }
      & RegularStepFragment
    )>> }
  )> }
);

export type LessonsQueryVariables = Exact<{
  status: Scalars['String'];
  ownerId?: Maybe<Scalars['Float']>;
  dependencies?: Maybe<Scalars['String']>;
  labels?: Maybe<Scalars['String']>;
  template?: Maybe<Scalars['String']>;
}>;


export type LessonsQuery = (
  { __typename?: 'Query' }
  & { lessons: Array<(
    { __typename?: 'Lesson' }
    & RegularLessonItemFragment
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type ProfileColorSchemeQueryVariables = Exact<{
  id?: Maybe<Scalars['Float']>;
}>;


export type ProfileColorSchemeQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'profileColorScheme'>
);

export type ModalQueryVariables = Exact<{ [key: string]: never; }>;


export type ModalQuery = (
  { __typename?: 'Query' }
  & { modal?: Maybe<(
    { __typename?: 'Modal' }
    & Pick<Modal, 'name' | 'callback'>
  )> }
);

export type SessionQueryVariables = Exact<{
  lessonId: Scalars['Int'];
}>;


export type SessionQuery = (
  { __typename?: 'Query' }
  & { session?: Maybe<(
    { __typename?: 'Session' }
    & Pick<Session, 'id' | 'currentStep' | 'requiresUpdate'>
    & { lesson: (
      { __typename?: 'Lesson' }
      & Pick<Lesson, 'title' | 'id'>
      & { owner: (
        { __typename?: 'User' }
        & Pick<User, 'id'>
      ) }
    ), steps?: Maybe<Array<(
      { __typename?: 'Step' }
      & RegularStepFragment
    )>> }
  )> }
);

export type SessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type SessionsQuery = (
  { __typename?: 'Query' }
  & { sessions: Array<(
    { __typename?: 'Session' }
    & Pick<Session, 'id' | 'currentStep'>
    & { lesson: (
      { __typename?: 'Lesson' }
      & RegularLessonItemFragment
    ), steps?: Maybe<Array<(
      { __typename?: 'Step' }
      & RegularStepFragment
    )>> }
  )> }
);

export type StepQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type StepQuery = (
  { __typename?: 'Query' }
  & { step?: Maybe<(
    { __typename?: 'Step' }
    & RegularStepFragment
  )> }
);

export type StepsQueryVariables = Exact<{ [key: string]: never; }>;


export type StepsQuery = (
  { __typename?: 'Query' }
  & { steps: Array<(
    { __typename?: 'Step' }
    & RegularStepFragment
  )> }
);

export type StudentsQueryVariables = Exact<{ [key: string]: never; }>;


export type StudentsQuery = (
  { __typename?: 'Query' }
  & { users?: Maybe<Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'createdAt'>
  )>> }
);

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularLessonFragmentDoc = gql`
    fragment RegularLesson on Lesson {
  id
  description
  label
  status
  label
  template
  thumbnail
  title
  owner {
    id
    username
  }
}
    `;
export const RegularLessonItemFragmentDoc = gql`
    fragment RegularLessonItem on Lesson {
  id
  createdAt
  label
  likes
  status
  tags {
    name
  }
  template
  title
  thumbnail
  updatedAt
  views
  students {
    id
  }
  owner {
    id
    username
  }
}
    `;
export const RegularCodeModuleFragmentDoc = gql`
    fragment RegularCodeModule on CodeModule {
  uuid
  isEntry
  name
  value
}
    `;
export const RegularCheckpointFragmentDoc = gql`
    fragment RegularCheckpoint on Checkpoint {
  id
  createdAt
  description
  fileToMatchRegex
  matchRegex
  output
  isCompleted
  isTested
  test
  type
}
    `;
export const RegularStepFragmentDoc = gql`
    fragment RegularStep on Step {
  id
  createdAt
  currentCheckpointId
  executionType
  lang
  instructions
  isCompleted
  name
  position
  codeModules {
    ...RegularCodeModule
  }
  checkpoints {
    ...RegularCheckpoint
  }
}
    ${RegularCodeModuleFragmentDoc}
${RegularCheckpointFragmentDoc}`;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  email
  role
  theme
  username
  isAuthenticated @client
}
    `;
export const ChangeEmailDocument = gql`
    mutation ChangeEmail($newEmail: String!) {
  changeEmail(newEmail: $newEmail) {
    errors {
      ...RegularError
    }
    user {
      id
      email
      username
    }
  }
}
    ${RegularErrorFragmentDoc}`;
export type ChangeEmailMutationFn = Apollo.MutationFunction<ChangeEmailMutation, ChangeEmailMutationVariables>;

/**
 * __useChangeEmailMutation__
 *
 * To run a mutation, you first call `useChangeEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeEmailMutation, { data, loading, error }] = useChangeEmailMutation({
 *   variables: {
 *      newEmail: // value for 'newEmail'
 *   },
 * });
 */
export function useChangeEmailMutation(baseOptions?: Apollo.MutationHookOptions<ChangeEmailMutation, ChangeEmailMutationVariables>) {
        return Apollo.useMutation<ChangeEmailMutation, ChangeEmailMutationVariables>(ChangeEmailDocument, baseOptions);
      }
export type ChangeEmailMutationHookResult = ReturnType<typeof useChangeEmailMutation>;
export type ChangeEmailMutationResult = Apollo.MutationResult<ChangeEmailMutation>;
export type ChangeEmailMutationOptions = Apollo.BaseMutationOptions<ChangeEmailMutation, ChangeEmailMutationVariables>;
export const ChangePasswordFromTokenDocument = gql`
    mutation ChangePasswordFromToken($token: String!, $newPassword: String!) {
  changePasswordFromToken(token: $token, newPassword: $newPassword) {
    errors {
      ...RegularError
    }
    user {
      id
      username
    }
  }
}
    ${RegularErrorFragmentDoc}`;
export type ChangePasswordFromTokenMutationFn = Apollo.MutationFunction<ChangePasswordFromTokenMutation, ChangePasswordFromTokenMutationVariables>;

/**
 * __useChangePasswordFromTokenMutation__
 *
 * To run a mutation, you first call `useChangePasswordFromTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordFromTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordFromTokenMutation, { data, loading, error }] = useChangePasswordFromTokenMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordFromTokenMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordFromTokenMutation, ChangePasswordFromTokenMutationVariables>) {
        return Apollo.useMutation<ChangePasswordFromTokenMutation, ChangePasswordFromTokenMutationVariables>(ChangePasswordFromTokenDocument, baseOptions);
      }
export type ChangePasswordFromTokenMutationHookResult = ReturnType<typeof useChangePasswordFromTokenMutation>;
export type ChangePasswordFromTokenMutationResult = Apollo.MutationResult<ChangePasswordFromTokenMutation>;
export type ChangePasswordFromTokenMutationOptions = Apollo.BaseMutationOptions<ChangePasswordFromTokenMutation, ChangePasswordFromTokenMutationVariables>;
export const ChangePasswordFromPasswordDocument = gql`
    mutation ChangePasswordFromPassword($oldPassword: String!, $newPassword: String!) {
  changePasswordFromPassword(oldPassword: $oldPassword, newPassword: $newPassword) {
    errors {
      ...RegularError
    }
    user {
      id
      username
    }
  }
}
    ${RegularErrorFragmentDoc}`;
export type ChangePasswordFromPasswordMutationFn = Apollo.MutationFunction<ChangePasswordFromPasswordMutation, ChangePasswordFromPasswordMutationVariables>;

/**
 * __useChangePasswordFromPasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordFromPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordFromPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordFromPasswordMutation, { data, loading, error }] = useChangePasswordFromPasswordMutation({
 *   variables: {
 *      oldPassword: // value for 'oldPassword'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordFromPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordFromPasswordMutation, ChangePasswordFromPasswordMutationVariables>) {
        return Apollo.useMutation<ChangePasswordFromPasswordMutation, ChangePasswordFromPasswordMutationVariables>(ChangePasswordFromPasswordDocument, baseOptions);
      }
export type ChangePasswordFromPasswordMutationHookResult = ReturnType<typeof useChangePasswordFromPasswordMutation>;
export type ChangePasswordFromPasswordMutationResult = Apollo.MutationResult<ChangePasswordFromPasswordMutation>;
export type ChangePasswordFromPasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordFromPasswordMutation, ChangePasswordFromPasswordMutationVariables>;
export const CreateSpecCheckpointDocument = gql`
    mutation CreateSpecCheckpoint($checkpointId: Float!, $stepId: Float!) {
  createSpecCheckpoint(options: {checkpointId: $checkpointId, stepId: $stepId}) {
    ...RegularCheckpoint
  }
}
    ${RegularCheckpointFragmentDoc}`;
export type CreateSpecCheckpointMutationFn = Apollo.MutationFunction<CreateSpecCheckpointMutation, CreateSpecCheckpointMutationVariables>;

/**
 * __useCreateSpecCheckpointMutation__
 *
 * To run a mutation, you first call `useCreateSpecCheckpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSpecCheckpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSpecCheckpointMutation, { data, loading, error }] = useCreateSpecCheckpointMutation({
 *   variables: {
 *      checkpointId: // value for 'checkpointId'
 *      stepId: // value for 'stepId'
 *   },
 * });
 */
export function useCreateSpecCheckpointMutation(baseOptions?: Apollo.MutationHookOptions<CreateSpecCheckpointMutation, CreateSpecCheckpointMutationVariables>) {
        return Apollo.useMutation<CreateSpecCheckpointMutation, CreateSpecCheckpointMutationVariables>(CreateSpecCheckpointDocument, baseOptions);
      }
export type CreateSpecCheckpointMutationHookResult = ReturnType<typeof useCreateSpecCheckpointMutation>;
export type CreateSpecCheckpointMutationResult = Apollo.MutationResult<CreateSpecCheckpointMutation>;
export type CreateSpecCheckpointMutationOptions = Apollo.BaseMutationOptions<CreateSpecCheckpointMutation, CreateSpecCheckpointMutationVariables>;
export const CreateMatchCheckpointDocument = gql`
    mutation CreateMatchCheckpoint($matchRegex: String!, $fileToMatchRegex: String!, $stepId: Float!) {
  createMatchCheckpoint(
    options: {matchRegex: $matchRegex, fileToMatchRegex: $fileToMatchRegex, stepId: $stepId}
  ) {
    ...RegularCheckpoint
  }
}
    ${RegularCheckpointFragmentDoc}`;
export type CreateMatchCheckpointMutationFn = Apollo.MutationFunction<CreateMatchCheckpointMutation, CreateMatchCheckpointMutationVariables>;

/**
 * __useCreateMatchCheckpointMutation__
 *
 * To run a mutation, you first call `useCreateMatchCheckpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMatchCheckpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMatchCheckpointMutation, { data, loading, error }] = useCreateMatchCheckpointMutation({
 *   variables: {
 *      matchRegex: // value for 'matchRegex'
 *      fileToMatchRegex: // value for 'fileToMatchRegex'
 *      stepId: // value for 'stepId'
 *   },
 * });
 */
export function useCreateMatchCheckpointMutation(baseOptions?: Apollo.MutationHookOptions<CreateMatchCheckpointMutation, CreateMatchCheckpointMutationVariables>) {
        return Apollo.useMutation<CreateMatchCheckpointMutation, CreateMatchCheckpointMutationVariables>(CreateMatchCheckpointDocument, baseOptions);
      }
export type CreateMatchCheckpointMutationHookResult = ReturnType<typeof useCreateMatchCheckpointMutation>;
export type CreateMatchCheckpointMutationResult = Apollo.MutationResult<CreateMatchCheckpointMutation>;
export type CreateMatchCheckpointMutationOptions = Apollo.BaseMutationOptions<CreateMatchCheckpointMutation, CreateMatchCheckpointMutationVariables>;
export const CreateOutputCheckpointDocument = gql`
    mutation CreateOutputCheckpoint($output: String!, $stepId: Float!) {
  createOutputCheckpoint(options: {output: $output, stepId: $stepId}) {
    ...RegularCheckpoint
  }
}
    ${RegularCheckpointFragmentDoc}`;
export type CreateOutputCheckpointMutationFn = Apollo.MutationFunction<CreateOutputCheckpointMutation, CreateOutputCheckpointMutationVariables>;

/**
 * __useCreateOutputCheckpointMutation__
 *
 * To run a mutation, you first call `useCreateOutputCheckpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOutputCheckpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOutputCheckpointMutation, { data, loading, error }] = useCreateOutputCheckpointMutation({
 *   variables: {
 *      output: // value for 'output'
 *      stepId: // value for 'stepId'
 *   },
 * });
 */
export function useCreateOutputCheckpointMutation(baseOptions?: Apollo.MutationHookOptions<CreateOutputCheckpointMutation, CreateOutputCheckpointMutationVariables>) {
        return Apollo.useMutation<CreateOutputCheckpointMutation, CreateOutputCheckpointMutationVariables>(CreateOutputCheckpointDocument, baseOptions);
      }
export type CreateOutputCheckpointMutationHookResult = ReturnType<typeof useCreateOutputCheckpointMutation>;
export type CreateOutputCheckpointMutationResult = Apollo.MutationResult<CreateOutputCheckpointMutation>;
export type CreateOutputCheckpointMutationOptions = Apollo.BaseMutationOptions<CreateOutputCheckpointMutation, CreateOutputCheckpointMutationVariables>;
export const CreateCodeModuleDocument = gql`
    mutation CreateCodeModule($stepId: Float!, $lessonId: Float, $name: String!, $value: String!) {
  createCodeModule(
    stepId: $stepId
    options: {name: $name, lessonId: $lessonId, value: $value}
  ) {
    ...RegularCodeModule
  }
}
    ${RegularCodeModuleFragmentDoc}`;
export type CreateCodeModuleMutationFn = Apollo.MutationFunction<CreateCodeModuleMutation, CreateCodeModuleMutationVariables>;

/**
 * __useCreateCodeModuleMutation__
 *
 * To run a mutation, you first call `useCreateCodeModuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCodeModuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCodeModuleMutation, { data, loading, error }] = useCreateCodeModuleMutation({
 *   variables: {
 *      stepId: // value for 'stepId'
 *      lessonId: // value for 'lessonId'
 *      name: // value for 'name'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useCreateCodeModuleMutation(baseOptions?: Apollo.MutationHookOptions<CreateCodeModuleMutation, CreateCodeModuleMutationVariables>) {
        return Apollo.useMutation<CreateCodeModuleMutation, CreateCodeModuleMutationVariables>(CreateCodeModuleDocument, baseOptions);
      }
export type CreateCodeModuleMutationHookResult = ReturnType<typeof useCreateCodeModuleMutation>;
export type CreateCodeModuleMutationResult = Apollo.MutationResult<CreateCodeModuleMutation>;
export type CreateCodeModuleMutationOptions = Apollo.BaseMutationOptions<CreateCodeModuleMutation, CreateCodeModuleMutationVariables>;
export const CreateLessonDocument = gql`
    mutation CreateLesson($title: String!, $description: String!, $template: String) {
  createLesson(
    options: {title: $title, description: $description, template: $template}
  ) {
    lesson {
      id
      title
      owner {
        id
        username
      }
    }
    errors {
      ...RegularError
    }
  }
}
    ${RegularErrorFragmentDoc}`;
export type CreateLessonMutationFn = Apollo.MutationFunction<CreateLessonMutation, CreateLessonMutationVariables>;

/**
 * __useCreateLessonMutation__
 *
 * To run a mutation, you first call `useCreateLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLessonMutation, { data, loading, error }] = useCreateLessonMutation({
 *   variables: {
 *      title: // value for 'title'
 *      description: // value for 'description'
 *      template: // value for 'template'
 *   },
 * });
 */
export function useCreateLessonMutation(baseOptions?: Apollo.MutationHookOptions<CreateLessonMutation, CreateLessonMutationVariables>) {
        return Apollo.useMutation<CreateLessonMutation, CreateLessonMutationVariables>(CreateLessonDocument, baseOptions);
      }
export type CreateLessonMutationHookResult = ReturnType<typeof useCreateLessonMutation>;
export type CreateLessonMutationResult = Apollo.MutationResult<CreateLessonMutation>;
export type CreateLessonMutationOptions = Apollo.BaseMutationOptions<CreateLessonMutation, CreateLessonMutationVariables>;
export const CreateSessionDocument = gql`
    mutation CreateSession($lessonId: Float!, $currentStepId: Float) {
  createSession(options: {lessonId: $lessonId, currentStepId: $currentStepId}) {
    id
  }
}
    `;
export type CreateSessionMutationFn = Apollo.MutationFunction<CreateSessionMutation, CreateSessionMutationVariables>;

/**
 * __useCreateSessionMutation__
 *
 * To run a mutation, you first call `useCreateSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSessionMutation, { data, loading, error }] = useCreateSessionMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      currentStepId: // value for 'currentStepId'
 *   },
 * });
 */
export function useCreateSessionMutation(baseOptions?: Apollo.MutationHookOptions<CreateSessionMutation, CreateSessionMutationVariables>) {
        return Apollo.useMutation<CreateSessionMutation, CreateSessionMutationVariables>(CreateSessionDocument, baseOptions);
      }
export type CreateSessionMutationHookResult = ReturnType<typeof useCreateSessionMutation>;
export type CreateSessionMutationResult = Apollo.MutationResult<CreateSessionMutation>;
export type CreateSessionMutationOptions = Apollo.BaseMutationOptions<CreateSessionMutation, CreateSessionMutationVariables>;
export const CreateStepDocument = gql`
    mutation CreateStep($lessonId: Float!, $currentStepId: Float!, $name: String!) {
  createStep(
    options: {lessonId: $lessonId, currentStepId: $currentStepId, name: $name}
  ) {
    ...RegularStep
  }
}
    ${RegularStepFragmentDoc}`;
export type CreateStepMutationFn = Apollo.MutationFunction<CreateStepMutation, CreateStepMutationVariables>;

/**
 * __useCreateStepMutation__
 *
 * To run a mutation, you first call `useCreateStepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStepMutation, { data, loading, error }] = useCreateStepMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      currentStepId: // value for 'currentStepId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateStepMutation(baseOptions?: Apollo.MutationHookOptions<CreateStepMutation, CreateStepMutationVariables>) {
        return Apollo.useMutation<CreateStepMutation, CreateStepMutationVariables>(CreateStepDocument, baseOptions);
      }
export type CreateStepMutationHookResult = ReturnType<typeof useCreateStepMutation>;
export type CreateStepMutationResult = Apollo.MutationResult<CreateStepMutation>;
export type CreateStepMutationOptions = Apollo.BaseMutationOptions<CreateStepMutation, CreateStepMutationVariables>;
export const DeleteCheckpointDocument = gql`
    mutation DeleteCheckpoint($id: Float!) {
  deleteCheckpoint(id: $id)
}
    `;
export type DeleteCheckpointMutationFn = Apollo.MutationFunction<DeleteCheckpointMutation, DeleteCheckpointMutationVariables>;

/**
 * __useDeleteCheckpointMutation__
 *
 * To run a mutation, you first call `useDeleteCheckpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCheckpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCheckpointMutation, { data, loading, error }] = useDeleteCheckpointMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCheckpointMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCheckpointMutation, DeleteCheckpointMutationVariables>) {
        return Apollo.useMutation<DeleteCheckpointMutation, DeleteCheckpointMutationVariables>(DeleteCheckpointDocument, baseOptions);
      }
export type DeleteCheckpointMutationHookResult = ReturnType<typeof useDeleteCheckpointMutation>;
export type DeleteCheckpointMutationResult = Apollo.MutationResult<DeleteCheckpointMutation>;
export type DeleteCheckpointMutationOptions = Apollo.BaseMutationOptions<DeleteCheckpointMutation, DeleteCheckpointMutationVariables>;
export const DeleteCodeModuleDocument = gql`
    mutation DeleteCodeModule($uuid: String!) {
  deleteCodeModule(uuid: $uuid)
}
    `;
export type DeleteCodeModuleMutationFn = Apollo.MutationFunction<DeleteCodeModuleMutation, DeleteCodeModuleMutationVariables>;

/**
 * __useDeleteCodeModuleMutation__
 *
 * To run a mutation, you first call `useDeleteCodeModuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCodeModuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCodeModuleMutation, { data, loading, error }] = useDeleteCodeModuleMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteCodeModuleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCodeModuleMutation, DeleteCodeModuleMutationVariables>) {
        return Apollo.useMutation<DeleteCodeModuleMutation, DeleteCodeModuleMutationVariables>(DeleteCodeModuleDocument, baseOptions);
      }
export type DeleteCodeModuleMutationHookResult = ReturnType<typeof useDeleteCodeModuleMutation>;
export type DeleteCodeModuleMutationResult = Apollo.MutationResult<DeleteCodeModuleMutation>;
export type DeleteCodeModuleMutationOptions = Apollo.BaseMutationOptions<DeleteCodeModuleMutation, DeleteCodeModuleMutationVariables>;
export const DeleteDependencyDocument = gql`
    mutation DeleteDependency($id: Float!) {
  deleteDependency(id: $id)
}
    `;
export type DeleteDependencyMutationFn = Apollo.MutationFunction<DeleteDependencyMutation, DeleteDependencyMutationVariables>;

/**
 * __useDeleteDependencyMutation__
 *
 * To run a mutation, you first call `useDeleteDependencyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDependencyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDependencyMutation, { data, loading, error }] = useDeleteDependencyMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteDependencyMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDependencyMutation, DeleteDependencyMutationVariables>) {
        return Apollo.useMutation<DeleteDependencyMutation, DeleteDependencyMutationVariables>(DeleteDependencyDocument, baseOptions);
      }
export type DeleteDependencyMutationHookResult = ReturnType<typeof useDeleteDependencyMutation>;
export type DeleteDependencyMutationResult = Apollo.MutationResult<DeleteDependencyMutation>;
export type DeleteDependencyMutationOptions = Apollo.BaseMutationOptions<DeleteDependencyMutation, DeleteDependencyMutationVariables>;
export const DeleteLessonDocument = gql`
    mutation DeleteLesson($id: Float!) {
  deleteLesson(id: $id)
}
    `;
export type DeleteLessonMutationFn = Apollo.MutationFunction<DeleteLessonMutation, DeleteLessonMutationVariables>;

/**
 * __useDeleteLessonMutation__
 *
 * To run a mutation, you first call `useDeleteLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLessonMutation, { data, loading, error }] = useDeleteLessonMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLessonMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLessonMutation, DeleteLessonMutationVariables>) {
        return Apollo.useMutation<DeleteLessonMutation, DeleteLessonMutationVariables>(DeleteLessonDocument, baseOptions);
      }
export type DeleteLessonMutationHookResult = ReturnType<typeof useDeleteLessonMutation>;
export type DeleteLessonMutationResult = Apollo.MutationResult<DeleteLessonMutation>;
export type DeleteLessonMutationOptions = Apollo.BaseMutationOptions<DeleteLessonMutation, DeleteLessonMutationVariables>;
export const DeleteSessionDocument = gql`
    mutation DeleteSession($id: Float!) {
  deleteSession(id: $id)
}
    `;
export type DeleteSessionMutationFn = Apollo.MutationFunction<DeleteSessionMutation, DeleteSessionMutationVariables>;

/**
 * __useDeleteSessionMutation__
 *
 * To run a mutation, you first call `useDeleteSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSessionMutation, { data, loading, error }] = useDeleteSessionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSessionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSessionMutation, DeleteSessionMutationVariables>) {
        return Apollo.useMutation<DeleteSessionMutation, DeleteSessionMutationVariables>(DeleteSessionDocument, baseOptions);
      }
export type DeleteSessionMutationHookResult = ReturnType<typeof useDeleteSessionMutation>;
export type DeleteSessionMutationResult = Apollo.MutationResult<DeleteSessionMutation>;
export type DeleteSessionMutationOptions = Apollo.BaseMutationOptions<DeleteSessionMutation, DeleteSessionMutationVariables>;
export const DeleteStepDocument = gql`
    mutation DeleteStep($id: Float!, $lessonId: Float!) {
  deleteStep(options: {id: $id, lessonId: $lessonId})
}
    `;
export type DeleteStepMutationFn = Apollo.MutationFunction<DeleteStepMutation, DeleteStepMutationVariables>;

/**
 * __useDeleteStepMutation__
 *
 * To run a mutation, you first call `useDeleteStepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStepMutation, { data, loading, error }] = useDeleteStepMutation({
 *   variables: {
 *      id: // value for 'id'
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useDeleteStepMutation(baseOptions?: Apollo.MutationHookOptions<DeleteStepMutation, DeleteStepMutationVariables>) {
        return Apollo.useMutation<DeleteStepMutation, DeleteStepMutationVariables>(DeleteStepDocument, baseOptions);
      }
export type DeleteStepMutationHookResult = ReturnType<typeof useDeleteStepMutation>;
export type DeleteStepMutationResult = Apollo.MutationResult<DeleteStepMutation>;
export type DeleteStepMutationOptions = Apollo.BaseMutationOptions<DeleteStepMutation, DeleteStepMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser {
  deleteUser
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, baseOptions);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($usernameOrEmail: String!) {
  forgotPassword(usernameOrEmail: $usernameOrEmail)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, baseOptions);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(options: {usernameOrEmail: $usernameOrEmail, password: $password}) {
    errors {
      message
      field
    }
    user {
      id
      username
      createdAt
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const GitHubLoginDocument = gql`
    mutation GitHubLogin($id: Float!, $accessToken: String!, $username: String!) {
  githubLogin(options: {id: $id, accessToken: $accessToken, username: $username}) {
    errors {
      message
      field
    }
    user {
      id
      username
      createdAt
    }
  }
}
    `;
export type GitHubLoginMutationFn = Apollo.MutationFunction<GitHubLoginMutation, GitHubLoginMutationVariables>;

/**
 * __useGitHubLoginMutation__
 *
 * To run a mutation, you first call `useGitHubLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGitHubLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [gitHubLoginMutation, { data, loading, error }] = useGitHubLoginMutation({
 *   variables: {
 *      id: // value for 'id'
 *      accessToken: // value for 'accessToken'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGitHubLoginMutation(baseOptions?: Apollo.MutationHookOptions<GitHubLoginMutation, GitHubLoginMutationVariables>) {
        return Apollo.useMutation<GitHubLoginMutation, GitHubLoginMutationVariables>(GitHubLoginDocument, baseOptions);
      }
export type GitHubLoginMutationHookResult = ReturnType<typeof useGitHubLoginMutation>;
export type GitHubLoginMutationResult = Apollo.MutationResult<GitHubLoginMutation>;
export type GitHubLoginMutationOptions = Apollo.BaseMutationOptions<GitHubLoginMutation, GitHubLoginMutationVariables>;
export const GoogleLoginDocument = gql`
    mutation GoogleLogin($id: String!, $username: String!, $email: String!) {
  googleLogin(options: {id: $id, username: $username, email: $email}) {
    user {
      id
      username
      createdAt
    }
  }
}
    `;
export type GoogleLoginMutationFn = Apollo.MutationFunction<GoogleLoginMutation, GoogleLoginMutationVariables>;

/**
 * __useGoogleLoginMutation__
 *
 * To run a mutation, you first call `useGoogleLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGoogleLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [googleLoginMutation, { data, loading, error }] = useGoogleLoginMutation({
 *   variables: {
 *      id: // value for 'id'
 *      username: // value for 'username'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useGoogleLoginMutation(baseOptions?: Apollo.MutationHookOptions<GoogleLoginMutation, GoogleLoginMutationVariables>) {
        return Apollo.useMutation<GoogleLoginMutation, GoogleLoginMutationVariables>(GoogleLoginDocument, baseOptions);
      }
export type GoogleLoginMutationHookResult = ReturnType<typeof useGoogleLoginMutation>;
export type GoogleLoginMutationResult = Apollo.MutationResult<GoogleLoginMutation>;
export type GoogleLoginMutationOptions = Apollo.BaseMutationOptions<GoogleLoginMutation, GoogleLoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $username: String!, $password: String!) {
  register(options: {email: $email, username: $username, password: $password}) {
    errors {
      field
      message
    }
    user {
      id
      email
      username
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const UpdateCheckpointDocument = gql`
    mutation UpdateCheckpoint($id: Float!, $description: String!) {
  updateCheckpoint(id: $id, options: {description: $description}) {
    id
    description
  }
}
    `;
export type UpdateCheckpointMutationFn = Apollo.MutationFunction<UpdateCheckpointMutation, UpdateCheckpointMutationVariables>;

/**
 * __useUpdateCheckpointMutation__
 *
 * To run a mutation, you first call `useUpdateCheckpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCheckpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCheckpointMutation, { data, loading, error }] = useUpdateCheckpointMutation({
 *   variables: {
 *      id: // value for 'id'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateCheckpointMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCheckpointMutation, UpdateCheckpointMutationVariables>) {
        return Apollo.useMutation<UpdateCheckpointMutation, UpdateCheckpointMutationVariables>(UpdateCheckpointDocument, baseOptions);
      }
export type UpdateCheckpointMutationHookResult = ReturnType<typeof useUpdateCheckpointMutation>;
export type UpdateCheckpointMutationResult = Apollo.MutationResult<UpdateCheckpointMutation>;
export type UpdateCheckpointMutationOptions = Apollo.BaseMutationOptions<UpdateCheckpointMutation, UpdateCheckpointMutationVariables>;
export const CompleteCheckpointDocument = gql`
    mutation CompleteCheckpoint($id: Float!) {
  completeCheckpoint(id: $id) {
    ...RegularCheckpoint
  }
}
    ${RegularCheckpointFragmentDoc}`;
export type CompleteCheckpointMutationFn = Apollo.MutationFunction<CompleteCheckpointMutation, CompleteCheckpointMutationVariables>;

/**
 * __useCompleteCheckpointMutation__
 *
 * To run a mutation, you first call `useCompleteCheckpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteCheckpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeCheckpointMutation, { data, loading, error }] = useCompleteCheckpointMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCompleteCheckpointMutation(baseOptions?: Apollo.MutationHookOptions<CompleteCheckpointMutation, CompleteCheckpointMutationVariables>) {
        return Apollo.useMutation<CompleteCheckpointMutation, CompleteCheckpointMutationVariables>(CompleteCheckpointDocument, baseOptions);
      }
export type CompleteCheckpointMutationHookResult = ReturnType<typeof useCompleteCheckpointMutation>;
export type CompleteCheckpointMutationResult = Apollo.MutationResult<CompleteCheckpointMutation>;
export type CompleteCheckpointMutationOptions = Apollo.BaseMutationOptions<CompleteCheckpointMutation, CompleteCheckpointMutationVariables>;
export const PassCheckpointDocument = gql`
    mutation PassCheckpoint($id: Float!) {
  passCheckpoint(id: $id) {
    ...RegularCheckpoint
  }
}
    ${RegularCheckpointFragmentDoc}`;
export type PassCheckpointMutationFn = Apollo.MutationFunction<PassCheckpointMutation, PassCheckpointMutationVariables>;

/**
 * __usePassCheckpointMutation__
 *
 * To run a mutation, you first call `usePassCheckpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePassCheckpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [passCheckpointMutation, { data, loading, error }] = usePassCheckpointMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePassCheckpointMutation(baseOptions?: Apollo.MutationHookOptions<PassCheckpointMutation, PassCheckpointMutationVariables>) {
        return Apollo.useMutation<PassCheckpointMutation, PassCheckpointMutationVariables>(PassCheckpointDocument, baseOptions);
      }
export type PassCheckpointMutationHookResult = ReturnType<typeof usePassCheckpointMutation>;
export type PassCheckpointMutationResult = Apollo.MutationResult<PassCheckpointMutation>;
export type PassCheckpointMutationOptions = Apollo.BaseMutationOptions<PassCheckpointMutation, PassCheckpointMutationVariables>;
export const UpdateCodeModuleDocument = gql`
    mutation UpdateCodeModule($uuid: String!, $name: String!, $value: String!, $lessonId: Float, $sessionId: Float) {
  updateCodeModule(
    uuid: $uuid
    options: {name: $name, value: $value, sessionId: $sessionId, lessonId: $lessonId}
  ) {
    ...RegularCodeModule
  }
}
    ${RegularCodeModuleFragmentDoc}`;
export type UpdateCodeModuleMutationFn = Apollo.MutationFunction<UpdateCodeModuleMutation, UpdateCodeModuleMutationVariables>;

/**
 * __useUpdateCodeModuleMutation__
 *
 * To run a mutation, you first call `useUpdateCodeModuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCodeModuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCodeModuleMutation, { data, loading, error }] = useUpdateCodeModuleMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *      name: // value for 'name'
 *      value: // value for 'value'
 *      lessonId: // value for 'lessonId'
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useUpdateCodeModuleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCodeModuleMutation, UpdateCodeModuleMutationVariables>) {
        return Apollo.useMutation<UpdateCodeModuleMutation, UpdateCodeModuleMutationVariables>(UpdateCodeModuleDocument, baseOptions);
      }
export type UpdateCodeModuleMutationHookResult = ReturnType<typeof useUpdateCodeModuleMutation>;
export type UpdateCodeModuleMutationResult = Apollo.MutationResult<UpdateCodeModuleMutation>;
export type UpdateCodeModuleMutationOptions = Apollo.BaseMutationOptions<UpdateCodeModuleMutation, UpdateCodeModuleMutationVariables>;
export const UpdateCodeModuleEntryFileDocument = gql`
    mutation UpdateCodeModuleEntryFile($newId: String, $oldId: String) {
  updateCodeModuleEntryFile(options: {newId: $newId, oldId: $oldId}) {
    ...RegularCodeModule
  }
}
    ${RegularCodeModuleFragmentDoc}`;
export type UpdateCodeModuleEntryFileMutationFn = Apollo.MutationFunction<UpdateCodeModuleEntryFileMutation, UpdateCodeModuleEntryFileMutationVariables>;

/**
 * __useUpdateCodeModuleEntryFileMutation__
 *
 * To run a mutation, you first call `useUpdateCodeModuleEntryFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCodeModuleEntryFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCodeModuleEntryFileMutation, { data, loading, error }] = useUpdateCodeModuleEntryFileMutation({
 *   variables: {
 *      newId: // value for 'newId'
 *      oldId: // value for 'oldId'
 *   },
 * });
 */
export function useUpdateCodeModuleEntryFileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCodeModuleEntryFileMutation, UpdateCodeModuleEntryFileMutationVariables>) {
        return Apollo.useMutation<UpdateCodeModuleEntryFileMutation, UpdateCodeModuleEntryFileMutationVariables>(UpdateCodeModuleEntryFileDocument, baseOptions);
      }
export type UpdateCodeModuleEntryFileMutationHookResult = ReturnType<typeof useUpdateCodeModuleEntryFileMutation>;
export type UpdateCodeModuleEntryFileMutationResult = Apollo.MutationResult<UpdateCodeModuleEntryFileMutation>;
export type UpdateCodeModuleEntryFileMutationOptions = Apollo.BaseMutationOptions<UpdateCodeModuleEntryFileMutation, UpdateCodeModuleEntryFileMutationVariables>;
export const UpdateLessonTitleDocument = gql`
    mutation UpdateLessonTitle($id: Float!, $title: String!) {
  updateLessonTitle(id: $id, title: $title) {
    id
  }
}
    `;
export type UpdateLessonTitleMutationFn = Apollo.MutationFunction<UpdateLessonTitleMutation, UpdateLessonTitleMutationVariables>;

/**
 * __useUpdateLessonTitleMutation__
 *
 * To run a mutation, you first call `useUpdateLessonTitleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLessonTitleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLessonTitleMutation, { data, loading, error }] = useUpdateLessonTitleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useUpdateLessonTitleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLessonTitleMutation, UpdateLessonTitleMutationVariables>) {
        return Apollo.useMutation<UpdateLessonTitleMutation, UpdateLessonTitleMutationVariables>(UpdateLessonTitleDocument, baseOptions);
      }
export type UpdateLessonTitleMutationHookResult = ReturnType<typeof useUpdateLessonTitleMutation>;
export type UpdateLessonTitleMutationResult = Apollo.MutationResult<UpdateLessonTitleMutation>;
export type UpdateLessonTitleMutationOptions = Apollo.BaseMutationOptions<UpdateLessonTitleMutation, UpdateLessonTitleMutationVariables>;
export const UpdateLessonDescriptionDocument = gql`
    mutation UpdateLessonDescription($id: Float!, $description: String!) {
  updateLessonDescription(id: $id, description: $description) {
    id
  }
}
    `;
export type UpdateLessonDescriptionMutationFn = Apollo.MutationFunction<UpdateLessonDescriptionMutation, UpdateLessonDescriptionMutationVariables>;

/**
 * __useUpdateLessonDescriptionMutation__
 *
 * To run a mutation, you first call `useUpdateLessonDescriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLessonDescriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLessonDescriptionMutation, { data, loading, error }] = useUpdateLessonDescriptionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateLessonDescriptionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLessonDescriptionMutation, UpdateLessonDescriptionMutationVariables>) {
        return Apollo.useMutation<UpdateLessonDescriptionMutation, UpdateLessonDescriptionMutationVariables>(UpdateLessonDescriptionDocument, baseOptions);
      }
export type UpdateLessonDescriptionMutationHookResult = ReturnType<typeof useUpdateLessonDescriptionMutation>;
export type UpdateLessonDescriptionMutationResult = Apollo.MutationResult<UpdateLessonDescriptionMutation>;
export type UpdateLessonDescriptionMutationOptions = Apollo.BaseMutationOptions<UpdateLessonDescriptionMutation, UpdateLessonDescriptionMutationVariables>;
export const UpdateLessonLabelDocument = gql`
    mutation UpdateLessonLabel($id: Float!, $label: String!) {
  updateLessonLabel(id: $id, label: $label) {
    id
  }
}
    `;
export type UpdateLessonLabelMutationFn = Apollo.MutationFunction<UpdateLessonLabelMutation, UpdateLessonLabelMutationVariables>;

/**
 * __useUpdateLessonLabelMutation__
 *
 * To run a mutation, you first call `useUpdateLessonLabelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLessonLabelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLessonLabelMutation, { data, loading, error }] = useUpdateLessonLabelMutation({
 *   variables: {
 *      id: // value for 'id'
 *      label: // value for 'label'
 *   },
 * });
 */
export function useUpdateLessonLabelMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLessonLabelMutation, UpdateLessonLabelMutationVariables>) {
        return Apollo.useMutation<UpdateLessonLabelMutation, UpdateLessonLabelMutationVariables>(UpdateLessonLabelDocument, baseOptions);
      }
export type UpdateLessonLabelMutationHookResult = ReturnType<typeof useUpdateLessonLabelMutation>;
export type UpdateLessonLabelMutationResult = Apollo.MutationResult<UpdateLessonLabelMutation>;
export type UpdateLessonLabelMutationOptions = Apollo.BaseMutationOptions<UpdateLessonLabelMutation, UpdateLessonLabelMutationVariables>;
export const UpdateLessonViewsDocument = gql`
    mutation UpdateLessonViews($id: Float!) {
  updateLessonViews(id: $id) {
    id
  }
}
    `;
export type UpdateLessonViewsMutationFn = Apollo.MutationFunction<UpdateLessonViewsMutation, UpdateLessonViewsMutationVariables>;

/**
 * __useUpdateLessonViewsMutation__
 *
 * To run a mutation, you first call `useUpdateLessonViewsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLessonViewsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLessonViewsMutation, { data, loading, error }] = useUpdateLessonViewsMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateLessonViewsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLessonViewsMutation, UpdateLessonViewsMutationVariables>) {
        return Apollo.useMutation<UpdateLessonViewsMutation, UpdateLessonViewsMutationVariables>(UpdateLessonViewsDocument, baseOptions);
      }
export type UpdateLessonViewsMutationHookResult = ReturnType<typeof useUpdateLessonViewsMutation>;
export type UpdateLessonViewsMutationResult = Apollo.MutationResult<UpdateLessonViewsMutation>;
export type UpdateLessonViewsMutationOptions = Apollo.BaseMutationOptions<UpdateLessonViewsMutation, UpdateLessonViewsMutationVariables>;
export const UpdateLessonStatusDocument = gql`
    mutation UpdateLessonStatus($id: Float!, $status: String!) {
  updateLessonStatus(id: $id, status: $status) {
    ...RegularLesson
  }
}
    ${RegularLessonFragmentDoc}`;
export type UpdateLessonStatusMutationFn = Apollo.MutationFunction<UpdateLessonStatusMutation, UpdateLessonStatusMutationVariables>;

/**
 * __useUpdateLessonStatusMutation__
 *
 * To run a mutation, you first call `useUpdateLessonStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLessonStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLessonStatusMutation, { data, loading, error }] = useUpdateLessonStatusMutation({
 *   variables: {
 *      id: // value for 'id'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useUpdateLessonStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLessonStatusMutation, UpdateLessonStatusMutationVariables>) {
        return Apollo.useMutation<UpdateLessonStatusMutation, UpdateLessonStatusMutationVariables>(UpdateLessonStatusDocument, baseOptions);
      }
export type UpdateLessonStatusMutationHookResult = ReturnType<typeof useUpdateLessonStatusMutation>;
export type UpdateLessonStatusMutationResult = Apollo.MutationResult<UpdateLessonStatusMutation>;
export type UpdateLessonStatusMutationOptions = Apollo.BaseMutationOptions<UpdateLessonStatusMutation, UpdateLessonStatusMutationVariables>;
export const UpdateLessonThumbnailDocument = gql`
    mutation UpdateLessonThumbnail($id: Float!, $thumbnail: String) {
  updateLessonThumbnail(id: $id, thumbnail: $thumbnail) {
    ...RegularLesson
  }
}
    ${RegularLessonFragmentDoc}`;
export type UpdateLessonThumbnailMutationFn = Apollo.MutationFunction<UpdateLessonThumbnailMutation, UpdateLessonThumbnailMutationVariables>;

/**
 * __useUpdateLessonThumbnailMutation__
 *
 * To run a mutation, you first call `useUpdateLessonThumbnailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLessonThumbnailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLessonThumbnailMutation, { data, loading, error }] = useUpdateLessonThumbnailMutation({
 *   variables: {
 *      id: // value for 'id'
 *      thumbnail: // value for 'thumbnail'
 *   },
 * });
 */
export function useUpdateLessonThumbnailMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLessonThumbnailMutation, UpdateLessonThumbnailMutationVariables>) {
        return Apollo.useMutation<UpdateLessonThumbnailMutation, UpdateLessonThumbnailMutationVariables>(UpdateLessonThumbnailDocument, baseOptions);
      }
export type UpdateLessonThumbnailMutationHookResult = ReturnType<typeof useUpdateLessonThumbnailMutation>;
export type UpdateLessonThumbnailMutationResult = Apollo.MutationResult<UpdateLessonThumbnailMutation>;
export type UpdateLessonThumbnailMutationOptions = Apollo.BaseMutationOptions<UpdateLessonThumbnailMutation, UpdateLessonThumbnailMutationVariables>;
export const CreateLessonTagDocument = gql`
    mutation CreateLessonTag($id: Float!, $name: String!) {
  createLessonTag(id: $id, name: $name) {
    ...RegularLesson
  }
}
    ${RegularLessonFragmentDoc}`;
export type CreateLessonTagMutationFn = Apollo.MutationFunction<CreateLessonTagMutation, CreateLessonTagMutationVariables>;

/**
 * __useCreateLessonTagMutation__
 *
 * To run a mutation, you first call `useCreateLessonTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLessonTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLessonTagMutation, { data, loading, error }] = useCreateLessonTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateLessonTagMutation(baseOptions?: Apollo.MutationHookOptions<CreateLessonTagMutation, CreateLessonTagMutationVariables>) {
        return Apollo.useMutation<CreateLessonTagMutation, CreateLessonTagMutationVariables>(CreateLessonTagDocument, baseOptions);
      }
export type CreateLessonTagMutationHookResult = ReturnType<typeof useCreateLessonTagMutation>;
export type CreateLessonTagMutationResult = Apollo.MutationResult<CreateLessonTagMutation>;
export type CreateLessonTagMutationOptions = Apollo.BaseMutationOptions<CreateLessonTagMutation, CreateLessonTagMutationVariables>;
export const DeleteLessonTagDocument = gql`
    mutation DeleteLessonTag($id: Float!, $name: String!) {
  deleteLessonTag(id: $id, name: $name) {
    ...RegularLesson
  }
}
    ${RegularLessonFragmentDoc}`;
export type DeleteLessonTagMutationFn = Apollo.MutationFunction<DeleteLessonTagMutation, DeleteLessonTagMutationVariables>;

/**
 * __useDeleteLessonTagMutation__
 *
 * To run a mutation, you first call `useDeleteLessonTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLessonTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLessonTagMutation, { data, loading, error }] = useDeleteLessonTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useDeleteLessonTagMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLessonTagMutation, DeleteLessonTagMutationVariables>) {
        return Apollo.useMutation<DeleteLessonTagMutation, DeleteLessonTagMutationVariables>(DeleteLessonTagDocument, baseOptions);
      }
export type DeleteLessonTagMutationHookResult = ReturnType<typeof useDeleteLessonTagMutation>;
export type DeleteLessonTagMutationResult = Apollo.MutationResult<DeleteLessonTagMutation>;
export type DeleteLessonTagMutationOptions = Apollo.BaseMutationOptions<DeleteLessonTagMutation, DeleteLessonTagMutationVariables>;
export const SetNextStepDocument = gql`
    mutation SetNextStep($sessionId: Float!, $stepId: Float!) {
  setNextStep(options: {sessionId: $sessionId, stepId: $stepId}) {
    id
  }
}
    `;
export type SetNextStepMutationFn = Apollo.MutationFunction<SetNextStepMutation, SetNextStepMutationVariables>;

/**
 * __useSetNextStepMutation__
 *
 * To run a mutation, you first call `useSetNextStepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetNextStepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setNextStepMutation, { data, loading, error }] = useSetNextStepMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      stepId: // value for 'stepId'
 *   },
 * });
 */
export function useSetNextStepMutation(baseOptions?: Apollo.MutationHookOptions<SetNextStepMutation, SetNextStepMutationVariables>) {
        return Apollo.useMutation<SetNextStepMutation, SetNextStepMutationVariables>(SetNextStepDocument, baseOptions);
      }
export type SetNextStepMutationHookResult = ReturnType<typeof useSetNextStepMutation>;
export type SetNextStepMutationResult = Apollo.MutationResult<SetNextStepMutation>;
export type SetNextStepMutationOptions = Apollo.BaseMutationOptions<SetNextStepMutation, SetNextStepMutationVariables>;
export const UpdateSessionDocument = gql`
    mutation UpdateSession($lessonId: Float!, $sessionId: Float!) {
  updateSession(options: {lessonId: $lessonId, sessionId: $sessionId}) {
    id
  }
}
    `;
export type UpdateSessionMutationFn = Apollo.MutationFunction<UpdateSessionMutation, UpdateSessionMutationVariables>;

/**
 * __useUpdateSessionMutation__
 *
 * To run a mutation, you first call `useUpdateSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSessionMutation, { data, loading, error }] = useUpdateSessionMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useUpdateSessionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSessionMutation, UpdateSessionMutationVariables>) {
        return Apollo.useMutation<UpdateSessionMutation, UpdateSessionMutationVariables>(UpdateSessionDocument, baseOptions);
      }
export type UpdateSessionMutationHookResult = ReturnType<typeof useUpdateSessionMutation>;
export type UpdateSessionMutationResult = Apollo.MutationResult<UpdateSessionMutation>;
export type UpdateSessionMutationOptions = Apollo.BaseMutationOptions<UpdateSessionMutation, UpdateSessionMutationVariables>;
export const UpdateStepInstructionsDocument = gql`
    mutation UpdateStepInstructions($id: Float!, $instructions: String!) {
  updateStepInstructions(options: {id: $id, instructions: $instructions}) {
    id
  }
}
    `;
export type UpdateStepInstructionsMutationFn = Apollo.MutationFunction<UpdateStepInstructionsMutation, UpdateStepInstructionsMutationVariables>;

/**
 * __useUpdateStepInstructionsMutation__
 *
 * To run a mutation, you first call `useUpdateStepInstructionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStepInstructionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStepInstructionsMutation, { data, loading, error }] = useUpdateStepInstructionsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      instructions: // value for 'instructions'
 *   },
 * });
 */
export function useUpdateStepInstructionsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStepInstructionsMutation, UpdateStepInstructionsMutationVariables>) {
        return Apollo.useMutation<UpdateStepInstructionsMutation, UpdateStepInstructionsMutationVariables>(UpdateStepInstructionsDocument, baseOptions);
      }
export type UpdateStepInstructionsMutationHookResult = ReturnType<typeof useUpdateStepInstructionsMutation>;
export type UpdateStepInstructionsMutationResult = Apollo.MutationResult<UpdateStepInstructionsMutation>;
export type UpdateStepInstructionsMutationOptions = Apollo.BaseMutationOptions<UpdateStepInstructionsMutation, UpdateStepInstructionsMutationVariables>;
export const UpdateStepNameDocument = gql`
    mutation UpdateStepName($id: Float!, $name: String!, $lessonId: Float!) {
  updateStepName(options: {id: $id, lessonId: $lessonId, name: $name}) {
    id
  }
}
    `;
export type UpdateStepNameMutationFn = Apollo.MutationFunction<UpdateStepNameMutation, UpdateStepNameMutationVariables>;

/**
 * __useUpdateStepNameMutation__
 *
 * To run a mutation, you first call `useUpdateStepNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStepNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStepNameMutation, { data, loading, error }] = useUpdateStepNameMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useUpdateStepNameMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStepNameMutation, UpdateStepNameMutationVariables>) {
        return Apollo.useMutation<UpdateStepNameMutation, UpdateStepNameMutationVariables>(UpdateStepNameDocument, baseOptions);
      }
export type UpdateStepNameMutationHookResult = ReturnType<typeof useUpdateStepNameMutation>;
export type UpdateStepNameMutationResult = Apollo.MutationResult<UpdateStepNameMutation>;
export type UpdateStepNameMutationOptions = Apollo.BaseMutationOptions<UpdateStepNameMutation, UpdateStepNameMutationVariables>;
export const UpdateStepCheckpointDocument = gql`
    mutation UpdateStepCheckpoint($id: Float!, $checkpointId: Float!) {
  updateStepCheckpoint(options: {id: $id, checkpointId: $checkpointId}) {
    id
  }
}
    `;
export type UpdateStepCheckpointMutationFn = Apollo.MutationFunction<UpdateStepCheckpointMutation, UpdateStepCheckpointMutationVariables>;

/**
 * __useUpdateStepCheckpointMutation__
 *
 * To run a mutation, you first call `useUpdateStepCheckpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStepCheckpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStepCheckpointMutation, { data, loading, error }] = useUpdateStepCheckpointMutation({
 *   variables: {
 *      id: // value for 'id'
 *      checkpointId: // value for 'checkpointId'
 *   },
 * });
 */
export function useUpdateStepCheckpointMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStepCheckpointMutation, UpdateStepCheckpointMutationVariables>) {
        return Apollo.useMutation<UpdateStepCheckpointMutation, UpdateStepCheckpointMutationVariables>(UpdateStepCheckpointDocument, baseOptions);
      }
export type UpdateStepCheckpointMutationHookResult = ReturnType<typeof useUpdateStepCheckpointMutation>;
export type UpdateStepCheckpointMutationResult = Apollo.MutationResult<UpdateStepCheckpointMutation>;
export type UpdateStepCheckpointMutationOptions = Apollo.BaseMutationOptions<UpdateStepCheckpointMutation, UpdateStepCheckpointMutationVariables>;
export const CompleteStepDocument = gql`
    mutation CompleteStep($id: Float!) {
  completeStep(options: {id: $id}) {
    id
  }
}
    `;
export type CompleteStepMutationFn = Apollo.MutationFunction<CompleteStepMutation, CompleteStepMutationVariables>;

/**
 * __useCompleteStepMutation__
 *
 * To run a mutation, you first call `useCompleteStepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteStepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeStepMutation, { data, loading, error }] = useCompleteStepMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCompleteStepMutation(baseOptions?: Apollo.MutationHookOptions<CompleteStepMutation, CompleteStepMutationVariables>) {
        return Apollo.useMutation<CompleteStepMutation, CompleteStepMutationVariables>(CompleteStepDocument, baseOptions);
      }
export type CompleteStepMutationHookResult = ReturnType<typeof useCompleteStepMutation>;
export type CompleteStepMutationResult = Apollo.MutationResult<CompleteStepMutation>;
export type CompleteStepMutationOptions = Apollo.BaseMutationOptions<CompleteStepMutation, CompleteStepMutationVariables>;
export const UpdateStepPositionDocument = gql`
    mutation UpdateStepPosition($id: Float!, $changeY: Float!, $lessonId: Float!) {
  updateStepPosition(options: {id: $id, lessonId: $lessonId, changeY: $changeY}) {
    id
  }
}
    `;
export type UpdateStepPositionMutationFn = Apollo.MutationFunction<UpdateStepPositionMutation, UpdateStepPositionMutationVariables>;

/**
 * __useUpdateStepPositionMutation__
 *
 * To run a mutation, you first call `useUpdateStepPositionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStepPositionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStepPositionMutation, { data, loading, error }] = useUpdateStepPositionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      changeY: // value for 'changeY'
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useUpdateStepPositionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStepPositionMutation, UpdateStepPositionMutationVariables>) {
        return Apollo.useMutation<UpdateStepPositionMutation, UpdateStepPositionMutationVariables>(UpdateStepPositionDocument, baseOptions);
      }
export type UpdateStepPositionMutationHookResult = ReturnType<typeof useUpdateStepPositionMutation>;
export type UpdateStepPositionMutationResult = Apollo.MutationResult<UpdateStepPositionMutation>;
export type UpdateStepPositionMutationOptions = Apollo.BaseMutationOptions<UpdateStepPositionMutation, UpdateStepPositionMutationVariables>;
export const UpdateUserRoleDocument = gql`
    mutation UpdateUserRole($id: Float!, $role: String!) {
  updateUserRole(options: {id: $id, role: $role}) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;
export type UpdateUserRoleMutationFn = Apollo.MutationFunction<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>;

/**
 * __useUpdateUserRoleMutation__
 *
 * To run a mutation, you first call `useUpdateUserRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserRoleMutation, { data, loading, error }] = useUpdateUserRoleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useUpdateUserRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>) {
        return Apollo.useMutation<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>(UpdateUserRoleDocument, baseOptions);
      }
export type UpdateUserRoleMutationHookResult = ReturnType<typeof useUpdateUserRoleMutation>;
export type UpdateUserRoleMutationResult = Apollo.MutationResult<UpdateUserRoleMutation>;
export type UpdateUserRoleMutationOptions = Apollo.BaseMutationOptions<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>;
export const UpdateUserThemeDocument = gql`
    mutation UpdateUserTheme($theme: String!) {
  updateUserTheme(options: {theme: $theme}) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;
export type UpdateUserThemeMutationFn = Apollo.MutationFunction<UpdateUserThemeMutation, UpdateUserThemeMutationVariables>;

/**
 * __useUpdateUserThemeMutation__
 *
 * To run a mutation, you first call `useUpdateUserThemeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserThemeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserThemeMutation, { data, loading, error }] = useUpdateUserThemeMutation({
 *   variables: {
 *      theme: // value for 'theme'
 *   },
 * });
 */
export function useUpdateUserThemeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserThemeMutation, UpdateUserThemeMutationVariables>) {
        return Apollo.useMutation<UpdateUserThemeMutation, UpdateUserThemeMutationVariables>(UpdateUserThemeDocument, baseOptions);
      }
export type UpdateUserThemeMutationHookResult = ReturnType<typeof useUpdateUserThemeMutation>;
export type UpdateUserThemeMutationResult = Apollo.MutationResult<UpdateUserThemeMutation>;
export type UpdateUserThemeMutationOptions = Apollo.BaseMutationOptions<UpdateUserThemeMutation, UpdateUserThemeMutationVariables>;
export const UpdateProfileColorSchemeDocument = gql`
    mutation UpdateProfileColorScheme {
  updateProfileColorScheme
}
    `;
export type UpdateProfileColorSchemeMutationFn = Apollo.MutationFunction<UpdateProfileColorSchemeMutation, UpdateProfileColorSchemeMutationVariables>;

/**
 * __useUpdateProfileColorSchemeMutation__
 *
 * To run a mutation, you first call `useUpdateProfileColorSchemeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileColorSchemeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileColorSchemeMutation, { data, loading, error }] = useUpdateProfileColorSchemeMutation({
 *   variables: {
 *   },
 * });
 */
export function useUpdateProfileColorSchemeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileColorSchemeMutation, UpdateProfileColorSchemeMutationVariables>) {
        return Apollo.useMutation<UpdateProfileColorSchemeMutation, UpdateProfileColorSchemeMutationVariables>(UpdateProfileColorSchemeDocument, baseOptions);
      }
export type UpdateProfileColorSchemeMutationHookResult = ReturnType<typeof useUpdateProfileColorSchemeMutation>;
export type UpdateProfileColorSchemeMutationResult = Apollo.MutationResult<UpdateProfileColorSchemeMutation>;
export type UpdateProfileColorSchemeMutationOptions = Apollo.BaseMutationOptions<UpdateProfileColorSchemeMutation, UpdateProfileColorSchemeMutationVariables>;
export const CheckpointsDocument = gql`
    query Checkpoints($stepId: Float!) {
  checkpoints(stepId: $stepId) {
    ...RegularCheckpoint
  }
}
    ${RegularCheckpointFragmentDoc}`;

/**
 * __useCheckpointsQuery__
 *
 * To run a query within a React component, call `useCheckpointsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckpointsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckpointsQuery({
 *   variables: {
 *      stepId: // value for 'stepId'
 *   },
 * });
 */
export function useCheckpointsQuery(baseOptions: Apollo.QueryHookOptions<CheckpointsQuery, CheckpointsQueryVariables>) {
        return Apollo.useQuery<CheckpointsQuery, CheckpointsQueryVariables>(CheckpointsDocument, baseOptions);
      }
export function useCheckpointsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckpointsQuery, CheckpointsQueryVariables>) {
          return Apollo.useLazyQuery<CheckpointsQuery, CheckpointsQueryVariables>(CheckpointsDocument, baseOptions);
        }
export type CheckpointsQueryHookResult = ReturnType<typeof useCheckpointsQuery>;
export type CheckpointsLazyQueryHookResult = ReturnType<typeof useCheckpointsLazyQuery>;
export type CheckpointsQueryResult = Apollo.QueryResult<CheckpointsQuery, CheckpointsQueryVariables>;
export const DepsFromPkgsDocument = gql`
    query DepsFromPkgs {
  deps
}
    `;

/**
 * __useDepsFromPkgsQuery__
 *
 * To run a query within a React component, call `useDepsFromPkgsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDepsFromPkgsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDepsFromPkgsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDepsFromPkgsQuery(baseOptions?: Apollo.QueryHookOptions<DepsFromPkgsQuery, DepsFromPkgsQueryVariables>) {
        return Apollo.useQuery<DepsFromPkgsQuery, DepsFromPkgsQueryVariables>(DepsFromPkgsDocument, baseOptions);
      }
export function useDepsFromPkgsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DepsFromPkgsQuery, DepsFromPkgsQueryVariables>) {
          return Apollo.useLazyQuery<DepsFromPkgsQuery, DepsFromPkgsQueryVariables>(DepsFromPkgsDocument, baseOptions);
        }
export type DepsFromPkgsQueryHookResult = ReturnType<typeof useDepsFromPkgsQuery>;
export type DepsFromPkgsLazyQueryHookResult = ReturnType<typeof useDepsFromPkgsLazyQuery>;
export type DepsFromPkgsQueryResult = Apollo.QueryResult<DepsFromPkgsQuery, DepsFromPkgsQueryVariables>;
export const LessonDocument = gql`
    query Lesson($id: Int!) {
  lesson(id: $id) {
    id
    description
    label
    status
    tags {
      name
    }
    thumbnail
    title
    owner {
      id
      username
    }
    steps {
      ...RegularStep
    }
  }
}
    ${RegularStepFragmentDoc}`;

/**
 * __useLessonQuery__
 *
 * To run a query within a React component, call `useLessonQuery` and pass it any options that fit your needs.
 * When your component renders, `useLessonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLessonQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useLessonQuery(baseOptions: Apollo.QueryHookOptions<LessonQuery, LessonQueryVariables>) {
        return Apollo.useQuery<LessonQuery, LessonQueryVariables>(LessonDocument, baseOptions);
      }
export function useLessonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LessonQuery, LessonQueryVariables>) {
          return Apollo.useLazyQuery<LessonQuery, LessonQueryVariables>(LessonDocument, baseOptions);
        }
export type LessonQueryHookResult = ReturnType<typeof useLessonQuery>;
export type LessonLazyQueryHookResult = ReturnType<typeof useLessonLazyQuery>;
export type LessonQueryResult = Apollo.QueryResult<LessonQuery, LessonQueryVariables>;
export const LessonsDocument = gql`
    query Lessons($status: String!, $ownerId: Float, $dependencies: String, $labels: String, $template: String) {
  lessons(
    options: {status: $status, ownerId: $ownerId, dependencies: $dependencies, labels: $labels, template: $template}
  ) {
    ...RegularLessonItem
  }
}
    ${RegularLessonItemFragmentDoc}`;

/**
 * __useLessonsQuery__
 *
 * To run a query within a React component, call `useLessonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLessonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLessonsQuery({
 *   variables: {
 *      status: // value for 'status'
 *      ownerId: // value for 'ownerId'
 *      dependencies: // value for 'dependencies'
 *      labels: // value for 'labels'
 *      template: // value for 'template'
 *   },
 * });
 */
export function useLessonsQuery(baseOptions: Apollo.QueryHookOptions<LessonsQuery, LessonsQueryVariables>) {
        return Apollo.useQuery<LessonsQuery, LessonsQueryVariables>(LessonsDocument, baseOptions);
      }
export function useLessonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LessonsQuery, LessonsQueryVariables>) {
          return Apollo.useLazyQuery<LessonsQuery, LessonsQueryVariables>(LessonsDocument, baseOptions);
        }
export type LessonsQueryHookResult = ReturnType<typeof useLessonsQuery>;
export type LessonsLazyQueryHookResult = ReturnType<typeof useLessonsLazyQuery>;
export type LessonsQueryResult = Apollo.QueryResult<LessonsQuery, LessonsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const ProfileColorSchemeDocument = gql`
    query ProfileColorScheme($id: Float) {
  profileColorScheme(id: $id)
}
    `;

/**
 * __useProfileColorSchemeQuery__
 *
 * To run a query within a React component, call `useProfileColorSchemeQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileColorSchemeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileColorSchemeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProfileColorSchemeQuery(baseOptions?: Apollo.QueryHookOptions<ProfileColorSchemeQuery, ProfileColorSchemeQueryVariables>) {
        return Apollo.useQuery<ProfileColorSchemeQuery, ProfileColorSchemeQueryVariables>(ProfileColorSchemeDocument, baseOptions);
      }
export function useProfileColorSchemeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfileColorSchemeQuery, ProfileColorSchemeQueryVariables>) {
          return Apollo.useLazyQuery<ProfileColorSchemeQuery, ProfileColorSchemeQueryVariables>(ProfileColorSchemeDocument, baseOptions);
        }
export type ProfileColorSchemeQueryHookResult = ReturnType<typeof useProfileColorSchemeQuery>;
export type ProfileColorSchemeLazyQueryHookResult = ReturnType<typeof useProfileColorSchemeLazyQuery>;
export type ProfileColorSchemeQueryResult = Apollo.QueryResult<ProfileColorSchemeQuery, ProfileColorSchemeQueryVariables>;
export const ModalDocument = gql`
    query Modal {
  modal @client {
    name
    callback
  }
}
    `;

/**
 * __useModalQuery__
 *
 * To run a query within a React component, call `useModalQuery` and pass it any options that fit your needs.
 * When your component renders, `useModalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useModalQuery({
 *   variables: {
 *   },
 * });
 */
export function useModalQuery(baseOptions?: Apollo.QueryHookOptions<ModalQuery, ModalQueryVariables>) {
        return Apollo.useQuery<ModalQuery, ModalQueryVariables>(ModalDocument, baseOptions);
      }
export function useModalLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ModalQuery, ModalQueryVariables>) {
          return Apollo.useLazyQuery<ModalQuery, ModalQueryVariables>(ModalDocument, baseOptions);
        }
export type ModalQueryHookResult = ReturnType<typeof useModalQuery>;
export type ModalLazyQueryHookResult = ReturnType<typeof useModalLazyQuery>;
export type ModalQueryResult = Apollo.QueryResult<ModalQuery, ModalQueryVariables>;
export const SessionDocument = gql`
    query Session($lessonId: Int!) {
  session(lessonId: $lessonId) {
    id
    currentStep
    requiresUpdate
    lesson {
      owner {
        id
      }
      title
      id
    }
    steps {
      ...RegularStep
    }
  }
}
    ${RegularStepFragmentDoc}`;

/**
 * __useSessionQuery__
 *
 * To run a query within a React component, call `useSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSessionQuery({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useSessionQuery(baseOptions: Apollo.QueryHookOptions<SessionQuery, SessionQueryVariables>) {
        return Apollo.useQuery<SessionQuery, SessionQueryVariables>(SessionDocument, baseOptions);
      }
export function useSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SessionQuery, SessionQueryVariables>) {
          return Apollo.useLazyQuery<SessionQuery, SessionQueryVariables>(SessionDocument, baseOptions);
        }
export type SessionQueryHookResult = ReturnType<typeof useSessionQuery>;
export type SessionLazyQueryHookResult = ReturnType<typeof useSessionLazyQuery>;
export type SessionQueryResult = Apollo.QueryResult<SessionQuery, SessionQueryVariables>;
export const SessionsDocument = gql`
    query Sessions {
  sessions {
    id
    currentStep
    lesson {
      ...RegularLessonItem
    }
    steps {
      ...RegularStep
    }
  }
}
    ${RegularLessonItemFragmentDoc}
${RegularStepFragmentDoc}`;

/**
 * __useSessionsQuery__
 *
 * To run a query within a React component, call `useSessionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSessionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSessionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSessionsQuery(baseOptions?: Apollo.QueryHookOptions<SessionsQuery, SessionsQueryVariables>) {
        return Apollo.useQuery<SessionsQuery, SessionsQueryVariables>(SessionsDocument, baseOptions);
      }
export function useSessionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SessionsQuery, SessionsQueryVariables>) {
          return Apollo.useLazyQuery<SessionsQuery, SessionsQueryVariables>(SessionsDocument, baseOptions);
        }
export type SessionsQueryHookResult = ReturnType<typeof useSessionsQuery>;
export type SessionsLazyQueryHookResult = ReturnType<typeof useSessionsLazyQuery>;
export type SessionsQueryResult = Apollo.QueryResult<SessionsQuery, SessionsQueryVariables>;
export const StepDocument = gql`
    query Step($id: Int!) {
  step(id: $id) {
    ...RegularStep
  }
}
    ${RegularStepFragmentDoc}`;

/**
 * __useStepQuery__
 *
 * To run a query within a React component, call `useStepQuery` and pass it any options that fit your needs.
 * When your component renders, `useStepQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStepQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStepQuery(baseOptions: Apollo.QueryHookOptions<StepQuery, StepQueryVariables>) {
        return Apollo.useQuery<StepQuery, StepQueryVariables>(StepDocument, baseOptions);
      }
export function useStepLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StepQuery, StepQueryVariables>) {
          return Apollo.useLazyQuery<StepQuery, StepQueryVariables>(StepDocument, baseOptions);
        }
export type StepQueryHookResult = ReturnType<typeof useStepQuery>;
export type StepLazyQueryHookResult = ReturnType<typeof useStepLazyQuery>;
export type StepQueryResult = Apollo.QueryResult<StepQuery, StepQueryVariables>;
export const StepsDocument = gql`
    query Steps {
  steps {
    ...RegularStep
  }
}
    ${RegularStepFragmentDoc}`;

/**
 * __useStepsQuery__
 *
 * To run a query within a React component, call `useStepsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStepsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStepsQuery({
 *   variables: {
 *   },
 * });
 */
export function useStepsQuery(baseOptions?: Apollo.QueryHookOptions<StepsQuery, StepsQueryVariables>) {
        return Apollo.useQuery<StepsQuery, StepsQueryVariables>(StepsDocument, baseOptions);
      }
export function useStepsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StepsQuery, StepsQueryVariables>) {
          return Apollo.useLazyQuery<StepsQuery, StepsQueryVariables>(StepsDocument, baseOptions);
        }
export type StepsQueryHookResult = ReturnType<typeof useStepsQuery>;
export type StepsLazyQueryHookResult = ReturnType<typeof useStepsLazyQuery>;
export type StepsQueryResult = Apollo.QueryResult<StepsQuery, StepsQueryVariables>;
export const StudentsDocument = gql`
    query Students {
  users {
    id
    username
    createdAt
  }
}
    `;

/**
 * __useStudentsQuery__
 *
 * To run a query within a React component, call `useStudentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useStudentsQuery(baseOptions?: Apollo.QueryHookOptions<StudentsQuery, StudentsQueryVariables>) {
        return Apollo.useQuery<StudentsQuery, StudentsQueryVariables>(StudentsDocument, baseOptions);
      }
export function useStudentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentsQuery, StudentsQueryVariables>) {
          return Apollo.useLazyQuery<StudentsQuery, StudentsQueryVariables>(StudentsDocument, baseOptions);
        }
export type StudentsQueryHookResult = ReturnType<typeof useStudentsQuery>;
export type StudentsLazyQueryHookResult = ReturnType<typeof useStudentsLazyQuery>;
export type StudentsQueryResult = Apollo.QueryResult<StudentsQuery, StudentsQueryVariables>;