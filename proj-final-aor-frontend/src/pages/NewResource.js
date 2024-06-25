import React from "react";
import './NewResource.css';
import Header from "../components/header/Header";

const NewResource = () => {
    return (
        <div className="new-resource-container">
            <Header />
            <div className="new-resource-form-container">
                <h1>New Resource</h1>
            </div>
        </div>
    )
};

export default NewResource;