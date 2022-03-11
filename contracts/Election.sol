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
    mapping(address => bool) public voters;

    function Election() public {
        owner = msg.sender;
        hasStarted = false;
        hasEnded = false;
        numCandidates = 0;
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

    function getCandidateName(uint _candidateId) public view returns (string) {
        require(_candidateId > 0 && _candidateId <= numCandidates);
        return candidates[_candidateId].name;
    }

    function getCandidateVotes(uint _candidateId) public view returns (uint) {
        require(_candidateId > 0 && _candidateId <= numCandidates);
        return candidates[_candidateId].numVotes;
    }

    function hasVoted() public view returns (bool) {
        if (voters[msg.sender]) {
            return true;
        }
        return false;
    }

    function vote(uint _candidateId) public {
        require(hasStarted == true);
        require(hasEnded == false);
        require(!voters[msg.sender]);
        require(_candidateId > 0 && _candidateId <= numCandidates);
        candidates[_candidateId].numVotes++;
        voters[msg.sender] = true;
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