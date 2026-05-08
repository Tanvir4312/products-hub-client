// "use client";

// import { Button } from "@/components/ui/button";
// import { redirect } from "next/dist/server/api-utils";
// import { useRouter } from "next/navigation";

// import { FcGoogle } from "react-icons/fc";
// import { toast } from "sonner";

// export default function SocialLogin() {

//   const handleGoogleLogin = async () => {
//     try {
//       const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//       window.location.href = `${API_BASE_URL}/auth/login/google`;

//     } catch (error: any) {
//       toast.error(error.message || "Something went wrong with Google login");
//     }
//   };

//   return (
//     <div className="w-full space-y-4">
//       <div className="relative">
//         <div className="absolute inset-0 flex items-center">
//           <span className="w-full border-t border-slate-200 dark:border-slate-800" />
//         </div>
//         <div className="relative flex justify-center text-xs uppercase">
//           <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">
//             Or continue with
//           </span>
//         </div>
//       </div>
//       <Button
//         variant="outline"
//         type="button"
//         className="w-full flex items-center justify-center gap-2 py-6 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold transition-all shadow-sm"
//         onClick={handleGoogleLogin}
//       >
//         <FcGoogle className="h-5 w-5" />
//         Continue with Google
//       </Button>
//     </div>
//   );
// }
