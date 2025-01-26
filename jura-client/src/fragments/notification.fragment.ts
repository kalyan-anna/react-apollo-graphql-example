import { gql } from "@generated/gql";

export const NotificationFragment = gql(`
 fragment NotificationFragment on Notification {
    id
    message
    status
  }
`);
