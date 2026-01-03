import { DiariaLogForm } from "./diaria-log-form";
import { Button } from "../ui/button";
import { DailyLog, DailyLogCreateInput, DailyLogUpdateInput } from "@/lib/types";

interface DiariaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: DailyLogCreateInput | DailyLogUpdateInput) => Promise<void>;
    initialData: DailyLog | null;
}

export const DiariaModal = ({isOpen, onClose, onSubmit, initialData}: DiariaModalProps) => {
    if (!isOpen) {
        return null;
    }

    return(
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-card p-8 rounded-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <DiariaLogForm
                    initialData={initialData}
                    onSubmit={onSubmit}
                />
                <Button variant="ghost" onClick={onClose} className="w-full mt-2">
                    Cancelar
                </Button>
            </div>  
        </div>
    );
};

