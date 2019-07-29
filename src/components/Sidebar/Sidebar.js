
import React from "react";
import clsx from 'clsx';

// Material ui components
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 400;
const toolbarClass = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 70,
    zIndex: 9999,
    left: drawerWidth,
    backgroundColor: '#fff2af',
    padding: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    // ...theme.mixins.toolbar,
    minHeight: 48,
    '& button': {
        padding: 8
    }
}
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbarIcon: {
        ...toolbarClass,

        '& button:hover': {
            backgroundColor: "transparent"
        }
    },
    iconClassClose: {
        ...toolbarClass,
        left: 0
    },
    drawerPaper: {
        boxSizing: "border-box",
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: 0,
        [theme.breakpoints.up('sm')]: {
            width: 0,
            padding: 0
        },
    },
}));

function Sidebar({ children }) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(true);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const iconClass = clsx(classes.toolbarIcon, !open && classes.iconClassClose);

    return (
        <div className={classes.root}>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}>
                {children}
            </Drawer>

            <div className={iconClass} onClick={toggleDrawer}>
                <IconButton >
                    <ChevronLeftIcon />
                </IconButton>
            </div>


        </div>
    )
}

export default Sidebar;

