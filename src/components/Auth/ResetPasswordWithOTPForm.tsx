import React from "react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";

const ResetPasswordWithOTPForm = ({
  resetForm,
  handleReset,
  isLoading,
  setBackToEmailForm,
}) => {
  return (
    <div className="w-full h-[520px] flex flex-col bg-white">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setBackToEmailForm(true)}
        className="text-gray-800 hover:text-gray-700 rounded-full absolute left-4 top-4 text-xl"
      >
        <ArrowLeft />
      </Button>

      <div className="w-full max-w-md space-y-6 mt-10">
        <h2 className="text-2xl font-bold text-center">Set New Password</h2>
        <p className="text-sm text-gray-500 text-center">
          Enter the OTP you received and set a new password.
        </p>

        <Form {...resetForm}>
          <form
            onSubmit={() => {}}
            className="h-full flex flex-col"
          >
            {/* OTP */}
            <FormField
              control={resetForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <FloatingInput
                        label="OTP"
                        {...field}
                        disabled={isLoading}
                        className="pl-3"
                      />
                    </FormControl>
                  </div>
                  <div className="h-5">
                    <FormMessage className="text-xs text-[#b3261e] font-normal ml-3 -mt-[6.5px]" />
                  </div>
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={resetForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <FloatingInput
                        label="New Password"
                        type="password"
                        {...field}
                        disabled={isLoading}
                        className="pl-3"
                      />
                    </FormControl>
                  </div>
                  <div className="h-5">
                    <FormMessage className="text-xs text-[#b3261e] font-normal ml-3 -mt-[6.5px]" />
                  </div>
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={resetForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <FloatingInput
                        label="Confirm Password"
                        type="password"
                        {...field}
                        disabled={isLoading}
                        className="pl-3"
                      />
                    </FormControl>
                  </div>
                  <div className="h-5">
                    <FormMessage className="text-xs text-[#b3261e] font-normal ml-3 -mt-[6.5px]" />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="left-4 w-[92%] md:w-[88%] md:left-6 absolute bottom-5 rounded-full bg-[#ff6b00] hover:bg-[#e55f00] py-5"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordWithOTPForm;
