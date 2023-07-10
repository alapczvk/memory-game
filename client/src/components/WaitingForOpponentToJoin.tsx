import React from 'react';
import {Headline2} from "./App.styles";
import logo from '../assets/logo.png';
const WaitingForOpponentToJoin = () => {

	return <div style={{  display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		height: "90vh",
		overflowY: "hidden"}}>
		<style>
			{`
          .logo-animation {
            animation-name: logo-animation;
            animation-duration: 3.5s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            padding: 10px;
          }

          @keyframes logo-animation {
            0% {
              opacity: 0.3;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0.3;
            }
          }
        `}
		</style>
		<img
			src={logo}
			alt="Logo"
			style={{ display: "block", margin: "0 auto", marginBottom: "16px", animation: "logo-animation 3.5s linear infinite" }}
			className="logo-animation"
		/>
		<Headline2>Waiting for opponent to join...</Headline2>
	</div>
};

export default WaitingForOpponentToJoin;

