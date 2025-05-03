import React from "react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const LoginForm = ({
  loginForm,
  handleLogin,
  isLoading,
  showPassword,
  setShowPassword,
  setForgotPassword,
}) => {
  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(handleLogin)}
        className="h-full flex flex-col justify-between"
      >
        <div className="space-y-1">
          <FormField
            control={loginForm.control}
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
                  <FormMessage className="text-xs text-[#b3261e] font-normal ml-3 -mt-[6.5px]" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={loginForm.control}
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
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 -mt-0.5" />
                    ) : (
                      <Eye className="h-4 w-4 -mt-0.5" />
                    )}
                  </button>
                </div>
                <div className="h-5">
                  <FormMessage className="text-xs text-[#b3261e] font-normal ml-3 -mt-[6.5px]" />
                </div>
              </FormItem>
            )}
          />
          <div className="text-center w-[92%] md:w-full absolute md:static bottom-16">
            <Button
              variant="link"
              className="text-sm text-[#3b82f6] p-0 hover:text-blue-600 font-normal mt-5"
              onClick={() => setForgotPassword(true)}
            >
              Forgot your password?
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          className=" w-[92%] md:w-full absolute md:static bottom-5 py-5 bg-[#ff6b00] hover:bg-[#e55f00] rounded-full mt-1 "
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
