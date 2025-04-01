import * as Types from '../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Time: { input: any; output: any; }
};

export type DummySubscriptionPayload = {
  __typename?: 'DummySubscriptionPayload';
  dummy?: Maybe<Scalars['String']['output']>;
};

export type File = {
  __typename?: 'File';
  contentType?: Maybe<Scalars['String']['output']>;
  contentUrl?: Maybe<Scalars['String']['output']>;
};

export type FileInput = {
  contentType: Scalars['String']['input'];
  contentUrl: Scalars['String']['input'];
};

export type FileUploadInput = {
  fileName: Scalars['String']['input'];
  fileType: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** @deprecated No longer supported */
  _dummy?: Maybe<Scalars['String']['output']>;
  createReport?: Maybe<Report>;
  generatePresignedUrls: Array<Scalars['String']['output']>;
  updateUser: User;
};


export type MutationCreateReportArgs = {
  description: Scalars['String']['input'];
  files?: InputMaybe<Array<InputMaybe<FileInput>>>;
  publishTime?: InputMaybe<Scalars['DateTime']['input']>;
  title: Scalars['String']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
};


export type MutationGeneratePresignedUrlsArgs = {
  files: Array<FileUploadInput>;
};


export type MutationUpdateUserArgs = {
  dateOfBirth?: InputMaybe<Scalars['Date']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  /** @deprecated No longer supported */
  _date: Scalars['Date']['output'];
  /** @deprecated No longer supported */
  _datetime: Scalars['DateTime']['output'];
  /** @deprecated No longer supported */
  _dummy?: Maybe<Scalars['String']['output']>;
  /** @deprecated No longer supported */
  _time: Scalars['Time']['output'];
  report?: Maybe<Report>;
  reports: Array<Report>;
  user: User;
  users: Array<User>;
};


export type Query_DateArgs = {
  input?: InputMaybe<Scalars['Date']['input']>;
};


export type Query_DatetimeArgs = {
  input?: InputMaybe<Scalars['DateTime']['input']>;
};


export type Query_TimeArgs = {
  input?: InputMaybe<Scalars['Time']['input']>;
};


export type QueryReportArgs = {
  id: Scalars['String']['input'];
};


export type QueryReportsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Report = Node & {
  __typename?: 'Report';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdById?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  files?: Maybe<Array<Maybe<File>>>;
  id: Scalars['ID']['output'];
  slides?: Maybe<Array<Maybe<Slide>>>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ReportImage = {
  __typename?: 'ReportImage';
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Slide = {
  __typename?: 'Slide';
  description?: Maybe<Scalars['String']['output']>;
  images?: Maybe<Array<Maybe<ReportImage>>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** @deprecated No longer supported */
  _dummy?: Maybe<DummySubscriptionPayload>;
};

export type User = Node & {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dateOfBirth?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  middleName?: Maybe<Scalars['String']['output']>;
  patientId?: Maybe<Scalars['String']['output']>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type GetUserQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, fullName?: string | null, email?: string | null, dateOfBirth?: any | null, patientId?: string | null } };


export const GetUserDocument = gql`
    query GetUser($id: String!) {
  user(id: $id) {
    id
    firstName
    lastName
    fullName
    email
    dateOfBirth
    patientId
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables> & ({ variables: GetUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;