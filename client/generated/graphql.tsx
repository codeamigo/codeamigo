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
  lessons: Array<Lesson>;
  lesson?: Maybe<Lesson>;
  me?: Maybe<User>;
  steps: Array<Step>;
  step?: Maybe<Step>;
  checkpoints: Array<Checkpoint>;
  checkpoint?: Maybe<Checkpoint>;
};


export type QueryLessonArgs = {
  id: Scalars['Int'];
};


export type QueryStepArgs = {
  id: Scalars['Int'];
};


export type QueryCheckpointArgs = {
  id: Scalars['Int'];
};

export type Lesson = {
  __typename?: 'Lesson';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title: Scalars['String'];
  description: Scalars['String'];
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

export type Step = {
  __typename?: 'Step';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  instructions: Scalars['String'];
  lesson: Lesson;
  checkpoints?: Maybe<Array<Checkpoint>>;
};

export type Checkpoint = {
  __typename?: 'Checkpoint';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  description: Scalars['String'];
  initialCode: Scalars['String'];
  userCode: Scalars['String'];
  test: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createLesson: Lesson;
  updateLesson?: Maybe<Lesson>;
  deleteLesson: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  forgotPassword: Scalars['Boolean'];
  changePassword: UserResponse;
  createOrUpdateStep: Step;
  deleteStep: Scalars['Boolean'];
  createCheckpoint: Checkpoint;
  updateCheckpoint?: Maybe<Checkpoint>;
  deleteCheckpoint: Scalars['Boolean'];
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


export type MutationCreateOrUpdateStepArgs = {
  options: StepInput;
};


export type MutationDeleteStepArgs = {
  id: Scalars['Float'];
};


export type MutationCreateCheckpointArgs = {
  options: CheckpointInput;
};


export type MutationUpdateCheckpointArgs = {
  options: CheckpointInput;
  id: Scalars['Float'];
};


export type MutationDeleteCheckpointArgs = {
  id: Scalars['Float'];
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

export type StepInput = {
  id?: Maybe<Scalars['Float']>;
  lessonId: Scalars['Float'];
  instructions: Scalars['String'];
};

export type CheckpointInput = {
  stepId: Scalars['Float'];
  description: Scalars['String'];
  initialCode: Scalars['String'];
  userCode: Scalars['String'];
  test: Scalars['String'];
};

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
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

export type CreateLessonMutationVariables = Exact<{
  title: Scalars['String'];
}>;


export type CreateLessonMutation = (
  { __typename?: 'Mutation' }
  & { createLesson: (
    { __typename?: 'Lesson' }
    & Pick<Lesson, 'id' | 'likes' | 'title'>
    & { owner: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  ) }
);

export type CreateOrUpdateStepMutationVariables = Exact<{
  id: Scalars['Float'];
  lessonId: Scalars['Float'];
  instructions: Scalars['String'];
}>;


export type CreateOrUpdateStepMutation = (
  { __typename?: 'Mutation' }
  & { createOrUpdateStep: (
    { __typename?: 'Step' }
    & Pick<Step, 'id' | 'createdAt' | 'instructions'>
  ) }
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
      & Pick<Step, 'id' | 'createdAt' | 'instructions'>
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

export type StepsQueryVariables = Exact<{ [key: string]: never; }>;


export type StepsQuery = (
  { __typename?: 'Query' }
  & { steps: Array<(
    { __typename?: 'Step' }
    & Pick<Step, 'instructions' | 'createdAt'>
  )> }
);

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
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
export const CreateLessonDocument = gql`
    mutation CreateLesson($title: String!) {
  createLesson(options: {title: $title}) {
    id
    likes
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
export const CreateOrUpdateStepDocument = gql`
    mutation CreateOrUpdateStep($id: Float!, $lessonId: Float!, $instructions: String!) {
  createOrUpdateStep(
    options: {id: $id, lessonId: $lessonId, instructions: $instructions}
  ) {
    id
    createdAt
    instructions
  }
}
    `;
export type CreateOrUpdateStepMutationFn = Apollo.MutationFunction<CreateOrUpdateStepMutation, CreateOrUpdateStepMutationVariables>;

/**
 * __useCreateOrUpdateStepMutation__
 *
 * To run a mutation, you first call `useCreateOrUpdateStepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrUpdateStepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrUpdateStepMutation, { data, loading, error }] = useCreateOrUpdateStepMutation({
 *   variables: {
 *      id: // value for 'id'
 *      lessonId: // value for 'lessonId'
 *      instructions: // value for 'instructions'
 *   },
 * });
 */
export function useCreateOrUpdateStepMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrUpdateStepMutation, CreateOrUpdateStepMutationVariables>) {
        return Apollo.useMutation<CreateOrUpdateStepMutation, CreateOrUpdateStepMutationVariables>(CreateOrUpdateStepDocument, baseOptions);
      }
export type CreateOrUpdateStepMutationHookResult = ReturnType<typeof useCreateOrUpdateStepMutation>;
export type CreateOrUpdateStepMutationResult = Apollo.MutationResult<CreateOrUpdateStepMutation>;
export type CreateOrUpdateStepMutationOptions = Apollo.BaseMutationOptions<CreateOrUpdateStepMutation, CreateOrUpdateStepMutationVariables>;
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
      id
      createdAt
      instructions
    }
  }
}
    `;

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
export const StepsDocument = gql`
    query Steps {
  steps {
    instructions
    createdAt
  }
}
    `;

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