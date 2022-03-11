import React, { Component } from "react";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";
import Loading from "./Loading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import "../index.css";
import "bulma/css/bulma.min.css";

class AdminPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ElectionInstance: undefined,
			account: null,
			web3: null,
			isAdmin: false,
			loading: true,
			candidateName: '',
			start: false,
			end: false
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
			const [owner, start, end] = await Promise.all([
				this.state.ElectionInstance.methods.getOwner().call(),
				this.state.ElectionInstance.methods.getStart().call(),
				this.state.ElectionInstance.methods.getEnd().call()
			]);
			this.setState({
				isAdmin: this.state.account === owner,
				start: start,
				end: end,
				loading: false
			});
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert('Failed to load web3, accounts, or contract. Check console for details.');
			console.error(error);
		}
	};

	operateElection = async () => {
		if (!this.state.start) await this.state.ElectionInstance.methods.start().send({ from: this.state.account });
        else await this.state.ElectionInstance.methods.end().send({ from: this.state.account });
		window.location.reload(false);
	}

	addCandidate = async () => {
		const name = this.state.candidateName;
		if (name === '') return;
		await this.state.ElectionInstance.methods.addCandidate(name).send({ from: this.state.account });
		window.location.reload(false);
	}

	render() {
		if (this.state.loading) return <Loading />
        if (!this.state.isAdmin) {
            return <h1 className="title pt-5 has-text-centered">Sorry, you do not have access to this page.</h1>
        }

		return (<>
			{this.state.start && this.state.end ? <></> : <div className="columns mt-6">
				<div className="column is-3"></div>
				<div className="column is-6">
					<article className="panel is-info is-half">
						<div className="panel-heading level-left">
							<FontAwesomeIcon icon={!this.state.start ? faPlay : faPause} className="fa-2x"/>
							<p className="is-size-3 ml-5">Control the election</p>
						</div>
						<div className="p-3">
							<div className="columns">
								<div className="column is-4"></div>
								<div className="column is-4">
									<button className="button is-primary is-fullwidth" onClick={() => this.operateElection()}>{!this.state.start ? 'Start' : 'Pause'}</button>
								</div>
								<div className="column is-4"></div>
							</div>
						</div>
					</article>
				</div>
				<div className="column is-3"></div>
			</div>}

			<div className="columns mt-6">
				<div className="column is-3"></div>
				<div className="column is-6">
					<article className="panel is-info is-half">
						<div className="panel-heading level-left">
							<FontAwesomeIcon icon={faUserTie} className="fa-2x"/>
							<p className="is-size-3 ml-5">Add a candidate</p>
						</div>
						<div className="p-3">
							<p className="has-text-weight-bold mb-1">Candidate Name:</p>
							<input className="input is-primary mb-3" type="text" placeholder="Enter candidate name"
								value={this.state.candidateName}
								onChange={(e) => { this.setState({ candidateName: e.target.value }) }}>
							</input>
							<button className="button is-primary" onClick={() => this.addCandidate()}>Submit</button>
						</div>
					</article>
				</div>
				<div className="column is-3"></div>
			</div>
		</>);
	}
}

export default AdminPage;