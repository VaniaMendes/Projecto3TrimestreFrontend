import React from 'react';
import './SliderContainer.css';

const SliderContainer = ({ children, isOpen }) => {

    return (
        <div className={`slider-container ${isOpen ? 'open' : ''}`}>
            <div className="slider-content">
                {React.Children.map(children, (child, index) => (
                    <div key={index} className="slider-item">
                        {child}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SliderContainer;
