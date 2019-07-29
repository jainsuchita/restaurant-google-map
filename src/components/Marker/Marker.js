import React from "react";
import { Marker, InfoWindow } from "react-google-maps";

// Material ui Components
import Link from '@material-ui/core/Link';

// Local components
import pinIcon from "images/pin-red.png";
import pinGreen from "images/pin-green.png";

function CustomMarker({ marker, index, onMarkerClick, markerInfoIndex }) {
    return (
        <Marker
            key={index}
            position={{ lat: marker.coordinates.latitude, lng: marker.coordinates.longitude }}
            onClick={() => onMarkerClick(index)}
            title="Click here for more details"
            icon={{ url: markerInfoIndex !== index ? pinIcon : pinGreen, scaledSize: { width: 50, height: 50 }, }}
        >
            {markerInfoIndex === index &&
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
