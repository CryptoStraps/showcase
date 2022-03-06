import { FC } from "react";

import Image from "next/image";

export const Loader: FC = () => {
  return (
    <Image
    src="/loading-white.png"
    alt="Loading"
    width={128}
    height={128}
    className="loading-spinner"
  />
  );
};
