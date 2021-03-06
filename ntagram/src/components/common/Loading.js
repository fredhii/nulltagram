import React from 'react'

/**
 * Name: Loading
 * Description: Loading animation
 */
const Loading = () => {
    /* =================================================================== */
    /* HTML */
    /* =================================================================== */
    return (
        <div className="h-100 valign-wrapper justify-content-center">
            <div className="preloader-wrapper big active">
                <div className="spinner-layer spinner-green-only">
                    <div className="circle-clipper left">
                        <div className="circle" />
                    </div>
                    <div className="gap-patch">
                        <div className="circle" />
                    </div>
                    <div className="circle-clipper right">
                        <div className="circle" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loading
