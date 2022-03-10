// SPDX-License-Identifier: MIT
pragma solidity ^0.4.17;

contract Election {
    // model variables
    address public owner;
    bool hasStarted;
    bool hasEnded;
    uint public numCandidates;
    struct Candidate {
        uint id;
        string name;
        uint numVotes;
    }
    mapping(uint => Candidate) public candidates;
    uint public numVoters;
    struct Voter {
        address voterAddress;
        string name;
        bool hasVoted;
        bool isVerified;
    }
    mapping(address => Voter) public voters;

    function Election() public {
        owner = msg.sender;
        hasStarted = false;
        hasEnded = false;
        numCandidates = 0;
        numVoters = 0;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    // restrict functions to admin view
    modifier adminOnly() {
        require(msg.sender == owner);
        _;
    }

    function addCandidate(string _name) public adminOnly {
        numCandidates++;
        candidates[numCandidates] = Candidate({
            id: numCandidates,
            name: _name,
            numVotes: 0
        });
    }

    function getNumCandidates() public view returns (uint) {
        return numCandidates;
    }

    function requestVoter(string _name) public {
        numVoters++;
        voters[msg.sender] = Voter({
            voterAddress: msg.sender,
            name: _name,
            hasVoted: false,
            isVerified: false
        });
    }

    function getNumVoters() public view returns (uint) {
        return numVoters;
    }

    function verifyVoter(address _address) public adminOnly {
        voters[_address].isVerified = true;
    }

    function vote(uint candidateId) public {
        require(hasStarted == true);
        require(hasEnded == false);
        require(voters[msg.sender].hasVoted == false);
        require(voters[msg.sender].isVerified == true);
        candidates[candidateId].numVotes++;
        voters[msg.sender].hasVoted = true;
    }

    function start() public adminOnly {
        hasStarted = true;
    }

    function end() public adminOnly {
        hasEnded = true;
    }

    function getStart() public view returns (bool) {
        return hasStarted;
    }

    function getEnd() public view returns (bool) {
        return hasEnded;
    }
}