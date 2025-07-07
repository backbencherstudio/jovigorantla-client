import React from "react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Eye, EyeOff, Check } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface UserDetailsFormProps {
  signupDetailsForm: UseFormReturn<{
    username?: string;
    password?: string;
    confirmPassword?: string;
    otp?: string;
  }>;
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  redirectToLogin: () => void;
}

const UserDetailsForm = ({
  signupDetailsForm,
  isLoading,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  redirectToLogin,
}: UserDetailsFormProps) => {
  const { signUp } = useAuth();

  const otp = localStorage.getItem("otp");
  const email = localStorage.getItem("signupEmail");
  
  const onSubmit = async (data: { username?: string; password?: string; confirmPassword?: string }) => {
    if (!email || !otp) {
      toast.error("Registration failed", {
        description: "Email verification information not found. Please try again.",
      });
      return;
    }

    try {
      const success = await signUp(email, data.password!, data.username!, otp);

      if (success) {
        toast.success("Account created successfully!", {
          description: "You can now start using your account.",
        });
        // Clear sensitive data from localStorage
        localStorage.removeItem("otp");
        localStorage.removeItem("signupEmail");
        redirectToLogin()
      } else {
        toast.error("Registration failed", {
          description: "Please try again or contact support if the problem persists.",
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Registration failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <>
      <p className="text-sm text-gray-500 text-center">
        Fill in a few details to finish signing up.
      </p>
      <Form {...signupDetailsForm}>
        <form
          onSubmit={signupDetailsForm.handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col justify-between"
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
                    {field.value?.length >= 3 && (
                      <div className="absolute right-3 top-4 text-green-600">
                        <Check className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="h-5">
                    <FormMessage className="text-xs font-normal text-[#b3261e] ml-3 -mt-[6.5px]" />
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
                    {field.value?.length >= 6 && (
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
                    <FormMessage className="text-xs font-normal text-[#b3261e] ml-3 -mt-[6.5px]" />
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
                    {field.value?.length >= 6 &&
                      signupDetailsForm.watch("password") === field.value && (
                        <div className="absolute right-10 top-4 text-green-600">
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
                    <FormMessage className="text-xs font-normal text-[#b3261e] ml-3 -mt-[6.5px]" />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full  bg-[#ff6b00] hover:bg-[#e55f00] py-5 rounded-full"
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
