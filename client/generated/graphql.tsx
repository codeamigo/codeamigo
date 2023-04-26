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

export type Checkpoint = {
  __typename?: 'Checkpoint';
  id: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  description: Scalars['String'];
  isCompleted: Scalars['Boolean'];
  isTested: Scalars['Boolean'];
  type?: Maybe<CheckpointTypeEnum>;
  step: Step;
  user: User;
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
  id: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  isEntry?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
  step: Step;
  user: User;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
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

export type Lesson = {
  __typename?: 'Lesson';
  id: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  views?: Maybe<Scalars['Float']>;
  likes: Scalars['Float'];
  users?: Maybe<Array<User>>;
  steps?: Maybe<Array<Step>>;
};

export type LoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type Modal = {
  __typename?: 'Modal';
  name?: Maybe<Scalars['String']>;
  callback?: Maybe<Scalars['String']>;
  persistent?: Maybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteUser: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  githubLogin: UserResponse;
  googleLogin: UserResponse;
  logout: Scalars['Boolean'];
  updateUserRole: UserResponse;
  forgotPassword: Scalars['String'];
  changePasswordFromToken: UserResponse;
  changePasswordFromPassword: UserResponse;
  changeEmail: UserResponse;
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

export type Query = {
  __typename?: 'Query';
  checkpoint?: Maybe<Checkpoint>;
  checkpoints: Array<Checkpoint>;
  codeModules: Array<CodeModule>;
  lesson?: Maybe<Lesson>;
  lessons: Array<Lesson>;
  me?: Maybe<User>;
  modal?: Maybe<Modal>;
  step?: Maybe<Step>;
  steps: Array<Step>;
  users?: Maybe<Array<User>>;
};


export type QueryCheckpointArgs = {
  id: Scalars['Int'];
};


export type QueryCheckpointsArgs = {
  stepId: Scalars['String'];
};


export type QueryCodeModulesArgs = {
  stepId: Scalars['String'];
};


export type QueryLessonArgs = {
  slug: Scalars['String'];
};


export type QueryStepArgs = {
  slug: Scalars['String'];
};

export type Question = {
  __typename?: 'Question';
  id: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  value: Scalars['String'];
  step: Step;
};

export type RegisterInput = {
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type Step = {
  __typename?: 'Step';
  id: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  slug: Scalars['String'];
  instructions?: Maybe<Scalars['String']>;
  isCompleted?: Maybe<Scalars['Boolean']>;
  position?: Maybe<Scalars['Float']>;
  start?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  lesson: Lesson;
  questions?: Maybe<Array<Question>>;
  codeModules?: Maybe<Array<CodeModule>>;
  checkpoints?: Maybe<Array<Checkpoint>>;
};

export type UpdateUserRoleInput = {
  id: Scalars['String'];
  role: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  checkpoints?: Maybe<Array<Checkpoint>>;
  codeModules?: Maybe<Array<CodeModule>>;
  createdAt: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isAuthenticated?: Maybe<Scalars['Boolean']>;
  profilePic: Scalars['String'];
  role: Role;
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'email' | 'role' | 'username' | 'isAuthenticated'>
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

export type ForgotPasswordMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
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

export type CodeModulesQueryVariables = Exact<{
  stepId: Scalars['String'];
}>;


export type CodeModulesQuery = (
  { __typename?: 'Query' }
  & { codeModules: Array<(
    { __typename?: 'CodeModule' }
    & Pick<CodeModule, 'code' | 'name'>
  )> }
);

export type LessonQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type LessonQuery = (
  { __typename?: 'Query' }
  & { lesson?: Maybe<(
    { __typename?: 'Lesson' }
    & Pick<Lesson, 'id' | 'description' | 'thumbnail' | 'title'>
    & { steps?: Maybe<Array<(
      { __typename?: 'Step' }
      & Pick<Step, 'slug'>
    )>> }
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
    & Pick<Modal, 'name' | 'callback' | 'persistent'>
  )> }
);

export type StepQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type StepQuery = (
  { __typename?: 'Query' }
  & { step?: Maybe<(
    { __typename?: 'Step' }
    & Pick<Step, 'id' | 'instructions' | 'position' | 'title'>
    & { checkpoints?: Maybe<Array<(
      { __typename?: 'Checkpoint' }
      & Pick<Checkpoint, 'description' | 'matchRegex' | 'isCompleted'>
    )>> }
  )> }
);

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  email
  role
  username
  isAuthenticated @client
}
    `;
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
export const CodeModulesDocument = gql`
    query CodeModules($stepId: String!) {
  codeModules(stepId: $stepId) {
    code
    name
  }
}
    `;

/**
 * __useCodeModulesQuery__
 *
 * To run a query within a React component, call `useCodeModulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCodeModulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCodeModulesQuery({
 *   variables: {
 *      stepId: // value for 'stepId'
 *   },
 * });
 */
export function useCodeModulesQuery(baseOptions: Apollo.QueryHookOptions<CodeModulesQuery, CodeModulesQueryVariables>) {
        return Apollo.useQuery<CodeModulesQuery, CodeModulesQueryVariables>(CodeModulesDocument, baseOptions);
      }
export function useCodeModulesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CodeModulesQuery, CodeModulesQueryVariables>) {
          return Apollo.useLazyQuery<CodeModulesQuery, CodeModulesQueryVariables>(CodeModulesDocument, baseOptions);
        }
export type CodeModulesQueryHookResult = ReturnType<typeof useCodeModulesQuery>;
export type CodeModulesLazyQueryHookResult = ReturnType<typeof useCodeModulesLazyQuery>;
export type CodeModulesQueryResult = Apollo.QueryResult<CodeModulesQuery, CodeModulesQueryVariables>;
export const LessonDocument = gql`
    query Lesson($slug: String!) {
  lesson(slug: $slug) {
    id
    description
    thumbnail
    title
    steps {
      slug
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
 *      slug: // value for 'slug'
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
    persistent
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
export const StepDocument = gql`
    query Step($slug: String!) {
  step(slug: $slug) {
    id
    instructions
    position
    title
    checkpoints {
      description
      matchRegex
      isCompleted
    }
  }
}
    `;

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
 *      slug: // value for 'slug'
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