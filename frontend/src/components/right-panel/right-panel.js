import React, {useState, useEffect} from "react";
import Toast from "../toast";
import UserType from "../user-type/user-type";
import UserFunction from "../user-function/user-function";
import AggregateFunction from "../aggregate-function";
import MaterializedView from "../materialized-view";
import CqlEditor from "../cql-editor";
import Table from "../table";
import './right-panel.css';


const $ = window.$;
let lastTime = 0;


const RightPanel = ({dataToast, removeToast, content, saveContent, closeTabPanel}) => {


    let [tabs, setTabs] = useState([null]);
    let [tabsContent, setTabsContent] = useState([null]);
    let [render, setRender] = useState(false);



    const returnTabs = () => {
        if (content.length !== 0 && Array.isArray(content)) {
            let elements = content.map((element, i) => {

                if (element === null) return null;
                if (element.type === 'userType') {

                    return (<li className="nav-item" role="presentation" key={i}>
                        <a style={{padding: 3, fontSize: 15, fontFamily: 'Apple Chancery, cursive'}}
                           className={`nav-link`} id={`type-tab${i}`}
                           data-toggle="tab" href={`#type${i}`} role="tab"
                           aria-controls={`type${i}`} aria-selected='false'>
                            {element.name}
                            <button type="button" className="close" aria-label="Close"
                                    onClick={() => closeTabPanel(`${+i}`)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </a>
                    </li>)
                }

                if (element.type === 'userFunction') {

                    return (<li className="nav-item" role="presentation" key={i}>
                        <a style={{padding: 3, fontSize: 15, fontFamily: 'Apple Chancery, cursive'}}
                           className={`nav-link`} id={`udf-tab${i}`}
                           data-toggle="tab" href={`#udf${i}`} role="tab"
                           aria-controls={`udf${i}`} aria-selected='false'>
                            {element.name}
                            <button type="button" className="close" aria-label="Close"
                                    onClick={() => closeTabPanel(`${+i}`)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </a>
                    </li>)
                }
                if (element.type === 'aggregateFunction') {

                    return (<li className="nav-item" role="presentation" key={i}>
                        <a style={{padding: 3, fontSize: 15, fontFamily: 'Apple Chancery, cursive'}}
                           className={`nav-link`} id={`aggregate-tab${i}`}
                           data-toggle="tab" href={`#aggregate${i}`} role="tab"
                           aria-controls={`aggregate${i}`} aria-selected='false'>
                            {element.name}
                            <button type="button" className="close" aria-label="Close"
                                    onClick={() => closeTabPanel(`${+i}`)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </a>
                    </li>)
                }
                if (element.type === 'view') {

                    return (<li className="nav-item" role="presentation" key={i}>
                        <a style={{padding: 3, fontSize: 15, fontFamily: 'Apple Chancery, cursive'}}
                           className={`nav-link`} id={`view-tab${i}`}
                           data-toggle="tab" href={`#view${i}`} role="tab"
                           aria-controls={`view${i}`} aria-selected='false'>
                            {element.name}
                            <button type="button" className="close" aria-label="Close"
                                    onClick={() => closeTabPanel(`${+i}`)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </a>
                    </li>)
                }
                if (element.type === 'cqleditor') {

                    return (<li className="nav-item" role="presentation" key={i}>
                        <a style={{padding: 3, fontSize: 15, fontFamily: 'Apple Chancery, cursive'}}
                           className={`nav-link`} id={`cqleditor-tab${i}`}
                           data-toggle="tab" href={`#cqleditor${i}`} role="tab"
                           aria-controls={`cqleditor${i}`} aria-selected='false'>
                            {element.name}
                            <button type="button" className="close" aria-label="Close"
                                    onClick={() => closeTabPanel(`${+i}`)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </a>
                    </li>)
                }
                if (element.type === 'table') {

                    return (<li className="nav-item" role="presentation" key={i}>
                        <a style={{padding: 3, fontSize: 15, fontFamily: 'Apple Chancery, cursive'}}
                           className={`nav-link`} id={`table-tab${i}`}
                           data-toggle="tab" href={`#table${i}`} role="tab"
                           aria-controls={`table${i}`} aria-selected='false'>
                            {element.name}
                            <button type="button" className="close" aria-label="Close"
                                    onClick={() => closeTabPanel(`${+i}`)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </a>
                    </li>)
                }
                return null;
            });
            return elements;
        }
    };


    const returnTabsContent = () => {
        if (content.length !== 0 && Array.isArray(content)) {
            return content.map((element, i) => {
                if (element === null) return null;
                if (element.type === 'userType') {

                    return (
                        <div className={`tab-pane fade `} id={`type${i}`} role="tabpanel"
                             aria-labelledby="types-tab">
                            <UserType element={element} saveContent={(content) => supportFunc(content, `${+i}`)}/>
                        </div>
                    )
                }

                if (element.type === 'userFunction') {

                    return (<div className={`tab-pane fade `} id={`udf${i}`} role="tabpanel"
                                 aria-labelledby="udf-tab">
                        <UserFunction element={element} saveContent={(content) => supportFunc(content, `${+i}`)}/>
                    </div>)
                }
                if (element.type === 'aggregateFunction') {

                    return (<div className={`tab-pane fade `} id={`aggregate${i}`} role="tabpanel"
                                 aria-labelledby="aggregate-tab">
                        <AggregateFunction element={element} saveContent={(content) => supportFunc(content, `${+i}`)}/>
                    </div>)
                }
                if (element.type === 'view') {

                    return (<div className={`tab-pane fade `} id={`view${i}`} role="tabpanel"
                                 aria-labelledby="view-tab">
                        <MaterializedView element={element} saveContent={(content) => supportFunc(content, `${+i}`)}/>
                    </div>)
                }
                if (element.type === 'cqleditor') {

                    return (<div className={`tab-pane fade `} id={`cqleditor${i}`} role="tabpanel"
                                 aria-labelledby="cqleditor-tab">
                        <CqlEditor element={element} saveContent={(content) => supportFunc(content, `${+i}`)}/>
                    </div>)
                }
                if (element.type === 'table') {

                    return (<div className={`tab-pane fade `} id={`table${i}`} role="tabpanel"
                                 aria-labelledby="table-tab">
                        <Table element={element} saveContent={(content) => supportFunc(content, `${+i}`)}/>
                    </div>)
                }
                return null;

            });
        }

    }


    useEffect(() => {
        if (content.length === 0 && tabs[0] !== null) {
            setTabs(() => {
                return [null]
            })

            setTabsContent(() => {
                return [null]
            })

        }
        if (content.length !== 0 && Array.isArray(content)) {


            let tabs = returnTabs();
            let tabsContent = returnTabsContent();

            setTabs(() => {
                return [tabs]
            })

            setTabsContent(() => {
                return [tabsContent]
            })

            if (render) {
                setRender(false)
            } else {
                setRender(true)
            }


        }
    }, [content])

    // show tabsContent after render
    useEffect(() => {
        // if (content.length !== 0) {
        // hack... if fast click on create button jQuery not have time set show on focus tab
        if ((performance.now() - lastTime) > 300) {
            lastTime = performance.now();
            let show = '';
            content.forEach((el, i) => {

                if (el && el.show !== '') {
                    show = i;
                }
            });
            if (show !== '') {
                if (content[show].type === 'userType') {
                    $(`#type-tab${show}`).tab('show');
                }
                if (content[show].type === 'userFunction') {
                    $(`#udf-tab${show}`).tab('show');
                }
                if (content[show].type === 'aggregateFunction') {
                    $(`#aggregate-tab${show}`).tab('show');
                }
                if (content[show].type === 'view') {
                    $(`#view-tab${show}`).tab('show');
                }
                if (content[show].type === 'cqleditor') {
                    $(`#cqleditor-tab${show}`).tab('show');
                }
                if (content[show].type === 'table') {
                    $(`#table-tab${show}`).tab('show');
                }
            }
        }

    }, [render])

    const supportFunc = (content, i) => {
        saveContent(content, +i);
    }


    return (
        <div className={"right-panel"}>
            {dataToast ? <Toast removeToast={removeToast} dataToast={dataToast}/> : null}
            <ul className="nav nav-tabs" id={`myTab`} role="tablist">
                {tabs}
            </ul>
            <div className="tab-content" id="myTabContent">
                {tabsContent}
            </div>
        </div>);

};


export default RightPanel;