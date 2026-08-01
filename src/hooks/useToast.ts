import { toast, type ExternalToast } from "sonner";

export const useToast = () => ({
    success: (message: string, options?: ExternalToast) => toast.success(message, options),
    error: (message: string, options?: ExternalToast) => toast.error(message, options),
    info: (message: string, options?: ExternalToast) => toast.info(message, options),
    promise: toast.promise,
});
