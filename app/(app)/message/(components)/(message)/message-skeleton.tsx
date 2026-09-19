import { Skeleton } from "@/components/ui/skeleton";

export default function MessageSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden px-3 py-3 sm:px-6">
      {/* Other person's messages */}

      <div className="flex justify-start">
        <div className="space-y-1">
          <Skeleton className="h-9 w-40 rounded-2xl rounded-bl-md" />
          <Skeleton className="h-2 w-10" />
        </div>
      </div>

      <div className="flex justify-start">
        <Skeleton className="h-9 w-56 rounded-2xl rounded-bl-md" />
      </div>

      {/* Your messages */}

      <div className="flex justify-end">
        <div className="space-y-1">
          <Skeleton className="h-9 w-48 rounded-2xl rounded-br-md" />

          <div className="flex justify-end">
            <Skeleton className="h-2 w-10" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Skeleton className="h-9 w-32 rounded-2xl rounded-br-md" />
      </div>

      <div className="flex justify-start">
        <Skeleton className="h-12 w-64 rounded-2xl rounded-bl-md" />
      </div>
    </div>
  );
}
