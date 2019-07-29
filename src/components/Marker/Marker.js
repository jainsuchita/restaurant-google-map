import React from "react";
import { Marker, InfoWindow } from "react-google-maps";

// Material ui Components
import Link from '@material-ui/core/Link';

// Local components
import pinIcon from "images/pin.png";
import pinGreen from "images/pingreen.png";

function CustomMarker({ marker, key, onMarkerClick, markerInfoIndex }) {
    return (
        <Marker
            key={key}
            position={{ lat: marker.coordinates.latitude, lng: marker.coordinates.longitude }}
            onClick={() => onMarkerClick(key)}
            title="Click here for more details"
            icon={{ url: markerInfoIndex !== key ? pinIcon : pinGreen, scaledSize: { width: 23, height: 32 }, }}
        >
            {markerInfoIndex === key &&
                <InfoWindow onCloseClick={onMarkerClick}>
                    <Link
                        target="_blank"
                        rel="noopener"
                        underline="none"
                        href={marker.url}
                        color="primary"
                    >
                        {marker.name}
                    </Link>
                </InfoWindow>
            }
        </Marker>
    );
}

export default CustomMarker;
