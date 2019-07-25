import React from "react"
import { compose, withProps, lifecycle } from "recompose"
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
    // withState('zoom', 'onZoomChange', 8),
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
                onBoundsChanged: () => {
                    this.setState({
                        bounds: refs.map.getBounds(),
                        center: refs.map.getCenter(),
                    })
                },
                // onZoomChanged: ({ onZoomChange, onMapBoundsChange }) => () => {
                //     onZoomChange(refs.map.getZoom());
                //     onMapBoundsChange(refs.map.getBounds());
                // },
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
                    refs.map.fitBounds(bounds);
                },
            })
        },
    }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={8}
        center={props.center}
        onBoundsChanged={props.onBoundsChanged}
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
        {props.isMarkerShown && <Marker position={props.center} onClick={props.onMarkerClick} />}
    </GoogleMap >
)

class MapWrapper extends React.PureComponent {
    state = {
        isMarkerShown: false,
        // mapPosition: {
        //     lat: this.props.center.lat,
        //     lng: this.props.center.lng
        // },
        markerPosition: {
            lat: -34.397,
            lng: 150.644
        }
    }

    componentDidMount() {
        this.delayedShowMarker()
    }

    delayedShowMarker = () => {
        setTimeout(() => {
            this.setState({ isMarkerShown: true })
        }, 3000)
    }

    handleMarkerClick = () => {
        this.setState({ isMarkerShown: false })
        this.delayedShowMarker()
    }

    render() {
        const { markerPosition } = this.state;

        return (
            <MyMapComponent
                isMarkerShown={this.state.isMarkerShown}
                onMarkerClick={this.handleMarkerClick}
                markerPosition={markerPosition}
            />
        )
    }
}

export default MapWrapper;
