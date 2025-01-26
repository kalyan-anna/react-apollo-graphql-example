import { gqlGlobalErrorAtom } from "../state/error";
import { useAtomValue } from "jotai";

export const useGqlErrorHandler = () => {
  const gqlError = useAtomValue(gqlGlobalErrorAtom);
  if (gqlError) {
    throw new Error(gqlError);
  }
};
