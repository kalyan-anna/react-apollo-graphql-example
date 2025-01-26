import { IssueType } from "@generated/graphql";

export const ISSUE_TYPE_COLOR = {
  [IssueType.Story]: "bg-gray-500",
  [IssueType.Bug]: "bg-red-500",
};
