import React, {useEffect, useState} from "react";
import Service from "../service/service";
import {Role as R} from "../../protobuffer/compiled.js";


const $ = window.$;

const Role = ({id, close, exclud, connect, save, roleForEdit}) => {

    const service = new Service();
    const [nameRole, setNameRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [excludes, setExcludes] = useState('');
    const [warn, setWarning] = useState('');
    const [warnPassword, setWarningPassword] = useState('');
    const [isSuperUser, setSuperUser] = useState(false);
    const [isCanLogin, setCanLogin] = useState(false);
    const [connection, setConnection] = useState(false);
    const [responseQuery, setResponse] = useState('');
    const [errorResult, setErrorResult] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        $(`#${id}`).modal('show')

        setConnection(connect);


        if (id === 'createrole' || id === 'createuser') {

            if (id === 'createuser') {
                setTitle('Create User')
            }
            if (id === 'createrole') {
                setTitle('Create Role')
            }
            setExcludes(() => exclud)
        } else {
            if (id === 'edituser') {
                setTitle('Edit User')
            }
            if (id === 'editrole') {
                setTitle('Edit Role')
            }
            setExcludes(() => exclud)
            setNameRole(roleForEdit.name)
            if (roleForEdit.options) {
                let map = new Map(Object.entries(roleForEdit.options));
                if (map.has('login')) {
                    if (map.get('login') === 'true') {
                        setCanLogin(true)
                    }
                }
                if (map.has('superuser')) {
                    if (map.get('superuser') === 'true') {
                        setSuperUser(true)
                    }
                }
            }
        }


    }, []);

    useEffect(() => {
        if (password && confirm_password) {
            if (password !== confirm_password) {
                setWarningPassword(() => <span style={{color: "red", fontSize: 12}}>passwords not equals</span>)
            } else {
                setWarningPassword(() => '');
            }
        } else {
            if (warnPassword !== '')
                setWarningPassword(() => '');
        }

    }, [password, confirm_password])


    const chooseHandleFunction = (typeAction, data) => {
        if (typeAction === 'createrole' || typeAction === 'createuser') {
            return service.createRole(data)
        }
        if (typeAction === 'editrole' || typeAction === 'edituser') {
            return service.editRole(data)
        }

    }


    const createRole = () => {
        let options = {};

        options["password"] = password;

        if(id === 'createuser'){
            options["login"] = "true";
        }

        if(id !== 'edituser' && id !== 'createuser') {
            options["login"] = isCanLogin + '';
        }

        options["superuser"] = isSuperUser + '';


        let message = R.create({name: nameRole, connection, options})

        let data = R.encode(message).finish();

        chooseHandleFunction(id, data).then(result => {
            try {
                if (result instanceof ArrayBuffer) {
                    let response = new TextDecoder("utf-8").decode(result);

                    if (response.includes("successfully")) {
                        setErrorResult(() => '');
                        setResponse(() => response);
                        setTimeout(() => {
                            save(id);
                        }, 1000)

                    } else {
                        setErrorResult(() => 'error scroll');
                        setResponse(() => response);
                    }


                }
            } catch (e) {
                let textDecoder = new TextDecoder("utf-8").decode(result);
                if (textDecoder.length > 50) {
                    setErrorResult(() => 'error scroll')
                } else {
                    setErrorResult(() => 'error')
                }
                setResponse(() => textDecoder);

            }


        }).catch(e => {
                let
                    textDecoder = new TextDecoder("utf-8").decode(e);
                if (textDecoder.length > 50) {
                    setErrorResult(() => 'error scroll')
                } else {
                    setErrorResult(() => 'error')
                }
                setResponse(() => textDecoder);
            }
        )
    }

    const setWarn = (value) => {
        setWarning(() => <span style={{color: "red", fontSize: 12}}>this role already exists</span>);
        setNameRole(() => value);
    }
    const onChange = (e) => {
        let id = e.target.id;
        let value = e.target.value;
        if (id === 'nameRole') {
            if (excludes.includes(value)) {
                setWarn(value)
            } else {
                setWarning(() => '');
                setNameRole(() => value);
            }
        }
        if (id === 'super_user') {
            let checked = e.target.checked;
            setSuperUser(() => checked)
        }
        if (id === 'can_login') {
            let checked = e.target.checked;
            setCanLogin(() => checked)
        }
        if (id === 'password') {
            setPassword(() => value)
        }
        if (id === 'confirm_password') {
            setConfirmPassword(() => value)
        }
    }
    //todo: show password icon and implementation
    return (
        <div className="modal fade" id={id} data-backdrop="static" data-keyboard="false" tabIndex="-1"
             role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"
                            id="staticBackdropLabel">{title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={close}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onChange={onChange}>
                            <div><span>Role name</span> <input id={'nameRole'} value={nameRole}
                                                               disabled={id !== 'createrole' && id !== 'createuser'}/>
                                {warn}
                            </div>

                            <div><span>Password</span> <input id={'password'} type={'password'} value={password}
                            />{warnPassword}
                            </div>

                            <div><span>Confirm Password</span> <input id={'confirm_password'} type={'password'}
                                                                      value={confirm_password}
                            />{warnPassword}</div>

                            <div>
                                <input type="checkbox" checked={isSuperUser} id={'super_user'}/> <label
                                htmlFor={'super_user'}>Superuser</label>
                            </div>
                            <div hidden={id === 'createuser'}>
                                <input type="checkbox" checked={isCanLogin} id={'can_login'}/> <label
                                htmlFor={'can_login'}>Can login</label>
                            </div>
                            <div className={`valid ${errorResult}`}>{responseQuery}</div>
                        </form>

                    </div>
                    <div className="modal-footer">
                        <button onClick={() => close()} type="button" className="btn btn-secondary"
                                data-dismiss="modal">Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => createRole()}
                                disabled={warn || nameRole === ''}>Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Role;