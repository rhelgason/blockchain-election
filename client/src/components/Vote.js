import React, { Component } from "react";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";
import Loading from "./Loading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

import "../index.css";
import "bulma/css/bulma.min.css";

class Vote extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ElectionInstance: undefined,
			account: null,
			web3: null,
			isAdmin: false,
            loading: true,
            candidates: [],
            selected: null,
            canVote: false
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
			const [owner, start, end, numCandidates, hasVoted] = await Promise.all([
				this.state.ElectionInstance.methods.getOwner().call(),
				this.state.ElectionInstance.methods.getStart().call(),
				this.state.ElectionInstance.methods.getEnd().call(),
                this.state.ElectionInstance.methods.getNumCandidates().call(),
                this.state.ElectionInstance.methods.hasVoted().call()
			]);
            let candidates = []
            for (var i = 1; i <= numCandidates; i++) {
                const name = await this.state.ElectionInstance.methods.getCandidateName(i).call();
                candidates.push({ value: i, label: name });
            }
			this.setState({
				isAdmin: this.state.account === owner,
				start: start,
				end: end,
                candidates: candidates,
                loading: false,
                canVote: !hasVoted
			});
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert('Failed to load web3, accounts, or contract. Check console for details.');
			console.error(error);
		}
	};

	placeVote = async () => {
		const candidate = this.state.selected;
		if (candidate === null) return;
		await this.state.ElectionInstance.methods.vote(candidate.value).send({ from: this.state.account, gas: 1000000 });
		window.location.reload(false);
	}

	render() {
		if (this.state.loading) return <Loading />
        if (!this.state.start) return <h1 className="is-size-2 pt-5 has-text-centered">Sorry, the election has not started yet.</h1>
        if (this.state.end) return <h1 className="is-size-2 pt-5 has-text-centered">Sorry, the election has ended.</h1>
        if (!this.state.canVote) return <h1 className="is-size-2 pt-5 has-text-centered">Sorry, you have already voted.</h1>

		return (<>
			<div className="columns mt-6">
				<div className="column is-3"></div>
				<div className="column is-6">
					<article className="panel is-info is-half">
						<div className="panel-heading level-left">
							<FontAwesomeIcon icon={faClipboardCheck} className="fa-2x"/>
							<p className="is-size-3 ml-5">Vote</p>
						</div>
						<div className="p-3">
							<p className="has-text-weight-bold mb-1">Select a candidate:</p>
                            <Select options={this.state.candidates} onChange={(e) => { this.setState({ selected: e }) }} />
							<button className="button is-primary mt-3" onClick={() => this.placeVote()}>Place vote</button>
						</div>
					</article>
				</div>
				<div className="column is-3"></div>
			</div>
        </>);
	}
}

export default Vote;