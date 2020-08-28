import React, {useEffect, useRef, useState} from "react";
import SplitPane from "react-split-pane";
import {ContentState, Editor, EditorState} from "draft-js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronCircleRight} from "@fortawesome/free-solid-svg-icons";
import Service from "../service/service";
import {Rows} from '../../protobuffer/compiled'
import {AutoSizer, Grid, CellMeasurerCache, CellMeasurer} from "react-virtualized";
import styles from './cql-editor.css';

const CqlEditor = ({element}) => {

    const service = new Service();

    const [editorState, setEditorState] = useState(() => EditorState.createWithContent(ContentState.createFromText(element.content ? element.content : '')));
    const [connection] = useState(element.connection);
    const [rows, setRows] = useState([]);
    const [result, setResult] = useState(null);
    const [columnCount, setColumnCount] = useState(0);
    const _cache = useRef(new CellMeasurerCache({
        defaultWidth: 100,
        fixedHeight: true,
    }))


    const executeQuery = () => {

        let query = {query: editorState.getCurrentContent().getPlainText(), connection}
        service.executeQuery(query).then(result => {

            if (result instanceof ArrayBuffer) {

                let uint8View = new Uint8Array(result);

                let rows = Rows.decode(uint8View).rows;

                let ar = [];
                rows.map(item => {
                    try {
                        let parse = JSON.parse(item);
                        ar.push(parse)
                    } catch (e) {
                        ar.push(item)
                    }

                })

                setRows(() => {
                    return ar
                })


                setColumnCount(() => {
                    return ar[0].length
                })




            }

        }).catch(e => {
            console.log(e)
        })
    }


    const _cellRenderer = ({columnIndex, key, parent, rowIndex, style}) => {

        return (
            <CellMeasurer
                cache={_cache.current}
                columnIndex={columnIndex}
                key={key}
                parent={parent}
                rowIndex={rowIndex}>
                <div
                    className={'evenRow cell'}
                    style={{
                        ...style,
                        height: 35,
                        whiteSpace: 'nowrap',
                    }}>
                    {rows[rowIndex][columnIndex]}
                </div>
            </CellMeasurer>
        );
    }


    useEffect(() => {
        if (rows.length > 0 && columnCount > 0) {

            setResult(() => {
                return (
                    <AutoSizer disableHeight>
                        {({width}) => (
                            <Grid
                                className={'BodyGrid'}
                                columnCount={columnCount}
                                columnWidth={_cache.current.columnWidth}
                                deferredMeasurementCache={_cache.current}
                                height={350}
                                overscanColumnCount={0}
                                overscanRowCount={2}
                                cellRenderer={_cellRenderer}
                                rowCount={rows.length}
                                rowHeight={35}
                                width={width}
                            />
                        )}
                    </AutoSizer>
                )
            })

        } else {
            if (result !== null)
                setResult(() => null)
        }
    }, [rows, columnCount])


    return (
        <SplitPane split="horizontal" minSize={150}>
            <div className={'root'} style={styles.root}>
                <button data-placement="bottom" onClick={executeQuery}
                        type="button" className={"btn btn-primary"}><FontAwesomeIcon
                    icon={faChevronCircleRight}/></button>
                <Editor
                    className={'editor'}
                    customStyleMap={styles.editor}
                    editorState={editorState}
                    onChange={setEditorState}
                    placeholder="Enter query ..."/>
            </div>
            {result}
        </SplitPane>
    );

}

export default CqlEditor;



