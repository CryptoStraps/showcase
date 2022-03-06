import type { NextPage } from "next";
import Head from "next/head";
import { GalleryView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>CryptoStraps - Showcase</title>
        <meta
          name="description"
          content="Download video and image showcase for your strap."
        />
      </Head>
      <GalleryView />
    </div>
  );
};

export default Home;
