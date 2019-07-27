import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
    inputClass: {
        '& input': {
            padding: 16
        }
    }
    // textField: {
    //     flexBasis: '100%',
    // },
}));

function MuiSearch({ searchInputRef }) {

    const classes = useStyles();
    const [value, setValue] = React.useState("");

    const handleChange = event => {
        setValue(event.target.value);
    };

    // const handleClickShowPassword = () => {
    //     setValues({ ...values, showPassword: !values.showPassword });
    // };
    return (
        <div className={classes.root}>
            <TextField
                id="filled-adornment-restautants"
                className={clsx(classes.margin, classes.textField)}
                variant="filled"
                type={"text"}
                placeholder="Search Restaurants"
                value={value}
                fullWidth
                onChange={(e) => handleChange(e)}
                InputProps={{
                    className: classes.inputClass,
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                edge="end"
                                aria-label="search"
                            // onClick={handleClickShowPassword}
                            >
                                <SearchIcon />

                            </IconButton>
                            {/* <div style={{ borderRight: '0.1em solid black', padding: '0.5em' }}></div> */}
                            <IconButton
                                edge="end"
                                aria-label="clear results"
                            // onClick={handleClickShowPassword}
                            >
                                <CloseIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </div>
    )
}

export default MuiSearch;

