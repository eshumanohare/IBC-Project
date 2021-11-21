pragma solidity ^0.5.8;

contract AuctionApp {
    
    // Every seller is associated with one or more Auctions
    struct Auction {
        uint auction_id;
        address payable seller_address;
        string name;
        string description;
        uint minimum_price;
        uint end_time;
        uint best_bidder_id;
        uint[] all_bidders_id;
    }
    
    // Every bidder bids on a currently active offer
    struct Offer {
        uint offer_id;
        uint auction_id;
        address payable bidder_address;
        uint price;
    }
    
    // mappings
    
    // Every Auction is associated with a unique id
    mapping(uint => Auction) public all_auctions;
    // Every offer is associated with a unique id
    mapping(uint => Offer) public all_offers;
    
    mapping(address => uint[]) sellers_auctions_list;
    mapping(address => uint[]) bidders_bid_list;
    
    // some counters
    uint private next_auction_id_counter = 1;
    uint private next_offer_id_counter = 1;
    
    function create_auction(string memory auction_name, string memory auction_desc, uint min_price, uint time) public {
        require(min_price > 0, 'minimum_price must be greater than 0');
        require(time > 10000, 'time must be greater than 10000');
        
        uint[] memory offer_id = new uint[](0);
        
        all_auctions[next_auction_id_counter] = Auction(next_auction_id_counter, msg.sender, auction_name, auction_desc, min_price, now + time, 0, offer_id);
        
        sellers_auctions_list[msg.sender].push(next_auction_id_counter);
        next_auction_id_counter++;
    }
    
}