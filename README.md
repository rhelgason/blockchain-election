# blockchain-election
This system simulates an election using blockchain technology to ensure both the confidentiality and integrity of votes. Every voter has a randomly generated ID that is used to insert their vote to the chain. The ID provides anonymity for each user, and the decentralized nature of the blockchain ensures the integrity of the election.

## Development Environment
Setting up the development environment was incredibly difficult for me because the concepts were to grasp. I came into this project with a fair understanding of blockchain but translating these concepts to a hands-on project was not simple. The application utilizes Ethereumn blockchain coupled with Ganache for the system’s backend. I also set up Truffle to compile the smart contracts and migrate them to the development environment. Truffle provides ten free accounts with Ethereum gas for testing purposes, so I limited the project scope to this at first. Below is the command line output of running the smart contract migrations:

<p align="center">
  <img src="https://github.com/rhelgason/blockchain-election/blob/main/img/migrations.PNG" alt="migrations"/>
</p>

Ganache provides a GUI that is useful for tracking blockchain transactions. A sample of the system is shown below. Note that the first user address has already used some of its Ethereum gas. This address corresponds to the system administrator, who spent gas initiating the election:

<p align="center">
  <img src="https://github.com/rhelgason/blockchain-election/blob/main/img/ganache.PNG" alt="ganache"/>
</p>

For the front end, I designed a graphical user interface so that users could more easily vote in the election. I used React to define the front-facing website for the blockchain election coupled with the Bulma library to enhance the user experience.

## Smart Contract
The smart contract for the blockchain election was written in Solidity. The main architecture for the smart contract includes an array of candidate structures and a list of voter IDs. The system defines a single administrator who populates candidates, starts the election, and determines when the voting closes.

Every user who accesses the frontend GUI can place their vote for any of the candidates only a single time. The smart contract maintains a running list of all user IDs that have already placed their votes to ensure that no user is voting multiple times. Each candidate structure includes a running tally of votes so that, when the election concludes, it is easy to determine which candidate won the popular vote.

Originally, I had included a more fleshed-out structure for each voter, but I decided it was not necessary. Much of the novelty of blockchain resides in the anonymity, so storing additional voter information such as name and political affiliation was unwarranted. The smart contract also defines that once a user places a vote, their vote is validated by other peers on the decentralized peer-to-peer network before it can be placed on the blockchain, ensuring the election's integrity.

## Front End
The system administrator can add candidates, start the election, and stop the election. The smart contract recognizes the only admin by the user ID of the person who initiated the election blockchain. The admin page shown below is only available to the system administrator:

<p align="center">
  <img src="https://github.com/rhelgason/blockchain-election/blob/main/img/admin_page.PNG" alt="admin page"/>
</p>

When the admin adds a candidate, the backend is queried to update the array of candidates. The candidate is given a name, unique ID, and a count of votes initialized to zero.

Any user can navigate to the voting screen to place their vote for any of the candidates. Once a vote has been placed, the vote will be validated and added to the blockchain, at which point the user cannot place another vote. The home screen maintains a running total of the current election:

<p align="center">
  <img src="https://github.com/rhelgason/blockchain-election/blob/main/img/results.PNG" alt="election results"/>
</p>

When the system administrator eventually ends the election process, the vote counts are finalized and the blockchain stops accepting any more votes.
