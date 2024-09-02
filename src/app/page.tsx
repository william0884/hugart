import { SignUp, SignIn } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="w-full  max-w-xs ml-10">
      <h1 className="block border-2 text-center text-white text-sm font-bold mb-2">
        HugArt
      </h1>
      <p>Generate AI images with a rick and morty infuence.</p>
      <SignUp />
      <SignIn />
    </div>
  );
}
