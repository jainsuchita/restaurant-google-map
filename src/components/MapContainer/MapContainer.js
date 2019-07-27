import React from "react"
import axios from "axios";
import { Marker, InfoWindow } from "react-google-maps";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import Link from '@material-ui/core/Link';

import MuiDrawer from "./Drawer";
import LocationSearchInput from "./LocationSearch";
import GoogleMapsWrapper from './Map';
import List from "./List";
import pinIcon from "images/pin.png";
import pinGreen from "images/pingreen.png";

class MapContainer extends React.PureComponent {
    state = {
        places: [],
        showMarkerInfoIndex: -1
    }

    componentDidMount() {
        this.fetchRestaurants();
    }

    fetchRestaurants = (title) => {

        console.log(this.state.center, title);

        axios.get(`${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search?latitude=${this.state.center.lat}&longitude=${this.state.center.lng}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
                }
            })
            .then((res) => {
                let restaurants = res.data.businesses;
                console.log(restaurants);
                this.setState({
                    places: restaurants
                })
            })
            .catch((err) => {
                console.log('error')
            })
    }

    componentWillUpdate() {
        this.fetchRestaurants();
    }

    componentWillMount() {
        let refs = {};

        this.setState({
            markers: [],
            bounds: null,
            center: {
                lat: 41.9, lng: -87.624
            },
            onSearchBoxMounted: ref => {
                refs.searchBox = ref;
            },
            onMapMounted: map => {
                refs.map = map;
            },
            onBoundsChanged: () => {
                let bounds = refs.map.getBounds();
                this.setState({
                    bounds: bounds,
                    center: refs.map.getCenter()
                });
                // this.fetchRestaurants();
            },
        });
    }

    getGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    console.log("current position", position.coords);
                    this.setState(({
                        center: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    }))
                }
            )
        }
    }

    onLocationSelect = (address) => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(position => {
                this.setState({
                    center: {
                        lat: position.lat,
                        lng: position.lng
                    }
                });
                this.fetchRestaurants();
            })
            .catch(error => console.error("Error", error));
    }

    onToggleOpen = (index) => {
        this.setState({
            showMarkerInfoIndex: index
        });
    }

    handleCurrentLocation = () => {
        this.getGeoLocation();
    }

    render() {
        const { center, onMapMounted, onBoundsChanged, places, showMarkerInfoIndex } = this.state;

        return (
            <GoogleMapsWrapper
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDAQOhuvUriLPgDzVblnSSH7BUj-s2EMSw&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: "100%" }} />}
                containerElement={<div style={{ height: "100vh" }} />}
                mapElement={<div style={{ height: "100%" }} />}
                defaultZoom={8}
                center={center}
                onBoundsChanged={onBoundsChanged}
                onMapMounted={onMapMounted}
            >
                <MuiDrawer>
                    <LocationSearchInput onLocationSelect={this.onLocationSelect} handleCurrentLocation={this.handleCurrentLocation} />
                    <List list={places} activeItem={showMarkerInfoIndex} />
                </MuiDrawer>

                {
                    places && places.map((item, i) => {
                        return (
                            <Marker key={i}
                                position={{ lat: item.coordinates.latitude, lng: item.coordinates.longitude }}
                                onClick={() => this.onToggleOpen(i)}
                                title="Click here for more details"
                                icon={{ url: showMarkerInfoIndex !== i ? pinIcon : pinGreen, scaledSize: { width: 23, height: 32 }, }}
                            >
                                {showMarkerInfoIndex === i &&
                                    <InfoWindow onCloseClick={this.onToggleOpen}>
                                        <Link
                                            target="_blank"
                                            rel="noopener"
                                            underline="none"
                                            href={item.url}
                                            color="primary"
                                        >
                                            {item.name}
                                        </Link>
                                    </InfoWindow>
                                }
                            </Marker>
                        );
                    })
                }
            </GoogleMapsWrapper >
        )
    }
}

export default MapContainer;
