import { atom, useAtomValue, useSetAtom } from "jotai";

interface ToastState {
  message: string;
  id: string;
}

const toastsAtom = atom<ToastState[]>([]);

const addToastAtom = atom(null, (get, set, message: string) => {
  const prevToasts = get(toastsAtom);
  set(toastsAtom, [...prevToasts, { message, id: Date.now().toString() }]);
});

const removeToastAtom = atom(null, (get, set, id: string) => {
  const prevToasts = get(toastsAtom);
  console.log("id to remove:", id);
  set(
    toastsAtom,
    prevToasts.filter((t) => t.id !== id)
  );
});

export const useToastState = () => {
  const toasts = useAtomValue(toastsAtom);
  const addToast = useSetAtom(addToastAtom);
  const removeToast = useSetAtom(removeToastAtom);

  return { toasts, addToast, removeToast };
};
