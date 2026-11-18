import TrackCard from "@/components/shared/cards/track-card";

import { trackItems } from "@/lib/constants";

const TrackGroup = () => {
  return (
    <div className="flex w-full flex-col gap-y-4">
      {trackItems.map((track) => (
        <TrackCard key={track.id} track={track as any} />
      ))}
    </div>
  );
};

export default TrackGroup;
