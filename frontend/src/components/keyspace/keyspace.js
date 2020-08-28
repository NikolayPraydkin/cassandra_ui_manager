import React, {Component} from "react";
import {faPlusCircle, faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import './keyspace.css';

const $ = window.$;

export default class Keyspace extends Component {
    state = {
        title: '',
        id: '',
        nameKS: '',
        strategy: '',
        repl_factor: '',
        durable_writes: false,
        focus: '',
        dcElements: [],
        warn: '',
        excludes: []
    }

    componentDidMount() {
        $(`#${this.props.id}`).modal('show')
        if (this.props.objectForEdit) {
            if (this.props.objectForEdit.replication) {
                let strategy = '';
                let repl_factor = '';
                let elements = [];
                if (this.props.objectForEdit.replication.class.includes('Simple')) {
                    strategy = 'simple';
                    repl_factor = +this.props.objectForEdit.replication.replication_factor;
                } else {
                    strategy = 'topology';
                    Object.keys(this.props.objectForEdit.replication).forEach(prop => {

                        if (prop !== 'class') {
                            elements.push({dc: prop, number: +this.props.objectForEdit.replication[prop]})
                        }
                    })
                }

                this.setState(() => {
                    return {
                        durable_writes: this.props.objectForEdit.durableWrites,
                        nameKS: this.props.objectForEdit.name,
                        strategy: strategy,
                        repl_factor: repl_factor,
                        dcElements: elements,

                    }
                })
            }

        }
        if(this.props.excludes){
            this.setState(() => {
                return {
                    excludes: this.props.excludes
                }
            })
        }
    }

    onChange = (e) => {
        let id = e.target.id;
        let value = e.target.value;
        if (id === 'nameKS') {
            if(this.state.excludes.includes(value)){
                this.setWarn(value)
            }else{

                this.setState(() => {
                    return {
                        nameKS: value,
                        warn: ''
                    }
                })
            }
        }
        if (id === 'simple' || id === 'topology') {
            this.setState(() => {
                return {
                    strategy: id
                }
            })
        }
        if (id === 'repl_factor') {
            this.setState(() => {
                return {
                    repl_factor: value
                }
            })
        }
        if (id === 'durable_writes') {
            let checked = e.target.checked;
            this.setState(() => {
                return {
                    durable_writes: checked
                }
            })
        }
        if (e.target.closest('.dcelement')) {
            let index = +e.target.closest('.dcelement').id;

            if (this.state.dcElements.length !== 0) {

                let oldItem = this.state.dcElements[index];

                let newItem;
                if (e.target.className === 'name_dcelement') {
                    newItem = {...oldItem, 'dc': e.target.value};
                }
                if (e.target.className === 'count_dcelement') {
                    newItem = {...oldItem, 'number': e.target.value};
                }

                let start = this.state.dcElements.slice(0, index);
                let end = this.state.dcElements.slice(index + 1);
                let newElements = [...start, newItem, ...end]
                this.setState(() => {
                    return {dcElements: newElements}
                })
            }


        }

    }

    handleActionButton = (e) => {
        let closest = e.target.closest('.btn');
        if (closest.id === 'addbutton') {
            if (this.state.dcElements instanceof Array) {
                let copy = this.state.dcElements.slice();
                copy.push({dc: 'dc', number: 2})
                this.setState(() => {
                    return {dcElements: copy, focus: ''}
                })
            } else {
                return;
            }
        }
        if (closest.id === 'removebutton') {
            if (this.state.focus !== '') {
                if (this.state.dcElements.length !== 0) {
                    let start = this.state.dcElements.slice(0, this.state.focus);
                    let end = this.state.dcElements.slice(this.state.focus + 1);
                    let newElements = [...start, ...end]
                    let focus = this.state.focus;
                    this.setState(() => {
                        return {dcElements: newElements, focus: --focus}
                    })
                }
            }
            return;
        }
    }
    makeElements = (elements) => {

        if (elements.length !== 0) {

            return elements.map((element, i) => {

                return (
                    <tr id={i} className={'dcelement'}>
                        <td><input className={'name_dcelement'} value={element.dc}/></td>
                        <td><input className={'count_dcelement'} type={'number'} value={+element.number}/></td>
                    </tr>
                )
            })
        }

    }

    setFocus = (e) => {
        let closest = e.target.closest('.dcelement');
        if (closest) {
            let id = closest.id;
            if (document.querySelector('.dcelement.focus')) {
                document.querySelector('.dcelement.focus').classList.toggle('focus');
            }

            closest.classList.toggle('focus')
            this.setState(() => {
                return {focus: +id}
            })
        }

    }

    render() {
        let {strategy, nameKS, repl_factor, durable_writes, dcElements, warn} = this.state;
        return (
            <div className="modal fade" id={this.props.id} data-backdrop="static" data-keyboard="false" tabIndex="-1"
                 role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"
                                id="staticBackdropLabel">{this.props.id === 'createkeyspace' ? 'Create Keyspace' : 'Edit Keyspace'}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                    onClick={this.props.close}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onChange={this.onChange}>
                                <div><span>Keyspace name</span> <input id={'nameKS'} value={nameKS}
                                                                       disabled={this.props.id !== 'createkeyspace'}/>
                                    {warn}
                                </div>

                                <input type={'radio'} name={'strategy'} id={'simple'} checked={strategy === 'simple'}/>
                                <label htmlFor="simple">Use simple strategy</label>

                                <div><span>Replication factor</span> <input style={{width: '50px', marginLeft: '10px'}}
                                                                            disabled={strategy !== 'simple'}
                                                                            type={'number'} id={'repl_factor'}
                                                                            value={repl_factor}/></div>

                                <input type={'radio'} name={'strategy'} id={'topology'}
                                       checked={strategy === 'topology'}/>
                                <label htmlFor="topology">Use network topology strategy</label>

                                <table className="table" hidden={strategy !== 'topology'} onClick={this.setFocus}>
                                    <thead>
                                    <tr>
                                        <th scope="col">Data Center</th>
                                        <th scope="col">Number of replicas</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.makeElements(dcElements)}
                                    </tbody>
                                </table>

                                <div hidden={strategy !== 'topology'}>
                                    <div className="dropdown-divider"></div>
                                    <button type={'button'} className={'btn btn-outline-success'}
                                            style={{marginLeft: '10px'}} id={'addbutton'}
                                            onClick={this.handleActionButton}>
                                        <FontAwesomeIcon icon={faPlusCircle}/>
                                    </button>
                                    <button type={'button'} className={'btn btn-outline-warning'}
                                            style={{marginLeft: '10px'}} id={'removebutton'}
                                            onClick={this.handleActionButton}>
                                        <FontAwesomeIcon icon={faTrashAlt}/>
                                    </button>

                                    <div className="dropdown-divider"></div>
                                </div>

                                <div>
                                    <input type="checkbox" checked={durable_writes} id={'durable_writes'}/> <label
                                    htmlFor={'durable_writes'}>Durable writes</label>
                                </div>
                            </form>

                        </div>
                        <div className="modal-footer">
                            <button onClick={this.closeModal} type="button" className="btn btn-secondary"
                                    data-dismiss="modal">Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={this.createKS} disabled={strategy === '' || warn}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    setWarn(value) {
        this.setState(() => {
            return {
                warn: <span style={{color: "red", fontSize: 12}}>this keyspace already exists</span>,
                nameKS: value
            }
        })
    }

    closeModal = () => {
        this.setState(() => {
            return {
                title: '',
                id: '',
                nameKS: '',
                strategy: '',
                repl_factor: '',
                durable_writes: false,
                focus: '',
                dcElements: [],
                warn: ''
            }
        })
        this.props.close()
    }

    createKS = () => {
        let KS
        let {repl_factor, nameKS, durable_writes, dcElements} = this.state;
        if (this.state.strategy === 'simple') {
            let map = new Map();
            map.set('class', 'simple');
            map.set('replication_factor', repl_factor + '');
            KS = {
                name: nameKS, durableWrites: durable_writes, replication:
                    Object.fromEntries(map.entries())
            }

        } else if (this.state.strategy === 'topology') {
            let map = new Map();
            map.set('class', 'topology');
            if (dcElements.length !== 0) {
                dcElements.forEach(element => {
                    map.set(element.dc, element.number + '');
                })
            }

            KS = {name: nameKS, durableWrites: durable_writes, replication: Object.fromEntries(map.entries())}
        }
        this.props.createKS(KS);

    }
}