import React, { FC } from "react"


const Title: FC = () => {
    const toHome: React.MouseEventHandler = (event) => {
        location.href = "/";
    }

    return (
        <div className="title" onClick={toHome}>
            <h1>You <div>Toep</div></h1>
        </div>
    )
}

export default Title;