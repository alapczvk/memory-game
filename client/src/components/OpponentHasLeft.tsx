import React from 'react';
import logo from "../assets/logo.png";
import {Copy, Headline2} from "./App.styles";

const OpponentHasLeft = () => {
    return (<div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        overflowY: "hidden"
    }}>
        <img
            src={logo}
            alt="Logo"
            style={{
                display: "block",
                margin: "0 auto",
                marginBottom: "16px",
                animation: "logo-animation 3.5s linear infinite"
            }}
            className="logo-animation"
        />
        <Headline2 style={{alignItems: "center"}}>Your opponent left.</Headline2>
            <Copy onClick={() => window.location.reload()}>Refresh page</Copy>
        </div>
);
}
;

export default OpponentHasLeft;
