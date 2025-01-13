import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const Auth = () => {
  return (
    <div className="auth-container">
      {/* When User is signOut */}
      <SignedOut>
        <SignUpButton mode="modal" />
        <SignInButton mode="modal" />
      </SignedOut>

      {/* When User is signIn */}
      <SignedIn>
        <Navigate to={"/"}/>
      </SignedIn>
    </div>
  );
};

export default Auth;
