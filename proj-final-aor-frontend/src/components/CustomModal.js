import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

const CustomModal = ({ title, label, show, onClose, onConfirm, isReadyState, setObservationInput }) => {
    
    if (!show) return null;

    const handleChange = (event) => {
        setObservationInput(event.target.value);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{title}</h3>
                </div>
                <p>{label}</p>

                {isReadyState && (
                    <div className="modal-header">
                        <textarea 
                            className="roboto-regular"
                            placeholder="Observation" 
                            style={{ resize: 'none' }} 
                            onChange={handleChange}
                        />
                    </div>
                )}
                <div className="modal-buttons">
                    <button className="btn-back" onClick={onClose}><FormattedMessage id="back"/></button>
                    <button className="btn-confirm" onClick={onConfirm}><FormattedMessage id="confirm"/></button>
                </div>
            </div>
        </div>
    );
};

export default CustomModal;