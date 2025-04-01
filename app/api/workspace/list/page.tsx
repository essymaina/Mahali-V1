import { DialogDescription } from "../../../../components/ui/dialog"
// Find the DialogDescription component that contains a div
;<div className="text-center pt-4">
  <div className="flex justify-center mb-4">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">{/* Content inside */}</div>
  </div>
  <DialogDescription className="text-sm text-muted-foreground">
    {/* Other content that was inside the DialogDescription */}
  </DialogDescription>
</div>