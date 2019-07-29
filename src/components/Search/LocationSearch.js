import React from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    locationSearchInput: {
        boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0,0,0,0.08)",
        border: "honeydew",
        display: "block",
        width: "100%",
        padding: 16,
        fontSize: 16,
        borderRadius: 2,
        outline: "none",
        boxSizing: "border-box",
    },
    dropdownItems: {
        boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderTop: "none"
    },
    searchBoxRoot: {
        // minHeight: 50,
        borderBottom: "1px solid",
        backgroundColor: "#4285f4",
        padding: 24,
        display: "flex",
        flexDirection: "column"
    },
    inputWrapper: {
        display: "flex",
        position: "relative",
        "& button": {
            position: "absolute",
            right: 12
        },
        "& button:hover": {
            backgroundColor: "transparent"
        }
    },
    itemsClass: {
        padding: 16
    },
    myLocationButton: {
        marginRight: "auto",
        marginTop: "12px"
    }
}));

export default function LocationSearchInput({ onLocationSelect, handleCurrentLocation }) {
    const classes = useStyles();
    const [address, setAddress] = React.useState("");

    const handleChange = address => {
        setAddress(address);
    };

    const handleSelect = address => {
        setAddress(address);
        onLocationSelect(address);
    };

    return (
        <div className={classes.searchBoxRoot}>
            <PlacesAutocomplete
                value={address}
                highlightFirstSuggestion
                onChange={handleChange}
                onSelect={handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                    <React.Fragment>
                        <div className={classes.inputWrapper}>
                            <input
                                {...getInputProps({
                                    placeholder: "Search Places ...",
                                    className: classes.locationSearchInput,
                                })}
                            />
                            <IconButton
                                // onClick={handleSelect}
                                edge="end"
                                aria-label="clear results"
                            >
                                <SearchIcon />
                            </IconButton>
                        </div>
                        <div className={classes.dropdownItems}>
                            {
                                suggestions.map(suggestion => {
                                    const className = classes.itemsClass;
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                        ? { backgroundColor: "#fafafa", cursor: "pointer" }
                                        : { backgroundColor: "#ffffff", cursor: "pointer" };
                                    return (
                                        <div
                                            {...getSuggestionItemProps(suggestion, {
                                                className,
                                                style,
                                            })}
                                        >
                                            <span>{suggestion.description}</span>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <Button variant="contained"
                            color="primary"
                            className={classes.myLocationButton}
                            onClick={handleCurrentLocation}
                        >
                            Use my location
                            </Button>
                    </React.Fragment>
                )}
            </PlacesAutocomplete>
        </div>
    );
}
