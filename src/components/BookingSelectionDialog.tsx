import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Phone, Video } from "lucide-react";

interface BookingSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (type: "free" | "paid") => void;
}

const BookingSelectionDialog = ({ open, onOpenChange, onSelect }: BookingSelectionDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="font-display text-2xl text-center text-gold-gradient mb-2">
                        Choose Your Consultation
                    </DialogTitle>
                    <p className="text-center text-muted-foreground font-body text-sm px-4">
                        Select how you would like to connect with our team to discuss your photography needs.
                    </p>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* Free Callback Option */}
                    <button
                        onClick={() => onSelect("free")}
                        className="group relative flex flex-col items-center p-6 rounded-2xl border-2 border-border bg-secondary hover:border-primary/50 hover:bg-secondary/80 transition-all text-left h-full"
                    >
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <Phone className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-display text-lg font-bold mb-2">Free Callback</h3>
                        <p className="text-sm text-muted-foreground text-center font-body flex-grow">
                            A quick phone call from our studio coordinator to answer your initial questions.
                        </p>
                        <div className="mt-4 font-bold text-primary">Free</div>
                    </button>

                    {/* Paid Meet Option */}
                    <button
                        onClick={() => onSelect("paid")}
                        className="group relative flex flex-col items-center p-6 rounded-2xl border-2 border-primary/30 bg-secondary hover:border-primary transition-all text-left h-full shadow-sm hover:shadow-gold"
                    >
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            Recommended
                        </div>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <Video className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-display text-lg font-bold mb-2 text-center break-words">1-on-1 Google Meet</h3>
                        <p className="text-sm text-muted-foreground text-center font-body flex-grow">
                            A dedicated video consultation directly with the lead photographer to plan your shoot.
                        </p>
                        <div className="mt-4 font-bold text-primary">₹5</div>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BookingSelectionDialog;
