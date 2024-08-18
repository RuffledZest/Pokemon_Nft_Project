import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [nfts, setNFTs] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account && account.length > 0) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(ethers.utils.parseEther("1"));
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(ethers.utils.parseEther("1"));
      await tx.wait();
      getBalance();
    }
  };

  const fetchNFTs = async () => {
    const availableNFTs = [];
    for (let i = 0; i < 4; i++) {
      const nft = await atm.nfts(i);
      availableNFTs.push(nft);
    }
    setNFTs(availableNFTs);
  };

  const buyNFT = async (index) => {
    try {
      const tx = await atm.buyNFT(index, { value: ethers.utils.parseEther("1") });
      await tx.wait();
      alert("NFT purchased successfully!");

      fetchNFTs();
      fetchMyNFTs();
      fetchNFTs();
    } catch (err) {
      console.error("Failed to buy NFT:", err);
    }
  };

  const sellNftBackToMarket = async () => {
    try {
      if (myNFTs.length === 0) {
        alert("You have no NFTs to sell.");
        return;
      }
      const tx = await atm.returnallNFTs();
      await tx.wait();
      alert("NFT sold back to market successfully!");

      fetchNFTs();
      fetchMyNFTs();
    } catch (err) {
      console.error("Failed to sell NFT:", err);
    }
  };

  const fetchMyNFTs = async () => {
    const myNFTs = await atm.showMyNFTs();
    setMyNFTs(myNFTs);
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this NFT Marketplace.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your MetaMask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p style={{
          color: "white",
        }}>Your Account: {account}</p>
    
        <div style={{
          
          // backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",

        }} >
          <div style={{
            width: "80%",
            // backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "12px",
            color: "white",
            paddingBottom: "12px",


          }}>

          <h2 style={{
            color: "white",
          }}>Store NFTs</h2>
          <section className="StoreNfts" 
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}>
          {nfts.map((nft, index) => (
            <div key={index}>
              <img src={nft.imageURL} alt={nft.name} width="200" 
              style={{
                borderRadius: "12px",
              }} />
              <p>{nft.name}</p>
              <button onClick={() => buyNFT(index)} disabled={!nft.isForSale}>
                {/* add this gif https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/029b8bd9-cb5a-41e4-9c7e-ee516face9bb/dayo3ow-7ac86c31-8b2b-4810-89f2-e6134caf1f2d.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzAyOWI4YmQ5LWNiNWEtNDFlNC05YzdlLWVlNTE2ZmFjZTliYlwvZGF5bzNvdy03YWM4NmMzMS04YjJiLTQ4MTAtODlmMi1lNjEzNGNhZjFmMmQuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ooubhxjHp9PIMhVxvCFHziI6pxDAS8glXPWenUeomWs to each button */}

                {nft.isForSale ? 
                <div style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  paddingRight: "10px",
                }}>
                  
                  <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/029b8bd9-cb5a-41e4-9c7e-ee516face9bb/dayo3ow-7ac86c31-8b2b-4810-89f2-e6134caf1f2d.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzAyOWI4YmQ5LWNiNWEtNDFlNC05YzdlLWVlNTE2ZmFjZTliYlwvZGF5bzNvdy03YWM4NmMzMS04YjJiLTQ4MTAtODlmMi1lNjEzNGNhZjFmMmQuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ooubhxjHp9PIMhVxvCFHziI6pxDAS8glXPWenUeomWs" alt="Buy NFT" width="50" 
                  style={{
                   borderRadius: "50%",
                  }}/>
                  <p>Buy NFT</p>
                </div>
                 : "Sold Out"}
                
              </button>
            <style jsx>{`
              
                img {
                transition: transform 0.2s;
              }
              img:hover {
                transform: scale(1.1);
              }

              button { 
              background-color: transparent;
              color: white;
              border: 2px solid white;
              color: white;
              
              border-radius: 10px;
              // padding: 10px 20px;
              margin: 10px;
              cursor: pointer;
              transition: 0.3s;
            }
            button:hover {
              background-color: red;
              border: 2px solid white;
              color: white;
              scale: 0.9;
            }

              button:disabled {
                background-color: #cccccc;
                color: #666666;
              }

              

            `}</style>
            </div>
          ))}
          </section>
          </div>
        </div>
        {/* <button  className="btn" onClick={fetchMyNFTs}
        
        >Show my NFTs</button> */}
        <div style={{
          color: "white",
        }}>
          <h2>My NFTs</h2>
          <div style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}>

          {myNFTs.length > 0 ? (
            myNFTs.map((nft, index) => (
              <div key={index}>
                <img src={nft.imageURL} alt={nft.name} width="200" />
                <p>{nft.name}</p>
              </div>
            ))
          ) : (
            <p>You have no NFTs in your collection.</p>
          )}
          </div>
        </div>
        <div>
        <button onClick={() => sellNftBackToMarket()}>Sell NFT</button>
          <style jsx>{`
            button {
              background-color: black;
              color: white;
              border: 2px solid white;
              color: white;
              border-radius: 10px;
              margin: 10px;
              cursor: pointer;
              transition: 0.3s;
              padding: 10px 20px;
            }
            button:hover {
              background-color: green;
              border: 2px solid white;
              color: white;
              scale: 0.9;
            }

          `}</style>
        </div>
      
      </div>
    );
  };

  useEffect(() => {
    getWallet();
    if (account) {
      fetchNFTs();
    }
  }, [account]);

  return (
    <main className="container" style={{
      backgroundImage: "url('https://wallpapers-clan.com/wp-content/uploads/2023/11/cute-pokemon-pikachu-rain-desktop-wallpaper-preview.jpg')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      margin: "0",
      // backgroundAttachment: "fixed",
      backgroundPosition: "center",
      height: "100vh",
      width: "100%",
      backdropFilter: "blur(5px)",
      
    }}>
      <div style={{
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "20px",
        
      }}>

      <header><h1 style={{
        margin: "0",
      }}>Welcome to Prakhar's NFT Marketplace</h1></header>
      {initUser()}
      
      </div>
      <style jsx>{`

* {
  box-sizing: border-box;
  margin: 0;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
header {
  // background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
}
.container {
  text-align: center;
  margin: 0;
  // padding: 40px;
}


`}</style>
    </main>
  );
}
