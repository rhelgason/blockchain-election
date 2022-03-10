import React, { Component } from "react";

import "../index.css";
import "bulma/css/bulma.min.css";

class Loading extends Component {
	render() {
		return (<>
            <div className="columns pt-5">
                <div className="column is-3"></div>
                <div className="column is-6">
                    <progress class="progress is-large is-info pt-5" max="100">60%</progress>
                </div>
                <div className="column is-3"></div>
            </div>
			<h1 className="title pt-5 has-text-centered">Loading Web3, accounts, and contract...</h1>
		</>);
	}
}

export default Loading;