import React from "react"
import axios from "axios";

import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

// Local components
import GoogleMapsWrapper from './Map';
import Sidebar from "../Sidebar/Sidebar";
import List from "../List/List";
import LocationSearchInput from "../Search/LocationSearch";
import CustomMarker from "../Marker/Marker";

class MapContainer extends React.PureComponent {
    state = {
        places: [],
        showMarkerInfoIndex: -1
    }

    componentDidMount() {
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
                let center = refs.map.getCenter();

                this.setState({
                    bounds: bounds,
                    center: {
                        lat: center.lat(),
                        lng: center.lng()
                    }
                });
            },
        });

        console.log(refs);
    }

    fetchRestaurants = () => {
        axios.get(`${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search?latitude=${this.state.center.lat}&longitude=${this.state.center.lng}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
                }
            })
            .then((res) => {
                let restaurants = res.data.businesses;
                this.setState({
                    places: restaurants
                })
            })
            .catch((err) => {
                console.log('error:', err);
            })
    }

    getGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
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

    onMapClick = (e) => {
        this.setState({
            center: {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            }
        });
        this.fetchRestaurants();
    }

    render() {
        const { center, onMapMounted, onBoundsChanged, places, showMarkerInfoIndex } = this.state;

        return (
            <GoogleMapsWrapper
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDAQOhuvUriLPgDzVblnSSH7BUj-s2EMSw&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: "100%" }} />}
                containerElement={<div style={{ height: "100vh" }} />}
                mapElement={<div style={{ height: "100%" }} />}
                defaultZoom={10}
                center={center}
                onBoundsChanged={onBoundsChanged}
                onMapMounted={onMapMounted}
                onClick={this.onMapClick}
            >
                <Sidebar>
                    <LocationSearchInput onLocationSelect={this.onLocationSelect} handleCurrentLocation={this.handleCurrentLocation} />
                    <List list={places} activeItem={showMarkerInfoIndex} />
                </Sidebar>

                {
                    places && places.map((item, key) => {
                        return <CustomMarker
                            onMarkerClick={this.onToggleOpen}
                            markerInfoIndex={showMarkerInfoIndex}
                            marker={item}
                            index={key} />
                    })
                }

            </GoogleMapsWrapper >
        )
    }
}

export default MapContainer;
