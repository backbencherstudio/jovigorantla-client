import React from "react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Eye, EyeOff, Check } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const UserDetailsForm = ({
  signupDetailsForm,
  handleDetailsSubmit,
  isLoading,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword
}) => {
  return (
    <>
      <p className="text-sm text-gray-500 text-center">
        Please provide your details to complete the signup
      </p>
      <Form {...signupDetailsForm}>
        <form
          onSubmit={signupDetailsForm.handleSubmit(handleDetailsSubmit)}
          className="space-y-4 h-full flex flex-col justify-between"
        >
          <div className="space-y-1">
            <FormField
              control={signupDetailsForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <FloatingInput
                        label="Full Name"
                        {...field}
                        disabled={isLoading}
                        className="pl-3"
                      />
                    </FormControl>
                    {field.value.length >= 3 && (
                      <div className="absolute right-3 top-4 text-green-600">
                        <Check className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="h-5">
                    <FormMessage className="text-xs font-normal text-red-700 ml-3" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={signupDetailsForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <FloatingInput
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        {...field}
                        disabled={isLoading}
                        className="pl-3"
                      />
                    </FormControl>
                    {field.value.length >= 6 && (
                      <div className="absolute right-10 top-4 text-green-600">
                        <Check className="h-5 w-5" />
                      </div>
                    )}
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="h-5">
                    <FormMessage className="text-xs font-normal text-red-700 ml-3" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={signupDetailsForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <FloatingInput
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm Password"
                        {...field}
                        disabled={isLoading}
                        className="pl-3"
                      />
                    </FormControl>
                    {field.value.length >= 6 &&
                      signupDetailsForm.watch("password") === field.value && (
                        <div className="absolute right-10 top-4 text-green-500">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="h-5">
                    <FormMessage className="text-xs font-normal text-red-700 ml-3" />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#ff6b00] hover:bg-[#e55f00] py-5 rounded-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default UserDetailsForm;