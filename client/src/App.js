import React, { Component } from "react";
import Election from "./contracts/Election.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
    }
  }

  componentDidMount = async () => {
    // refresh election instance
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }
    try {
      // basic blockchain setup
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(Election.abi, deployedNetwork && deployedNetwork.address);
      this.setState({ web3, accounts, ElectionInstance: instance });

      // check for election info
      const [owner, start, end] = await Promise.all([
        this.state.ElectionInstance.methods.getOwner().call(),
        this.state.ElectionInstance.methods.getStart().call(),
        this.state.ElectionInstance.methods.getEnd().call()
      ]);
      this.setState({
        isAdmin: this.state.account === owner,
        start: start,
        end: end
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert('Failed to load web3, accounts, or contract. Check console for details.');
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      /* NEED BETTER LOADING SCREEN */
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>You are {this.state.isAdmin ? '' : 'not '}an admin.</h1>
        <h1>The election has {this.state.start ? '' : 'not '}started.</h1>
        <h1>The election has {this.state.end ? '' : 'not '}ended.</h1>
      </div>
    );
  }
}

export default App;