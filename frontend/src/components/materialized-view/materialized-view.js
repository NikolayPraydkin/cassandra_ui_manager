import React, {useEffect, useState} from "react";
import {ContentState, Editor, EditorState} from "draft-js";
import {MateriliazedView as MV} from "../../protobuffer/compiled";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import styles from './materialized-view.css';

const MaterializedView = ({element, saveContent}) => {


    const [editorState, setEditorState] = useState(() => EditorState.createWithContent(ContentState.createFromText(element.viewFunction)));
    let [warn, setWarn] = useState('')
    let [showButtopApply, setShowButtopApply] = useState(false)


    useEffect(() => {
        if (element.action !== 'create') {
            setShowButtopApply(true)
        }
    }, [element])


    const validateAndMakeFunction = (text) => {
        // analize user function
        text = text.toLowerCase();


        // remove double spaces
        text = text.replace(/\s{2,}/g, ' ')
        text = text.replace(/\s\n/g, '\n')

        let match = text.matchAll(/create[\s\n]+materialized[\s\n]+view[\s\n]+([a-zA-Z_0-9]+)[\s\n]+as[\s\n]+select[\s\n]+(.*)[\s\n]+from[\s\n]+([^\s\n]+)[\s\n]+where[\s\n]?(^(and)$)?[\s\n]+(([\s\n]+and[\s\n]+)??[^\s\n]+[\s\n]+is[\s\n]+not[\s\n]+null)+[\s\n]+primary[\s\n]key[\s\n]+([\s\n]?\(.*\)){1}([\s\n]+with[\s\n]+(.*)+)?/g);

        match = Array.from(match);
        if (match.length === 0) {
            setWarn(() => (<span style={{color: "red", marginLeft: 20}}>Function not valid. Please change it! </span>))
        } else {
            const nameView = match[0][1];
            const select = match[0][2];
            const baseTable = match[0][3];
            let primaryKeyNames = match[0][8].replace(/\((.*)\)/g, '$1');
            const option = match[0][9];

            const connection = element.name.split('.')[0];
            const nameKeySpace = element.name.split('.')[1];


            if(primaryKeyNames){
                if(primaryKeyNames.includes(",")){
                    primaryKeyNames = primaryKeyNames.split(",");
                }
            }

            let includesAllColumns;
            if(select.trim().includes("*")){
                includesAllColumns = true;
            }


            let message = MV.create({name:nameView,select,baseTable,primaryKeyNames,option,connection,nameKeySpace,includesAllColumns});

            let envelope = MV.encode(message).finish();

            saveContent(envelope);
        }
    }


    return ((<>
            <button type="button" className="btn btn-outline-success"
                    disabled={showButtopApply}
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


export default MaterializedView;