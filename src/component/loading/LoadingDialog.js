import React from "react";
import "./LoadingDialog.css";

export default function LoadingDialog({
    isLoading
}) {
    const classes = "box centred loading-box " + (isLoading ? "loading" : "not-loading");

    return <div className={classes}>
        Loading...
    </div>;
}
