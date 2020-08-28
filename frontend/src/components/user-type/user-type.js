import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPlusCircle, faEdit, faMinusCircle} from "@fortawesome/free-solid-svg-icons";
import * as _ from 'lodash'

const $ = window.$;

export default class UserType extends Component {


    state = {
        fields: [],
        modal: false,
        dataForModal: '',
        indexFocusElement: -1,
        nameType: '',
        changed: [],
        action: '',
        process: '',

    }

    constructor(props) {
        super();
        if (props.element.fields) {
            let nameType = '';
            if (props.element.action === 'edit') {
                nameType = props.element.name.split('.')[2];
            }
            this.state = {nameType, fields: props.element.fields, action: props.element.action, changed: []}

        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.element.fields !== this.props.element.fields) {
            let nameType = this.state.nameType;
            this.setState(() => {
                return {
                    fields: this.props.element.fields
                }
            })
        }
    }

    onChange = (e) => {
        if (e) {
            let value = e.target.value;
            this.setState(() => {
                return {nameType: value}
            })
        }
    }


    render() {
        let {fields, modal, dataForModal, nameType, action} = this.state;
        return (<div>
            <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                <div className="btn-group mr-2" role="group" aria-label="First group">
                    <button type="button" className="btn btn-outline-secondary"
                            onClick={this.applyType}
                            disabled={(fields.length === 0 || nameType === '')}
                            title="to apply type"><FontAwesomeIcon
                        icon={faCheck}/></button>
                    <button type="button"
                            className="btn btn-outline-secondary"
                            onClick={this.addType}
                    ><FontAwesomeIcon icon={faPlusCircle}/>
                    </button>
                    <button type="button" className="btn btn-outline-secondary"
                            disabled={fields.length === 0}
                            onClick={this.editType}
                    ><FontAwesomeIcon
                        icon={faEdit}/></button>

                    <button type="button" className="btn btn-outline-secondary"
                            disabled={fields.length === 0}
                            hidden={action === 'edit'}
                            onClick={this.deleteType}><FontAwesomeIcon
                        icon={faMinusCircle}/></button>


                </div>
            </div>

            <div><span>Name</span> <input onChange={this.onChange} value={nameType} disabled={action === 'edit'}/></div>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Data Type</th>
                </tr>
                </thead>
                <tbody onClick={this.setFocus}>
                {this.makeFields(fields)}
                </tbody>
            </table>

            {modal ? <SupportModalWindow data={dataForModal} save={this.save}/> : null}
        </div>);
    }

    setFocus = (e) => {
        let closestTR = e.target.closest('.type-field');
        let element = closestTR.querySelector('.type-field-name');
        if (element) {
            if (this.state.fields.length > 0) {

                let copyFields = _.cloneDeep(this.state.fields);
                //reset focus
                copyFields.forEach(el => {
                    if (el.focus) {
                        delete el.focus;
                    }
                })

                let index = this.state.fields.findIndex(el => el.name === element.innerHTML);
                copyFields[index].focus = true;

                this.setState(() => {
                    return {fields: copyFields, indexFocusElement: index}
                })
            }
        }

    }

    save = (object) => {
        if (object) {
            let newArrayFields = []
            let {fields, indexFocusElement} = this.state;
            if (fields.length > 0) {
                newArrayFields = _.cloneDeep(fields);
            }
            let copyChanged;
            if (this.state.process === 'editing') {
                // edit field
                if (this.state.action === 'edit') {
                    copyChanged = _.cloneDeep(this.state.changed);

                    let findNewField = copyChanged.findIndex(el => {
                            if (el.add) {
                                return el.add.name === newArrayFields[indexFocusElement].name
                            }
                        }
                    );
                    if (findNewField > -1) {
                        copyChanged[findNewField] = {add: object};
                    } else {

                        // {changeOriginal : [origin type, previously type]}
                        let findOrigin = copyChanged.findIndex(el => {
                                if (el.changeOriginal) {
                                    return el.changeOriginal[1].name === newArrayFields[indexFocusElement].name
                                }
                            }
                        );
                        if (findOrigin > -1) {
                            copyChanged[findOrigin].changeOriginal[1] = object;
                        } else {
                            copyChanged.push({
                                changeOriginal: [newArrayFields[indexFocusElement],
                                    object]
                            })
                        }
                    }
                }
                newArrayFields[indexFocusElement] = object;
            } else {
                //add field

                if (this.state.action === 'edit') {
                    copyChanged = _.cloneDeep(this.state.changed);
                    copyChanged.push({add: object})
                }

                newArrayFields.push(object)
            }
            if (this.state.action === 'edit') {
                this.setState(() => {
                    return {fields: newArrayFields, modal: false, indexFocusElement: -1, changed: copyChanged,}
                })
            } else {
                this.setState(() => {
                    return {fields: newArrayFields, modal: false, indexFocusElement: -1}
                })
            }

        } else {
            this.setState(() => {
                return {modal: false}
            })
        }
    }

    makeFields = (elements) => {

        if (elements.length !== 0) {

            return elements.map((element, i) => {

                if (element.focus) {
                    return (
                        <tr className={'type-field'} style={{backgroundColor: '#91dca2'}}>
                            <td className={'type-field-name'}>{element.name}</td>
                            <td>{element.type}</td>
                        </tr>
                    )
                } else {
                    return (
                        <tr className={'type-field'}>
                            <td className={'type-field-name'}>{element.name}</td>
                            <td>{element.type}</td>
                        </tr>
                    )
                }
            })
        }
    }

    applyType = () => {
        let {nameType, fields, changed} = this.state;
        if (this.props.element.action === 'create') {
            this.props.saveContent({nameType, fields, path: this.props.element.name, action: 'create'})
        }
        if (this.props.element.action === 'edit') {
            this.props.saveContent({nameType, changed, path: this.props.element.name, action: 'edit'})
            this.setState(() => {
                return {changed: []}
            })
        }

    }

    addType = () => {
        let excludes = [];
        if (this.state.fields.length > 0) {
            this.state.fields.forEach(element => {
                excludes.push(element.name)
            })
        }

        let data = {
            title: 'New Field',
            field: '',
            type: '',
            excludesNames: excludes,
            action: this.props.element.action
        }
        this.setState(() => {
            return {modal: true, dataForModal: data, process: 'adding'}
        })
    }

    editType = () => {
        let {indexFocusElement, fields} = this.state;
        if (indexFocusElement > -1) {
            let field = fields[indexFocusElement];
            let excludes = [];

            fields.forEach((element, i) => {
                if (i !== indexFocusElement) {
                    excludes.push(element.name)
                }
            })

            let data = {
                title: 'Edit Field',
                field: field.name,
                type: field.type,
                excludesNames: excludes,
                action: this.props.element.action
            }
            this.setState(() => {
                return {modal: true, dataForModal: data, process: 'editing'}
            })
        }
    }

    deleteType = () => {
        if (this.state.indexFocusElement > -1) {
            let cloneDeep = _.cloneDeep(this.state.fields);
            let newFields = cloneDeep.slice();
            newFields.splice(this.state.indexFocusElement, 1);

            this.setState(() => {
                return {fields: newFields, indexFocusElement: -1}
            })
        }
    }
}

class SupportModalWindow extends Component {
    state = {
        title: 'New Field',
        field: '',
        type: '',
        excludesNames: [],
        warn: '',
        action: ''
    }


    setWarn(value) {
        this.setState(() => {
            return {
                warn: <span style={{color: "red"}}> this name already uses </span>,
                field: value
            }
        })
    }

    constructor(props) {
        super();
        try {
            this.state = {
                title: props.data.title ? props.data.title : '',
                field: props.data.field ? props.data.field : '',
                type: props.data.type ? props.data.type : '',
                excludesNames: props.data.excludesNames ? props.data.excludesNames : [],
                warn: '',
                action: props.data.action ? props.data.action : ''
            }
        } catch (e) {
        }

    }

    componentDidMount() {
        $('#support-modal').modal('show');
    }

    onChange = (e) => {
        if (e.target) {
            try {
                let value = e.target.value;
                if (e.target.className === 'nameField') {
                    if (this.state.excludesNames.includes(value)) {
                        this.setWarn(value)
                    } else {
                        let newState = {field: value}
                        if (this.state.warn !== '') {
                            newState.warn = ''
                        }
                        this.setState(() => {
                            return newState
                        })
                    }

                } else {
                    this.setState(() => {
                        return {type: value}
                    })
                }
            } catch (e) {
            }

        }

    }

    render() {
        let {field, type, warn, action, title} = this.state;

        let isdisAbledInput = (action === 'edit' && title === 'Edit Field') ||
            (action === 'edit' && title === 'New Field' && field === '')

        let isDisableOkButton = type === '' || warn !== '' || field === '';
        return (
            <div className="modal fade" id="support-modal" data-backdrop="static" data-keyboard="false"
                 tabIndex="-1"
                 role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                    onClick={() => this.saveField()}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body" onChange={this.onChange}>

                            <div><span>Field name</span> <input className={'nameField'} value={field}
                            />{warn}</div>
                            <div><span style={{float: 'left'}}>Type</span>

                                <select className="custom-select mr-sm-2" disabled={isdisAbledInput}>
                                    {this.getSelectList(type)}
                                </select>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                    onClick={() => this.saveField()}>Cancel
                            </button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal"
                                    disabled={isDisableOkButton}
                                    onClick={() => this.saveField('save')}>OK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    saveField = (e) => {
        if (e) {
            let newField = {name: this.state.field, type: this.state.type}
            this.props.save(newField)
        } else {
            this.props.save()
        }

    }

    getSelectList = (type) => {
        //todo: include custom type from system_schema.types SET LIST MAP NEED ANOTHER
        const types = ['', 'ascii', 'bigint', 'blob', 'boolean', 'counter', 'date', 'decimal',
            'double', 'duration', 'float', 'inet', 'int',
            'smallint', 'text', 'time', 'timestamp', 'timeuuid', 'tinyint', 'tuple',
            'uuid', 'varchar', 'varint']


        let index = types.findIndex(element => element === type.toLowerCase());

        return types.map((element, i) => {
            if (i === index) {
                return (<option selected>{element}</option>);
            } else {
                return (<option>{element}</option>);
            }

        })

    }
}

