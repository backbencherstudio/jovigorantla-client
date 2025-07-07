import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/ui/otp-input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface EmailVerificationProps {
  otp: string;
  setOtp: (otp: string) => void;
  isLoading: boolean;
  resendTimer: number;
  resendDisabled: boolean;
  handleResend: () => void;
  setSignupStep: (step: "email" | "verify" | "details") => void;
}

const EmailVerification = ({
  otp,
  setOtp,
  isLoading,
  resendTimer,
  resendDisabled,
  handleResend,
  setSignupStep,
}: EmailVerificationProps) => {
  const { verifyOtp, sendOtp } = useAuth();
  const signUpEmail = localStorage.getItem("signupEmail");
  const [error, setError] = useState(false);

  const handleVerifyOTP = async (completedOtp: string) => {
    try {
      const success = await verifyOtp(signUpEmail!, completedOtp);
      if (success) {
        localStorage.setItem("otp", completedOtp);
        setError(false);
        setSignupStep("details");
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError(true);
    }
  };

  const handleResendClick = async () => {
    try {
      await handleResend();
      setOtp("")
      // const success = await sendOtp(signUpEmail!);
      // if (success) {
      //   handleResend(); // This will handle the timer reset
      //   toast.success("Verification code resent successfully");
      // } else {
      //   toast.error("Failed to resend verification code");
      // }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend verification code");
    }
  };

  const isOtpComplete = otp.length === 6;

  return (
    <div >
      <p className="text-sm text-gray-500 text-center mb-4">
        We've sent a 6-digit code to your email.
        <br />
        Please check your inbox and spam folder.
      </p>
      <div className=" h-full flex flex-col ">
        <div>
          <OTPInput
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError(false);
            }}
            onComplete={handleVerifyOTP}
            disabled={isLoading}
            hasError={error}
          />
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">
              Invalid verification code. Please try again.
            </p>
          )}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 text-center mb-2 mt-5 w-full">
            Didn't receive the code?
            {resendDisabled ? (
              <span className="text-gray-400 mx-3">
                Resend in {resendTimer}s
              </span>
            ) : (
              <span
                className="text-[#3b82f6] hover:text-blue-600 cursor-pointer mx-3"
                onClick={handleResendClick}
              >
                Resend
              </span>
            )}
          </p>
          <Button
            onClick={() => handleVerifyOTP(otp)}
            className="w-full md:w-full  bg-brand py-5 rounded-full mt-5"
            disabled={isLoading || !isOtpComplete}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
