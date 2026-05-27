import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useResetPasswordMutation } from "../../api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function ResetPassword() {
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await resetPassword(values).unwrap();
      toast({
        title: "Password reset successfully!",
        description: "Redirecting to login...",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to reset password",
        description: err.data?.message || "Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brutal-blue">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">Enter your reset token and new password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reset Token</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reset token" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full bg-yass-queen hover:bg-sister-sister">
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center">
            <p className="text-sm">
              <Link to="/login" className="text-blue-light hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPassword;
