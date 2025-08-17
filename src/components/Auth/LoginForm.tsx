import React, { useRef } from "react";
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
  signupSuccessfull,
}) => {
  const loginButtonRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loginButtonRef.current?.click();
    }
  };

  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(handleLogin)}
        className="h-full flex flex-col justify-between"
        onKeyDown={handleKeyPress}
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

          {signupSuccessfull && (
            <p className="text-center text-brand pb-4">{signupSuccessfull}</p>
          )}
        </div>
        <Button
          ref={loginButtonRef}
          type="submit"
          className="md:w-full  py-5 bg-brand rounded-full mt-1 "
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <div className="text-center md:w-full mb-4">
          <Button
            variant="link"
            className="text-sm text-[#3b82f6] p-0 hover:text-blue-600 font-normal"
            onClick={() => setForgotPassword(true)}
          >
            Forgot your password?
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;

// import React, { useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { FloatingInput } from "@/components/ui/floating-input";
// import { Eye, EyeOff } from "lucide-react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";

// const LoginForm = ({
//   loginForm,
//   handleLogin,
//   isLoading,
//   showPassword,
//   setShowPassword,
//   setForgotPassword,
//   signupSuccessfull,
// }) => {
//   const loginButtonRef = useRef(null);

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       loginButtonRef.current?.click();
//     }
//   };

//   return (
//     <Form {...loginForm}>
//       <form
//         onSubmit={loginForm.handleSubmit(handleLogin)}
//         className="h-full flex flex-col justify-between"
//         onKeyDown={handleKeyPress}
//       >
//         <div className="space-y-4"> {/* Increased spacing between fields */}
//           <FormField
//             control={loginForm.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <div className="relative">
//                   <FormControl>
//                     <FloatingInput
//                       label="Email"
//                       {...field}
//                       disabled={isLoading}
//                       className="pl-3"
//                     />
//                   </FormControl>
//                 </div>
//                 <div className="h-5">
//                   <FormMessage className="text-xs text-[#b3261e] font-normal ml-3 -mt-[6.5px]" />
//                 </div>
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={loginForm.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem className="mb-4"> {/* Added margin bottom */}
//                 <div className="relative">
//                   <FormControl>
//                     <FloatingInput
//                       type={showPassword ? "text" : "password"}
//                       label="Password"
//                       {...field}
//                       disabled={isLoading}
//                       className="pl-3"
//                     />
//                   </FormControl>
//                   <button
//                     type="button"
//                     tabIndex={-1}
//                     className="absolute right-3 top-5 text-gray-400 hover:text-gray-600"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4 -mt-0.5" />
//                     ) : (
//                       <Eye className="h-4 w-4 -mt-0.5" />
//                     )}
//                   </button>
//                 </div>
//                 <div className="h-5">
//                   <FormMessage className="text-xs text-[#b3261e] font-normal ml-3 -mt-[6.5px]" />
//                 </div>
//               </FormItem>
//             )}
//           />

//           {signupSuccessfull && (
//             <p className="text-center text-brand">{signupSuccessfull}</p>
//           )}

//           {/* Moved forgot password link to be part of the normal flow */}
//           <div className="text-center w-full mt-2"> {/* Removed absolute positioning */}
//             <Button
//               variant="link"
//               className="text-sm text-[#3b82f6] p-0 hover:text-blue-600 font-normal"
//               onClick={() => setForgotPassword(true)}
//               type="button"
//             >
//               Forgot your password?
//             </Button>
//           </div>
//         </div>

//         <Button
//           ref={loginButtonRef}
//           type="submit"
//           className="w-full py-5 bg-brand rounded-full mt-4"
//           disabled={isLoading}
//         >
//           {isLoading ? "Logging in..." : "Login"}
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default LoginForm;

// import React, { useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { FloatingInput } from "@/components/ui/floating-input";
// import { Eye, EyeOff } from "lucide-react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";

// const LoginForm = ({
//   loginForm,
//   handleLogin,
//   isLoading,
//   showPassword,
//   setShowPassword,
//   setForgotPassword,
//   signupSuccessfull,
// }) => {
//   const loginButtonRef = useRef(null);

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       loginButtonRef.current?.click();
//     }
//   };

//   return (
//     <Form {...loginForm}>
//       <form
//         onSubmit={loginForm.handleSubmit(handleLogin)}
//         className="flex flex-col h-full"
//         onKeyDown={handleKeyPress}
//       >
//         <div className="flex-grow space-y-4 px-4 overflow-y-auto">
//           <FormField
//             control={loginForm.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <div className="relative">
//                   <FormControl>
//                     <FloatingInput
//                       label="Email"
//                       {...field}
//                       disabled={isLoading}
//                       className="pl-3"
//                     />
//                   </FormControl>
//                 </div>
//                 <div className="h-5">
//                   <FormMessage className="text-xs text-[#b3261e] font-normal ml-3 -mt-[6.5px]" />
//                 </div>
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={loginForm.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <div className="relative">
//                   <FormControl>
//                     <FloatingInput
//                       type={showPassword ? "text" : "password"}
//                       label="Password"
//                       {...field}
//                       disabled={isLoading}
//                       className="pl-3"
//                     />
//                   </FormControl>
//                   <button
//                     type="button"
//                     tabIndex={-1}
//                     className="absolute right-3 top-5 text-gray-400 hover:text-gray-600"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4 -mt-0.5" />
//                     ) : (
//                       <Eye className="h-4 w-4 -mt-0.5" />
//                     )}
//                   </button>
//                 </div>
//                 <div className="h-5">
//                   <FormMessage className="text-xs text-[#b3261e] font-normal ml-3 -mt-[6.5px]" />
//                 </div>
//               </FormItem>
//             )}
//           />

//           {signupSuccessfull && (
//             <p className="text-center text-brand">{signupSuccessfull}</p>
//           )}
//         </div>

//         <div className="px-4 pb-4 pt-2 border-t">
//           <div className="text-center w-full mb-3">
//             <Button
//               variant="link"
//               className="text-sm text-[#3b82f6] p-0 hover:text-blue-600 font-normal"
//               onClick={() => setForgotPassword(true)}
//               type="button"
//             >
//               Forgot your password?
//             </Button>
//           </div>

//           <Button
//             ref={loginButtonRef}
//             type="submit"
//             className="w-full py-5 bg-brand rounded-full"
//             disabled={isLoading}
//           >
//             {isLoading ? "Logging in..." : "Login"}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// };

// export default LoginForm;
