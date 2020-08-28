import React, {Component} from "react";
import Service from "../service/service";
import Spinner from "../spinner";
import LocalStorageService from "../service/local-storage-service";
import './create-connection.css';

const $ = window.$;


export default class CreateConnection extends Component {


    fetchService = new Service();
    storage = new LocalStorageService();


    state = {
        connection_alias: 'connection',
        host: '',
        port: '',
        connect: 'No connected',
        loading: false,
        authUser: '',
        authPass: '',
        checkerAuth: false
    };

    componentDidMount() {
        $(`#${this.props.id}`).modal('show')
        if (this.props.focus) {
            this.setProperties(this.props.focus)
        }
    }

    setProperties = (focus) => {
        if (Array.isArray(this.storage.get()))
            this.storage.get().forEach(object => {
                if (focus === JSON.parse(object).connection_alias) {
                    let {connection_alias: alias, host: h, port: p, authUser: u, authPass: pass, checkerAuth: check} = JSON.parse(object);
                    this.setState(({connection_alias, host, port, authUser, authPass}) => {
                        return {
                            connection_alias: alias,
                            host: h,
                            port: p,
                            authUser: u,
                            authPass: pass,
                            checkerAuth: check
                        }
                    });
                }
            })
    }

    componentDidUpdate(prevProps) {
        if (this.props.focus !== prevProps.focus || (this.props.focus !== '' && this.state.host === '')) {
            this.setProperties(this.props.focus)
        }
    }


    sendTest = () => {
        this.setState(() => {
            return {loading: true, connect: ''}
        });
        let {host, port, authUser, authPass} = this.state;
        this.fetchService.testConnection(host, port, authUser, authPass).then((data) => {
            this.setState(({connect}) => {
                return {connect: data, loading: false}
            });

        })
    };

    clearFields = () => {
        this.setState(({host, port, connect, authUser, authPass}) => {
            return ({host: '', port: '', connect: '', authUser: '', authPass: '', checkerAuth: false})
        })
        this.props.close()
    }

    saveConnection = () => {
        let focus = this.props.focus;
        let {host, port, connection_alias, authUser, authPass, checkerAuth} = this.state;
        let connection = JSON.stringify({host, port, connection_alias, authUser, authPass, checkerAuth});
        // edit section
        if (this.props.id === 'editconnection') {
            try {
                this.storage.edit(focus, connection);
                this.clearFields();
                this.props.save(connection);
                $(`#${this.props.id}`).modal('hide');
            } catch (e) {
                this.props.save(null);
                this.setState(({connect}) => {
                    return {connect: '\'' + connection_alias + '\' already exists'}
                })
            }

        } else {
            try {
                this.storage.save(connection);
                this.clearFields();
                this.props.save(connection);
                $(`#${this.props.id}`).modal('hide');
            } catch (e) {
                this.props.save(null);
                this.setState(({connect}) => {
                    return {connect: '\'' + connection_alias + '\' already exists'}
                })
            }
        }

    }


    onChange = (e) => {
        let id = e.target.id;
        let value = e.target.value;
        if (id === 'host') {
            this.setState(({host}) => {
                return {host: value}
            })
        }
        if (id === 'port') {
            this.setState(({port}) => {
                return {port: value}
            })
        }
        if (id === 'alias') {
            this.setState(({connection_alias}) => {
                return {connection_alias: value}
            })
        }
        if (id === 'auth_checkbox') {
            const condition = e.target.checked;
            this.setState(({checkerAuth}) => {
                return {checkerAuth: condition}
            })
            //todo: ?
            document.querySelectorAll('.authForm').forEach(e => e.disabled = condition)

        }
        if (id === 'user_auth') {
            this.setState(({authUser}) => {
                return {authUser: value}
            })
        }
        if (id === 'user_pass') {
            this.setState(({authPass}) => {
                return {authPass: value}
            })
        }


    }


    render() {
        const {connect, host, port, loading, authPass, authUser, checkerAuth} = this.state;
        let spiner;
        if (loading) {
            spiner = <Spinner/>;
        }
        let error;
        if (connect !== 'Connected') {
            if (connect.length > 50) {
                error = 'error scroll'
            } else {
                error = 'error'
            }
        }

//todo: use authentication add label tag
        return (
            <div>
                <div className="modal fade" id={this.props.id} data-backdrop="static" data-keyboard="false"
                     tabIndex="-1"
                     role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">
                                    {this.props.id === 'createconnection' ? 'Create Connection' : 'Edit Connection'}
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                        onClick={this.props.close}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body">

                                <form onChange={this.onChange}>
                                    <table >
                                        <thead>
                                        <tr>
                                            <th scope="col">Host</th>
                                            <th scope="col">Port</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td><input
                                                type='text'
                                                id='host'
                                                value={host}/></td>
                                            <td><input
                                                type='number'
                                                id='port'
                                                value={port}
                                                min={1024}
                                                max={65535}/></td>
                                        </tr>
                                        </tbody>
                                        <div style={{alignContent: 'flex-end'}}><input type="checkbox"
                                                                                       id={'auth_checkbox'}
                                                                                       checked={checkerAuth}
                                        /> Use
                                            autentification
                                        </div>

                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <div><span>User</span> <input className={"authForm"} type="text"
                                                                          disabled={!checkerAuth}
                                                                          value={authUser === '' ? '' : authUser}
                                                                          style={{paddingLeft: '30%'}}
                                                                          id={"user_auth"}/></div>
                                            <div>Password <input type="password" className={"authForm"}
                                                                 value={authPass === '' ? '' : authPass}
                                                                 disabled={!checkerAuth}
                                                                 id={"user_pass"}/></div>
                                        </div>
                                        <button onClick={this.sendTest} style={{marginTop: '5px'}}
                                                id='button' type="button" className="btn btn-primary float-left">TEST
                                        </button>
                                        {spiner}
                                    </table>
                                    <div>Connection alias <input type={"text"}
                                                                 style={{marginLeft: '10px'}}
                                                                 id={"alias"}
                                                                 value={this.state.connection_alias}/></div>
                                    <div className={`valid ${error}`}>
                                        <span>{connect === 'No connected' ? '' : connect}</span>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                        onClick={this.clearFields}>Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={this.saveConnection}
                                >SAVE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}