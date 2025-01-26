import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

interface UIPreferenceState {
  lastVisitedProjectId?: string;
}

const uiPreferenceAtom = atomWithStorage<UIPreferenceState>("counter", {});

const setLastVisitedProjectIdAtom = atom(null, (get, set, projectId?: string) => {
  const uiPreference = get(uiPreferenceAtom);
  set(uiPreferenceAtom, { ...uiPreference, lastVisitedProjectId: projectId });
});

export const useUIPreferenceState = () => {
  const setLastVisitedProjectId = useSetAtom(setLastVisitedProjectIdAtom);
  const uiPreference = useAtomValue(uiPreferenceAtom);

  return { setLastVisitedProjectId, ...uiPreference };
};
