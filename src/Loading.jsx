import React from "react";
import "./Loading.css"
export default class Loading extends React.Component {
    render(){
        return(
            <div className="loading">
                <div className="bar"></div>
            </div>
        )
    }
}