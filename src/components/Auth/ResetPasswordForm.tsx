import React from "react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const ResetPasswordForm = ({
  resetPasswordForm,
  handleResetPassword,
  isLoading,
  setForgotPassword
}) => {
  return (
    <div className="w-full h-[500px] flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <p className="text-sm text-gray-500 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <Form {...resetPasswordForm}>
          <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
            <FormField
              control={resetPasswordForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <FloatingInput
                        label="Email"
                        {...field}
                        disabled={isLoading}
                        className="pl-3"
                      />
                    </FormControl>
                  </div>
                  <div className="h-5">
                    <FormMessage className="text-xs text-red-700 font-normal ml-3" />
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={() => setForgotPassword(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-1/2 bg-[#ff6b00] hover:bg-[#e55f00]"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;