import React from "react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";

const ResetPasswordForm = ({
  resetPasswordForm,
  handleResetPassword,
  isLoading,
  setForgotPassword,
}) => {
  return (
    <div className="w-full h-[500px] flex flex-col  bg-white">
         <Button
            variant="ghost"
            size="icon"
            onClick={() => setForgotPassword(false)}
            className="text-gray-800 hover:text-gray-700 rounded-full absolute left-4 top-4 text-xl"
          >
            <ArrowLeft />
          </Button>
      <div className="w-full max-w-md space-y-6 mt-10">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <p className="text-sm text-gray-500 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <Form {...resetPasswordForm}>
          <form 
            onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} 
            className="h-full flex flex-col justify-between"
          >
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
            
           
              <Button
                type="submit"
                className="left-4 w-[92%] md:w-[88%] md:left-6 absolute  bottom-5 rounded-full bg-[#ff6b00] hover:bg-[#e55f00] py-5"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;