import React from 'react';


export default function Footer() {
    return (
        // awlays at the bottom of the page, even if the content is not enough to fill the page
        <div className="bg-light text-center text-lg-start" 
        style={{ "width": '100%', "bottom": 0, "position": 'fixed',"marginTop": '20px' }}>
            <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                © 2024 Copyright:
                <a className="text-dark" href="https://mdbootstrap.com/">MDBootstrap.com</a>
            </div>
        </div>
    );
}