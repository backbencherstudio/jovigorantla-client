import React from "react";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/ui/otp-input";

const EmailVerification = ({
  otp,
  setOtp,
  isLoading,
  handleVerifyOTP,
  resendTimer,
  resendDisabled,
  handleResend,
  setSignupStep
}) => {
  return (
    <>
      <p className="text-sm text-gray-500 text-center">
        We've sent a 6-digit code to your email.
        <br />
        Please check your inbox and spam folder.
      </p>
      <div className="space-y-6 h-full flex flex-col justify-between">
        <div>
          <OTPInput
            value={otp}
            onChange={setOtp}
            onComplete={handleVerifyOTP}
            disabled={isLoading}
          />
        </div>
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500 text-center mb-2">
            Didn't receive the code?
            {resendDisabled ? (
              <span className="text-gray-400 mx-3">
                Resend in {resendTimer}s
              </span>
            ) : (
              <span 
                className="text-blue-500 hover:text-blue-700 cursor-pointer mx-3"
                onClick={handleResend}
              >
                Resend
              </span>
            )}
          </p>
          <Button
            onClick={() => setSignupStep("details")}
            className="w-full bg-[#ff6b00] hover:bg-[#e55f00] py-5 rounded-full"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default EmailVerification;