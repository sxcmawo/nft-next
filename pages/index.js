import Head from 'next/head'
import Image from 'next/image'
import { Erica_One, Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { Contract, providers, ethers } from 'ethers';
import React, { useState, useEffect, useRef } from 'react';
import Web3Modal from 'web3modal';
import { NFT_CONTRACT_ADDRESS, abi } from '@/constants';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [nfts, setNFTs] = useState(0);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 97) {
      window.alert("Change Network");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const safeMint = async() => {
    try{
      const signer = await getProviderOrSigner(true);
      console.log(signer);

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

      const tx = await nftContract.safeMint(signer.getAddress(),{
        value: ethers.utils.parseEther("0.001")
      });
      console.log(tx)

      await getNFTs();
    } catch (error){
        console.error(error);
    }
  };

  const getNFTs = async () => {
    try{
      const signer = await getProviderOrSigner(true);
      console.log(signer);

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

      const tx = Number(await nftContract.balanceOf(signer.getAddress()));
      setNFTs(tx);

    } catch (error) {
        console.error(error);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      return(
        <div className={styles.buttoncontainer}>
          <h2>You can mint NFTs</h2>
          <button className={styles.button} onClick={safeMint}>Mint</button>
        </div>
      );
    } else {
      return(
        <button className={styles.button} onClick={connectWallet}>Connect Wallet</button>
      );
    }
  };

  const connectWallet = async()=>{
    try{
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error('Some error occured')
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 97,
        providerOptions: {},
        disableInjectedProvider: false,
      })
      connectWallet()
      getNFTs();
    }
    getNFTs();
  }, [walletConnected]);



  return (
    <div>
      <Head>
        <title>NFT Minter</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <h1>Basic Web3 App on React</h1>
          <br/>
          <div className={styles.buttoncontainer}>
            
          </div>
        </div>
        <div>
          <br/>
          <div className={styles.buttoncontainer}>
            {renderButton()}
          </div>
          <br/>
          <div className={styles.buttoncontainer}>
            <h2>You have {nfts} NFTs</h2>
          </div>
            <br/>
          <div className={styles.container}>
      <div className={styles.card}>
        <img src="/0.png" className={styles.cardimage} />
        <div className={styles.cardcontent}>
          <h2>NFT #0</h2>
        </div>
      </div>
      <div className={styles.card}>
        <img src="/1.png" className={styles.cardimage} />
        <div className={styles.cardcontent}>
        <h2>NFT #1</h2>
        </div>
      </div>
      <div className={styles.card}>
        <img src="/2.png" className={styles.cardimage} />
        <div className={styles.cardcontent}>
        <h2>NFT #2</h2>
        </div>
      </div>
    </div>
    <div className={styles.buttoncontainer}>
            <h2>See all tokens <a href='https://testnets.opensea.io/collection/alien-cats'><i>here</i></a></h2>
          </div>
        </div>
      </main>
    </div>
  );
}