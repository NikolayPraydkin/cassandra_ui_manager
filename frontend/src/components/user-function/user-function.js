import React, {Component} from "react";
import {ContentState, Editor, EditorState} from "draft-js";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {UserFunction as UF} from "../../protobuffer/compiled.js"
import styles from './user-function.css';

export default class UserFunction extends Component {


    constructor(props) {
        super(props);
        if (props.element) {

            this.state = {
                editorState: EditorState.createWithContent(ContentState.createFromText(props.element.viewFunction)),
                warn: '',
                showButtopApply: props.element.action !== 'create',
            };

            this.onChange = (editorState) => {

                this.setState(() => {
                    return {editorState}
                });

            }

            this.setEditor = (editor) => {
                this.editor = editor;
            };
            this.focusEditor = () => {
                if (this.editor) {
                    this.editor.focus();
                }
            };

        }

    }

    componentDidMount() {
        this.focusEditor();
    }


    validateAndMakeFunction = (text) => {
        // analize user function
        text = text.toLowerCase();

        // remove double spaces
        text = text.replace(/\s{2,}/g, ' ')
        text = text.replace(/\s\n/g, '\n')

        let match = text.matchAll(/(create){1}[\s\n]?(or[\s\n]replace)?[\s\n]+(function){1}[\s\n]?(if[\s\n]not[\s\n]exists)?[\s\n]+([^\s\n]+)[\s\n]*(\(.*?\)[\s\n])(returns[\s\n]null|called)([\s\n]on[\s\n]null[\s\n]input[\s\n]returns[\s\n])([^\s\n]+)([\s\n]language[\s\n])([^\s\n]+)[\s\n](as[\s\n])('.+')/g);

        match = Array.from(match);
        if (match.length === 0) {
            this.setState(() => {
                return {
                    warn: <span style={{color: "red", marginLeft: 20}}>Function not valid. Please change it! </span>
                }
            })
        } else {

            if (match[0][2] && match[0][4]) {
                this.setState(() => {
                    return {warn: <span style={{color: "red", marginLeft: 20}}> OR REPLACE and IF NOT EXISTS cannot be used together. Please change it! </span>}
                })
            }

            let parameterFunction = match[0][6];


            let signature = parameterFunction.replace(/\((.*)\)/g, '$1');
            signature = signature.trim();

            const name = match[0][5];
            const orReplace = !(match[0][2] === undefined);

            const ifNotExist = !(match[0][4] === undefined);
            const calledOnNullInput = match[0][7].indexOf('called') !== -1;
            const returnType = match[0][9];
            const language = match[0][11];
            const body = match[0][13];
            const keyspace = this.props.element.name.split('.')[1]
            const connection = this.props.element.name.split('.')[0]

            let finish = UF.encode(UF.create({
                connection,
                name, keyspace,
                orReplace, ifNotExist, returnType,
                calledOnNullInput,
                language, body, signature
            })).finish();

            this.props.saveContent(finish)

        }


    }


    render() {

        let {warn, editorState, showButtopApply} = this.state;
        return (<>
                <button type="button" className="btn btn-outline-success"
                        disabled={showButtopApply}
                        onClick={() => this.validateAndMakeFunction(editorState.getCurrentContent().getPlainText())}>
                    <FontAwesomeIcon
                        icon={faCheck}/></button>
                {warn}
                <div style={styles.root} onClick={this.focusEditor}>
                    <Editor
                        customStyleMap={styles.editor}
                        ref={this.setEditor}
                        editorState={editorState}
                        onChange={this.onChange}
                    />
                </div>
            </>
        );

    }

}


