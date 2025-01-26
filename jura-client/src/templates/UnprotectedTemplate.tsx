import { MainNav } from "./MainNav";
import { PropsWithChildren } from "react";

export const UnprotectedTemplate = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <header>
        <MainNav withProfileMenu={false} />
      </header>
      <main className="px-8 md:px-16 py-8">{children}</main>
    </div>
  );
};
