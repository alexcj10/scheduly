
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
      })
  };
}
