import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

function ForgotPassword() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await forgotPassword(values).unwrap();
      toast({
        title: "Reset token sent!",
        description: "Check your email or use the token: " + response.resetToken,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to send reset token",
        description: err.data?.message || "Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brutal-blue">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">Enter your email to receive a password reset token.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full bg-yass-queen hover:bg-sister-sister">
                {isLoading ? "Sending..." : "Send Reset Token"}
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

export default ForgotPassword;
