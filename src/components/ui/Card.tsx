import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/src/lib/cn";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: React.ReactNode;
    hover?: boolean;
}

export function Card({ children, className, hover = false, ...props }: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
            className={cn("rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90", className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}
