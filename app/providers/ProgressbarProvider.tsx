"use client"
 
import { ProgressProvider } from "@bprogress/next/app"
 
const ProgressbarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider 
      height="4px"
      color="var(--primary)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};
 
export default ProgressbarProvider