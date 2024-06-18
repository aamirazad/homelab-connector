import { LoaderCircle } from "lucide-react";

interface LoadingSpinnerProps {
  children: React.ReactNode;
}

export default function LoadingSpinner({ children }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-row place-content-center gap-1">
      <LoaderCircle className="animate-spin" />
      {children}
    </div>
  );
}
