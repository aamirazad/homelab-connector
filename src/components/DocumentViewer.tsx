import { getUserData } from "@/app/actions";
import LoadingSpinner from "./loading-spinner";

export default async function DocumentViewer(props: { id: number }) {
  const userData = await getUserData();

  if (!userData) {
    return <h1>Failure</h1>;
  }

  const url = `${userData.paperlessURL}/api/documents${props.id}/preview`;

  return (
    <embed
      src={url}
      className="h-screen w-2/3"
      type="application/pdf"
      width="100%"
      height="100%"
    />
  );
}
