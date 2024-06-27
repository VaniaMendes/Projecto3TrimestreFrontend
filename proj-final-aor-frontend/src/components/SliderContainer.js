import React from 'react';
import './SliderContainer.css';

const SliderContainer = ({ children, isOpen, isResourcesPage }) => {
    const containerClassNames = `slider-container ${isOpen ? 'open' : ''} ${isResourcesPage ? 'resources-page' : ''}`;

    return (
        <div className={`slider-container ${isOpen ? 'dark-background' : ''}`}>
            <div className={containerClassNames}>
                <div className="slider-content">
                    {React.Children.map(children, (child, index) => (
                        <div key={index} className="slider-item">
                            {child}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SliderContainer;