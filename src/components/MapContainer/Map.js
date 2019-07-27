import React from 'react';
import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';

const GoogleMapsWrapper = withScriptjs(withGoogleMap(props => {
    return <GoogleMap {...props} ref={props.onMapMounted}>{props.children}</GoogleMap>
}));

export default GoogleMapsWrapper;
