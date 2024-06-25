export default function DocumentPage({
    params: { id },
  }: {
    params: { id: string };
  }) {
    return <div>{id}</div>;
  }