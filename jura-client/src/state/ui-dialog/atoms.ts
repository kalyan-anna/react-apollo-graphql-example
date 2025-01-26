import { Issue } from "@generated/graphql";
import { atom, useAtom, useSetAtom } from "jotai";

type DialogState<T> = {
  isOpen: boolean;
  data?: T;
};

const createDialogAtoms = <T = undefined>() => {
  const dialogAtom = atom<DialogState<T>>({ isOpen: false });

  const openDialogAtom = atom(null, (_, set, data?: T) => {
    set(dialogAtom, { isOpen: true, data });
  });

  const closeDialogAtom = atom(null, (_, set) => {
    set(dialogAtom, { isOpen: false });
  });

  const useDialogState = () => {
    const [{ isOpen, data }] = useAtom(dialogAtom);
    const openDialog = useSetAtom(openDialogAtom);
    const closeDialog = useSetAtom(closeDialogAtom);

    return { isOpen, data, openDialog, closeDialog };
  };

  return { useDialogState };
};

export const issueDialog = createDialogAtoms<Issue>();
export const sprintDialog = createDialogAtoms();
export const sprintCompleteWarningDialog = createDialogAtoms();
export const sprintStartWarningDialog = createDialogAtoms();
