import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { useAuth } from "@/context/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const SignupEmailForm = ({ signupEmailForm, handleEmailSubmit, isLoading }) => {
  const { sendOtp } = useAuth();

  const onSubmit = async (values) => {
    try {
      const success = await sendOtp(values.email);
      if (success) {
        // Store email in localStorage after successful OTP sending
        localStorage.setItem("signupEmail", values.email);
        handleEmailSubmit(values);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  };

  return (
    <Form {...signupEmailForm}>
      <form
        onSubmit={signupEmailForm.handleSubmit(onSubmit)}
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
                <FormMessage className="text-xs text-[#b3261e] font-normal ml-3 -mt-[6.5px]" />
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="md:w-full w-[92%] absolute md:static bottom-5 rounded-full bg-[#ff6b00] hover:bg-[#e55f00] py-5 mt-0.5"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
};

export default SignupEmailForm;
