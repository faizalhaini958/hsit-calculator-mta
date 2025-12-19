"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";

interface SaveResultsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDownloadPDF: () => void;
    onSendEmail: () => void;
}

export function SaveResultsDialog({
    open,
    onOpenChange,
    onDownloadPDF,
    onSendEmail,
}: SaveResultsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Save Your Results</DialogTitle>
                    <DialogDescription>
                        Choose how you'd like to save your HSIT preparedness results
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Button
                        onClick={() => {
                            onDownloadPDF();
                            onOpenChange(false);
                        }}
                        className="w-full justify-start gap-2"
                        size="lg"
                    >
                        <Download className="h-5 w-5" />
                        Download as PDF
                    </Button>
                    <Button
                        onClick={() => {
                            onSendEmail();
                            onOpenChange(false);
                        }}
                        variant="outline"
                        className="w-full justify-start gap-2"
                        size="lg"
                    >
                        <Mail className="h-5 w-5" />
                        Send via Email
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
