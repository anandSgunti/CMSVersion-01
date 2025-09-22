// components/ui/toaster.tsx
import { useToast } from "../../hooks/use-toast";
import { 
  Toast, 
  ToastClose, 
  ToastDescription, 
  ToastTitle, 
  ToastViewport 
} from "../../components/ui/toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastViewport>
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant} className={toast.className}>
          <div className="grid gap-1">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          </div>
          {toast.action}
          <ToastClose onClick={() => dismiss(toast.id)} />
        </Toast>
      ))}
    </ToastViewport>
  );
}