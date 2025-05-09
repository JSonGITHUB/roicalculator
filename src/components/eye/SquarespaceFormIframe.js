import React from 'react';

const SquarespaceFormIframe = () => {
    return (
        <div style={{ position: 'relative', width: '100%', paddingTop: '800px' }}>
            <iframe
                src='https://www.ocusci.com/request-information'
                title='Squarespace Embedded Form'
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                }}
                loading='lazy'
            />
        </div>
    );
};

export default SquarespaceFormIframe;