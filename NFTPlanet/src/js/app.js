App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",

  init: async function() {
    $.getJSON('../data.json', function(data) {
      var artRow = $('#artRow');
      var artTemplate = $('#artTemplate');

      for (i = 0; i < data.length; i ++) {
 
        artTemplate.find('.panel-title').text(`Auction ${i+1}`); 
        artTemplate.find('img').attr('src', data[i].picture);
        artTemplate.find('.art-name').text(data[i].name);  
        artTemplate.find('.art-description').text(data[i].description); 
        artTemplate.find('.min-incr').text(`$${data[i].minimum_increment}`);
        artTemplate.find('.base-price').text(`Started at $${data[i].original_price}`); 

      
        artTemplate.find('.highest-bid').attr('data-id', data[i].id); 
        artTemplate.find('.btn-submit').attr('data-id', data[i].id); 
        artTemplate.find('.input-amount').attr('id',`input-amt-${data[i].id}`); 
        artRow.append(artTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  // Function to intialize web3
  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        window.ethereum.autoRefreshOnNetworkChange = false;
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts'});
        
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    
    return App.initContract();
  },

  // Function to initialize contract
  initContract: function() {
    $.getJSON('Auction.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AuctionArtifact = data;
      App.contracts.Auction = TruffleContract(AuctionArtifact);
    
      // Set the provider for our contract
      App.contracts.Auction.setProvider(App.web3Provider);
      
      // Set up the accounts
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          $("#account").text(account);
        }
      })

      return App.updateAuctionPrices();
    });

    return App.bindEvents();
  },

  bindEvents: function() { 
    $(document).on('click', '.btn-submit', App.handleBid);
  },

  handleInputChanges: function(id, bidAmount){
      var account = App.account;
      var artId = id.split("-")[2];
      var highestBidder = $(document).find('.highest-bidder').eq(artId).text();
      var minIncrement = Number($(document).find('.min-incr').eq(artId).text().slice(1));
      var highestBid = Number($(document).find(`.highest-bid[data-id=${artId}]`).text().slice(1));
      

      if (account !==  highestBidder) {
        if (bidAmount >= highestBid+minIncrement){
          $(document).find(`.btn-submit[data-id=${artId}]`).prop('disabled',false);
        } else {
          $(document).find(`.btn-submit[data-id=${artId}]`).prop('disabled',true);
        }
      } else {
        $(document).find(`.btn-submit[data-id=${artId}]`).prop('disabled',true);
      }

  },

  updateAuctionPrices: function() {
    var auctionInstance;
    
    App.contracts.Auction.deployed().then(function(instance) {
      auctionInstance = instance; 

      return auctionInstance.getArrayOfPrices.call();
    }).then(function(result) {
        for (j=0; j < result.length; j++) {
          $(document).find('.highest-bid').eq(j).text(`$${result[j]}`);
        }
      }).then(function(result) {
        return App.updateAuctionIncreases();
      }).then(function(result) {
        return App.updateHighestBidders();
      }).catch(function(err) {
        console.log(err.message);
      });

  },

  updateAuctionIncreases: function () {
    var auctionInstance;

    App.contracts.Auction.deployed().then(function(instance) {
      auctionInstance=instance;

      return auctionInstance.getArrayOfIncreases.call(); 
    }).then(function(increases) {
      for (j=0;j<increases.length;j++) {
        $(document).find('.incr-in-value').eq(j).text(`${increases[j]}%`);
      }
    }).catch(function(err) {
      console.log(err.message);
    })
      
  },

  updateHighestBidders: function () {
    var auctionInstance;

    App.contracts.Auction.deployed().then(function(instance) {
      auctionInstance=instance;

      return auctionInstance.getHighestBidders.call(); 
    }).then(function(bidders) {
      for (j=0;j<bidders.length;j++) {
        $(document).find('.highest-bidder').eq(j).text(`${bidders[j]}`);
      }
    }).catch(function(err) {
      console.log(err.message);
    })
  },

  handleBid: function(event) {
    event.preventDefault();

    var artId = parseInt($(event.target).data('id'));
    var bid_amount = parseInt($(`#input-amt-${artId}`).val());
    
    var auctionInstance;    
    var account = App.account;
  
    App.contracts.Auction.deployed().then(function(instance) {
      auctionInstance = instance;
  
      return auctionInstance.placeBid(artId, bid_amount, {from: account});
    }).then(function(result) {
      return App.updateAuctionPrices();
    }).catch(function(err) {
      console.log(err.message);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
