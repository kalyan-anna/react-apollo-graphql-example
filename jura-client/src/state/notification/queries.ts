import { useQuery } from "@apollo/client";
import { gql } from "@generated/gql";
import { NotificationStatus } from "@generated/graphql";
import { useMemo } from "react";

const NOTIFICATIONS_QUERY = gql(`
    query NOTIFICATIONS {
        notifications {
           ...NotificationFragment
        }
    }
  `);

export const useNotificationsQuery = () => {
  return useQuery(NOTIFICATIONS_QUERY, { pollInterval: 20000 });
};

export const useNotificationsCountQuery = () => {
  const result = useNotificationsQuery();

  return useMemo(() => {
    const unreadCount =
      result.data?.notifications.filter((item) => item.status === NotificationStatus.Unread).length || 0;

    return {
      ...result,
      data: unreadCount,
      length: unreadCount,
    };
  }, [result]);
};
