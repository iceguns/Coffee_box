import { motion } from "framer-motion";
import { IconBag, IconCheck } from "./icons";

export interface ToastData {
  id: number;
  title: string;
  sub?: string;
  icon?: "bag" | "check";
}

export default function Toast({ toast }: { toast: ToastData | null }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="flex items-center gap-3 rounded-full border border-caramel-600/40 bg-espresso-850 py-2.5 pl-3 pr-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]"
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              toast.icon === "check" ? "bg-sage-400/20 text-sage-300" : "bg-caramel-500/20 text-caramel-300"
            }`}
          >
            {toast.icon === "check" ? <IconCheck className="h-4 w-4" /> : <IconBag className="h-4 w-4" />}
          </span>
          <div>
            <p className="text-sm font-bold text-crema-50">{toast.title}</p>
            {toast.sub && <p className="text-[11px] text-crema-400">{toast.sub}</p>}
          </div>
        </motion.div>
      )}
    </div>
  );
}
