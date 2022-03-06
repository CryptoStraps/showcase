import { FC, useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { EyeOffIcon } from "@heroicons/react/outline";

import { fetcher } from "utils/fetcher";
import { download } from "utils/download";

type Props = {
  details: any;
  onSelect: (id: string) => void;
  onTokenDetailsFetched?: (props: any) => unknown;
};

export const NftCard: FC<Props> = ({
  details,
  onSelect,
  onTokenDetailsFetched = () => {},
}) => {
  const { name, uri } = details?.data ?? {};
  const figRef = useRef<HTMLElement>(null);

  const { data, error } = useSWR(
    // uri || url ? getMetaUrl(details) : null,
    uri,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (!error && !!data) {
      onTokenDetailsFetched(data);
    }
  }, [data, error]);
  const [showingVid, setShowingVid] = useState(false);

  const { image, animation_url } = data ?? {};
  console.log(data, image);

  return (
    <div className={`max-w-xs rounded-md card bordered compact`}>
      <figure
        ref={figRef}
        className="min-h-16 animation-pulse-color"
        style={{ height: figRef?.current?.clientWidth }}
      >
        {!showingVid && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            onMouseEnter={() => setShowingVid(true)}
            src={image}
            alt={name}
          />
        )}
        {!error ? (
          <>
            {showingVid && (
              <video
                autoPlay
                onMouseLeave={() => setShowingVid(false)}
                loop
                muted
                playsInline
                className="video-tile"
                preload="auto"
                title={name}
                poster={image}
              >
                <source src={animation_url} />
              </video>
            )}
          </>
        ) : (
          // Fallback when preview isn't available
          // This could be broken image, video, or audio
          <div className="flex justify-center items-center w-auto h-48 bg-gray-900 bg-opacity-40">
            <EyeOffIcon className="w-16 h-16 text-white-500" />
          </div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="text-sm text-center card-title">{name}</h2>
        <div className="grid grid-cols-2 gap-3 card-actions">
          <a
            className="btn btn-outline"
            href={image}
            target="_blank"
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </a>
          <a
            href={animation_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};
