import axios from "axios";
import React from "react";
import { config } from "./API"
import "./App.css";
import WeatherCard from "./Card";
import LinkBack from "./LinkBack";
import Loading from "./Loading";

export default class App extends React.Component {
    constructor(props) {
        super()
        this.state = {
            loading: false,
            location: "",
            inputWarning: false,
            wdata: {}
        }
    }

    GetData = () => {
        // settings input warning to false
        this.setState({
            inputWarning: false
        })

        // if location is not available
        if (!this.state.location) {
            this.setState({
                inputWarning: "Enter location to continue",
            })
            return;
        }

        // setting loading to true and weather data to {}
        this.setState({
            wdata : {},
            loading: true,
        })

        // sending GET request
        axios.get(
            `https://api.weatherapi.com/v1/current.json?key=${config.API_KEY}&q=${this.state.location}`
        ).then(resp => {
            return resp.data
        })
            .then(response => {
                // if any error in request
                if (response.error) {
                    this.setState({
                        inputWarning: response.error.message,
                        loading: false,
                        wdata: {}
                    })
                    return;
                }
                // set the response to state
                this.setState({
                    loading: false,
                    wdata: response
                })

            })
            .catch(err => {
                if (err.response && err.response.status === 400 && err.response.data)
                    this.setState({
                        inputWarning: err.response.data.error.message,
                        loading: false
                    })
            })
    }

    FormData = e => {
        e.preventDefault();
        this.GetData();
    }

    render() {
        return (
            <div id="App">
                <div id="main">
                    <form onSubmit={this.FormData}>
                        <input type="search" defaultValue={this.state.location} onChange={e => this.setState({ location: e.target.value })} placeholder="Enter Location" style={
                            this.state.inputWarning ?
                                {
                                    "border": "3px solid #a00"
                                }
                                :
                                {}
                        }
                        />
                        
                    </form>
                    {
                        this.state.inputWarning ?
                            <div style={{
                                padding: "5px 1px",
                                "color": "#a00",
                                fontSize: "17px",
                                fontWeight: 700,
                            }}>
                                {this.state.inputWarning}
                            </div>
                            :
                            []
                    }
                    {
                        this.state.loading ?
                            <Loading />
                            :
                            []
                    }
                    {
                        this.state.wdata && this.state.wdata.location && this.state.wdata.current ?
                            <WeatherCard response={this.state.wdata} />
                            :
                            []
                    }
                </div>
                <LinkBack />
            </div>
        )
    }

    componentDidMount() {
        // Getting GeoLocation of user,
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(pos => {
                console.log("ok")
                this.setState({
                    location: `${pos.coords.latitude},${pos.coords.longitude}`
                }, this.GetData)

            })
        }
    }
}
