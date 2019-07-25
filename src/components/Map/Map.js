import React from "react"
import { compose, withProps, lifecycle, withState, withHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import _ from "lodash";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";

const MyMapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDAQOhuvUriLPgDzVblnSSH7BUj-s2EMSw&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: "100%" }} />,
        containerElement: <div style={{ height: "100vh" }} />,
        mapElement: <div style={{ height: "100%" }} />,
    }),
    lifecycle({
        componentWillMount() {
            const refs = {}

            this.setState({
                bounds: null,
                center: {
                    lat: 41.9, lng: -87.624
                },
                markers: [],
                onMapMounted: ref => {
                    refs.map = ref;
                },
                onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                },
                onPlacesChanged: () => {
                    const places = refs.searchBox.getPlaces();
                    const bounds = new window.google.maps.LatLngBounds();

                    places.forEach(place => {
                        if (place.geometry.viewport) {
                            bounds.union(place.geometry.viewport)
                        } else {
                            bounds.extend(place.geometry.location)
                        }
                    });
                    const nextMarkers = places.map(place => ({
                        position: place.geometry.location,
                    }));
                    const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

                    this.setState({
                        center: nextCenter,
                        markers: nextMarkers,
                    });
                    // refs.map.fitBounds(bounds);
                },
            })
        },
    }),
    withScriptjs,
    withGoogleMap,
    withState('places', 'updatePlaces', ''),
    withHandlers(() => {
        const refs = {
            map: undefined,
        }
        return {
            onMapMounted: () => ref => {
                refs.map = ref
            },

            fetchPlaces: ({ updatePlaces }) => () => {
                const bounds = refs.map.getBounds();
                const center = refs.map.getCenter();
                const service = new window.google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
                const request = {
                    // location: new window.google.maps.LatLng({ lat: center.lat(), lng: center.lng() }),
                    bounds: bounds,
                    // radius: '500',
                    type: ['restaurant']
                };
                service.nearbySearch(request, (results, status) => {
                    if (status == window.google.maps.places.PlacesServiceStatus.OK) {
                        console.log(results);
                        updatePlaces(results);
                    }
                })
            }
        }
    }),
)((props) =>
    <GoogleMap
        onTilesLoaded={props.fetchPlaces}
        onBoundsChanged={props.fetchPlaces}
        ref={props.onMapMounted}
        defaultZoom={8}
        center={props.center}
        // center={{ lat: props.currentLocation.lat, lng: props.currentLocation.lng }}
        onZoomChanged={props.onZoomChanged}
    >
        <SearchBox
            ref={props.onSearchBoxMounted}
            bounds={props.bounds}
            controlPosition={window.google.maps.ControlPosition.TOP_CENTER}
            onPlacesChanged={props.onPlacesChanged}
        >
            <input
                type="text"
                placeholder="Search Places"
                style={{
                    boxSizing: "border-box",
                    border: "1px solid transparent",
                    width: "240px",
                    height: "32px",
                    marginTop: "27px",
                    padding: "0 12px",
                    borderRadius: "3px",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                    fontSize: "14px",
                    outline: "none",
                    textOverflow: "ellipses",
                }}
            />
        </SearchBox>
        {props.places && props.places.map((place, i) =>
            <Marker key={i} position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }} />
        )}
        {/* {props.isMarkerShown && <Marker position={props.center} onClick={props.onMarkerClick} />} */}
    </GoogleMap >
)

class MapWrapper extends React.PureComponent {
    state = {
        isMarkerShown: false,
        currentLatLng: {
            lat: 0,
            lng: 0
        },
    }

    componentDidMount() {
        this.delayedShowMarker()
    }

    // componentWillUpdate() {
    //     this.getGeoLocation()
    // }

    delayedShowMarker = () => {
        setTimeout(() => {
            this.getGeoLocation();
            this.setState({ isMarkerShown: true })
        }, 3000)
    }

    getGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    console.log("current position", position.coords);
                    this.setState(prevState => ({
                        currentLatLng: {
                            ...prevState.currentLatLng,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    }))
                }
            )
        }
    }

    handleMarkerClick = () => {
        this.setState({ isMarkerShown: false })
        this.delayedShowMarker()
    }

    render() {
        const { currentLatLng } = this.state;

        return (
            <MyMapComponent
                isMarkerShown={this.state.isMarkerShown}
                onMarkerClick={this.handleMarkerClick}
                currentLocation={currentLatLng}
            />
        )
    }
}

export default MapWrapper;
