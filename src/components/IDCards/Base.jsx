import React from 'react';


const BaseID = (
    <>
        <style>
            {`
                .id-card {
                    width: 20em;
                    height: 32em;
                    background-color: #eeeeee;
                    border-radius: 0.75em;
                    // border: 1px solid rgba(255, 255, 255, 0);
                    // padding: 2.5em 2.5em 2.5em 2.5em;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    position: relative;
                    color: #000;
                    overflow: hidden;
                }

                .id-card::before {
                    content: "";
                    position: absolute;
                    top: -100%;
                    left: -100%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle at center, rgba(255, 255, 255, 1), transparent 70%);
                    opacity: 0.5;
                    pointer-events: none;
                    filter: blur(2rem);
                    mix-blend-mode: screen;
                }

                .photo-area {
                    background-color: #ffffff;
                    // margin-bottom: 0.625em;
                    overflow: hidden;
                }
                
                .photo-area img {
                    // width: 100%;
                    height: 100%;
                    object-fit: cover; 
                }

                .name {
                        font-size: 1em;
                        font-weight: 800;
                        color: #000;
                        text-transform: uppercase;
                        margin-bottom: 0.75em;
                }
            `}
        </style>
        <div>
            <div className="id-card">
                <div className="photo-area">
                    <img 
                        src="/data/IMG_6743.jpeg"
                        alt="Student Photo" 
                    />
                </div>
            </div>
        </div>
    </>
);

export default BaseID;
export { BaseID };