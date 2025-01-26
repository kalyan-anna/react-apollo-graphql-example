import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => {
  return (
    <main className="flex flex-wrap min-h-screen">
      <div className="w-full lg:w-1/2 p-4 border-b md:border-b-0 md:border-r flex flex-col items-center mt-12 gap-8">
        <div className="flex flex-col justify-center align-middle text-center">
          <img className="mx-auto h-52" src="./logo.svg" alt="logo" />
        </div>
        <LoginForm />
        <div className="text-gray-400 flex flex-col justify-center align-middle text-center mt-8">
          <h2 className="mb-2">Other example logins</h2>
          <div>johnsmith@example.com</div>
          <div>michael.smith@example.com</div>
          <div>susan.jones@example.com</div>
          <div>david.brown@example.com</div>
          <div>emily.white@example.com</div>
          <div>christopher.wilson@example.com</div>
          <div className="mt-2">password: welcome</div>
        </div>
      </div>
      <div className="lg:flex w-full lg:w-1/2 p-4 bg-gray-200 hidden">
        <img
          className="mx-auto h-100 xl:h-[700px] lg:h-[600px]"
          src="./calender.png"
          alt="logo"
        />
      </div>
    </main>
  );
};
