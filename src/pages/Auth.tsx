import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Auth = () => {
  const { signIn, signUp, signInWithProvider, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get the default tab from URL params if present
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login";

  // Define schema for login and signup forms
  const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });

  const signupSchema = z
    .object({
      email: z
        .string()
        .email({ message: "Please enter a valid email address" }),
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
      confirmPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
      username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .optional(),
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

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
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
        navigate("/");
      }
    } catch (error) {
      toast.error("Login failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Signup handler
  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(
        values.email,
        values.password,
        values.username || values.email.split("@")[0]
      );
      if (error) {
        toast.error("Signup failed", {
          description: error.message,
        });
      } else {
        toast.success("Signup successful", {
          description: "Please check your email for verification instructions",
        });
        navigate("/");
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md text-center mb-6">
        <div className="flex justify-center mb-4">
          <img
            src="/lovable-uploads/734bcb13-cbaa-4ead-b63a-d6fa46648627.png"
            alt="DesiEasy Logo"
            className="h-16"
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mt-4 text-[#bf072c]">
          Welcome to DesiEasy!
        </h1>
        <p className="text-gray-600 mt-2">
          Connect with the community and find what you need
        </p>
      </div>

      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl text-center font-bold">
            Sign In
          </CardTitle>
          <CardDescription className="text-center">
            Choose your preferred method to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* OAuth Buttons - Displayed prominently above the tabs content */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuthSignIn("google")}
                disabled={isLoading}
                className="w-full py-5 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                <FaGoogle className="mr-2 h-5 w-5 text-[#bc0117]" />
                <span className="font-medium">Google</span>
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuthSignIn("facebook")}
                disabled={isLoading}
                className="w-full py-5 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                <FaFacebook className="mr-2 h-5 w-5 text-blue-600" />
                <span className="font-medium">Facebook</span>
              </Button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
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
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email"
                              {...field}
                              disabled={isLoading}
                              className="pl-10"
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
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              {...field}
                              disabled={isLoading}
                              className="pl-10 pr-10"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[#1e3a5f] hover:bg-[#142a48] py-5"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>

              <div className="text-center">
                <Button
                  variant="link"
                  className="text-sm text-blue-400 p-0"
                  onClick={() => setForgotPassword(true)}
                >
                  Forgot your password?
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <Form {...signupForm}>
                <form
                  onSubmit={signupForm.handleSubmit(handleSignup)}
                  className="space-y-4"
                >
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email"
                              {...field}
                              disabled={isLoading}
                              className="pl-10"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <Avatar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400">
                            <AvatarFallback className="bg-gray-200 text-gray-500 text-xs">
                              U
                            </AvatarFallback>
                          </Avatar>
                          <FormControl>
                            <Input
                              placeholder="Username (optional)"
                              {...field}
                              disabled={isLoading}
                              className="pl-10"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              {...field}
                              disabled={isLoading}
                              className="pl-10 pr-10"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm Password"
                              {...field}
                              disabled={isLoading}
                              className="pl-10 pr-10"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[#1e3a5f] hover:bg-[#142a48] py-5"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing up..." : "Sign Up"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPassword} onOpenChange={setForgotPassword}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your
              password.
            </DialogDescription>
          </DialogHeader>
          <Form {...resetPasswordForm}>
            <form
              onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}
              className="space-y-4"
            >
              <FormField
                control={resetPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input
                          placeholder="email@example.com"
                          {...field}
                          disabled={isLoading}
                          className="pl-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-[#1e3a5f]"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
