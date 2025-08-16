// import React, { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useAuth } from "@/context/AuthContext";
// import { TrendingUpIcon, X } from "lucide-react";
// import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
// import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import ResetPasswordForm from "./Auth/ResetPasswordForm";
// import AuthSteps from "./Auth/AutoSteps";
// import SocialAuthButtons from "./Auth/SocialAuthButtons";
// import LoginForm from "./Auth/LoginForm";
// import SignupEmailForm from "./Auth/SignupEmailForm";
// import { useNavigate } from "react-router-dom";
// import ResetPasswordWithOTPForm from "./Auth/ResetPasswordWithOTPForm";
// import { api } from "@/lib/axois";

// interface AuthModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   defaultTab: "login" | "signup";
// }

// const AuthModal = ({
//   open,
//   onOpenChange,
//   defaultTab = "login",
// }: AuthModalProps) => {
//   const { signIn, signUp,  signUpWithGoogle, resetPassword, forgotPassword: handleForgotPassword} = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [forgotPassword, setForgotPassword] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
//   const isMobile = useIsMobile();
//   const navigate = useNavigate();
//   // State for signup steps
//   const [signupStep, setSignupStep] = useState<"email" | "verify" | "details">(
//     "email"
//   );
//   const [signupEmail, setSignupEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [resendTimer, setResendTimer] = useState<number>(60);
//   const [resendDisabled, setResendDisabled] = useState(false);
//   const [openResetPassword, setOpenResetPassword] = useState(false)
//   const [resetEmail, setResetEmail] = useState("");
//   const [signupSuccessfull, setSignupSuccessfull] = useState("")

//   useEffect(() => {
//     if (!open) {
//       setSignupStep("email");
//       setSignupEmail("");
//       setOtp("");
//       setForgotPassword(false);
//       setActiveTab(defaultTab);

//       // Reset all forms including their error states
//       signupEmailForm.reset();
//       signupDetailsForm.reset();
//       loginForm.reset();
//       resetPasswordForm.reset();

//       // Clear errors for all forms
//       loginForm.clearErrors();
//       signupEmailForm.clearErrors();
//       signupDetailsForm.clearErrors();
//       resetPasswordForm.clearErrors();
//     }
//   }, [open]);

//   // Define schemas for forms
//   const loginSchema = z.object({
//     email: z.string().email({ message: "Please enter a valid email address" }),
//     password: z
//       .string()
//       .min(6, { message: "Password must be at least 6 characters" }),
//   });

//   const signupEmailSchema = z.object({
//     email: z.string().email({ message: "Please enter a valid email address" }),
//   });

//   const signupDetailsSchema = z
//     .object({
//       username: z
//         .string()
//         .min(3, { message: "Full name must be at least 3 characters" }),
//       password: z
//         .string()
//         .min(6, { message: "Password must be at least 6 characters" }),
//       confirmPassword: z
//         .string()
//         .min(6, { message: "Password must be at least 6 characters" }),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//       message: "Passwords don't match",
//       path: ["confirmPassword"],
//     });

//   const resetPasswordSchema = z.object({
//     email: z.string().email({ message: "Please enter a valid email address" }),
//   });

// const resetPasswordWithOtpSchema = z
//   .object({
//     otp: z.string().min(6, "OTP must be at least 4 characters"),
//     password: z
//       .string()
//       .min(8, "Password must be at least 6 characters long"),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match",
//   });

//   // Create forms
//   const loginForm = useForm<z.infer<typeof loginSchema>>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { email: "", password: "" },
//   });

//   const signupEmailForm = useForm<z.infer<typeof signupEmailSchema>>({
//     resolver: zodResolver(signupEmailSchema),
//     defaultValues: { email: "" },
//   });

//   const signupDetailsForm = useForm<z.infer<typeof signupDetailsSchema>>({
//     resolver: zodResolver(signupDetailsSchema),
//     defaultValues: { username: "", password: "", confirmPassword: "" },
//   });

//   const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
//     resolver: zodResolver(resetPasswordSchema),
//     defaultValues: { email: "" },
//   });

//   const resetForm = useForm<z.infer<typeof resetPasswordWithOtpSchema>>({
//     resolver: zodResolver(resetPasswordWithOtpSchema),
//     defaultValues: {
//       otp: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   // Login handler
//   const handleLogin = async (values: z.infer<typeof loginSchema>) => {
//     setIsLoading(true);
//     try {
//       const isSignIn = await signIn(values.email, values.password);

//       if (!isSignIn) {
//         loginForm.setError("password", {
//           type: "manual",
//           message: "Incorrect email or password",
//         });
//         // toast.error("Login failed", {
//         //   description: "Please enter correct email and password",
//         //   className: "bg-red-700 text-white border-none",
//         // });
//       } else {
//         // toast.success('Login successful', {
//         //   className: 'bg-green-700 text-white border-none text-center',
//         // });
//         onOpenChange(false);
//       }
//     } catch (error) {
//       // toast.error("Login failed", {
//       //   description: "Username or Password May be Wrong",
//       //   className: "bg-red-700 text-white border-none",
//       // });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle email submission
//   const handleEmailSubmit = async (
//     values: z.infer<typeof signupEmailSchema>
//   ) => {
//     setIsLoading(true);
//     try {
//       setSignupEmail(values.email);
//       setSignupStep("verify");
//       // Start the resend timer
//       setResendDisabled(true);
//       //TODO: opt setResendTimer(120);
//       setResendTimer(100);
//       toast.success("Verification code sent to your email");
//     } catch (error) {
//       toast.error("Failed to send verification code");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle OTP verification
//   const handleVerifyOTP = async (value: string) => {
//     setIsLoading(true);
//     setTimeout(() => {
//       try {
//         setSignupStep("details");
//         toast.success("Email verified successfully");
//       } catch (error) {
//         toast.error("Invalid verification code");
//       } finally {
//         setIsLoading(false);
//       }
//     }, 1500);
//   };

//   // Handle final signup
//   const handleDetailsSubmit = async (
//     values: z.infer<typeof signupDetailsSchema>
//   ) => {
//     setIsLoading(true);
//     try {
//       // const isSignUp = await signUp(
//       //   signupEmail,
//       //   values.password,
//       //   values.username,
//       // );
//       // if (isSignUp) {
//       //   toast.error("Signup failed", { description: "Signup failed" });
//       // } else {
//       //   toast.success("Signup successful");
//       //   onOpenChange(false);
//       // }
//     } catch (error) {
//       toast.error("Signup failed", {
//         description: "An unexpected error occurred",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle OAuth signin
//   const handleOAuthSignIn = async (provider: "google" | "facebook") => {
//     // try {
//     //   const { error } = await signInWithProvider(provider);
//     //   if (error) {
//     //     toast.error(`${provider} sign-in failed`, {
//     //       description: error.message,
//     //     });
//     //   }
//     // } catch (error) {
//     //   toast.error(`${provider} sign-in failed`, {
//     //     description: "An unexpected error occurred",
//     //   });
//     // }

//     try {

//       const isSignInOrSingUp = await signUpWithGoogle()
//       if (!isSignInOrSingUp) {
//         toast.error("Signup failed", { description: "Signup failed" });
//       } else {
//         toast.success("Signup successful");
//         onOpenChange(false);
//       }
//     } catch (error) {
//       toast.error(`${activeTab === 'login'? 'Login':  'Sign Up'} failed`, {
//         description: "Something went wrong",
//       });
//     } finally {
//       setIsLoading(false);
//     }

//   };

//   // Handle password reset
//   const handleResetPassword = async (
//     values: z.infer<typeof resetPasswordSchema>
//   ) => {
//     setSignupStep("verify");
//     setIsLoading(true);
//     setResendDisabled(true);
//     setResendTimer(100);
//     try {
//       await handleForgotPassword(values.email);
//       setForgotPassword(false);
//     } catch (error) {
//       toast.error("Password reset failed", {
//         description: "An unexpected error occurred",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOpenResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
//    try {
//     setOpenResetPassword(true);
//     setForgotPassword(false);
//     setResetEmail(values.email);
//     await handleForgotPassword(values.email);
//    } catch (error) {
//     console.log(error)
//    }
//   }

//   // Handle resend OTP
//   const handleResend = async () => {
//     setResendDisabled(true);
//     setResendTimer(100);
//     resetForm.reset();
//     const res = await api.post('/auth/forgot-password', {
//       email: resetEmail
//     })
//     console.log(res)
//   };

//   const handleSignResend = async () => {
//     setResendDisabled(true);
//     setResendTimer(100);
//     const res = await api.post('/auth/send-otp', {
//       email: signupEmail
//     })
//     console.log(res)
//   };

//   const handleReset = async (values: z.infer<typeof resetPasswordWithOtpSchema>) => {
//     try {
//       // API call to reset password with values.otp, values.password
//       const { data } = await api.post('/auth/reset-password', {
//         "email": resetEmail,
//         "token": values.otp,
//         "password": values.password
//       })

//       if(data.success){
//         setOpenResetPassword(false);
//         setActiveTab('login')
//         setResetEmail('')
//         resetForm.reset();
//       }else{
//         resetForm.setError("otp", {
//           type: "manual",
//           message: "Invalid OTP",
//         });
//       }
//       console.log(values, resetEmail);
//     } catch (err) {
//       console.error("Reset failed", err);
//     }
//   };

//   const redirectToLogin = () => {
//     setSignupSuccessfull("Signup successfull")
//     setSignupStep("email");
//     setActiveTab('login')
//   }

//   // Timer effect for resend button
//   useEffect(() => {
//     let interval;
//     if (resendTimer > 0) {
//       interval = setInterval(() => {
//         setResendTimer((prevTimer) => prevTimer - 1);
//       }, 1000);
//     } else if (resendTimer === 0 && resendDisabled) {
//       setResendDisabled(false);
//     }

//     return () => clearInterval(interval);
//   }, [resendTimer, resendDisabled]);

//   const renderMainContent = () => {

//     // Show Reset Password form
//     if (openResetPassword) {
//       return <ResetPasswordWithOTPForm
//         resetForm={resetForm}
//         handleReset={handleReset}
//         isLoading={isLoading}
//         setBackToEmailForm={() => {
//           setOpenResetPassword(false);
//           setForgotPassword(true)
//         }}
//         resendTimer={resendTimer}
//         resendDisabled={resendDisabled}
//         handleResend={handleResend}
//       />
//     }
//     // Show forgot password form
//     if (forgotPassword) {
//       return (
//         <ResetPasswordForm
//           resetPasswordForm={resetPasswordForm}
//           handleResetPassword={handleOpenResetPassword}
//           isLoading={isLoading}
//           setForgotPassword={setForgotPassword}
//         />
//       );
//     }

//     // Show signup steps (verify email or enter details)
//     if (signupStep === "verify" || signupStep === "details") {
//       return (
//         <AuthSteps
//           signupStep={signupStep}
//           setSignupStep={setSignupStep}
//           otp={otp}
//           setOtp={setOtp}
//           isLoading={isLoading}
//           handleVerifyOTP={handleVerifyOTP}
//           resendTimer={resendTimer}
//           resendDisabled={resendDisabled}
//           handleResend={handleSignResend}
//           signupDetailsForm={signupDetailsForm}
//           handleDetailsSubmit={handleDetailsSubmit}
//           showPassword={showPassword}
//           setShowPassword={setShowPassword}
//           showConfirmPassword={showConfirmPassword}
//           setShowConfirmPassword={setShowConfirmPassword}
//           redirectToLogin={redirectToLogin}
//         />
//       );
//     }

//     // Show login/signup tabs
//     return (
//       <div className="w-full bg-white">
//         <div className="w-full text-center mb-6 bg-white">
//           <h1 className="text-xl md:text-2xl font-bold mt-2 text-center">
//             Login or Signup
//           </h1>
//           <p className="text-sm text-gray-600 mt-2 px-4">
//             By continuing, you agree to our{" "}
//             <p
//               onClick={() => navigate("/user-agreement")}
//               className="text-blue-500 hover:underline inline cursor-pointer"
//             >
//               User Agreement
//             </p>{" "}
//             and acknowledge that you understand the{" "}
//             <p
//               onClick={() => navigate("/privacy-policy")}
//               className="text-blue-500 inline hover:underline cursor-pointer"
//             >
//               Privacy Policy
//             </p>
//             .
//           </p>
//         </div>

//         <Card className="w-full shadow-none border-none bg-white">
//           <CardContent className="grid gap-4 p-0 bg-white">
//             <Tabs
//               defaultValue={defaultTab}
//               value={activeTab}
//               onValueChange={(value: "login" | "signup") => setActiveTab(value)}
//               className="w-full"
//             >
//               <TabsList className="grid w-full grid-cols-2 mb-4">
//                 <TabsTrigger value="login">Login</TabsTrigger>
//                 <TabsTrigger value="signup">Sign Up</TabsTrigger>
//               </TabsList>

//               {/* Social login buttons */}
//               <SocialAuthButtons
//                 handleOAuthSignIn={handleOAuthSignIn}
//                 isLoading={isLoading}
//               />

//               <div className="relative mb-4">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t" />
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-background px-2 text-muted-foreground">
//                     or
//                   </span>
//                 </div>
//               </div>

//               <TabsContent value="login" className="space-y-4">
//                 <LoginForm
//                   loginForm={loginForm}
//                   handleLogin={handleLogin}
//                   isLoading={isLoading}
//                   showPassword={showPassword}
//                   setShowPassword={setShowPassword}
//                   setForgotPassword={setForgotPassword}
//                   signupSuccessfull={signupSuccessfull}
//                 />
//               </TabsContent>

//               <TabsContent value="signup" className="h-full">
//                 <SignupEmailForm
//                   signupEmailForm={signupEmailForm}
//                   handleEmailSubmit={handleEmailSubmit}
//                   isLoading={isLoading}
//                 />
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   };

//   const authContent = renderMainContent();

//   // Use Drawer for mobile and Dialog for desktop
//   if (isMobile) {
//     return (
//       <Drawer open={open} onOpenChange={onOpenChange}>
//         <DrawerContent className="h-[80vh] bg-white">
//           <div className="absolute right-4 top-4 z-10">
//             <DrawerClose asChild>
//               <Button variant="ghost" size="icon">
//                 <X className="h-4 w-4" />
//               </Button>
//             </DrawerClose>
//           </div>
//           <div className="px-4 py-8 h-full bg-white">{authContent}</div>
//         </DrawerContent>
//       </Drawer>
//     );
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto p-3 bg-white">

//         <DialogClose className="absolute right-4 top-4 z-10">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="text-gray-800 rounded-full"
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </DialogClose>
//         <div className="p-6 h-full bg-white">{authContent}</div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AuthModal;

// import React, { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useAuth } from "@/context/AuthContext";
// import { TrendingUpIcon, X } from "lucide-react";
// import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
// import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import ResetPasswordForm from "./Auth/ResetPasswordForm";
// import AuthSteps from "./Auth/AutoSteps";
// import SocialAuthButtons from "./Auth/SocialAuthButtons";
// import LoginForm from "./Auth/LoginForm";
// import SignupEmailForm from "./Auth/SignupEmailForm";
// import { Link, useNavigate } from "react-router-dom";
// import ResetPasswordWithOTPForm from "./Auth/ResetPasswordWithOTPForm";
// import { api } from "@/lib/axois";

// interface AuthModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   defaultTab: "login" | "signup";
// }

// const AuthModal = ({
//   open,
//   onOpenChange,
//   defaultTab = "login",
// }: AuthModalProps) => {
//   const {
//     signIn,
//     signUp,
//     signUpWithGoogle,
//     resetPassword,
//     forgotPassword: handleForgotPassword,
//     setIsModalOpen,
//   } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [forgotPassword, setForgotPassword] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
//   const isMobile = useIsMobile();
//   const navigate = useNavigate();

//   // State for managing viewport height
//   const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

//   // State for signup steps
//   const [signupStep, setSignupStep] = useState<"email" | "verify" | "details">(
//     "email"
//   );
//   const [signupEmail, setSignupEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [resendTimer, setResendTimer] = useState<number>(60);
//   const [resendDisabled, setResendDisabled] = useState(false);
//   const [openResetPassword, setOpenResetPassword] = useState(false);
//   const [resetEmail, setResetEmail] = useState("");
//   const [signupSuccessfull, setSignupSuccessfull] = useState("");

//   // Fix for mobile keyboard height issue
//   useEffect(() => {
//     const handleResize = () => {
//       // Only update height if it's getting larger (keyboard closing)
//       // This prevents the modal from shrinking when keyboard opens
//       if (window.innerHeight > viewportHeight) {
//         setViewportHeight(window.innerHeight);
//       }
//     };

//     // Set initial height
//     setViewportHeight(window.innerHeight);

//     // Listen for resize events
//     window.addEventListener("resize", handleResize);
//     window.addEventListener("orientationchange", () => {
//       setTimeout(() => setViewportHeight(window.innerHeight), 100);
//     });

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       window.removeEventListener("orientationchange", () => {
//         setTimeout(() => setViewportHeight(window.innerHeight), 100);
//       });
//     };
//   }, [viewportHeight]);

//   useEffect(() => {
//     if (!open) {
//       setSignupStep("email");
//       setSignupEmail("");
//       setOtp("");
//       setForgotPassword(false);
//       setActiveTab(defaultTab);
//       setSignupSuccessfull("");

//       // Reset all forms including their error states
//       signupEmailForm.reset();
//       signupDetailsForm.reset();
//       loginForm.reset();
//       resetPasswordForm.reset();

//       // Clear errors for all forms
//       loginForm.clearErrors();
//       signupEmailForm.clearErrors();
//       signupDetailsForm.clearErrors();
//       resetPasswordForm.clearErrors();
//     } else {
//       setIsModalOpen(true);
//     }
//   }, [open]);

//   // Define schemas for forms
//   const loginSchema = z.object({
//     email: z.string().email({ message: "Please enter a valid email address" }),
//     password: z
//       .string()
//       .min(6, { message: "Password must be at least 6 characters" }),
//   });

//   const signupEmailSchema = z.object({
//     email: z.string().email({ message: "Please enter a valid email address" }),
//   });

//   const signupDetailsSchema = z
//     .object({
//       username: z
//         .string()
//         .min(3, { message: "Full name must be at least 3 characters" }),
//       password: z
//         .string()
//         .min(6, { message: "Password must be at least 6 characters" }),
//       confirmPassword: z
//         .string()
//         .min(6, { message: "Password must be at least 6 characters" }),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//       message: "Passwords don't match",
//       path: ["confirmPassword"],
//     });

//   const resetPasswordSchema = z.object({
//     email: z.string().email({ message: "Please enter a valid email address" }),
//   });

//   const resetPasswordWithOtpSchema = z
//     .object({
//       otp: z.string().min(6, "OTP must be at least 6 characters"),
//       password: z
//         .string()
//         .min(8, "Password must be at least 6 characters long"),
//       confirmPassword: z.string(),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//       path: ["confirmPassword"],
//       message: "Passwords do not match",
//     });

//   // Create forms
//   const loginForm = useForm<z.infer<typeof loginSchema>>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { email: "", password: "" },
//   });

//   const signupEmailForm = useForm<z.infer<typeof signupEmailSchema>>({
//     resolver: zodResolver(signupEmailSchema),
//     defaultValues: { email: "" },
//   });

//   const signupDetailsForm = useForm<z.infer<typeof signupDetailsSchema>>({
//     resolver: zodResolver(signupDetailsSchema),
//     defaultValues: { username: "", password: "", confirmPassword: "" },
//   });

//   const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
//     resolver: zodResolver(resetPasswordSchema),
//     defaultValues: { email: "" },
//   });

//   const resetForm = useForm<z.infer<typeof resetPasswordWithOtpSchema>>({
//     resolver: zodResolver(resetPasswordWithOtpSchema),
//     defaultValues: {
//       otp: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   // Login handler
//   const handleLogin = async (values: z.infer<typeof loginSchema>) => {
//     setIsLoading(true);
//     try {
//       const isSignIn = await signIn(values.email, values.password);

//       if (!isSignIn) {
//         loginForm.setError("password", {
//           type: "manual",
//           message: "Incorrect email or password",
//         });
//       } else {
//         onOpenChange(false);
//       }
//     } catch (error) {
//       // Handle error
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle email submission
//   const handleEmailSubmit = async (
//     values: z.infer<typeof signupEmailSchema>
//   ) => {
//     setIsLoading(true);
//     try {
//       setSignupEmail(values.email);
//       setSignupStep("verify");
//       setResendDisabled(true);
//       setResendTimer(100);
//       toast.success("Verification code sent to your email");
//     } catch (error) {
//       toast.error("Failed to send verification code");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle OTP verification
//   const handleVerifyOTP = async (value: string) => {
//     setIsLoading(true);
//     setTimeout(() => {
//       try {
//         setSignupStep("details");
//         toast.success("Email verified successfully");
//       } catch (error) {
//         toast.error("Invalid verification code");
//       } finally {
//         setIsLoading(false);
//       }
//     }, 1500);
//   };

//   // Handle final signup
//   const handleDetailsSubmit = async (
//     values: z.infer<typeof signupDetailsSchema>
//   ) => {
//     setIsLoading(true);
//     try {
//       // Signup logic here
//     } catch (error) {
//       toast.error("Signup failed", {
//         description: "An unexpected error occurred",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle OAuth signin
//   const handleOAuthSignIn = async (provider: "google" | "facebook") => {
//     try {
//       const isSignInOrSingUp = await signUpWithGoogle();
//       if (!isSignInOrSingUp) {
//         toast.error("Signup failed", { description: "Signup failed" });
//       } else {
//         toast.success("Signup successful");
//         onOpenChange(false);
//       }
//     } catch (error) {
//       toast.error(`${activeTab === "login" ? "Login" : "Sign Up"} failed`, {
//         description: "Something went wrong",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle password reset
//   const handleResetPassword = async (
//     values: z.infer<typeof resetPasswordSchema>
//   ) => {
//     setSignupStep("verify");
//     setIsLoading(true);
//     setResendDisabled(true);
//     setResendTimer(100);
//     try {
//       await handleForgotPassword(values.email);
//       setForgotPassword(false);
//     } catch (error) {
//       toast.error("Password reset failed", {
//         description: "An unexpected error occurred",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOpenResetPassword = async (
//     values: z.infer<typeof resetPasswordSchema>
//   ) => {
//     try {
//       setOpenResetPassword(true);
//       setForgotPassword(false);
//       setResetEmail(values.email);
//       await handleForgotPassword(values.email);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Handle resend OTP
//   const handleResend = async () => {
//     setResendDisabled(true);
//     setResendTimer(100);
//     resetForm.reset();

//     const res = await api.post("/auth/forgot-password", {
//       email: resetEmail,
//     });
//   };

//   const handleSignResend = async () => {
//     setResendDisabled(true);
//     setResendTimer(100);
//     const res = await api.post("/auth/send-otp", {
//       email: signupEmail,
//     });
//     // console.log(res);
//   };

//   const handleReset = async (
//     values: z.infer<typeof resetPasswordWithOtpSchema>
//   ) => {
//     try {
//       const { data } = await api.post("/auth/reset-password", {
//         email: resetEmail,
//         token: values.otp,
//         password: values.password,
//       });

//       if (data.success) {
//         setOpenResetPassword(false);

//         setActiveTab("login");
//         setResetEmail("");
//         setSignupSuccessfull("Password changed successfully!");
//         resetForm.reset();
//       } else {
//         resetForm.setError("otp", {
//           type: "manual",
//           message: "Invalid OTP",
//         });
//       }
//       console.log(values, resetEmail);
//     } catch (err) {
//       console.error("Reset failed", err);
//     }
//   };

//   const redirectToLogin = () => {
//     setSignupSuccessfull("Account created! You can now log in");
//     setSignupStep("email");
//     setActiveTab("login");
//   };

//   // Timer effect for resend button
//   useEffect(() => {
//     let interval;
//     if (resendTimer > 0) {
//       interval = setInterval(() => {
//         setResendTimer((prevTimer) => prevTimer - 1);
//       }, 1000);
//     } else if (resendTimer === 0 && resendDisabled) {
//       setResendDisabled(false);
//     }

//     return () => clearInterval(interval);
//   }, [resendTimer, resendDisabled]);

//   const handleOpenChange = (newOpen: boolean) => {
//     console.log("new open => ", newOpen);
//     onOpenChange(newOpen);
//     setIsModalOpen?.(newOpen); // Call if provided
//   };

//   const [tabHeight, setTabHeight] = useState<number | 'auto'>('auto'); // State for tab height

//   useEffect(() => {
//     const activeTabContent = document.querySelector('[data-state="active"]');
//     const tabContentHeight = activeTabContent ? activeTabContent.scrollHeight : 'auto';
//     setTabHeight(tabContentHeight); // Set the height based on active tab
//   }, [activeTab]);

//   // useEffect(() => {
//   //   const handleFocus = (e: Event) => {
//   //     const activeElement = e.target as HTMLElement;
//   //     if (
//   //       activeElement.tagName === "INPUT" ||
//   //       activeElement.tagName === "TEXTAREA" ||
//   //       activeElement.tagName === "SELECT"
//   //     ) {
//   //       setTimeout(() => {
//   //         activeElement.scrollIntoView({
//   //           behavior: "smooth",
//   //           block: "center",
//   //         });
//   //       }, 300);
//   //     }
//   //   };

//   //   document.addEventListener("focusin", handleFocus);
//   //   return () => document.removeEventListener("focusin", handleFocus);
//   // });

//   const renderMainContent = () => {
//     // Show Reset Password form
//     if (openResetPassword) {
//       return (
//         <ResetPasswordWithOTPForm
//           resetForm={resetForm}
//           handleReset={handleReset}
//           isLoading={isLoading}
//           setBackToEmailForm={() => {
//             setOpenResetPassword(false);
//             setForgotPassword(true);
//           }}
//           resendTimer={resendTimer}
//           resendDisabled={resendDisabled}
//           handleResend={handleResend}
//         />
//       );
//     }

//     // Show forgot password form
//     if (forgotPassword) {
//       return (
//         <ResetPasswordForm
//           resetPasswordForm={resetPasswordForm}
//           handleResetPassword={handleOpenResetPassword}
//           isLoading={isLoading}
//           setForgotPassword={setForgotPassword}
//         />
//       );
//     }

//     // Show signup steps (verify email or enter details)
//     if (signupStep === "verify" || signupStep === "details") {
//       return (
//         <AuthSteps
//           signupStep={signupStep}
//           setSignupStep={setSignupStep}
//           otp={otp}
//           setOtp={setOtp}
//           isLoading={isLoading}
//           handleVerifyOTP={handleVerifyOTP}
//           resendTimer={resendTimer}
//           resendDisabled={resendDisabled}
//           handleResend={handleSignResend}
//           signupDetailsForm={signupDetailsForm}
//           handleDetailsSubmit={handleDetailsSubmit}
//           showPassword={showPassword}
//           setShowPassword={setShowPassword}
//           showConfirmPassword={showConfirmPassword}
//           setShowConfirmPassword={setShowConfirmPassword}
//           redirectToLogin={redirectToLogin}
//         />
//       );
//     }

//     // Show login/signup tabs
//     return (
//       <div className="w-full bg-white ">
//         <div className="w-full text-center mb-6 bg-white">
//           <h1 className="text-xl md:text-2xl font-bold mt-2 text-center">
//             Login or Signup
//           </h1>
//           <p className="text-sm text-gray-600 mt-2 px-4">
//             By continuing, you agree to our{" "}
//             <Link
//               to={"/user-agreement"}
//               target="_blank"
//               // onClick={() => navigate("/user-agreement")}
//               className="text-blue-500 hover:underline inline cursor-pointer"
//             >
//               User Agreement
//             </Link>{" "}
//             and acknowledge that you understand the{" "}
//             <Link
//               to={"/privacy-policy"}
//               target="_blank"
//               // onClick={() => navigate("/privacy-policy")}
//               className="text-blue-500 inline hover:underline cursor-pointer"
//             >
//               Privacy Policy
//             </Link>
//             .
//           </p>
//         </div>

//         <Card className="w-full shadow-none border-none bg-white">
//           <CardContent className={`grid gap-4 p-0 bg-white`}>
   
//             <Tabs
//               defaultValue={defaultTab}
//               value={activeTab}
//               onValueChange={(value: "login" | "signup") => setActiveTab(value)}
//               className="w-full"
//             >
//               <TabsList className="grid w-full grid-cols-2 mb-4">
//                 <TabsTrigger value="login">Login</TabsTrigger>
//                 <TabsTrigger value="signup">Sign Up</TabsTrigger>
//               </TabsList>

//               {/* Social login buttons */}
//               <SocialAuthButtons
//                 handleOAuthSignIn={handleOAuthSignIn}
//                 isLoading={isLoading}
//               />

//               <div className="relative mb-4">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t" />
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-background px-2 text-muted-foreground">
//                     or
//                   </span>
//                 </div>
//               </div>

//               <TabsContent value="login" className="space-y-4 flex-grow">
//                 <LoginForm
//                   loginForm={loginForm}
//                   handleLogin={handleLogin}
//                   isLoading={isLoading}
//                   showPassword={showPassword}
//                   setShowPassword={setShowPassword}
//                   setForgotPassword={setForgotPassword}
//                   signupSuccessfull={signupSuccessfull}
//                 />
//               </TabsContent>

//               <TabsContent value="signup" className="">
//                 <SignupEmailForm
//                   signupEmailForm={signupEmailForm}
//                   handleEmailSubmit={handleEmailSubmit}
//                   isLoading={isLoading}
//                 />
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   };

//   const authContent = renderMainContent();

//   // Use Drawer for mobile and Dialog for desktop
//   if (isMobile) {
//     return (
//         <div style={{ height: tabHeight }} className="tabs-content">
//       <Drawer open={open} onOpenChange={handleOpenChange}>
//         <DrawerContent
//           className="justify-center bg-red-500 h-fit "
//           // style={{
//           //   height: Math.min(viewportHeight * 0.85, 600), // Use fixed height based on initial viewport
//           //   maxHeight: Math.min(viewportHeight * 0.85, 600),
//           // }} 
//           // style={{
//           //   height: 'fit-content', // Let content determine height
//           //   maxHeight: Math.min(viewportHeight * 0.85, 600), // Still enforce maximum
//           //   overflowY: 'auto' // Add scroll if content exceeds maxHeight
//           // }}

//           // style={{
//           //   // height: '90vh',
//           //   // maxHeight: '90vh',
//           // }}
//         >
//           <div
//             className="px-4 py-8  flex overflow-y-auto relative"
//             /* style={{
//               paddingBottom: "60px", // Extra padding for keyboard
//               scrollBehavior: "smooth",
//               overscrollBehavior: "contain",
//             }} */
//           >
//             <div className="absolute right-4 top-4 z-10">
//               <DrawerClose asChild>
//                 <Button variant="ghost" size="icon">
//                   <X className="h-4 w-4" />
//                 </Button>
//               </DrawerClose>
//             </div>

//             {authContent}
//           </div>
//         </DrawerContent>
//       </Drawer>
//         </div>
//     );
//   }

//   return (
//     <Dialog open={open} onOpenChange={handleOpenChange} >
//       <DialogContent className="sm:max-w-[480px]  overflow-y-auto p-3 bd-white" >
//         <DialogClose className="absolute right-4 top-4 z-10">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="text-gray-800 rounded-full"
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </DialogClose>
//         <div className="p-6 h-full bg-white">{authContent}</div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AuthModal;



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
        onOpenChange(false);
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
      <div className="auth-modal-content" >
        <div className="auth-header">
          <h1 className="text-xl md:text-2xl font-bold mt-2 text-center">Login or Signup</h1>
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
              className={`tab-button rounded-sm ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`tab-button rounded-sm ${activeTab === "signup" ? "active" : ""}`}
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
              <span className="font-medium text-black">Continue with Google</span>
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
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
        className={`auth-modal-overlay ${open ? 'open' : ''} ${isAnimating ? 'animating' : ''}`}
        onClick={handleClose}
      />

      <div 
        ref={modalRef}
        className={`auth-modal ${open ? 'open' : ''} ${isAnimating ? 'animating' : ''}`}
      >
        <button className="close-button" onClick={handleClose}>
          <X className="h-4 w-4 text-black" />
        </button>
        {renderMainContent()}
      </div>
    </>
  );
};

// Custom form components
// const LoginForm = ({
//   loginForm,
//   handleLogin,
//   isLoading,
//   showPassword,
//   setShowPassword,
//   setForgotPassword,
//   signupSuccessfull,
// }: {
//   loginForm: any;
//   handleLogin: (values: any) => void;
//   isLoading: boolean;
//   showPassword: boolean;
//   setShowPassword: (show: boolean) => void;
//   setForgotPassword: (show: boolean) => void;
//   signupSuccessfull: string;
// }) => {
//   return (
//     <form onSubmit={loginForm.handleSubmit(handleLogin)} className="auth-form">
//       {signupSuccessfull && (
//         <div className="success-message">{signupSuccessfull}</div>
//       )}
      
//       <div className="form-group">
//         <label htmlFor="email">Email</label>
//         <div className="input-wrapper">
//           <Mail size={18} className="input-icon" />
//           <input
//             id="email"
//             type="email"
//             placeholder="Enter your email"
//             {...loginForm.register("email")}
//           />
//         </div>
//         {loginForm.formState.errors.email && (
//           <span className="error-message">
//             {loginForm.formState.errors.email.message}
//           </span>
//         )}
//       </div>

//       <div className="form-group">
//         <label htmlFor="password">Password</label>
//         <div className="input-wrapper">
//           <Lock size={18} className="input-icon" />
//           <input
//             id="password"
//             type={showPassword ? "text" : "password"}
//             placeholder="Enter your password"
//             {...loginForm.register("password")}
//           />
//           <button
//             type="button"
//             className="password-toggle"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>
//         {loginForm.formState.errors.password && (
//           <span className="error-message">
//             {loginForm.formState.errors.password.message}
//           </span>
//         )}
//       </div>

//       <button
//         type="button"
//         className="forgot-password"
//         onClick={() => setForgotPassword(true)}
//       >
//         Forgot password?
//       </button>

//       <button
//         type="submit"
//         className="submit-button"
//         disabled={isLoading}
//       >
//         {isLoading ? "Logging in..." : "Login"}
//       </button>
//     </form>
//   );
// };

// const SignupEmailForm = ({
//   signupEmailForm,
//   handleEmailSubmit,
//   isLoading,
// }: {
//   signupEmailForm: any;
//   handleEmailSubmit: (values: any) => void;
//   isLoading: boolean;
// }) => {
//   return (
//     <form
//       onSubmit={signupEmailForm.handleSubmit(handleEmailSubmit)}
//       className="auth-form"
//     >
//       <div className="form-group">
//         <label htmlFor="signup-email">Email</label>
//         <div className="input-wrapper">
//           <Mail size={18} className="input-icon" />
//           <input
//             id="signup-email"
//             type="email"
//             placeholder="Enter your email"
//             {...signupEmailForm.register("email")}
//           />
//         </div>
//         {signupEmailForm.formState.errors.email && (
//           <span className="error-message">
//             {signupEmailForm.formState.errors.email.message}
//           </span>
//         )}
//       </div>

//       <button
//         type="submit"
//         className="submit-button"
//         disabled={isLoading}
//       >
//         {isLoading ? "Sending..." : "Continue"}
//       </button>
//     </form>
//   );
// };

// const AuthSteps = ({
//   signupStep,
//   setSignupStep,
//   otp,
//   setOtp,
//   isLoading,
//   handleVerifyOTP,
//   resendTimer,
//   resendDisabled,
//   handleResend,
//   signupDetailsForm,
//   handleDetailsSubmit,
//   showPassword,
//   setShowPassword,
//   showConfirmPassword,
//   setShowConfirmPassword,
//   redirectToLogin,
// }: {
//   signupStep: "email" | "verify" | "details";
//   setSignupStep: (step: "email" | "verify" | "details") => void;
//   otp: string;
//   setOtp: (otp: string) => void;
//   isLoading: boolean;
//   handleVerifyOTP: (otp: string) => void;
//   resendTimer: number;
//   resendDisabled: boolean;
//   handleResend: () => void;
//   signupDetailsForm: any;
//   handleDetailsSubmit: (values: any) => void;
//   showPassword: boolean;
//   setShowPassword: (show: boolean) => void;
//   showConfirmPassword: boolean;
//   setShowConfirmPassword: (show: boolean) => void;
//   redirectToLogin: () => void;
// }) => {
//   if (signupStep === "verify") {
//     return (
//       <div className="auth-form">
//         <h2>Verify your email</h2>
//         <p className="verification-text">
//           We've sent a 6-digit verification code to your email
//         </p>

//         <div className="form-group">
//           <label htmlFor="otp">Verification Code</label>
//           <input
//             id="otp"
//             type="text"
//             placeholder="Enter 6-digit code"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             maxLength={6}
//           />
//         </div>

//         <div className="resend-otp">
//           <button
//             type="button"
//             onClick={handleResend}
//             disabled={resendDisabled}
//             className="resend-button"
//           >
//             Resend Code {resendDisabled && `(${resendTimer}s)`}
//           </button>
//         </div>

//         <button
//           type="button"
//           className="submit-button"
//           onClick={() => handleVerifyOTP(otp)}
//           disabled={isLoading || otp.length !== 6}
//         >
//           {isLoading ? "Verifying..." : "Verify"}
//         </button>

//         <button
//           type="button"
//           className="back-button"
//           onClick={() => setSignupStep("email")}
//         >
//           Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <form
//       onSubmit={signupDetailsForm.handleSubmit(handleDetailsSubmit)}
//       className="auth-form"
//     >
//       <h2>Create your account</h2>

//       <div className="form-group">
//         <label htmlFor="username">Full Name</label>
//         <div className="input-wrapper">
//           <User size={18} className="input-icon" />
//           <input
//             id="username"
//             type="text"
//             placeholder="Enter your full name"
//             {...signupDetailsForm.register("username")}
//           />
//         </div>
//         {signupDetailsForm.formState.errors.username && (
//           <span className="error-message">
//             {signupDetailsForm.formState.errors.username.message}
//           </span>
//         )}
//       </div>

//       <div className="form-group">
//         <label htmlFor="password">Password</label>
//         <div className="input-wrapper">
//           <Lock size={18} className="input-icon" />
//           <input
//             id="password"
//             type={showPassword ? "text" : "password"}
//             placeholder="Create a password"
//             {...signupDetailsForm.register("password")}
//           />
//           <button
//             type="button"
//             className="password-toggle"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>
//         {signupDetailsForm.formState.errors.password && (
//           <span className="error-message">
//             {signupDetailsForm.formState.errors.password.message}
//           </span>
//         )}
//       </div>

//       <div className="form-group">
//         <label htmlFor="confirmPassword">Confirm Password</label>
//         <div className="input-wrapper">
//           <Lock size={18} className="input-icon" />
//           <input
//             id="confirmPassword"
//             type={showConfirmPassword ? "text" : "password"}
//             placeholder="Confirm your password"
//             {...signupDetailsForm.register("confirmPassword")}
//           />
//           <button
//             type="button"
//             className="password-toggle"
//             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//           >
//             {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>
//         {signupDetailsForm.formState.errors.confirmPassword && (
//           <span className="error-message">
//             {signupDetailsForm.formState.errors.confirmPassword.message}
//           </span>
//         )}
//       </div>

//       <button
//         type="submit"
//         className="submit-button"
//         disabled={isLoading}
//       >
//         {isLoading ? "Creating account..." : "Create Account"}
//       </button>

//       <button
//         type="button"
//         className="back-button"
//         onClick={() => setSignupStep("verify")}
//       >
//         Back
//       </button>
//     </form>
//   );
// };

// const ResetPasswordForm = ({
//   resetPasswordForm,
//   handleResetPassword,
//   isLoading,
//   setForgotPassword,
// }: {
//   resetPasswordForm: any;
//   handleResetPassword: (values: any) => void;
//   isLoading: boolean;
//   setForgotPassword: (show: boolean) => void;
// }) => {
//   return (
//     <form
//       onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}
//       className="auth-form"
//     >
//       <h2>Reset Password</h2>
//       <p className="reset-text">
//         Enter your email and we'll send you a code to reset your password
//       </p>

//       <div className="form-group">
//         <label htmlFor="reset-email">Email</label>
//         <div className="input-wrapper">
//           <Mail size={18} className="input-icon" />
//           <input
//             id="reset-email"
//             type="email"
//             placeholder="Enter your email"
//             {...resetPasswordForm.register("email")}
//           />
//         </div>
//         {resetPasswordForm.formState.errors.email && (
//           <span className="error-message">
//             {resetPasswordForm.formState.errors.email.message}
//           </span>
//         )}
//       </div>

//       <button
//         type="submit"
//         className="submit-button"
//         disabled={isLoading}
//       >
//         {isLoading ? "Sending..." : "Send Reset Code"}
//       </button>

//       <button
//         type="button"
//         className="back-button"
//         onClick={() => setForgotPassword(false)}
//       >
//         Back to Login
//       </button>
//     </form>
//   );
// };

// const ResetPasswordWithOTPForm = ({
//   resetForm,
//   handleReset,
//   isLoading,
//   setBackToEmailForm,
//   resendTimer,
//   resendDisabled,
//   handleResend,
// }: {
//   resetForm: any;
//   handleReset: (values: any) => void;
//   isLoading: boolean;
//   setBackToEmailForm: () => void;
//   resendTimer: number;
//   resendDisabled: boolean;
//   handleResend: () => void;
// }) => {
//   return (
//     <form
//       onSubmit={resetForm.handleSubmit(handleReset)}
//       className="auth-form"
//     >
//       <h2>Reset Password</h2>
//       <p className="reset-text">
//         Enter the verification code sent to your email and your new password
//       </p>

//       <div className="form-group">
//         <label htmlFor="reset-otp">Verification Code</label>
//         <input
//           id="reset-otp"
//           type="text"
//           placeholder="Enter 6-digit code"
//           {...resetForm.register("otp")}
//           maxLength={6}
//         />
//         {resetForm.formState.errors.otp && (
//           <span className="error-message">
//             {resetForm.formState.errors.otp.message}
//           </span>
//         )}
//       </div>

//       <div className="form-group">
//         <label htmlFor="new-password">New Password</label>
//         <div className="input-wrapper">
//           <Lock size={18} className="input-icon" />
//           <input
//             id="new-password"
//             type="password"
//             placeholder="Create a new password"
//             {...resetForm.register("password")}
//           />
//         </div>
//         {resetForm.formState.errors.password && (
//           <span className="error-message">
//             {resetForm.formState.errors.password.message}
//           </span>
//         )}
//       </div>

//       <div className="form-group">
//         <label htmlFor="confirm-new-password">Confirm New Password</label>
//         <div className="input-wrapper">
//           <Lock size={18} className="input-icon" />
//           <input
//             id="confirm-new-password"
//             type="password"
//             placeholder="Confirm your new password"
//             {...resetForm.register("confirmPassword")}
//           />
//         </div>
//         {resetForm.formState.errors.confirmPassword && (
//           <span className="error-message">
//             {resetForm.formState.errors.confirmPassword.message}
//           </span>
//         )}
//       </div>

//       <div className="resend-otp">
//         <button
//           type="button"
//           onClick={handleResend}
//           disabled={resendDisabled}
//           className="resend-button"
//         >
//           Resend Code {resendDisabled && `(${resendTimer}s)`}
//         </button>
//       </div>

//       <button
//         type="submit"
//         className="submit-button"
//         disabled={isLoading}
//       >
//         {isLoading ? "Resetting..." : "Reset Password"}
//       </button>

//       <button
//         type="button"
//         className="back-button"
//         onClick={setBackToEmailForm}
//       >
//         Back
//       </button>
//     </form>
//   );
// };



export default AuthModal;