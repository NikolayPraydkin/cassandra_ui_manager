import React from "react";
import './left-panel.css';


const LeftPanel = ({connections}) => {
    return (<div className={"left-panel"}>
        <div id={"tree-container"}>
            {connections}
        </div>
    </div>);


}
export default LeftPanel;