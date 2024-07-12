import { Download } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import DocumentPreview from "./document-preview";

async function deleteDocument(documentId: number) {
  const userData = await getUserData();
  if (!userData) {
    throw new Error("User data not found");
  }
  const body = {
    documents: [documentId],
    method: "delete",
  };
  const response = await fetch(
    `${userData.paperlessURL}/api/documents/bulk_edit/ `,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${userData.paperlessToken}`,
      },
      body: JSON.stringify(body),
    },
  );
  return response;
}

function DocumentDetails(props: { id: number }) {

  return (
    <div className="flex h-full w-full min-w-0 justify-center">
      <div className="flex h-4/5 flex-col rounded-xl bg-slate-600/50 md:w-1/2">
        <div className="m-4 flex flex-grow flex-col justify-center gap-8 md:m-8 md:flex-row md:gap-16">
<DocumentPreview />
          <div className="flex flex-col gap-8">
            <Button
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
            >
              Back
            </Button>
            <a
              href={pdfUrl}
              download={pdfUrl}
              className={`${buttonVariants({ variant: "default" })}`}
            >
              Download
              <Download />
            </a>
            <div id="dialog-container" />
            <OpenExternalLink
              className={buttonVariants({ variant: "default" })}
              href={`${userData.paperlessURL}/documents/${props.id}/details/`}
            >
              Open
            </OpenExternalLink>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button className="w-24" variant="destructive">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the recording.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      const response = await deleteDocument(props.id);
                      if (response.ok) {
                        toast("Pdf deleted", {
                          description: "The recording has been deleted.",
                        });
                      } else {
                        toast("Error deleting pdf", {
                          description:
                            "An error occurred while deleting the pdf.",
                        });
                      }
                      router.back();
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>