export default function BodyMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center">
      <div className="mx-auto max-w-sm rounded-lg bg-slate-700 p-4 shadow-md">
        <h1 className="w-full text-center text-2xl font-bold">{children}</h1>
      </div>
    </div>
  );
}
