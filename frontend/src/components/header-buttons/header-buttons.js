import React, {Component} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faLink, faUnlink, faPlug, faEdit, faTrashAlt, faPlusSquare, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
import './header-buttons.css';


export default class HeaderButtons extends Component {
    render() {
        let {
            typeFocus, connected, currentConnection, setAction,
            connect, disconnect, createUserType, createUserFunction, createAggregateFunction, createMaterializedView
            ,createCqlEditor,createTableHandler
        } = this.props;
        return (<div className={'headerbuttons'}>
            <img className={'logo'} />
            <button data-placement="bottom" title="create connection"
                    type="button" className="btn btn-primary btn-sm" data-toggle="modal"
                    data-target={'#createconnection'} onClick={() => setAction('createconnection')}>
                <FontAwesomeIcon icon={faPlug}/>+
            </button>
            <button disabled={connected.includes(currentConnection) || !typeFocus}
                    data-placement="bottom" title="edit connection"
                    onClick={() => setAction('editconnection')}
                    type="button" className="btn btn-primary btn-sm" data-toggle="modal"
                    data-target={'#editconnection'}><FontAwesomeIcon icon={faEdit}/>
            </button>
            <button disabled={connected.includes(currentConnection) || !typeFocus}
                    data-placement="bottom" title="delete connection"
                    type="button" className={"btn btn-primary"}
                    onClick={() => setAction('deleteconnection')}><FontAwesomeIcon
                icon={faTrashAlt}/></button>
            <button data-placement="bottom" title="connect"
                    disabled={connected.includes(currentConnection) || !typeFocus}
                    type="button" className={"btn btn-primary"} onClick={connect}><FontAwesomeIcon
                icon={faLink}/></button>
            <button disabled={!connected.includes(currentConnection) || !typeFocus}
                    data-placement="bottom" title="disconnect"
                    type="button" className={"btn btn-primary"} onClick={disconnect}><FontAwesomeIcon
                icon={faUnlink}/></button>
            <button disabled={!connected.includes(currentConnection)}
                    data-placement="bottom" title="create keyspace"
                    type="button" className={"btn btn-primary"} onClick={() => setAction('createkeyspace')}>
                <FontAwesomeIcon
                    icon={faPlusSquare}/> KS
            </button>
            <button data-placement="bottom" title="create table"
                    disabled={typeFocus !== 'tables' && typeFocus !== 'table'}
                    type="button" className={"btn btn-primary"} onClick={() => createTableHandler()}><FontAwesomeIcon
                icon={faPlusSquare}/> Table
            </button>
            <button data-placement="bottom" title="create user function"
                    disabled={typeFocus !== 'functions' && typeFocus !== 'function'}
                    type="button" className={"btn btn-primary"} onClick={() => createUserFunction()}><FontAwesomeIcon
                icon={faPlusSquare}/> User Func.
            </button>
            <button disabled={typeFocus !== 'agfunctions' && typeFocus !== 'agfunction'}
                    data-placement="bottom" title="create user aggregatin function"
                    type="button" className={"btn btn-primary"} onClick={() => createAggregateFunction()}>
                <FontAwesomeIcon icon={faPlusSquare}/> User Aggregate Func.
            </button>
            <button disabled={typeFocus !== 'types' && typeFocus !== 'type'}
                    data-placement="bottom" title="create user type"
                    type="button" className={"btn btn-primary"} onClick={() => createUserType()}><FontAwesomeIcon
                icon={faPlusSquare}/> User Type
            </button>
            <button disabled={typeFocus !== 'views' && typeFocus !== 'view'}
                    data-placement="bottom" title="create materialized view"
                    type="button" className={"btn btn-primary"} onClick={() => createMaterializedView()}>
                <FontAwesomeIcon
                    icon={faPlusSquare}/> Materialized View
            </button>
            <button data-placement="bottom" title="create user" disabled={!connected.includes(currentConnection)}
                    type="button" className={"btn btn-primary"} onClick={() => setAction('createuser')}><FontAwesomeIcon
                icon={faPlusSquare}/> User
            </button>
            <button data-placement="bottom" title="create role" disabled={!connected.includes(currentConnection)}
                    type="button" className={"btn btn-primary"} onClick={() => setAction('createrole')}><FontAwesomeIcon
                icon={faPlusSquare}/> Role
            </button>
            <button data-placement="bottom" title="cql editor" disabled={!connected.includes(currentConnection)}
                    type="button" className={"btn btn-primary"} onClick={() => createCqlEditor()}>EDITOR
            </button>
            <button data-placement="bottom" title="sign out"
                    type="button" className={"btn btn-primary"} onClick={() => setAction('signout')}><FontAwesomeIcon
                icon={faSignOutAlt}/> EXIT
            </button>

        </div>);
    }

}