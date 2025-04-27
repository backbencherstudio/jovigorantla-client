import React from "react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const SignupEmailForm = ({
  signupEmailForm,
  handleEmailSubmit,
  isLoading
}) => {
  return (
    <Form {...signupEmailForm}>
      <form
        onSubmit={signupEmailForm.handleSubmit(handleEmailSubmit)}
        className="h-full flex flex-col justify-between"
      >
        <FormField
          control={signupEmailForm.control}
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
          className="w-full rounded-full bg-[#ff6b00] hover:bg-[#e55f00] py-5 mt-0.5"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
};

export default SignupEmailForm;