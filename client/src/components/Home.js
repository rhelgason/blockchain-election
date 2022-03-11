import React, { Component } from "react";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";
import Loading from "./Loading";

import "../index.css";
import "bulma/css/bulma.min.css";

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ElectionInstance: undefined,
			account: null,
			web3: null,
			isAdmin: false,
            loading: true,
            candidates: []
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
			this.setState({ web3: web3, account: accounts[0], ElectionInstance: instance });

			// check for election info
			const [owner, start, end, numCandidates] = await Promise.all([
				this.state.ElectionInstance.methods.getOwner().call(),
				this.state.ElectionInstance.methods.getStart().call(),
				this.state.ElectionInstance.methods.getEnd().call(),
                this.state.ElectionInstance.methods.getNumCandidates().call()
			]);
            let candidates = []
            for (var i = 1; i <= numCandidates; i++) {
                const [name, votes] = await Promise.all([
                    this.state.ElectionInstance.methods.getCandidateName(i).call(),
                    this.state.ElectionInstance.methods.getCandidateVotes(i).call()
                ]);
                candidates.push({ id: i, name: name, votes: parseInt(votes) });
            }
			this.setState({
				isAdmin: this.state.account === owner,
				start: start,
				end: end,
                candidates: candidates,
                loading: false
			});
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert('Failed to load web3, accounts, or contract. Check console for details.');
			console.error(error);
		}
	};

	render() {
		if (this.state.loading) return <Loading />

		return (<>
            <h1 className="is-size-2 pt-5 has-text-centered">Election Results</h1>
            <div className="columns">
                <div className="column is-3"></div>
                <div className="column is-6">
                    <hr className="is-divider"></hr>
                    <table className="table is-fullwidth">
                        <thead><tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Votes</th>
                        </tr></thead>
                        <tbody>
                            {this.state.candidates.map(candidate => {
                                return <tr>
                                    <th>{candidate.id}</th>
                                    <th>{candidate.name}</th>
                                    <th>{candidate.votes}</th>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <hr className="is-divider pb-0"></hr>
                </div>
                <div className="column is-3"></div>
            </div>
            <h1 className="is-size-6 has-text-centered">Your account ID is: {this.state.account}</h1>
        </>);
	}
}

export default Home;