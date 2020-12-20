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
  steps: Array<Step>;
  step?: Maybe<Step>;
  lessons: Array<Lesson>;
  lesson?: Maybe<Lesson>;
  me?: Maybe<User>;
  checkpoints: Array<Checkpoint>;
  checkpoint?: Maybe<Checkpoint>;
  codeModules: Array<CodeModule>;
  codeModule?: Maybe<CodeModule>;
};


export type QueryStepArgs = {
  id: Scalars['Int'];
};


export type QueryLessonArgs = {
  id: Scalars['Int'];
};


export type QueryCheckpointArgs = {
  id: Scalars['Int'];
};


export type QueryCodeModuleArgs = {
  id: Scalars['Int'];
};

export type Step = {
  __typename?: 'Step';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  instructions?: Maybe<Scalars['String']>;
  lesson: Lesson;
  codeModules?: Maybe<Array<CodeModule>>;
  checkpoints?: Maybe<Array<Checkpoint>>;
};

export type Lesson = {
  __typename?: 'Lesson';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  likes: Scalars['Float'];
  owner: User;
  steps?: Maybe<Array<Step>>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  lessons: Array<Lesson>;
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

export type Checkpoint = {
  __typename?: 'Checkpoint';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  description: Scalars['String'];
  test: Scalars['String'];
  moduleId: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createStep?: Maybe<Step>;
  updateStep?: Maybe<Step>;
  deleteStep: Scalars['Boolean'];
  createLesson: Lesson;
  updateLesson?: Maybe<Lesson>;
  deleteLesson: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  forgotPassword: Scalars['Boolean'];
  changePassword: UserResponse;
  createCheckpoint?: Maybe<Checkpoint>;
  updateCheckpoint?: Maybe<Checkpoint>;
  deleteCheckpoint: Scalars['Boolean'];
  createCodeModule?: Maybe<CodeModule>;
  updateCodeModule?: Maybe<CodeModule>;
  deleteCodeModule: Scalars['Boolean'];
};


export type MutationCreateStepArgs = {
  options: CreateStepInput;
};


export type MutationUpdateStepArgs = {
  options: StepInput;
};


export type MutationDeleteStepArgs = {
  id: Scalars['Float'];
};


export type MutationCreateLessonArgs = {
  options: LessonInput;
};


export type MutationUpdateLessonArgs = {
  options: LessonInput;
  id: Scalars['Float'];
};


export type MutationDeleteLessonArgs = {
  id: Scalars['Float'];
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationLoginArgs = {
  options: LoginInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreateCheckpointArgs = {
  options: CreateCheckpointInput;
};


export type MutationUpdateCheckpointArgs = {
  options: UpdateCheckpointInput;
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

export type CreateStepInput = {
  lessonId?: Maybe<Scalars['Float']>;
};

export type StepInput = {
  id?: Maybe<Scalars['Float']>;
  instructions: Scalars['String'];
};

export type LessonInput = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
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

export type RegularCheckpointFragment = (
  { __typename?: 'Checkpoint' }
  & Pick<Checkpoint, 'id' | 'test' | 'description'>
);

export type RegularCodeModuleFragment = (
  { __typename?: 'CodeModule' }
  & Pick<CodeModule, 'id' | 'name' | 'value'>
);

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularStepFragment = (
  { __typename?: 'Step' }
  & Pick<Step, 'id' | 'createdAt' | 'instructions'>
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

export type CreateLessonMutationVariables = Exact<{
  title: Scalars['String'];
}>;


export type CreateLessonMutation = (
  { __typename?: 'Mutation' }
  & { createLesson: (
    { __typename?: 'Lesson' }
    & Pick<Lesson, 'id' | 'title'>
    & { owner: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  ) }
);

export type CreateStepMutationVariables = Exact<{
  lessonId: Scalars['Float'];
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

export type UpdateCodeModuleMutationVariables = Exact<{
  id: Scalars['Float'];
  name: Scalars['String'];
  value: Scalars['String'];
}>;


export type UpdateCodeModuleMutation = (
  { __typename?: 'Mutation' }
  & { updateCodeModule?: Maybe<(
    { __typename?: 'CodeModule' }
    & Pick<CodeModule, 'id'>
  )> }
);

export type UpdateLessonMutationVariables = Exact<{
  id: Scalars['Float'];
  title: Scalars['String'];
  description: Scalars['String'];
}>;


export type UpdateLessonMutation = (
  { __typename?: 'Mutation' }
  & { updateLesson?: Maybe<(
    { __typename?: 'Lesson' }
    & Pick<Lesson, 'id' | 'title'>
  )> }
);

export type UpdateStepMutationVariables = Exact<{
  id: Scalars['Float'];
  instructions: Scalars['String'];
}>;


export type UpdateStepMutation = (
  { __typename?: 'Mutation' }
  & { updateStep?: Maybe<(
    { __typename?: 'Step' }
    & Pick<Step, 'id' | 'createdAt' | 'instructions'>
  )> }
);

export type LessonQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type LessonQuery = (
  { __typename?: 'Query' }
  & { lesson?: Maybe<(
    { __typename?: 'Lesson' }
    & Pick<Lesson, 'id' | 'title' | 'description'>
    & { owner: (
      { __typename?: 'User' }
      & Pick<User, 'username'>
    ), steps?: Maybe<Array<(
      { __typename?: 'Step' }
      & RegularStepFragment
    )>> }
  )> }
);

export type LessonsQueryVariables = Exact<{ [key: string]: never; }>;


export type LessonsQuery = (
  { __typename?: 'Query' }
  & { lessons: Array<(
    { __typename?: 'Lesson' }
    & Pick<Lesson, 'createdAt' | 'id' | 'title' | 'updatedAt'>
    & { owner: (
      { __typename?: 'User' }
      & Pick<User, 'username'>
    ) }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
    & { lessons: Array<(
      { __typename?: 'Lesson' }
      & Pick<Lesson, 'id'>
    )> }
  )> }
);

export type StepQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type StepQuery = (
  { __typename?: 'Query' }
  & { step?: Maybe<(
    { __typename?: 'Step' }
    & { codeModules?: Maybe<Array<(
      { __typename?: 'CodeModule' }
      & RegularCodeModuleFragment
    )>>, checkpoints?: Maybe<Array<(
      { __typename?: 'Checkpoint' }
      & RegularCheckpointFragment
    )>> }
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

export const RegularCheckpointFragmentDoc = gql`
    fragment RegularCheckpoint on Checkpoint {
  id
  test
  description
}
    `;
export const RegularCodeModuleFragmentDoc = gql`
    fragment RegularCodeModule on CodeModule {
  id
  name
  value
}
    `;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularStepFragmentDoc = gql`
    fragment RegularStep on Step {
  id
  createdAt
  instructions
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
export const CreateLessonDocument = gql`
    mutation CreateLesson($title: String!) {
  createLesson(options: {title: $title}) {
    id
    title
    owner {
      id
      username
    }
  }
}
    `;
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
 *   },
 * });
 */
export function useCreateLessonMutation(baseOptions?: Apollo.MutationHookOptions<CreateLessonMutation, CreateLessonMutationVariables>) {
        return Apollo.useMutation<CreateLessonMutation, CreateLessonMutationVariables>(CreateLessonDocument, baseOptions);
      }
export type CreateLessonMutationHookResult = ReturnType<typeof useCreateLessonMutation>;
export type CreateLessonMutationResult = Apollo.MutationResult<CreateLessonMutation>;
export type CreateLessonMutationOptions = Apollo.BaseMutationOptions<CreateLessonMutation, CreateLessonMutationVariables>;
export const CreateStepDocument = gql`
    mutation CreateStep($lessonId: Float!) {
  createStep(options: {lessonId: $lessonId}) {
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
export const UpdateCodeModuleDocument = gql`
    mutation UpdateCodeModule($id: Float!, $name: String!, $value: String!) {
  updateCodeModule(id: $id, options: {name: $name, value: $value}) {
    id
  }
}
    `;
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
export const UpdateLessonDocument = gql`
    mutation UpdateLesson($id: Float!, $title: String!, $description: String!) {
  updateLesson(id: $id, options: {title: $title, description: $description}) {
    id
    title
  }
}
    `;
export type UpdateLessonMutationFn = Apollo.MutationFunction<UpdateLessonMutation, UpdateLessonMutationVariables>;

/**
 * __useUpdateLessonMutation__
 *
 * To run a mutation, you first call `useUpdateLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLessonMutation, { data, loading, error }] = useUpdateLessonMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateLessonMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLessonMutation, UpdateLessonMutationVariables>) {
        return Apollo.useMutation<UpdateLessonMutation, UpdateLessonMutationVariables>(UpdateLessonDocument, baseOptions);
      }
export type UpdateLessonMutationHookResult = ReturnType<typeof useUpdateLessonMutation>;
export type UpdateLessonMutationResult = Apollo.MutationResult<UpdateLessonMutation>;
export type UpdateLessonMutationOptions = Apollo.BaseMutationOptions<UpdateLessonMutation, UpdateLessonMutationVariables>;
export const UpdateStepDocument = gql`
    mutation UpdateStep($id: Float!, $instructions: String!) {
  updateStep(options: {id: $id, instructions: $instructions}) {
    id
    createdAt
    instructions
  }
}
    `;
export type UpdateStepMutationFn = Apollo.MutationFunction<UpdateStepMutation, UpdateStepMutationVariables>;

/**
 * __useUpdateStepMutation__
 *
 * To run a mutation, you first call `useUpdateStepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStepMutation, { data, loading, error }] = useUpdateStepMutation({
 *   variables: {
 *      id: // value for 'id'
 *      instructions: // value for 'instructions'
 *   },
 * });
 */
export function useUpdateStepMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStepMutation, UpdateStepMutationVariables>) {
        return Apollo.useMutation<UpdateStepMutation, UpdateStepMutationVariables>(UpdateStepDocument, baseOptions);
      }
export type UpdateStepMutationHookResult = ReturnType<typeof useUpdateStepMutation>;
export type UpdateStepMutationResult = Apollo.MutationResult<UpdateStepMutation>;
export type UpdateStepMutationOptions = Apollo.BaseMutationOptions<UpdateStepMutation, UpdateStepMutationVariables>;
export const LessonDocument = gql`
    query Lesson($id: Int!) {
  lesson(id: $id) {
    id
    title
    description
    owner {
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
    query Lessons {
  lessons {
    createdAt
    id
    title
    updatedAt
    owner {
      username
    }
  }
}
    `;

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
 *   },
 * });
 */
export function useLessonsQuery(baseOptions?: Apollo.QueryHookOptions<LessonsQuery, LessonsQueryVariables>) {
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
    id
    username
    lessons {
      id
    }
  }
}
    `;

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
export const StepDocument = gql`
    query Step($id: Int!) {
  step(id: $id) {
    codeModules {
      ...RegularCodeModule
    }
    checkpoints {
      ...RegularCheckpoint
    }
  }
}
    ${RegularCodeModuleFragmentDoc}
${RegularCheckpointFragmentDoc}`;

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