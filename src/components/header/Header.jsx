import "./Header.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="Header bg-blue-600 text-center  h-full py-8">
      <h1 className="head font-bold text-cyan-50 py-3 text-5xl">
        <Link to="/">TASK FLOW</Link>
      </h1>
      <div className="log-container">
        <p className="login-link">
          <SignedOut>
            <SignInButton
              appearance={{
                Animation: true,
                layout: {
                  socialButtonsPlacement: "bottom",
                  socialButtonsVariant: "auto",
                  termsPageUrl: "https://clerk.com/terms",
                },
              }}
            >
              Sign In
            </SignInButton>
          </SignedOut>

          <SignedIn to="/SignUp">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-20 h-12", // Tailwind: bigger width & height
                },
              }}
            />
          </SignedIn>
        </p>
      </div>
    </div>
  );
};

export default Header;
