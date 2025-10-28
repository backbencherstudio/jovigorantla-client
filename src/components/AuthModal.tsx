import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { X, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axois";
import LoginForm from "./Auth/LoginForm";
import SignupEmailForm from "./Auth/SignupEmailForm";
import SocialAuthButtons from "./Auth/SocialAuthButtons";
import ResetPasswordForm from "./Auth/ResetPasswordForm";
import ResetPasswordWithOTPForm from "./Auth/ResetPasswordWithOTPForm";
import AuthSteps from "./Auth/AutoSteps";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
}

const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onOpenChange,
  defaultTab = "login",
}) => {
  const {
    signIn,
    signUp,
    getFirstFile,
    setIsOpenPendingAfterLogin,
    setIsOpenSuccessAfterLogin,
    wipeDatabaseCompletely,
    setIsOpenErrorAfterLogin,
    signUpWithGoogle,
    forgotPassword: handleForgotPassword,
    setIsModalOpen,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const navigate = useNavigate();

  // State for signup steps
  const [signupStep, setSignupStep] = useState<"email" | "verify" | "details">(
    "email"
  );
  const [signupEmail, setSignupEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [signupSuccessfull, setSignupSuccessfull] = useState("");

  // Form schemas
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
      otp: z.string().min(6, "OTP must be at least 6 characters"),
      password: z
        .string()
        .min(8, "Password must be at least 6 characters long"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  // Form hooks
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

  //   useEffect(() => {
  //   const handleFocus = (e: Event) => {
  //     const activeElement = e.target as HTMLElement;
  //     if (
  //       activeElement.tagName === "INPUT" ||
  //       activeElement.tagName === "TEXTAREA" ||
  //       activeElement.tagName === "SELECT"
  //     ) {
  //       setTimeout(() => {
  //         activeElement.scrollIntoView({
  //           behavior: "smooth",
  //           block: "center",
  //         });
  //       }, 2000);
  //     }
  //   };

  //   document.addEventListener("focusin", handleFocus);
  //   return () => document.removeEventListener("focusin", handleFocus);
  // });

  // useEffect(() => {
  //   const handleResize = () => {
  //     // Only adjust if the modal is open
  //     if (open) {
  //       const visualViewport = window.visualViewport;
  //       if (visualViewport) {
  //         const modal = modalRef.current;
  //         if (modal) {
  //           // Center the modal in the remaining viewport space
  //           modal.style.top = `${visualViewport.height / 2 + visualViewport.offsetTop}px`;
  //         }
  //       }
  //     }
  //   };

  //   if (typeof window.visualViewport !== 'undefined') {
  //     window.visualViewport.addEventListener('resize', handleResize);
  //   }

  //   return () => {
  //     if (typeof window.visualViewport !== 'undefined') {
  //       window.visualViewport.removeEventListener('resize', handleResize);
  //     }
  //   };
  // }, [open]);

  // Reset forms when modal closes
  useEffect(() => {
    if (!open) {
      setSignupStep("email");
      setSignupEmail("");
      setOtp("");
      setForgotPassword(false);
      setActiveTab(defaultTab);
      setSignupSuccessfull("");

      // Reset all forms
      signupEmailForm.reset();
      signupDetailsForm.reset();
      loginForm.reset();
      resetPasswordForm.reset();

      // Clear errors
      loginForm.clearErrors();
      signupEmailForm.clearErrors();
      signupDetailsForm.clearErrors();
      resetPasswordForm.clearErrors();
    } else {
      setIsModalOpen?.(true);
    }
  }, [open]);

  // Login handler
  const [isUploading, setIsUploading] = useState(false);
  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const isSignIn = await signIn(values.email, values.password);
      if (!isSignIn) {
        loginForm.setError("password", {
          type: "manual",
          message: "Incorrect email or password",
        });
      } else {
        window.scrollTo(0, 0);
        onOpenChange(false);
        // window.location.reload();

        const afterLoginForm = localStorage.getItem("afterLogin");
        if (!afterLoginForm) {
          window.location.reload();
          return;
        }

        const formData = new FormData();

        const parsedForm = JSON.parse(afterLoginForm);
        for (const key in parsedForm) {
          formData.append(key, parsedForm[key]);
        }

        try {
          const image = await getFirstFile();
          if (image) {
            formData.append("image", image);
            setIsUploading(true);
          }
        } catch (error) {
          console.log("No image found or error getting image:", error);
          // Continue without image if there's an error
        }

        const response = await api.post("/listings", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        localStorage.removeItem("afterLogin");

        if (response.data.success) {
          setIsUploading(false);
          if (parsedForm.post_to_usa === "true") {
            setIsOpenPendingAfterLogin(true);
          } else {
            setIsOpenSuccessAfterLogin(true);
          }

          await wipeDatabaseCompletely();
        } else {
          setIsOpenErrorAfterLogin(true);
        }
      }
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email submission for signup
  const handleEmailSubmit = async (
    values: z.infer<typeof signupEmailSchema>
  ) => {
    setIsLoading(true);
    try {
      setSignupEmail(values.email);
      setSignupStep("verify");
      setResendDisabled(true);
      setResendTimer(60);
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
      // Your signup logic here
      toast.success("Signup successful");
      redirectToLogin();
    } catch (error) {
      toast.error("Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OAuth signin
  const handleOAuthSignIn = async (provider: "google") => {
    try {
      const isSignInOrSingUp = await signUpWithGoogle();
      if (!isSignInOrSingUp) {
        toast.error("Signup failed");
      } else {
        toast.success("Signup successful");
        onOpenChange(false);
      }
    } catch (error) {
      toast.error(`${activeTab === "login" ? "Login" : "Sign Up"} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset request
  const handleOpenResetPassword = async (
    values: z.infer<typeof resetPasswordSchema>
  ) => {
    try {
      setOpenResetPassword(true);
      setForgotPassword(false);
      setResetEmail(values.email);
      await handleForgotPassword(values.email);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    setResendDisabled(true);
    setResendTimer(60);
    resetForm.reset();
    await api.post("/auth/forgot-password", { email: resetEmail });
  };

  const handleSignResend = async () => {
    setResendDisabled(true);
    setResendTimer(60);
    await api.post("/auth/send-otp", { email: signupEmail });
  };

  // Handle password reset with OTP
  const handleReset = async (
    values: z.infer<typeof resetPasswordWithOtpSchema>
  ) => {
    try {
      const { data } = await api.post("/auth/reset-password", {
        email: resetEmail,
        token: values.otp,
        password: values.password,
      });

      if (data.success) {
        setOpenResetPassword(false);
        setActiveTab("login");
        setResetEmail("");
        setSignupSuccessfull("Password changed successfully!");
        resetForm.reset();
      } else {
        resetForm.setError("otp", {
          type: "manual",
          message: "Invalid OTP",
        });
      }
    } catch (err) {
      console.error("Reset failed", err);
    }
  };

  const redirectToLogin = () => {
    setSignupSuccessfull("Account created! You can now log in");
    setSignupStep("email");
    setActiveTab("login");
  };

  // Timer effect for resend button
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (resendTimer === 0 && resendDisabled) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendTimer, resendDisabled]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    setIsModalOpen?.(newOpen);
  };

  // Render the appropriate form based on state
  const renderMainContent = () => {
    if (openResetPassword) {
      return (
        <ResetPasswordWithOTPForm
          resetForm={resetForm}
          handleReset={handleReset}
          isLoading={isLoading}
          setBackToEmailForm={() => {
            setOpenResetPassword(false);
            setForgotPassword(true);
          }}
          resendTimer={resendTimer}
          resendDisabled={resendDisabled}
          handleResend={handleResend}
        />
      );
    }

    if (forgotPassword) {
      return (
        <ResetPasswordForm
          resetPasswordForm={resetPasswordForm}
          handleResetPassword={handleOpenResetPassword}
          isLoading={isLoading}
          setForgotPassword={setForgotPassword}
        />
      );
    }

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
          handleResend={handleSignResend}
          signupDetailsForm={signupDetailsForm}
          handleDetailsSubmit={handleDetailsSubmit}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          redirectToLogin={redirectToLogin}
        />
      );
    }

    return (
      <div className="auth-modal-content">
        <div className="auth-header">
          <h1 className="text-xl md:text-2xl font-bold mt-2 text-center">
            Login or Signup
          </h1>
          <p className="auth-terms">
            By continuing, you agree to our{" "}
            <Link to="/user-agreement" target="_blank" className="auth-link">
              User Agreement
            </Link>{" "}
            and acknowledge that you understand the{" "}
            <Link to="/privacy-policy" target="_blank" className="auth-link">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="auth-tabs">
          <div className="tab-buttons inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid w-full grid-cols-2 mb-4">
            <button
              className={`tab-button rounded-sm ${
                activeTab === "login" ? "active" : ""
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`tab-button rounded-sm ${
                activeTab === "signup" ? "active" : ""
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          <div className="social-auth">
            <button
              className="social-button google w-full rounded-full flex items-center justify-between py-5 border-gray-300 bg-white hover:bg-gray-50 hover:border-[#ff7417] transition-all"
              onClick={() => handleOAuthSignIn("google")}
              disabled={isLoading}
            >
              <img src="/google.svg" alt="Google" />
              <span className="font-medium text-black">
                Continue with Google
              </span>
            </button>
          </div>
          {/* <SocialAuthButtons
            isLoading={isLoading}
            handleOAuthSignIn={handleOAuthSignIn}
          /> */}

          <div className="divider">
            <span>OR</span>
          </div>

          {activeTab === "login" ? (
            <LoginForm
              loginForm={loginForm}
              handleLogin={handleLogin}
              isLoading={isLoading}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              setForgotPassword={setForgotPassword}
              signupSuccessfull={signupSuccessfull}
            />
          ) : (
            <SignupEmailForm
              signupEmailForm={signupEmailForm}
              handleEmailSubmit={handleEmailSubmit}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    );
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Handle overlay click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Handle animations
  useEffect(() => {
    if (open) {
      setShowModal(true);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setShowModal(false);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!showModal) return null;

  return (
    <>
      <div
        className={`auth-modal-overlay ${open ? "open" : ""} ${
          isAnimating ? "animating" : ""
        }`}
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className={`auth-modal ${open ? "open" : ""} ${
          isAnimating ? "animating" : ""
        }`}
      >
        <button className="close-button" onClick={handleClose}>
          <X className="h-4 w-4 text-black" />
        </button>
        {renderMainContent()}
      </div>
    </>
  );
};

export default AuthModal;
