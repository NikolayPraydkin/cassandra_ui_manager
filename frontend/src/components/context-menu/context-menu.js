import React, {useCallback, useState} from "react";
import {faDatabase} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import './context-menu.css';
const ContextMenu = ({data, style}) => {

    const [styleCustom, setStyleCustom] = useState({});


    const measuredRef = useCallback(node => {
        if (node !== null) {
            let windowHeight = window.innerHeight;

            let heightContext = node.getBoundingClientRect().height;
            let left = style.left;

            let top;
            if ((heightContext+style.top) > windowHeight) {
                top = windowHeight - heightContext - 5;
            } else {
                top = style.top;
            }
           const styleCust = {left, top}
            setStyleCustom(() => styleCust)

        }
    }, [style]);


    if (data !== undefined) {
        let elements = data.map((text, i) => {
            if (text === '') {
                return;
            } else if (text === 'dropdown-divider') {
                return (<div className="dropdown-divider"></div>)
            } else if (text instanceof Object) {

                let arrayAction = text['Generate Command'];

                let elements = arrayAction.map(element => {
                    return (<li className="context-menu__item" key={i}>
                        <span className={"context-menu__item_text"}>
                        {element}
                        </span>
                    </li>)
                });
                return (<li className="dropdown dropup context-menu__item" key={i}>
                    <div className="dropdown-toggle" id="dropdownMenuButton"
                         data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className={"context-menu__item_text"}>Generate Command</span>
                    </div>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        {elements}
                    </div>
                </li>)

            } else {
                return (<li className="context-menu__item" key={i}>
                    <FontAwesomeIcon icon={faDatabase} pulse={false}/>
                    <span className={"context-menu__item_text"}>
                    {text}
                    </span>
                </li>)
            }

        });

        return (
            <nav ref={measuredRef} className={"context-menu"} style={styleCustom ? styleCustom : null}>
                <ul className="context-menu__items">
                    {elements}
                </ul>
            </nav>
        );

    } else {
        return null;
    }

}

export default ContextMenu;