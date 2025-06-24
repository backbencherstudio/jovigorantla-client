import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { TrendingUpIcon, X } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ResetPasswordForm from "./Auth/ResetPasswordForm";
import AuthSteps from "./Auth/AutoSteps";
import SocialAuthButtons from "./Auth/SocialAuthButtons";
import LoginForm from "./Auth/LoginForm";
import SignupEmailForm from "./Auth/SignupEmailForm";
import { useNavigate } from "react-router-dom";
import ResetPasswordWithOTPForm from "./Auth/ResetPasswordWithOTPForm";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab: "login" | "signup";
}

const AuthModal = ({
  open,
  onOpenChange,
  defaultTab = "login",
}: AuthModalProps) => {
  const { signIn, signUp,  signUpWithGoogle, resetPassword, forgotPassword: handleForgotPassword} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  // State for signup steps
  const [signupStep, setSignupStep] = useState<"email" | "verify" | "details">(
    "email"
  );
  const [signupEmail, setSignupEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("");


  useEffect(() => {
    if (!open) {
      setSignupStep("email");
      setSignupEmail("");
      setOtp("");
      setForgotPassword(false);
      setActiveTab(defaultTab);

      // Reset all forms including their error states
      signupEmailForm.reset();
      signupDetailsForm.reset();
      loginForm.reset();
      resetPasswordForm.reset();

      // Clear errors for all forms
      loginForm.clearErrors();
      signupEmailForm.clearErrors();
      signupDetailsForm.clearErrors();
      resetPasswordForm.clearErrors();
    }
  }, [open]);

  // Define schemas for forms
  const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });

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



const resetPasswordWithOtpSchema = z
  .object({
    otp: z.string().min(6, "OTP must be at least 4 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });


  // Create forms
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupEmailForm = useForm<z.infer<typeof signupEmailSchema>>({
    resolver: zodResolver(signupEmailSchema),
    defaultValues: { email: "" },
  });

  const signupDetailsForm = useForm<z.infer<typeof signupDetailsSchema>>({
    resolver: zodResolver(signupDetailsSchema),
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<z.infer<typeof resetPasswordWithOtpSchema>>({
    resolver: zodResolver(resetPasswordWithOtpSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });



  // Login handler
  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const isSignIn = await signIn(values.email, values.password);
      if (!isSignIn) {
        toast.error("Login failed", {
          description: "Please enter correct email and password",
          className: "bg-red-700 text-white border-none",
        });
      } else {
        toast.success('Login successful', {
          className: 'bg-green-700 text-white border-none text-center',
        });
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Login failed", {
        description: "Username or Password May be Wrong",
        className: "bg-red-700 text-white border-none",
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
      setSignupEmail(values.email);
      setSignupStep("verify");
      // Start the resend timer
      setResendDisabled(true);
      //TODO: opt setResendTimer(120);
      setResendTimer(120);
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
    setTimeout(() => {
      try {
        setSignupStep("details");
        toast.success("Email verified successfully");
      } catch (error) {
        toast.error("Invalid verification code");
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  // Handle final signup
  const handleDetailsSubmit = async (
    values: z.infer<typeof signupDetailsSchema>
  ) => {
    setIsLoading(true);
    try {
      const isSignUp = await signUp(
        signupEmail,
        values.password,
        values.username,
      );
      if (isSignUp) {
        toast.error("Signup failed", { description: "Signup failed" });
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
    // try {
    //   const { error } = await signInWithProvider(provider);
    //   if (error) {
    //     toast.error(`${provider} sign-in failed`, {
    //       description: error.message,
    //     });
    //   }
    // } catch (error) {
    //   toast.error(`${provider} sign-in failed`, {
    //     description: "An unexpected error occurred",
    //   });
    // }

    try {
    

      const isSignInOrSingUp = await signUpWithGoogle()
      if (!isSignInOrSingUp) {
        toast.error("Signup failed", { description: "Signup failed" });
      } else {
        toast.success("Signup successful");
        onOpenChange(false);
      }
    } catch (error) {
      toast.error(`${activeTab === 'login'? 'Login':  'Sign Up'} failed`, {
        description: "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }




  };

  // Handle password reset
  const handleResetPassword = async (
    values: z.infer<typeof resetPasswordSchema>
  ) => {
    setSignupStep("verify");
    setIsLoading(true);
    setResendDisabled(true);
    setResendTimer(60);
    try {
      await handleForgotPassword(values.email);
      setForgotPassword(false);
    } catch (error) {
      toast.error("Password reset failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
   try {
    setOpenResetPassword(true);
    setForgotPassword(false);
    setResetEmail(values.email);
    await handleForgotPassword(values.email);
   } catch (error) {
    console.log(error)
   }
  }

  // Handle resend OTP
  const handleResend = () => {
    setResendDisabled(true);
    setResendTimer(60);
    toast.success("Verification code resent to your email");
  };

  const handleReset = async (values: z.infer<typeof resetPasswordWithOtpSchema>) => {
    try {
      // API call to reset password with values.otp, values.password
      console.log(values);
    } catch (err) {
      console.error("Reset failed", err);
    }
  };

  // Timer effect for resend button
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (resendTimer === 0 && resendDisabled) {
      setResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [resendTimer, resendDisabled]);

  const renderMainContent = () => {

    // Show Reset Password form
    if (openResetPassword) {
      return <ResetPasswordWithOTPForm 
        resetForm={resetForm}
        handleReset={handleReset}
        isLoading={isLoading}
        setBackToEmailForm={setOpenResetPassword}
      />
    }
    // Show forgot password form
    if (forgotPassword) {
      return (
        <ResetPasswordForm
          resetPasswordForm={resetPasswordForm}
          handleResetPassword={handleResetPassword}
          isLoading={isLoading}
          setForgotPassword={setForgotPassword}
        />
      );
    }

    // Show signup steps (verify email or enter details)
    if (signupStep === "verify" || signupStep === "details") {
      return (
        <AuthSteps
          signupStep={signupStep}
          setSignupStep={setSignupStep}
          otp={otp}
          setOtp={setOtp}
          isLoading={isLoading}
          handleVerifyOTP={handleVerifyOTP}
          resendTimer={resendTimer}
          resendDisabled={resendDisabled}
          handleResend={handleResend}
          signupDetailsForm={signupDetailsForm}
          handleDetailsSubmit={handleDetailsSubmit}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
        />
      );
    }

    // Show login/signup tabs
    return (
      <div className="w-full h-[500px] bg-white">
        <div className="w-full text-center mb-6 bg-white">
          <h1 className="text-xl md:text-2xl font-bold mt-2 text-center">
            Login or Signup
          </h1>
          <p className="text-sm text-gray-600 mt-2 px-4">
            By continuing, you agree to our{" "}
            <p
              onClick={() => navigate("/user-agreement")}
              className="text-blue-500 hover:underline inline cursor-pointer"
            >
              User Agreement
            </p>{" "}
            and acknowledge that you understand the{" "}
            <p
              onClick={() => navigate("/privacy-policy")}
              className="text-blue-500 inline hover:underline cursor-pointer"
            >
              Privacy Policy
            </p>
            .
          </p>
        </div>

        <Card className="w-full shadow-none border-none bg-white">
          <CardContent className="grid gap-4 p-0 bg-white">
            <Tabs
              defaultValue={defaultTab}
              value={activeTab}
              onValueChange={(value: "login" | "signup") => setActiveTab(value)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Social login buttons */}
              <SocialAuthButtons
                handleOAuthSignIn={handleOAuthSignIn}
                isLoading={isLoading}
              />

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
                <LoginForm
                  loginForm={loginForm}
                  handleLogin={handleLogin}
                  isLoading={isLoading}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  setForgotPassword={setForgotPassword}
                />
              </TabsContent>

              <TabsContent value="signup" className="h-full">
                <SignupEmailForm
                  signupEmailForm={signupEmailForm}
                  handleEmailSubmit={handleEmailSubmit}
                  isLoading={isLoading}
                />
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
        <DrawerContent className="h-[100vh] bg-white">
          <div className="absolute right-4 top-4 z-10">
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <div className="px-4 py-8 h-full bg-white">{authContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto p-3 bg-white">

        <DialogClose className="absolute right-4 top-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-800 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>
        <div className="p-6 h-full bg-white">{authContent}</div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
