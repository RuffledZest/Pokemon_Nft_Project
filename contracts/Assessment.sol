// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event NFTSoldBackToMarket(address indexed seller, uint256 indexed index);

    struct NFT {
        string name;
        string imageURL;
        address owner;
        bool isForSale;
    }
    
    NFT[] public nfts;
    mapping(address => NFT[]) public userNFTs;

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;

        // Initialize the NFTs in the store
        nfts.push(NFT("SHINY CHARIZARD CARD", "https://images-cdn.ubuy.co.in/6340021a896a155a7c2c4703-charizard-gx-pokemon-gold-card.jpg", address(0), true));
        nfts.push(NFT("SHINY RAYQUAZA CARD", "https://commondatastorage.googleapis.com/images.pricecharting.com/a48fea1c04af223080f844b69a6c3b7c2242a7e0bd95be8c371a4302d20c0b89/1600.jpg", address(0), true));
        nfts.push(NFT("SHINY MEW CARD", "https://images-cdn.ubuy.co.in/634d1a05c30aaf769356c8ac-shining-mew-40-73-holo-rare.jpg", address(0), true));
        nfts.push(NFT("SHINY PIKACHU CARD", "https://images-cdn.ubuy.co.in/634e575db56ab573ea1dc254-detective-pikachu-gx-card-custom-gold.jpg", address(0), true));
    }

    function buyNFT(uint256 index) external payable {
        require(index < nfts.length, "NFT not found");
        NFT storage nft = nfts[index];
        require(nft.isForSale, "NFT not for sale");
        require(msg.value >= 1 ether, "Insufficient funds to purchase NFT");

        nft.owner = msg.sender;
        nft.isForSale = false;
        userNFTs[msg.sender].push(nft);
        balance += msg.value;
    }

    function showMyNFTs() external view returns (NFT[] memory) {
        return userNFTs[msg.sender];
    }

    function returnallNFTs() external {
        for (uint i = 0; i < userNFTs[msg.sender].length; i++) {
            NFT memory nft = userNFTs[msg.sender][i];
            nft.owner = address(0);
            nft.isForSale = true;
            userNFTs[msg.sender][i].isForSale = true;
            nfts.push(nft);
        }
        for (uint i = 0; i < nfts.length; i++) {
            nfts[i].isForSale = true;
        }
        delete userNFTs[msg.sender];
    }
        











    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }
}
