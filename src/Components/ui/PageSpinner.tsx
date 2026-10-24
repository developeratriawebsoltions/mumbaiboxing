export default function PageSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}
