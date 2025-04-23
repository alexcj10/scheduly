
import { useToast } from "@/hooks/use-toast";

export function useFeedbackToast() {
  const { toast } = useToast();
  return {
    success: (title: string, description?: string) =>
      toast({
        title,
        description,
        variant: "default"
      }),
    error: (title: string, description?: string) =>
      toast({
        title,
        description,
        variant: "destructive"
      }),
    info: (title: string, description?: string) =>
      toast({
        title,
        description,
        variant: "default",
        className: "bg-blue-50 border-blue-200 text-blue-800"
      }),
    ai: (title: string, description?: string) =>
      toast({
        title,
        description,
        variant: "default",
        className: "bg-purple-50 border-purple-200 text-purple-800"
      })
  };
}
