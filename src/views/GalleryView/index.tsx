import { FC, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import { Loader } from "components";
import { NftCard } from "./NftCard";
import styles from "./index.module.css";
import { NftTokenAccount } from "@nfteyez/sol-rayz-react";
export const GalleryView: FC = ({}) => {
  const { publicKey } = useWallet();
  const [nftState, setNftState] = useState<any>({
    nfts: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    (async () => {
      try {
        if (publicKey) {
          setNftState({
            nfts: [],
            isLoading: true,
            error: null,
          });
          const publicAddress = await resolveToWalletAddress({
            text: publicKey?.toBase58(),
          });

          const nftArray = (
            await getParsedNftAccountsByOwner({
              publicAddress,
            })
          ).filter((n: any) =>
            n?.data?.creators?.find(
              (creator: any) =>
                !!creator.verified &&
                creator.address ===
                  "9WkExkFaChk59c94JVdSbQeLZQiNbv8FRaANQ1tdFoDj"
            )
          );
          setNftState({
            nfts: nftArray,
            isLoading: false,
            error: null,
          });
        }
      } catch (e) {
        setNftState({
          nfts: [],
          isLoading: false,
          error: e,
        });
      }
    })();
  }, [publicKey]);

  return (
    <div className="container p-8 mx-auto max-w-6xl 2xl:px-0">
      <div className={styles.container}>
        <div className="mb-2 shadow-lg navbar bg-neutral text-neutral-content rounded-box">
          <div className="flex-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-transparent.png" alt="Logo" className="mx-4" style={{height: 32}} />
          </div>
          <div className="flex-1 px-2 mx-2">
            <span className="text-2xl">CryptoStraps - Showcase</span>
          </div>
          <div className="flex-none">
            <WalletMultiButton className="btn btn-ghost" />
          </div>
        </div>

        <div className="pt-2 text-center">
          <div className="p-0 hero min-h-16">
            <div className="w-full text-center hero-content">
              <div className="w-full">
                <div>
                  {nftState.error ? (
                    <div>
                      <h1>Error Occured</h1>
                      {(nftState.error as any)?.message}
                    </div>
                  ) : null}

                  {!nftState.error && nftState.isLoading ? (
                    <div>
                      <Loader />
                    </div>
                  ) : (
                    <>
                      {!publicKey && (
                        <div className="inline-block mx-auto">
                          {" "}
                          <WalletMultiButton />
                        </div>
                      )}
                      {!!publicKey && (
                        <>
                          <div className="mb-6 shadow-lg alert alert-info">
                            <div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="flex-shrink-0 w-6 h-6 stroke-current"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                              </svg>
                              <span>
                                To download directly, right-click a video or
                                image and button and choose &quot;Save Link
                                As...&quot;
                              </span>
                            </div>
                          </div>
                          <NftList
                            nfts={nftState.nfts}
                            error={nftState.error}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type NftListProps = {
  nfts: NftTokenAccount[];
  error?: Error;
};

const NftList = ({ nfts, error }: NftListProps) => {
  if (error) {
    return null;
  }

  if (!nfts?.length) {
    return (
      <div className="pt-16 text-2xl text-center">
        No NFTs found in this wallet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 items-start md:grid-cols-4">
      {nfts?.map((nft) => (
        <NftCard key={nft.mint} details={nft} onSelect={() => {}} />
      ))}
    </div>
  );
};
