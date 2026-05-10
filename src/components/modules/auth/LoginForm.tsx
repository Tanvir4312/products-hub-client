"use client";

import { loginAction } from "@/app/(authLayout)/login/_action";
import AppField from "@/components/shared/AppField";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DemoLoginButtons from "./DemoLoginButtons";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";

interface LoginFormProps {
  redirectPath?: string;
}

const LoginForm = ({ redirectPath }: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "oauth_failed") {
      setServerError("Google authentication failed. Please try again.");
    }
  }, [searchParams]);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      }
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value) as any;
        if (result.success) {
          await queryClient.invalidateQueries({ queryKey: ["user", "me"] });
          if (result.redirect) {
            router.push(result.redirect);
          }
        } else {
          setServerError(result.message || "Invalid credentials. Please try again.");
        }
      } catch (error: any) {
        setServerError("Something went wrong. Please try again later.");
      }
    },
  });

  const handleQuickLogin = (email: string, password: string) => {
    form.setFieldValue("email", email);
    form.setFieldValue("password", password);
    setTimeout(() => {
      form.handleSubmit();
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-[#0F172A]">
      <Card className="w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-none bg-white dark:bg-[#0F172A] rounded-2xl">
        
        <CardHeader className="text-center pt-10 pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Sign in to discover and launch amazing products
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
              name="email"
              validators={{ onChange: loginZodSchema.shape.email }}
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

            <div className="space-y-1">
              <form.Field
                name="password"
                validators={{ onChange: loginZodSchema.shape.password }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    append={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-[#FF5E3A] dark:hover:text-[#FF5E3A] transition-colors"
                        onClick={() => setShowPassword(v => !v)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    }
                  />
                )}
              </form.Field>
            </div>

            {serverError && (
              <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50">
                <AlertDescription className="text-xs">{serverError}</AlertDescription>
              </Alert>
            )}

            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Signing in..."
                  disabled={!canSubmit}
                  className="w-full bg-[#FF5E3A] hover:bg-[#E5532D] text-white font-semibold py-2.5 rounded-lg transition-all"
                >
                  Sign In
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>

          <form.Subscribe selector={(s) => [s.isSubmitting] as const}>
            {([isSubmitting]) => (
              <DemoLoginButtons
                onQuickLogin={handleQuickLogin}
                isLoading={isPending || isSubmitting}
              />
            )}
          </form.Subscribe>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white dark:bg-[#0F172A] text-gray-400 uppercase tracking-wide font-medium">
                New to Products Hunt?
              </span>
            </div>
          </div>

          <Link href="/register">
            <Button 
              variant="outline" 
              className="w-full py-2.5 rounded-lg border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-[#FF5E3A] hover:text-[#FF5E3A] font-medium transition-all"
            >
              Create an Account
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;