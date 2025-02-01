import { ProfileForm } from "../components/ProfileForm";
import { ProtectedTemplate } from "../templates/ProtectedTemplate";

export const ProfilePage = () => {
  return (
    <ProtectedTemplate>
      <div className="w-full flex justify-center mt-8">
        <ProfileForm />
      </div>
    </ProtectedTemplate>
  );
};
