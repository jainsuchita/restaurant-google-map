
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Link from '@material-ui/core/Link';
import Rating from '@material-ui/lab/Rating';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    imgClass: {
        backgroundSize: "80px 80px",
        height: 80,
        width: 80,
        verticalAlign: "top",
        cursor: "pointer",
    },
    listItemClass: {
        padding: 16,
        borderBottom: "1px solid rgba(63, 81, 181, 0.08)"
    },
    text: {
        whiteSpace: "normal"
    },
    linkClass: {
        flex: "1 1 auto",
    },
    rating: {
        marginTop: 5,
        marginBottom: 2
    },
    ratingGroup: {
        display: "flex",
        alignItems: "center",

        "& span": {
            marginRight: 5,
            marginLeft: 5
        }
    },
    secondaryGroup: {
        display: "flex",
        flexDirection: "column"
    },
    activeListItem: {
        backgroundColor: "rgba(0, 0, 0, 0.16)"
    },
    noResult: {
        textAlign: "center",
        margin: 12
    }
}));

function MuiList({ list, activeItem, onImgClick }) {
    const classes = useStyles();

    const getSecondaryItems = (item) => {
        let titleArray = item.categories && item.categories.map((category) => {
            return category.title
        });

        let text = titleArray.join(", ");

        return (
            <div className={classes.secondaryGroup}>
                <div className={classes.ratingGroup}>
                    <span>{item.rating}</span>
                    <Rating className={classes.rating} readOnly size="small" value={item.rating} precision={0.5} />
                    <span>({item.review_count})</span>
                </div>
                <span>{text}</span>
                <Link
                    target="_blank"
                    rel="noopener"
                    underline="none"
                    className={classes.linkClass}
                    href={item.url}
                    color="secondary"
                >
                    Yelp Review Page
                            </Link>
            </div>
        )
    }

    return (
        list.length > 0 ?
            <List className={classes.root}>
                {
                    list.map((item, index) => {
                        return (
                            <ListItem className={clsx(classes.listItemClass, (activeItem === index) && classes.activeListItem)} key={index}>
                                <ListItemText
                                    classes={{
                                        primary: classes.text,
                                        secondary: classes.text
                                    }}
                                    primary={item.name}
                                    secondary={getSecondaryItems(item)} />

                                <ListItemAvatar>
                                    <img onClick={() => onImgClick(index)}
                                        className={classes.imgClass}
                                        src={item.image_url}
                                        alt="restaurant_pic" />
                                </ListItemAvatar>
                            </ListItem>
                        )
                    })

                }
            </List>
            : <div className={classes.noResult}>No Results</div>
    )
}

export default MuiList;

