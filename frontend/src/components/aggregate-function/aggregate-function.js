import React, {useEffect, useState} from "react";
import {ContentState, Editor, EditorState} from "draft-js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {AggregateFunction as AGF} from "../../protobuffer/compiled";
import styles from './aggregate-function.css'

const AggregateFunction = ({element, saveContent}) => {


    const [editorState, setEditorState] = useState(() => EditorState.createWithContent(ContentState.createFromText(element.viewFunction)));
    let [warn, setWarn] = useState('')
    let [showButtonApply, setShowButtonApply] = useState(false)


    useEffect(() => {
        if (element.action !== 'create') {
            setShowButtonApply(true)
        }
    }, [element])


    const validateAndMakeFunction = (text) => {
        try {
            // analize user function
            text = text.toLowerCase();


            // remove double spaces
            text = text.replace(/\s{2,}/g, ' ')
            text = text.replace(/\s\n/g, '\n')

            let match = text.matchAll(/(create){1}[\s\n]?(or[\s\n]+replace)?[\s\n]+(aggregate){1}[\s\n]?(if[\s\n]+not[\s\n]+exists)?[\s\n]+([^\s\n]+)[\s\n]*(\(.*?\))[\s\n]+(sfunc){1}[\s\n]+([^\s\n]+)[\s\n]+(stype)[\s\n]+([^\s\n]+)([\s\n]+finalfunc[\s\n]+[^\s\n]+)?([\s\n]+initcond[\s\n]+[^\s\n;]+)?/g);

            match = Array.from(match);
            if (match.length === 0) {
                setWarn(() => (
                    <span style={{color: "red", marginLeft: 20}}>Function not valid. Please change it! </span>))
            } else {

                if (match[0][2] && match[0][4]) {
                    setWarn(() => (
                        <span style={{color: "red", marginLeft: 20}}> OR REPLACE and IF NOT EXISTS cannot be used together. Please change it! </span>))
                }

                let parameterFunction = match[0][6];


                let signature = parameterFunction.replace(/\((.*)\)/g, '$1');
                signature = signature.trim();

                const name = match[0][5];
                const orReplace = !(match[0][2] === undefined);


                const sFunc = match[0][8];
                const sType = match[0][10];
                const finalFunc = match[0][11] === undefined ? '' : match[0][11];
                const initCond = match[0][12] === undefined ? '' : match[0][12].split('\(\)')[1];
                const keyspace = element.name.split('.')[1]
                const connection = element.name.split('.')[0]


                let userFunction = AGF.create({
                    connection,
                    name, keyspace,
                    orReplace, sFunc, sType,
                    finalFunc,
                    initCond, signature
                })
                let finish = AGF.encode(userFunction).finish();
                saveContent(finish)

            }
        } catch (e) {
            console.log(e)
        }
    }


    return ((<>
            <button type="button" className="btn btn-outline-success"
                    disabled={showButtonApply}
                    onClick={() => validateAndMakeFunction(editorState.getCurrentContent().getPlainText())}
            >
                <FontAwesomeIcon
                    icon={faCheck}/></button>
            {warn}
            <div style={styles.root}>
                <Editor
                    customStyleMap={styles.editor}
                    editorState={editorState}
                    onChange={setEditorState}
                />
            </div>
        </>
    ))
}


export default AggregateFunction;