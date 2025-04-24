import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { OTPInput } from "@/components/ui/otp-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { FaFacebook } from "react-icons/fa";
import { Mail, Lock, Eye, EyeOff, X, User } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
}

const AuthModal = ({
  open,
  onOpenChange,
  defaultTab = "login",
}: AuthModalProps) => {
  const { signIn, signUp, signInWithProvider, resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isMobile = useIsMobile();

  // Add new state for signup steps
  const [signupStep, setSignupStep] = useState<"email" | "verify" | "details">(
    "email"
  );
  const [signupEmail, setSignupEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Define schema for login and signup forms
  const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });

  // Split signup schema into steps
  const signupEmailSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
  });

  const signupDetailsSchema = z
    .object({
      username: z
        .string()
        .min(3, { message: "Full name must be at least 3 characters" }),
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
      confirmPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const resetPasswordSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
  });

  // Create forms
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupEmailForm = useForm<z.infer<typeof signupEmailSchema>>({
    resolver: zodResolver(signupEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const signupDetailsForm = useForm<z.infer<typeof signupDetailsSchema>>({
    resolver: zodResolver(signupDetailsSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Login handler
  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(values.email, values.password);
      if (error) {
        toast.error("Login failed", {
          description: error.message,
        });
      } else {
        toast.success("Login successful");
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Login failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email submission
  const handleEmailSubmit = async (
    values: z.infer<typeof signupEmailSchema>
  ) => {
    setIsLoading(true);
    try {
      // Here you would typically send the email and request OTP
      // For now, we'll just move to the next step
      setSignupEmail(values.email);
      setSignupStep("verify");
      toast.success("Verification code sent to your email");
    } catch (error) {
      toast.error("Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (value: string) => {
    setIsLoading(true);
    try {
      // Here you would verify the OTP with your backend
      // For now, we'll just move to the next step
      setSignupStep("details");
      toast.success("Email verified successfully");
    } catch (error) {
      toast.error("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle final signup
  const handleDetailsSubmit = async (
    values: z.infer<typeof signupDetailsSchema>
  ) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(
        signupEmail,
        values.password,
        values.username
      );
      if (error) {
        toast.error("Signup failed", {
          description: error.message,
        });
      } else {
        toast.success("Signup successful");
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Signup failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OAuth signin
  const handleOAuthSignIn = async (provider: "google" | "facebook") => {
    try {
      const { error } = await signInWithProvider(provider);
      if (error) {
        toast.error(`${provider} sign-in failed`, {
          description: error.message,
        });
      }
    } catch (error) {
      toast.error(`${provider} sign-in failed`, {
        description: "An unexpected error occurred",
      });
    }
  };

  // Handle password reset
  const handleResetPassword = async (
    values: z.infer<typeof resetPasswordSchema>
  ) => {
    setIsLoading(true);
    try {
      const { error } = await resetPassword(values.email);
      if (error) {
        toast.error("Password reset failed", {
          description: error.message,
        });
      } else {
        toast.success("Password reset email sent", {
          description: "Check your email for a password reset link",
        });
        setForgotPassword(false);
      }
    } catch (error) {
      toast.error("Password reset failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset signup state when modal closes
  React.useEffect(() => {
    if (!open) {
      setSignupStep("email");
      setSignupEmail("");
      setOtp("");
      signupEmailForm.reset();
      signupDetailsForm.reset();
    }
  }, [open]);

  const renderMainContent = () => {
    // If we're in the middle of signup flow (verify or details), show full-screen content
    if (signupStep === "verify" || signupStep === "details") {
      return (
        <div className="w-full h-[500px] flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-md space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setSignupStep(signupStep === "verify" ? "email" : "verify")
                }
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
              <h2 className="text-2xl font-bold text-center flex-1 mt-10">
                {signupStep === "verify"
                  ? "Verify your email"
                  : "Complete your profile"}
              </h2>
              <div className="w-10" /> {/* Spacer for alignment */}
            </div>
            {signupStep === "verify" && (
              <>
                <p className="text-sm text-gray-500 text-center">
                  We've sent a verification code to
                  <br />
                  <span className="font-medium">{signupEmail}</span>
                </p>
                <div className="space-y-6 h-full flex flex-col justify-between">
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    onComplete={handleVerifyOTP}
                    disabled={isLoading}
                  />
                  <div className="text-center space-y-4">
                    <Button
                      onClick={() => setSignupStep("details")}
                      className="w-full  bg-[#ff6b00] hover:bg-[#e55f00] py-5"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {signupStep === "details" && (
              <>
                <p className="text-sm text-gray-500 text-center">
                  Please provide your details to complete the signup
                </p>
                <Form {...signupDetailsForm}>
                  <form
                    onSubmit={signupDetailsForm.handleSubmit(
                      handleDetailsSubmit
                    )}
                    className="space-y-4 h-full flex flex-col justify-between"
                  >
                    <div className="space-y-4">
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
                            </div>
                            <FormMessage />
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
                              <button
                                type="button"
                                tabIndex={-1}
                                className="absolute right-3 top-5 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            <FormMessage />
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
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  label="Confirm Password"
                                  {...field}
                                  disabled={isLoading}
                                  className="pl-3"
                                />
                              </FormControl>
                              <button
                                type="button"
                                tabIndex={-1}
                                className="absolute right-3 top-5 text-gray-400 hover:text-gray-600"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full  bg-[#ff6b00] hover:bg-[#e55f00] py-5"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </div>
        </div>
      );
    }

    // Otherwise show the regular login/signup tabs
    return (
      <div className="w-full h-[500px]">
        <div className="w-full text-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold mt-2 text-center">
            Login or Signup
          </h1>
          <p className="text-sm text-gray-600 mt-2 px-4">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-500 hover:underline">
              User Agreement
            </a>{" "}
            and acknowledge that you understand the{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <Card className="w-full shadow-none border-none bg-[#f8fafc]">
          <CardContent className="grid gap-4 p-0">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Social login buttons */}
              <div className="grid grid-cols-1 gap-3 mb-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={isLoading}
                  className="w-full py-5 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  {/* Google logo */}
                  <svg
                    className="mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  <span className="font-medium">Continue with Google</span>
                </Button>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>

              <TabsContent value="login" className="space-y-4">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(handleLogin)}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            {/* <Mail className="absolute left-3 top-5 h-4 w-4 text-gray-400 z-10" /> */}
                            <FormControl>
                              <FloatingInput
                                label="Email"
                                {...field}
                                disabled={isLoading}
                                className="pl-3"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            {/* <Lock className="absolute left-3 top-5 h-4 w-4 text-gray-400 z-10" /> */}
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
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full py-5 bg-[#ff6b00] hover:bg-[#e55f00]"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>

                <div className="text-center">
                  <Button
                    variant="link"
                    className="text-sm text-blue-400 p-0 hover:text-blue-700"
                    onClick={() => setForgotPassword(true)}
                  >
                    Forgot your password?
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <Form {...signupEmailForm}>
                  <form
                    onSubmit={signupEmailForm.handleSubmit(handleEmailSubmit)}
                    className="space-y-4"
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-[#ff6b00] hover:bg-[#e55f00] py-5"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Continue"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  const authContent = renderMainContent();

  // Use Drawer for mobile and Dialog for desktop
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[85vh]">
          <div className="absolute right-4 top-4 z-10">
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <div className="px-4 py-8 h-full">{authContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto p-3">
        <DialogClose className="absolute right-4 top-4 z-10">
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>
        <div className="p-6 h-full">{authContent}</div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
