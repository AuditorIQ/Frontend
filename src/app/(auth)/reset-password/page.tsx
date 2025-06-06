import ResetPasswordForm from "./ResetPasswordForm";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <div className="bg-[url('/Billboards.jpg')] min-h-screen flex items-center justify-center p-4">
      <div className="h-full max-w-6xl bg-white rounded-lg overflow-hidden flex flex-col md:flex-row">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
