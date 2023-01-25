// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract BuyMeACoffee{
    //Event to emit when a memo is created
    event NewMemo(
                address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo Struct
    struct Memo{
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //List of all memos
    Memo[] memos;

    //Address of Contract deployer
    address payable owner;

    constructor(){
        owner=payable(msg.sender);
    }

    modifier onlyOwner{
        require(msg.sender==owner,"Only Owner allowed to call this function");
        _;
    }

    /**
    @dev Returns the address of the contract owner
     */
    function getOwner() public view returns(address){
        return owner;
    }
    /**
    * @dev Buy a coffee for the contract owner
    * @param _name Name of the coffee buyer
    * @param _message Message from the coffee buyer      
    */
    function BuyCoffee(string memory _name, string memory _message) public payable{
        //Check that the transaction has some value sent 
        require(msg.value>0,"You cant buy a cofee with 0 eth");
        
        //Push the memo to the memo list.
        memos.push(Memo(msg.sender,block.timestamp,_name,_message));

        //Emit an event after the transaction is sent
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
    * @dev Send the Entire balance stored in the contract to the owner

    */
    function WithdrawTips() public onlyOwner(){
        owner.transfer(address(this).balance);
    }

    /**
    * @dev Get a list of all Memos
    */
    function getAllMemos() public view returns(Memo[] memory){
        return memos;
    }


}