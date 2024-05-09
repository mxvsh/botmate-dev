import React from 'react';

import { Skeleton } from '../ui/skeleton';

function Loader({
  count = 4,
}: {
  count?: number;
}) {
  return (
    <>
      {new Array(count).fill(null).map((_, i) => (
        <div
          className="flex flex-col space-y-3"
          key={i}
        >
          <Skeleton className="h-[125px] rounded-lg" />
          {/* <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div> */}
        </div>
      ))}
    </>
  );
}

export default Loader;
