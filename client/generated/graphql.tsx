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
  lesson?: Maybe<Lesson>;
  lessons: Array<Lesson>;
  me?: Maybe<User>;
  modal?: Maybe<Modal>;
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
  test: Scalars['String'];
  moduleId: Scalars['Float'];
};

export type CodeModule = {
  __typename?: 'CodeModule';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  name?: Maybe<Scalars['String']>;
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
  currentCheckpointId?: Maybe<Scalars['Float']>;
  isCompleted?: Maybe<Scalars['Boolean']>;
  lesson: Lesson;
  session: Session;
  codeModules?: Maybe<Array<CodeModule>>;
  checkpoints?: Maybe<Array<Checkpoint>>;
  dependencies?: Maybe<Array<Dependency>>;
};

export type Lesson = {
  __typename?: 'Lesson';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  status?: Maybe<LessonStatus>;
  likes: Scalars['Float'];
  students?: Maybe<Array<User>>;
  owner: User;
  sessions?: Maybe<Array<Session>>;
  steps?: Maybe<Array<Step>>;
};

export enum LessonStatus {
  Editting = 'EDITTING',
  PendingPublish = 'PENDING_PUBLISH',
  Published = 'PUBLISHED'
}

export type User = {
  __typename?: 'User';
  classes: Array<Session>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  githubId: Scalars['Float'];
  id: Scalars['Float'];
  isAuthenticated?: Maybe<Scalars['Boolean']>;
  lessons: Array<Lesson>;
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
  student: User;
  lesson: Lesson;
  steps?: Maybe<Array<Step>>;
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
};

export type Mutation = {
  __typename?: 'Mutation';
  createCheckpoint?: Maybe<Checkpoint>;
  updateCheckpoint?: Maybe<Checkpoint>;
  completeCheckpoint?: Maybe<Checkpoint>;
  passCheckpoint?: Maybe<Checkpoint>;
  deleteCheckpoint: Scalars['Boolean'];
  createCodeModule?: Maybe<CodeModule>;
  updateCodeModule?: Maybe<CodeModule>;
  deleteCodeModule: Scalars['Boolean'];
  createDependency?: Maybe<Dependency>;
  updateDependency?: Maybe<Dependency>;
  deleteDependency: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  githubLogin: UserResponse;
  logout: Scalars['Boolean'];
  updateUserTheme: UserResponse;
  updateUserRole: UserResponse;
  forgotPassword: Scalars['Boolean'];
  changePassword: UserResponse;
  createStep?: Maybe<Step>;
  completeStep?: Maybe<Step>;
  updateStepCheckpoint?: Maybe<Step>;
  updateStepInstructions?: Maybe<Step>;
  updateStepName?: Maybe<Step>;
  deleteStep: Scalars['Boolean'];
  createLesson: CreateLessonResponse;
  updateLessonTitle?: Maybe<Lesson>;
  updateLessonDescription?: Maybe<Lesson>;
  updateLessonStatus?: Maybe<Lesson>;
  deleteLesson: Scalars['Boolean'];
  createSession?: Maybe<Session>;
  deleteSession: Scalars['Boolean'];
  setNextStep?: Maybe<Session>;
};


export type MutationCreateCheckpointArgs = {
  options: CreateCheckpointInput;
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
  options: CodeModuleInput;
  id: Scalars['Float'];
};


export type MutationDeleteCodeModuleArgs = {
  id: Scalars['Float'];
};


export type MutationCreateDependencyArgs = {
  options: DependencyInput;
  stepId: Scalars['Float'];
};


export type MutationUpdateDependencyArgs = {
  options: DependencyInput;
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


export type MutationUpdateUserThemeArgs = {
  options: UpdateUserThemeInput;
};


export type MutationUpdateUserRoleArgs = {
  options: UpdateUserRoleInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
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


export type MutationUpdateStepNameArgs = {
  options: StepNameInput;
};


export type MutationDeleteStepArgs = {
  id: Scalars['Float'];
};


export type MutationCreateLessonArgs = {
  options: LessonInput;
};


export type MutationUpdateLessonTitleArgs = {
  title: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationUpdateLessonDescriptionArgs = {
  description: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationUpdateLessonStatusArgs = {
  status: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationDeleteLessonArgs = {
  id: Scalars['Float'];
};


export type MutationCreateSessionArgs = {
  options: SessionInput;
};


export type MutationDeleteSessionArgs = {
  id: Scalars['Float'];
};


export type MutationSetNextStepArgs = {
  options: NextStepInput;
};

export type CreateCheckpointInput = {
  checkpointId: Scalars['Float'];
  stepId: Scalars['Float'];
};

export type UpdateCheckpointInput = {
  description: Scalars['String'];
};

export type CodeModuleInput = {
  name: Scalars['String'];
  value: Scalars['String'];
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

export type UpdateUserThemeInput = {
  theme: Scalars['String'];
};

export type UpdateUserRoleInput = {
  id: Scalars['Float'];
  role: Scalars['String'];
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

export type StepNameInput = {
  id: Scalars['Float'];
  name: Scalars['String'];
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
  & Pick<Checkpoint, 'id' | 'createdAt' | 'description' | 'isCompleted' | 'isTested' | 'test'>
);

export type RegularCodeModuleFragment = (
  { __typename?: 'CodeModule' }
  & Pick<CodeModule, 'id' | 'name' | 'value'>
);

export type RegularDependencyFragment = (
  { __typename?: 'Dependency' }
  & Pick<Dependency, 'id' | 'package' | 'version'>
);

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularLessonItemFragment = (
  { __typename?: 'Lesson' }
  & Pick<Lesson, 'createdAt' | 'id' | 'likes' | 'status' | 'title' | 'updatedAt'>
  & { students?: Maybe<Array<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )>>, owner: (
    { __typename?: 'User' }
    & Pick<User, 'username'>
  ), steps?: Maybe<Array<(
    { __typename?: 'Step' }
    & { dependencies?: Maybe<Array<(
      { __typename?: 'Dependency' }
      & RegularDependencyFragment
    )>>, codeModules?: Maybe<Array<(
      { __typename?: 'CodeModule' }
      & Pick<CodeModule, 'name'>
    )>> }
  )>> }
);

export type RegularStepFragment = (
  { __typename?: 'Step' }
  & Pick<Step, 'id' | 'createdAt' | 'currentCheckpointId' | 'instructions' | 'isCompleted' | 'name'>
  & { codeModules?: Maybe<Array<(
    { __typename?: 'CodeModule' }
    & RegularCodeModuleFragment
  )>>, checkpoints?: Maybe<Array<(
    { __typename?: 'Checkpoint' }
    & RegularCheckpointFragment
  )>>, dependencies?: Maybe<Array<(
    { __typename?: 'Dependency' }
    & RegularDependencyFragment
  )>> }
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'role' | 'theme' | 'username' | 'isAuthenticated'>
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
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

export type CreateCheckpointMutationVariables = Exact<{
  checkpointId: Scalars['Float'];
  stepId: Scalars['Float'];
}>;


export type CreateCheckpointMutation = (
  { __typename?: 'Mutation' }
  & { createCheckpoint?: Maybe<(
    { __typename?: 'Checkpoint' }
    & RegularCheckpointFragment
  )> }
);

export type CreateCodeModuleMutationVariables = Exact<{
  stepId: Scalars['Float'];
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

export type CreateDependencyMutationVariables = Exact<{
  stepId: Scalars['Float'];
  package: Scalars['String'];
  version: Scalars['String'];
}>;


export type CreateDependencyMutation = (
  { __typename?: 'Mutation' }
  & { createDependency?: Maybe<(
    { __typename?: 'Dependency' }
    & RegularDependencyFragment
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
  id: Scalars['Float'];
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
}>;


export type DeleteStepMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteStep'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
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
  id: Scalars['Float'];
  name: Scalars['String'];
  value: Scalars['String'];
}>;


export type UpdateCodeModuleMutation = (
  { __typename?: 'Mutation' }
  & { updateCodeModule?: Maybe<(
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

export type UpdateLessonStatusMutationVariables = Exact<{
  id: Scalars['Float'];
  status: Scalars['String'];
}>;


export type UpdateLessonStatusMutation = (
  { __typename?: 'Mutation' }
  & { updateLessonStatus?: Maybe<(
    { __typename?: 'Lesson' }
    & Pick<Lesson, 'id'>
  )> }
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

export type DependenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type DependenciesQuery = (
  { __typename?: 'Query' }
  & { dependencies: Array<(
    { __typename?: 'Dependency' }
    & RegularDependencyFragment
  )> }
);

export type LessonQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type LessonQuery = (
  { __typename?: 'Query' }
  & { lesson?: Maybe<(
    { __typename?: 'Lesson' }
    & Pick<Lesson, 'id' | 'title' | 'description' | 'status'>
    & { owner: (
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
    & Pick<Session, 'id' | 'currentStep'>
    & { lesson: (
      { __typename?: 'Lesson' }
      & Pick<Lesson, 'title' | 'id'>
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
    & Pick<User, 'id' | 'email' | 'createdAt'>
  )>> }
);

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularDependencyFragmentDoc = gql`
    fragment RegularDependency on Dependency {
  id
  package
  version
}
    `;
export const RegularLessonItemFragmentDoc = gql`
    fragment RegularLessonItem on Lesson {
  createdAt
  id
  likes
  status
  title
  updatedAt
  students {
    id
  }
  owner {
    username
  }
  steps {
    dependencies {
      ...RegularDependency
    }
    codeModules {
      name
    }
  }
}
    ${RegularDependencyFragmentDoc}`;
export const RegularCodeModuleFragmentDoc = gql`
    fragment RegularCodeModule on CodeModule {
  id
  name
  value
}
    `;
export const RegularCheckpointFragmentDoc = gql`
    fragment RegularCheckpoint on Checkpoint {
  id
  createdAt
  description
  isCompleted
  isTested
  test
}
    `;
export const RegularStepFragmentDoc = gql`
    fragment RegularStep on Step {
  id
  createdAt
  currentCheckpointId
  instructions
  isCompleted
  name
  codeModules {
    ...RegularCodeModule
  }
  checkpoints {
    ...RegularCheckpoint
  }
  dependencies {
    ...RegularDependency
  }
}
    ${RegularCodeModuleFragmentDoc}
${RegularCheckpointFragmentDoc}
${RegularDependencyFragmentDoc}`;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  role
  theme
  username
  isAuthenticated @client
}
    `;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
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
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, baseOptions);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreateCheckpointDocument = gql`
    mutation CreateCheckpoint($checkpointId: Float!, $stepId: Float!) {
  createCheckpoint(options: {checkpointId: $checkpointId, stepId: $stepId}) {
    ...RegularCheckpoint
  }
}
    ${RegularCheckpointFragmentDoc}`;
export type CreateCheckpointMutationFn = Apollo.MutationFunction<CreateCheckpointMutation, CreateCheckpointMutationVariables>;

/**
 * __useCreateCheckpointMutation__
 *
 * To run a mutation, you first call `useCreateCheckpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCheckpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCheckpointMutation, { data, loading, error }] = useCreateCheckpointMutation({
 *   variables: {
 *      checkpointId: // value for 'checkpointId'
 *      stepId: // value for 'stepId'
 *   },
 * });
 */
export function useCreateCheckpointMutation(baseOptions?: Apollo.MutationHookOptions<CreateCheckpointMutation, CreateCheckpointMutationVariables>) {
        return Apollo.useMutation<CreateCheckpointMutation, CreateCheckpointMutationVariables>(CreateCheckpointDocument, baseOptions);
      }
export type CreateCheckpointMutationHookResult = ReturnType<typeof useCreateCheckpointMutation>;
export type CreateCheckpointMutationResult = Apollo.MutationResult<CreateCheckpointMutation>;
export type CreateCheckpointMutationOptions = Apollo.BaseMutationOptions<CreateCheckpointMutation, CreateCheckpointMutationVariables>;
export const CreateCodeModuleDocument = gql`
    mutation CreateCodeModule($stepId: Float!, $name: String!, $value: String!) {
  createCodeModule(stepId: $stepId, options: {name: $name, value: $value}) {
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
export const CreateDependencyDocument = gql`
    mutation CreateDependency($stepId: Float!, $package: String!, $version: String!) {
  createDependency(
    stepId: $stepId
    options: {package: $package, version: $version}
  ) {
    ...RegularDependency
  }
}
    ${RegularDependencyFragmentDoc}`;
export type CreateDependencyMutationFn = Apollo.MutationFunction<CreateDependencyMutation, CreateDependencyMutationVariables>;

/**
 * __useCreateDependencyMutation__
 *
 * To run a mutation, you first call `useCreateDependencyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDependencyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDependencyMutation, { data, loading, error }] = useCreateDependencyMutation({
 *   variables: {
 *      stepId: // value for 'stepId'
 *      package: // value for 'package'
 *      version: // value for 'version'
 *   },
 * });
 */
export function useCreateDependencyMutation(baseOptions?: Apollo.MutationHookOptions<CreateDependencyMutation, CreateDependencyMutationVariables>) {
        return Apollo.useMutation<CreateDependencyMutation, CreateDependencyMutationVariables>(CreateDependencyDocument, baseOptions);
      }
export type CreateDependencyMutationHookResult = ReturnType<typeof useCreateDependencyMutation>;
export type CreateDependencyMutationResult = Apollo.MutationResult<CreateDependencyMutation>;
export type CreateDependencyMutationOptions = Apollo.BaseMutationOptions<CreateDependencyMutation, CreateDependencyMutationVariables>;
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
    mutation CreateSession($lessonId: Float!) {
  createSession(options: {lessonId: $lessonId}) {
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
    mutation DeleteCodeModule($id: Float!) {
  deleteCodeModule(id: $id)
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
 *      id: // value for 'id'
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
    mutation DeleteStep($id: Float!) {
  deleteStep(id: $id)
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
 *   },
 * });
 */
export function useDeleteStepMutation(baseOptions?: Apollo.MutationHookOptions<DeleteStepMutation, DeleteStepMutationVariables>) {
        return Apollo.useMutation<DeleteStepMutation, DeleteStepMutationVariables>(DeleteStepDocument, baseOptions);
      }
export type DeleteStepMutationHookResult = ReturnType<typeof useDeleteStepMutation>;
export type DeleteStepMutationResult = Apollo.MutationResult<DeleteStepMutation>;
export type DeleteStepMutationOptions = Apollo.BaseMutationOptions<DeleteStepMutation, DeleteStepMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
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
 *      email: // value for 'email'
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
    mutation UpdateCodeModule($id: Float!, $name: String!, $value: String!) {
  updateCodeModule(id: $id, options: {name: $name, value: $value}) {
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
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useUpdateCodeModuleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCodeModuleMutation, UpdateCodeModuleMutationVariables>) {
        return Apollo.useMutation<UpdateCodeModuleMutation, UpdateCodeModuleMutationVariables>(UpdateCodeModuleDocument, baseOptions);
      }
export type UpdateCodeModuleMutationHookResult = ReturnType<typeof useUpdateCodeModuleMutation>;
export type UpdateCodeModuleMutationResult = Apollo.MutationResult<UpdateCodeModuleMutation>;
export type UpdateCodeModuleMutationOptions = Apollo.BaseMutationOptions<UpdateCodeModuleMutation, UpdateCodeModuleMutationVariables>;
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
export const UpdateLessonStatusDocument = gql`
    mutation UpdateLessonStatus($id: Float!, $status: String!) {
  updateLessonStatus(id: $id, status: $status) {
    id
  }
}
    `;
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
    mutation UpdateStepName($id: Float!, $name: String!) {
  updateStepName(options: {id: $id, name: $name}) {
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
export const DependenciesDocument = gql`
    query Dependencies {
  dependencies {
    ...RegularDependency
  }
}
    ${RegularDependencyFragmentDoc}`;

/**
 * __useDependenciesQuery__
 *
 * To run a query within a React component, call `useDependenciesQuery` and pass it any options that fit your needs.
 * When your component renders, `useDependenciesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDependenciesQuery({
 *   variables: {
 *   },
 * });
 */
export function useDependenciesQuery(baseOptions?: Apollo.QueryHookOptions<DependenciesQuery, DependenciesQueryVariables>) {
        return Apollo.useQuery<DependenciesQuery, DependenciesQueryVariables>(DependenciesDocument, baseOptions);
      }
export function useDependenciesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DependenciesQuery, DependenciesQueryVariables>) {
          return Apollo.useLazyQuery<DependenciesQuery, DependenciesQueryVariables>(DependenciesDocument, baseOptions);
        }
export type DependenciesQueryHookResult = ReturnType<typeof useDependenciesQuery>;
export type DependenciesLazyQueryHookResult = ReturnType<typeof useDependenciesLazyQuery>;
export type DependenciesQueryResult = Apollo.QueryResult<DependenciesQuery, DependenciesQueryVariables>;
export const LessonDocument = gql`
    query Lesson($id: Int!) {
  lesson(id: $id) {
    id
    title
    description
    status
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
    query Lessons($status: String!, $ownerId: Float) {
  lessons(options: {status: $status, ownerId: $ownerId}) {
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
    lesson {
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
    email
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