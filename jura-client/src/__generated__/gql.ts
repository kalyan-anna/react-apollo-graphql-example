/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n fragment IssueFragment on Issue {\n    id\n    issueNumber\n    summary\n    description\n    type\n    status\n    storyPoints\n    projectId\n    sprintId\n    assigneeUserId\n    assignee {\n      ...UserFragment\n    }\n    reporterUserId  \n    reporter {\n      ...UserFragment\n    }  \n  }\n": types.IssueFragmentFragmentDoc,
    "\n fragment NotificationFragment on Notification {\n    id\n    message\n    status\n  }\n": types.NotificationFragmentFragmentDoc,
    "\n fragment ProjectFragment on Project {\n    id\n    name\n    ownerId\n    subTitle\n  }\n": types.ProjectFragmentFragmentDoc,
    "\n fragment SprintFragment on Sprint {\n    id\n    name\n    goal\n    status\n    startDate\n    endDate\n    projectId\n  }\n": types.SprintFragmentFragmentDoc,
    "\n fragment UserFragment on User {\n    id\n    email\n    name\n  }\n": types.UserFragmentFragmentDoc,
    "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      accessToken\n      user {\n        ...UserFragment\n      }\n    }\n  }\n": types.LoginDocument,
    "\n    mutation UpdateIssue($input: IssueUpdateInput!) {\n        updateIssue(issueUpdateInput: $input) {\n            ...IssueFragment\n        }\n    }\n": types.UpdateIssueDocument,
    "\n  mutation CreateIssue($input: IssueCreateInput!) {\n      createIssue(issueCreateInput: $input) {\n          ...IssueFragment\n      }\n  }\n": types.CreateIssueDocument,
    "\n  mutation DeleteIssue($id: String!) {\n      deleteIssue(id: $id)\n  }\n": types.DeleteIssueDocument,
    "\n  query BACKLOG_ISSUES($projectId: String!) {\n      issues(projectId: $projectId, sprintId: null) {\n          ...IssueFragment\n      }\n    }\n  ": types.Backlog_IssuesDocument,
    "\n    mutation UpdateNotification($id: String!, $status: NotificationStatus!) {\n        updateNotification(id: $id, status: $status) {\n            ...NotificationFragment\n        }\n    }\n": types.UpdateNotificationDocument,
    "\n    query NOTIFICATIONS {\n        notifications {\n           ...NotificationFragment\n        }\n    }\n  ": types.NotificationsDocument,
    "\n    query PROJECTS {\n        projects {\n           ...ProjectFragment\n        }\n    }\n  ": types.ProjectsDocument,
    "\n    mutation CreateSprint($input: SprintCreateInput!) {\n        createSprint(sprintCreateInput: $input) {\n            ...SprintFragment\n        }\n    }\n": types.CreateSprintDocument,
    "\n    mutation UpdateSprint($input: SprintUpdateInput!) {\n        updateSprint(sprintUpdateInput: $input) {\n            ...SprintFragment\n        }\n    }\n": types.UpdateSprintDocument,
    "\n    query SPRINTS($projectId: String!) {\n        sprints(projectId: $projectId) {\n            ...SprintFragment\n            issues {\n                ...IssueFragment\n            }\n        }\n    }\n": types.SprintsDocument,
    "\n    mutation UpdateUser($input: UserUpdateInput!) {\n        updateUser(userUpdateInput: $input) {\n            ...UserFragment\n        }\n    }\n": types.UpdateUserDocument,
    "\n    query USERS {\n        users {\n            ...UserFragment\n        }\n    }\n": types.UsersDocument,
    "\n    query USER($id: String!) {\n        user(id: $id) {\n            ...UserFragment\n        }\n    }\n": types.UserDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n fragment IssueFragment on Issue {\n    id\n    issueNumber\n    summary\n    description\n    type\n    status\n    storyPoints\n    projectId\n    sprintId\n    assigneeUserId\n    assignee {\n      ...UserFragment\n    }\n    reporterUserId  \n    reporter {\n      ...UserFragment\n    }  \n  }\n"): (typeof documents)["\n fragment IssueFragment on Issue {\n    id\n    issueNumber\n    summary\n    description\n    type\n    status\n    storyPoints\n    projectId\n    sprintId\n    assigneeUserId\n    assignee {\n      ...UserFragment\n    }\n    reporterUserId  \n    reporter {\n      ...UserFragment\n    }  \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n fragment NotificationFragment on Notification {\n    id\n    message\n    status\n  }\n"): (typeof documents)["\n fragment NotificationFragment on Notification {\n    id\n    message\n    status\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n fragment ProjectFragment on Project {\n    id\n    name\n    ownerId\n    subTitle\n  }\n"): (typeof documents)["\n fragment ProjectFragment on Project {\n    id\n    name\n    ownerId\n    subTitle\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n fragment SprintFragment on Sprint {\n    id\n    name\n    goal\n    status\n    startDate\n    endDate\n    projectId\n  }\n"): (typeof documents)["\n fragment SprintFragment on Sprint {\n    id\n    name\n    goal\n    status\n    startDate\n    endDate\n    projectId\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n fragment UserFragment on User {\n    id\n    email\n    name\n  }\n"): (typeof documents)["\n fragment UserFragment on User {\n    id\n    email\n    name\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      accessToken\n      user {\n        ...UserFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      accessToken\n      user {\n        ...UserFragment\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation UpdateIssue($input: IssueUpdateInput!) {\n        updateIssue(issueUpdateInput: $input) {\n            ...IssueFragment\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateIssue($input: IssueUpdateInput!) {\n        updateIssue(issueUpdateInput: $input) {\n            ...IssueFragment\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateIssue($input: IssueCreateInput!) {\n      createIssue(issueCreateInput: $input) {\n          ...IssueFragment\n      }\n  }\n"): (typeof documents)["\n  mutation CreateIssue($input: IssueCreateInput!) {\n      createIssue(issueCreateInput: $input) {\n          ...IssueFragment\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteIssue($id: String!) {\n      deleteIssue(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteIssue($id: String!) {\n      deleteIssue(id: $id)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query BACKLOG_ISSUES($projectId: String!) {\n      issues(projectId: $projectId, sprintId: null) {\n          ...IssueFragment\n      }\n    }\n  "): (typeof documents)["\n  query BACKLOG_ISSUES($projectId: String!) {\n      issues(projectId: $projectId, sprintId: null) {\n          ...IssueFragment\n      }\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation UpdateNotification($id: String!, $status: NotificationStatus!) {\n        updateNotification(id: $id, status: $status) {\n            ...NotificationFragment\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateNotification($id: String!, $status: NotificationStatus!) {\n        updateNotification(id: $id, status: $status) {\n            ...NotificationFragment\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query NOTIFICATIONS {\n        notifications {\n           ...NotificationFragment\n        }\n    }\n  "): (typeof documents)["\n    query NOTIFICATIONS {\n        notifications {\n           ...NotificationFragment\n        }\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query PROJECTS {\n        projects {\n           ...ProjectFragment\n        }\n    }\n  "): (typeof documents)["\n    query PROJECTS {\n        projects {\n           ...ProjectFragment\n        }\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CreateSprint($input: SprintCreateInput!) {\n        createSprint(sprintCreateInput: $input) {\n            ...SprintFragment\n        }\n    }\n"): (typeof documents)["\n    mutation CreateSprint($input: SprintCreateInput!) {\n        createSprint(sprintCreateInput: $input) {\n            ...SprintFragment\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation UpdateSprint($input: SprintUpdateInput!) {\n        updateSprint(sprintUpdateInput: $input) {\n            ...SprintFragment\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateSprint($input: SprintUpdateInput!) {\n        updateSprint(sprintUpdateInput: $input) {\n            ...SprintFragment\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query SPRINTS($projectId: String!) {\n        sprints(projectId: $projectId) {\n            ...SprintFragment\n            issues {\n                ...IssueFragment\n            }\n        }\n    }\n"): (typeof documents)["\n    query SPRINTS($projectId: String!) {\n        sprints(projectId: $projectId) {\n            ...SprintFragment\n            issues {\n                ...IssueFragment\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation UpdateUser($input: UserUpdateInput!) {\n        updateUser(userUpdateInput: $input) {\n            ...UserFragment\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateUser($input: UserUpdateInput!) {\n        updateUser(userUpdateInput: $input) {\n            ...UserFragment\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query USERS {\n        users {\n            ...UserFragment\n        }\n    }\n"): (typeof documents)["\n    query USERS {\n        users {\n            ...UserFragment\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query USER($id: String!) {\n        user(id: $id) {\n            ...UserFragment\n        }\n    }\n"): (typeof documents)["\n    query USER($id: String!) {\n        user(id: $id) {\n            ...UserFragment\n        }\n    }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;