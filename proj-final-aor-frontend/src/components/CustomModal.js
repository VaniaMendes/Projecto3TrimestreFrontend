import React from "react";
import { FormattedMessage } from "react-intl";

const CustomModal = ({ title, label, show, onClose, onConfirm }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title}</h3>
                <p>{label}</p>
                <div className="modal-buttons">
                    <button className="btn-back" onClick={onClose}><FormattedMessage id="back"/></button>
                    <button className="btn-confirm" onClick={onConfirm}><FormattedMessage id="confirm"/></button>
                </div>
            </div>
        </div>
    );
};

export default CustomModal;