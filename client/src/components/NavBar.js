import React, { Component } from "react";
import { Link } from "react-router-dom";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonBooth } from '@fortawesome/free-solid-svg-icons';

import "../index.css";
import "bulma/css/bulma.min.css";

class NavBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ElectionInstance: undefined,
			account: null,
			web3: null,
			isAdmin: false,
            loading: true
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

    render() {
        return (
            <div className="navbar is-info has-text-weight-bold is-size-5">
                <div className="navbar-brand p-3">
                    <FontAwesomeIcon icon={faPersonBooth} className="fa-2x"/>
                </div>
                <div className="navbar-menu">
                    <div className="navbar-start is-bold">
                        <Link to='/' className="navbar-item">Home</Link>
                        {/*<Link to='/candidates' className="navbar-item">Candidates</Link>
                        <Link to='/addvoter' className="navbar-item">Apply to Vote</Link>*/}
                        <Link to='/vote' className="navbar-item">Vote</Link>
                    </div>
                    {!this.state.isAdmin ? <></> : <div className="navbar-end pr-3">
                        <Link to='/admin' className="navbar-item">Admin Page</Link>
                    </div>}
                </div>
            </div>
        );
    }
}

export default NavBar;