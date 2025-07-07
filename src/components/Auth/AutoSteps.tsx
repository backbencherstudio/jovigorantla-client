import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import EmailVerification from "./EmailVarification";
import UserDetailsForm from "./UserDetailsForm";
import { UseFormReturn } from "react-hook-form";

const AuthSteps = ({
  signupStep,
  setSignupStep,
  otp,
  setOtp,
  isLoading,
  handleVerifyOTP,
  resendTimer,
  resendDisabled,
  handleResend,
  signupDetailsForm,
  handleDetailsSubmit,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  signupEmailForm,
  redirectToLogin,
}: {
  signupStep: "verify" | "details";
  setSignupStep: (step: "email" | "verify" | "details") => void;
  otp: string;
  setOtp: (otp: string) => void;
  isLoading: boolean;
  handleVerifyOTP: (value: string) => void;
  resendTimer: number;
  resendDisabled: boolean;
  handleResend: () => void;
  signupDetailsForm: UseFormReturn<{
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>;
  handleDetailsSubmit: (values: {
    username?: string;
    password?: string;
    confirmPassword?: string;
  }) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  signupEmailForm?: UseFormReturn<{ email: string }>;
  redirectToLogin: () => void;
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6 flex flex-col ">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (signupStep === "details") {
                setSignupStep("verify");
              } else {
                setSignupStep("email");
              }
              
              // Reset the form when going back
              // signupEmailForm?.reset();
            }}
            className="text-gray-800 hover:text-gray-700 rounded-full absolute left-4 top-4 text-xl"
          >
            <ArrowLeft />
          </Button>
          <h2 className="text-2xl font-bold text-center flex-1 mt-10">
            {signupStep === "verify"
              ? "Verify your email"
              : "Set up your account"}
          </h2>
        </div>

        {signupStep === "verify" && (
          <EmailVerification
            otp={otp}
            setOtp={setOtp}
            isLoading={isLoading}
            resendTimer={resendTimer}
            resendDisabled={resendDisabled}
            handleResend={handleResend}
            setSignupStep={setSignupStep}
          />
        )}

        {signupStep === "details" && (
          <UserDetailsForm
            signupDetailsForm={signupDetailsForm}
            // handleDetailsSubmit={handleDetailsSubmit}
            isLoading={isLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            redirectToLogin={redirectToLogin}
          />
        )}
      </div>
    </div>
  );
};

export default AuthSteps;
