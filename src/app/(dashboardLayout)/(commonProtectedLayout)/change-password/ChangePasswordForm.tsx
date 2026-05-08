"use client";

import { changePasswordAction } from "./_action";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { mutateAsync, isPending } = useMutation({
    mutationFn: changePasswordAction,
  });

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = "Current password is required";
    if (!newPassword) errors.newPassword = "New password is required";
    else if (newPassword?.length < 8) errors.newPassword = "New password must be at least 8 characters";
    if (!confirmPassword) errors.confirmPassword = "Please confirm your new password";
    else if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors)?.length > 0) return;

    try {
      const result = await mutateAsync({ currentPassword, newPassword }) as any;

      if (!result?.success) {
        setServerError(result?.message || "Password change failed");
        return;
      }
      toast.success("Password changed successfully! Please log in again.");
    } catch (error: any) {
      if (error?.message?.includes("NEXT_REDIRECT")) throw error;
      setServerError(`Failed: ${error.message}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-amber-500/10 text-amber-500 mb-2 shadow-inner">
          <ShieldCheck className="size-10" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Set Your Password
        </h1>
        <p className="text-muted-foreground">
          Your account requires a password update before you can access the dashboard. Please create a strong new password.
        </p>
      </div>

      <Card className="border border-border/50 shadow-2xl bg-card/30 backdrop-blur-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 via-amber-500 to-amber-500/50" />
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <KeyRound className="size-5 text-amber-500" />
            Account Security Update
          </CardTitle>
          <CardDescription>
            Enter your current (temporary) password and choose a new secure password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className={fieldErrors.currentPassword ? "text-destructive font-medium" : "font-medium"}>
                Current Password
              </Label>
              <div className="relative flex items-center border rounded-lg bg-background/50 border-input/50 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/10 transition-all">
                <Lock className="size-4 text-muted-foreground ml-3 shrink-0" />
                <Input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button type="button" variant="ghost" size="icon" className="size-8 mr-1" onClick={() => setShowCurrent(v => !v)}>
                  {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
              {fieldErrors.currentPassword && (
                <p className="text-sm text-destructive font-medium">{fieldErrors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className={fieldErrors.newPassword ? "text-destructive font-medium" : "font-medium"}>
                New Password
              </Label>
              <div className="relative flex items-center border rounded-lg bg-background/50 border-input/50 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/10 transition-all">
                <Lock className="size-4 text-muted-foreground ml-3 shrink-0" />
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create a strong new password"
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button type="button" variant="ghost" size="icon" className="size-8 mr-1" onClick={() => setShowNew(v => !v)}>
                  {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
              {fieldErrors.newPassword && (
                <p className="text-sm text-destructive font-medium">{fieldErrors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={fieldErrors.confirmPassword ? "text-destructive font-medium" : "font-medium"}>
                Confirm New Password
              </Label>
              <div className="relative flex items-center border rounded-lg bg-background/50 border-input/50 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/10 transition-all">
                <Lock className="size-4 text-muted-foreground ml-3 shrink-0" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button type="button" variant="ghost" size="icon" className="size-8 mr-1" onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-destructive font-medium">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {serverError && (
              <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive">
                <AlertDescription className="font-medium">{serverError}</AlertDescription>
              </Alert>
            )}

            <AppSubmitButton
              isPending={isPending}
              pendingLabel="Updating password..."
              className="h-12 w-full text-base font-bold transition-all hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] rounded-xl bg-amber-500 hover:bg-amber-600 text-white"
            >
              Update Password & Continue
            </AppSubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordForm;
