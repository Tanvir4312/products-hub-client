"use client";

import { registerAction } from "@/app/(authLayout)/register/_action";
import AppField from "@/components/shared/AppField";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerSchema } from "@/zod/auth.validation";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "oauth_failed") {
      setServerError("Google authentication failed. Please try again.");
    }
  }, [searchParams]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: registerAction,
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const parsed = registerSchema.safeParse(value);
      if (!parsed.success) {
        setServerError(parsed.error.issues[0].message);
        return;
      }

      try {
        const result = (await mutateAsync(value)) as any;
        if (!result?.success) {
          setServerError(result?.message || "Registration failed");
        }
      } catch (error: any) {
        if (error?.message?.includes("NEXT_REDIRECT")) throw error;
        setServerError("Registration failed. Please try again later.");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-[#0F172A]">
      <Card className="w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-none bg-white dark:bg-[#0F172A] rounded-2xl">
        
        <CardHeader className="text-center pt-10 pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Join Products Hunt to discover and launch amazing products
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 sm:px-8 pb-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            <form.Field
              name="name"
              validators={{ onChange: registerSchema.shape.name }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                />
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{ onChange: registerSchema.shape.email }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Email Address"
                  type="email"
                  placeholder="hello@productshunt.com"
                />
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{ onChange: registerSchema.shape.password }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  append={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-[#FF5E3A] dark:hover:text-[#FF5E3A] transition-colors"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            {serverError && (
              <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50">
                <AlertDescription className="text-xs">{serverError}</AlertDescription>
              </Alert>
            )}

            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Creating account..."
                  disabled={!canSubmit}
                  className="w-full bg-[#FF5E3A] hover:bg-[#E5532D] text-white font-semibold py-2.5 rounded-lg transition-all"
                >
                  Create Account
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white dark:bg-[#0F172A] text-gray-400 uppercase tracking-wide font-medium">
                Already a member?
              </span>
            </div>
          </div>

          <Link href="/login">
            <Button 
              variant="outline" 
              className="w-full py-2.5 rounded-lg border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-[#FF5E3A] hover:text-[#FF5E3A] font-medium transition-all"
            >
              Sign In to your account
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;