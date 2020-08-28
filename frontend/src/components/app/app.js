import React, {Component} from "react";
import CreateConnection from "../create-connection";
import '../../css/main.css'
import './app.css'
import LeftPanel from "../left-panel";
import RightPanel from "../right-panel";
import LocalStorageService from "../service/local-storage-service";
import HeaderButtons from "../header-buttons";
import Service from "../service/service";
import {KeySpaces, KeySpace, Roles} from "../../protobuffer/compiled.js"
import {Error} from "../../protobuffer/error.js"
import Connection from "../connection";
import * as _ from 'lodash'
import {guidGenerator} from '../utils/utils'
import 'react-virtualized/styles.css';
import ContextMenu from "../context-menu";
import Keyspace from "../keyspace";
import UserType from "../user-type";
import UserFunction from "../user-function";
import Role from "../role";
import ConfirmationModal from "../confirmation-modal";
import SplitPane from "react-split-pane";


const $ = window.$;

export default class App extends Component {


    state = {
        connections: new Map(),
        rightPanelContent: [],
        action: '',
        focusId: '',
        focus: '',
        typeFocus: '',
        currentConnection: '',
        currentKeyspace: '',
        connected: [],
        showcontext: false,
        stylecontext: '',
        dataContext: [],
        toast: '',
        dataToast: '',
        result: '',
        loading: false
    };


    storage = new LocalStorageService();
    service = new Service();


    getListConnections = () => {
        let items = this.state.connections;
        if (!!items) {
            let elements = []
            items.forEach((object, name) => {
                if (object !== '') {
                    elements.push(<Connection data={object}/>)
                }
            })
            return elements;
        }
    }

    makeConnectionWithChangedProps = () => {
        let items = this.storage.get();
        let mapConnections;
        if (!!items) {
            if (this.state.connections.length !== 0) {
                mapConnections = new Map(this.state.connections);
            } else {
                mapConnections = new Map();
            }
            try {
                items.forEach(object => {
                        let ob;
                        if (object instanceof Object) {
                            ob = object;
                        } else {
                            ob = JSON.parse(object);
                        }
                        let alias = ob.connection_alias;
                        if (mapConnections.has(alias)) {
                            ob = mapConnections.get(alias);
                        }

                        this.addAdditionalProperties(ob)
                        mapConnections.set(alias, ob);
                    }
                )
            } catch
                (e) {

            }
        }

        return mapConnections;
    }


    componentDidMount() {
        document.addEventListener('click', this.currentFocus);
        document.getElementById("tree-container").addEventListener('dblclick', this.currentFocus);
        document.getElementById("tree-container").addEventListener('mouseover', this.currentFocus);
        document.getElementById("tree-container").addEventListener('mouseout', this.currentFocus);
        document.addEventListener('contextmenu', this.currentFocus);


        let elements = this.makeConnectionWithChangedProps();

        this.setState(() => {
            return ({connections: elements})

        })

    }


    makeContextData = (typeContext) => {
        if (typeContext === 'connection') {
            return [`${this.state.connected.includes(this.state.currentConnection) ? 'Create new Keyspace' : ''}`, 'CqlEditor',
                `${this.state.connected.includes(this.state.currentConnection) ? 'Disconnect' : 'Connect'}`];
        }
        if (typeContext === 'keyspace') {
            return ['Create new Table',
                'dropdown-divider',
                'Create new Keyspace',
                `Edit '${this.state.focus}' Keyspace`,
                `Delete '${this.state.focus}' Keyspace`,
                'dropdown-divider',
                'CqlEditor',
                'dropdown-divider',
                `${this.state.connected.includes(this.state.currentConnection) ? 'Disconnect' : 'Connect'}`]
        }

        if (typeContext === 'tables') {
            return ['Create new Table'
                // , 'Refresh'
            ];
        }
        if (typeContext === 'table') {
            return ['Create new Table',
                `Edit '${this.state.focus}' Table`,
                `Delete '${this.state.focus}' Table`,
                {
                    'Generate Command': ['select * from ', 'insert into to'
                        // , 'update to'
                        , 'delete from', 'create index']
                }
            ];
        }
        if (typeContext === 'types') {
            return ['Create new User Type'

            ];
        }
        if (typeContext === 'type') {
            return ['Create new User Type',
                `Edit '${this.state.focus}' User Type`,
                `Delete '${this.state.focus}' User Type`,
                {'Generate Command': ['create type to', 'drop type to']}
            ];
        }
        if (typeContext === 'roles') {
            return ['Create new Role'];
        }
        if (typeContext === 'role') {
            return ['Create new Role',
                `Edit '${this.state.focus}' Role`,
                `Delete '${this.state.focus}' Role`

            ];
        }
        if (typeContext === 'users') {
            return ['Create new User User'

            ];
        }
        if (typeContext === 'user') {
            return ['Create new User ',
                `Edit '${this.state.focus}' User`,
                `Delete '${this.state.focus}' User`
            ];
        }
        if (typeContext === 'agfunctions') {
            return ['Create new Aggregate Function'
            ];
        }
        if (typeContext === 'agfunction') {
            return ['Create new Aggregate Function',
                `Show '${this.state.focus}' Aggregate Function`,
                `Delete '${this.state.focus}' Aggregate Function`,
                // {'Generate Command': ['create aggregate function to', 'drop aggregate function to']}
            ];
        }
        if (typeContext === 'functions') {
            return ['Create new User Defined Function'
            ];
        }
        if (typeContext === 'function') {
            return ['Create new User Defined Function',
                `Show '${this.state.focus}' User Defined Function`,
                `Delete '${this.state.focus}' User Defined Function`,
                // {'Generate Command': ['create function to', 'drop function to']}
            ];
        }
        if (typeContext === 'views') {
            return ['Create new Materialized View'
            ];
        }
        if (typeContext === 'view') {
            return ['Create new Materialized View',
                `Show '${this.state.focus}' Materialized View`,
                `Delete '${this.state.focus}' Materialized View`,
                {'Generate Command': ['select * from', 'create materialized view', 'drop materialized view to']}
            ];
        }

    }

    createUserType = () => {
        let object = {
            type: 'userType',
            action: 'create',
            show: 'show active',
            fields: [],
            name: this.state.currentConnection + '.' + this.state.currentKeyspace + '.New User Type'
        }
        this.pushToRightPanel(object);
    }
    createUserFunction = () => {
        let object = {
            type: 'userFunction',
            action: 'create',
            show: 'show active',
            viewFunction: 'CREATE OR REPLACE FUNCTION function3 ()\n' +
                'RETURNS NULL ON NULL INPUT\n' +
                'RETURNS text\n' +
                'LANGUAGE java\n' +
                'AS \'return "";\';',
            name: this.state.currentConnection + '.' + this.state.currentKeyspace + '.New UDF'
        }
        this.pushToRightPanel(object);
    }
    createAggregateFunction = () => {
        let object = {
            type: 'aggregateFunction',
            action: 'create',
            show: 'show active',
            viewFunction: `CREATE OR REPLACE AGGREGATE aggregate ()\nSFUNC\nSTYPE text\nINITCOND ;`,
            name: this.state.currentConnection + '.' + this.state.currentKeyspace + '.New Aggregate'
        }
        this.pushToRightPanel(object);
    }


    createMateralizedView = () => {
        let object = {
            type: 'view',
            action: 'create',
            show: 'show active',
            viewFunction: `CREATE MATERIALIZED VIEW view \nAS SELECT\nFROM\nWHERE\nPRIMARY KEY ()\nWITH`,
            name: this.state.currentConnection + '.' + this.state.currentKeyspace + '.New View'
        }
        this.pushToRightPanel(object);
    }
    createCqlEditor = (content) => {
        let object = {
            connection: this.state.currentConnection,
            type: 'cqleditor',
            action: 'create',
            show: 'show active',
            content: content,
            name: 'CQLEditor',
        }
        this.pushToRightPanel(object);
    }
    createTableHandler = () => {
        let object = {
            type: 'table',
            action: 'create',
            show: 'show active',
            name: this.state.currentConnection + '.' + this.state.currentKeyspace + '.New Table'
        }
        this.pushToRightPanel(object);
    }
    editTableHandler = (table) => {

        let object = {
            type: 'table',
            action: 'edit',
            show: 'show active',
            table: table,
            name: this.state.currentConnection + '.' + this.state.currentKeyspace + '.' + table.name
        }
        this.pushToRightPanel(object);
    }
    showUserFunction = () => {

        let {focusId, connections, currentConnection} = this.state;

        let content = connections.get(currentConnection);

        let find = this.findById(content, 'id_presentation', focusId);

        let showFunction = _.cloneDeep(find)

        let name = showFunction.name;


        let calledOnNullInput = showFunction.calledOnNullInput;
        let returnsType = showFunction.returnType;
        let language = showFunction.language;
        let body = showFunction.body;
        let signature = showFunction.signature;


        let calledOrReturns = 'RETURNS NULL'
        if (calledOnNullInput) {
            calledOrReturns = 'CALLED '
        }


        let object = {
            type: 'userFunction',
            action: 'show',
            show: 'show active',
            viewFunction: `CREATE OR REPLACE FUNCTION ${signature}\n${calledOrReturns} NULL ON NULL INPUT\nRETURNS ${returnsType}\nLANGUAGE ${language}\nAS '${body}'`,
            name: this.state.currentConnection + '.' + this.state.currentKeyspace + `.${name}`,
        }
        this.pushToRightPanel(object);
    }
    showAggregateFunction = () => {

        let {focusId, connections, currentConnection} = this.state;

        let content = connections.get(currentConnection);

        let find = this.findById(content, 'id_presentation', focusId);

        let showFunction = _.cloneDeep(find)

        let name = showFunction.name;


        let sFunc = showFunction.sFunc;
        let sType = showFunction.sType;
        let finalFunc = showFunction.finalFunc ? 'FINALFUNC ' + showFunction.finalFunc : '';
        let initCond = showFunction.initCond ? 'INITCOND ' + showFunction.initCond : '';
        let orReplace = showFunction.orReplace ? 'OR REPLACE' : '';
        let signature = showFunction.signature;
        let ifNotExist = showFunction.ifNotExist ? 'IF NOT EXISTS' : '';


        let object = {
            type: 'aggregateFunction',
            action: 'show',
            show: 'show active',
            viewFunction: `CREATE ${orReplace} AGGREGATE ${ifNotExist} ${signature}\nSFUNC ${sFunc}\nSTYPE ${sType}\n${finalFunc}\n${initCond}`,
            name: this.state.currentConnection + '.' + this.state.currentKeyspace + `.${name}`,
        }
        this.pushToRightPanel(object);
    }
    showMaterializedView = () => {

        let {focusId, connections, currentConnection} = this.state;

        let content = connections.get(currentConnection);

        let find = this.findById(content, 'id_presentation', focusId);

        let showFunction = _.cloneDeep(find)

        let name = showFunction.name;


        let indexOf = showFunction.describe.indexOf('WITH');

        let describe = showFunction.describe.substring(0, indexOf);


        let object = {
            type: 'view',
            action: 'show',
            show: 'show active',
            viewFunction: describe,
            name: this.state.currentConnection + '.' + this.state.currentKeyspace + `.${name}`,
        }
        this.pushToRightPanel(object);
    }

    pushToRightPanel(object) {
        let {rightPanelContent} = this.state;
        let newArray = [];

        if (rightPanelContent.length === 0) {
            newArray.push(object)
        } else {

            newArray = _.cloneDeep(this.state.rightPanelContent);
            newArray.forEach(element => {
                if (element) {
                    element.show = ''
                }
            });
            newArray.push(object)
        }
        this.setState(() => {
            return {rightPanelContent: newArray, showcontext: false}
        })
    }


    findById = (objectForSeek, key, focusId) => {
        if (objectForSeek[key] === focusId) {
            return objectForSeek;
        } else {
            for (const el of Object.values(objectForSeek)) {
                if (Array.isArray(el)) {
                    for (const k of el) {
                        let result = this.findById(k, key, focusId);
                        if (result) {
                            return result;
                        }
                    }
                }
            }
        }
    }

    editUserType = () => {

        let {focusId, connections, currentConnection} = this.state;

        let objectForSeek = connections.get(currentConnection);


        let find = this.findById(objectForSeek, 'id_presentation', focusId);


        let fields = []

        find.fields.map((element => {
            if (element.name) {
                let newVar = {name: element.name, type: element.type};
                fields.push(newVar)
            }
        }))


        let object = {
            type: 'userType',
            action: 'edit',
            fields,
            show: 'show active',
            name: `${this.state.currentConnection}.${this.state.currentKeyspace}.${find.name}`,
        }
        this.pushToRightPanel(object);
    }

    // todo: change it
    executeContextMenuAction = (text) => {
        let {typeFocus, focusId, currentConnection, connections, focus, currentKeyspace} = this.state;
        if (text.indexOf('Generate') === 0) {
            //nop
        } else if (text.indexOf('Create') === 0) {
            if (typeFocus === 'role' || typeFocus === 'roles') {
                this.setState(() => {
                    return {action: 'createrole'}
                })
            }
            if (typeFocus === 'user' || typeFocus === 'users') {
                this.setState(() => {
                    return {action: 'createuser'}
                })
            }
            if (typeFocus === 'type' || typeFocus === 'types') {
                this.createUserType();
            }
            if (typeFocus === 'function' || typeFocus === 'functions') {
                this.createUserFunction();
            }
            if (typeFocus === 'agfunction' || typeFocus === 'agfunctions') {
                this.createAggregateFunction();
            }
            if (typeFocus === 'table' || typeFocus === 'tables') {
                this.createTableHandler();
            }
            if (typeFocus === 'view' || typeFocus === 'views') {
                this.createMateralizedView();
            }

        } else if (text.indexOf('Show') === 0) {
            if (typeFocus === 'function') {
                this.showUserFunction();
            }
            if (typeFocus === 'agfunction') {
                this.showAggregateFunction();
            }
            if (typeFocus === 'view') {
                this.showMaterializedView();
            }


        } else if (text.indexOf('Edit') === 0) {
            if (typeFocus === 'keyspace') {
                this.setState(() => {
                    return {action: 'editkeyspace'}
                })
            }
            if (typeFocus === 'type') {
                this.editUserType();
            }
            if (typeFocus === 'role') {
                this.setState(() => {
                    return {action: 'editrole'}
                })
            }
            if (typeFocus === 'user') {
                this.setState(() => {
                    return {action: 'edituser'}
                })
            }
            if (typeFocus === 'table') {

                let connect = connections.get(currentConnection);

                let targetTable = this.findById(connect, 'id_presentation', focusId);

                let cloneTable = _.cloneDeep(targetTable);

                if (cloneTable) {
                    this.editTableHandler(targetTable);
                }


            }
        } else if (text.indexOf('Delete') === 0) {
            if (typeFocus === 'keyspace') {
                this.setState(() => {
                    return {action: 'dropkeyspace'}
                })
            }
            if (typeFocus === 'type') {
                this.setState(() => {
                    return {action: 'droptype'}
                })

            }
            if (typeFocus === 'function') {
                this.setState(() => {
                    return {action: 'dropfunction'}
                })
            }
            if (typeFocus === 'agfunction') {
                this.setState(() => {
                    return {action: 'dropagfunction'}
                })
            }
            if (typeFocus === 'view') {
                this.setState(() => {
                    return {action: 'dropview'}
                })
            }
            if (typeFocus === 'role') {
                this.setState(() => {
                    return {action: 'droprole'}
                })
            }
            if (typeFocus === 'user') {
                this.setState(() => {
                    return {action: 'dropuser'}
                })
            }
            if (typeFocus === 'table') {
                this.setState(() => {
                    return {action: 'droptable'}
                })
            }
        } else if (text.indexOf('CqlEditor') === 0) {
            this.createCqlEditor('')
        } else if (text.indexOf('Connect') === 0) {
            this.setState(() => {
                return {action: 'connect'}
            })
        } else if (text.indexOf('Disconnect') === 0) {
            this.setState(() => {
                return {action: 'disconnect'}
            })
        } else if (text.indexOf('select') === 0) {
            let content = `SELECT ${'*'} FROM ${currentKeyspace}.${focus}`
            this.createCqlEditor(content)
        } else if (text.indexOf('insert') === 0) {
            let dataForSeek = connections.get(currentConnection);
            let findObject = this.findById(dataForSeek, "id_presentation", focusId);
            let columnsName = findObject.columns.map((item, i) => {
                if (item.name !== undefined) {
                    return item.name
                }

            }).filter(item => item !== undefined);
            let fill = Array(columnsName.length).fill(' ');
            let content = `INSERT INTO ${currentKeyspace}.${focus}(${columnsName}) VALUES (${fill})`
            this.createCqlEditor(content)
        }
            // else if (text.indexOf('update') === 0) {
            //     console.log('update ' + this.state.typeFocus)
        // }
        else if (text.indexOf('delete') === 0) {
            let content = ` DROP TABLE ${currentKeyspace}.${focus}`
            this.createCqlEditor(content)
        } else if (text.indexOf('create index') === 0) {
            let content = `CREATE INDEX new_index ON ${currentKeyspace}.${focus} ()`
            this.createCqlEditor(content)
        }
    }

    dropUDTType = () => {

        let {rightPanelContent, currentConnection, currentKeyspace, focus, typeFocus, loading, focusId} = this.state;
        let typeForDelete;
        if (typeFocus === 'type') {
            typeForDelete = currentConnection + '.' + currentKeyspace + '.' + focus;
        }


        if (!loading) {
            let copyRightPanel = _.cloneDeep(rightPanelContent)
            let map = _.cloneDeep(this.state.connections);
            let contentConnection = map.get(this.state.currentConnection);


            let deletingItem = this.findById(contentConnection, 'id_presentation', focusId);


            deletingItem['rotation'] = 'spinner'

            this.setState(() => {
                return {showcontext: false, loading: true, connections: map}
            })


            this.service.dropUserType(typeForDelete).then(e => {

                if (e instanceof ArrayBuffer) {

                    let uint8View = new Uint8Array(e);

                    let response = new TextDecoder("utf-8").decode(uint8View);

                    if (this.makeDataForToast(response)) {
                        if (rightPanelContent.length !== 0) {


                            let number = rightPanelContent.findIndex(el => el.name === typeForDelete);
                            if (number !== -1) {

                                copyRightPanel.splice(number, 1);
                                this.setState(() => {
                                    return {rightPanelContent: copyRightPanel}
                                })
                            }
                        }
                    } else {
                        deletingItem['rotation'] = ''
                        this.setState(() => {
                            return {rightPanelContent: copyRightPanel}
                        })

                    }

                    let {host, port, user, pass, connection_alias} = this.getConnectionProperies(currentConnection);

                    if (currentKeyspace)
                        this.service.getTypes(host, port, connection_alias, user, pass, currentKeyspace).then(result => {

                                if (result instanceof ArrayBuffer) {

                                    let uint8View = new Uint8Array(result);
                                    try {

                                        let decoded = KeySpace.decode(uint8View);

                                        if (decoded.length === 0) {
                                            this.disconnectState()
                                        } else {

                                            let userTypes = decoded.userTypes;

                                            this.addAdditionalProperties(userTypes)


                                            let keyspace = this.findById(contentConnection, 'name', currentKeyspace);

                                            keyspace.userTypes = userTypes;

                                            this.setState(() => {
                                                return {connections: map, loading: false}
                                            })
                                        }

                                    } catch (e) {

                                    }
                                }
                            }
                        ).catch(e => {
                            this.setState(() => {
                                return {loading: false}
                            })
                        })


                }

            }).catch((e) => {
                    this.makeDataForToast(e.toString())
                    this.setState(() => {
                        return {loading: false}
                    })
                }
            )
        }

        this.setState(() => {
            return {action: ''}
        })

    }
    dropRole = () => {

        let {currentConnection, focus, typeFocus, loading, focusId} = this.state;
        let nameRoleWithConnection;
        if (typeFocus === 'role' || typeFocus === 'user') {
            nameRoleWithConnection = currentConnection + '.' + focus;
        }


        if (!loading) {

            let map = _.cloneDeep(this.state.connections);
            let contentConnection = map.get(this.state.currentConnection);


            let deletingItem = this.findById(contentConnection, 'id_presentation', focusId);


            deletingItem['rotation'] = 'spinner'

            this.setState(() => {
                return {showcontext: false, loading: true, connections: map}
            })


            this.service.dropRole(nameRoleWithConnection).then(e => {

                if (e instanceof ArrayBuffer) {

                    let uint8View = new Uint8Array(e);

                    let response = new TextDecoder("utf-8").decode(uint8View);

                    if (this.makeDataForToast(response)) {

                    } else {
                        deletingItem['rotation'] = ''

                    }


                    let {host, port, user, pass, connection_alias} = this.getConnectionProperies(currentConnection);


                    this.service.getRoles(host, port, connection_alias, user, pass).then(result => {

                            if (result instanceof ArrayBuffer) {

                                let uint8View = new Uint8Array(result);
                                try {

                                    let decoded = Roles.decode(uint8View);

                                    if (decoded.length === 0) {
                                        this.disconnectState()
                                    } else {

                                        let users = _.cloneDeep(decoded.roles);

                                        this.addAdditionalProperties(decoded.roles);
                                        this.addAdditionalProperties(users);


                                        contentConnection['roles'] = decoded.roles;
                                        contentConnection['users'] = users.filter(item => {

                                                if (item.name === undefined) return true;
                                                if (item.options) {
                                                    return item.options.login === 'true';

                                                }
                                            }
                                        )

                                        this.setState(() => {
                                            return {connections: map, loading: false}
                                        })
                                    }

                                } catch (e) {

                                }
                            }
                        }
                    ).catch(e => {
                        this.setState(() => {
                            return {loading: false}
                        })
                    })


                }

            }).catch((e) => {
                    this.makeDataForToast(e.toString())
                    this.setState(() => {
                        return {loading: false}
                    })
                }
            )
        }

        this.setState(() => {
            return {action: ''}
        })

    }

    dropUserFunction = () => {

        let {rightPanelContent, currentConnection, currentKeyspace, typeFocus, loading, focusId, connections} = this.state;
        let funcForDelete;
        let data = connections.get(currentConnection);
        let targetFunction = this.findById(data, 'id_presentation', focusId);
        if (typeFocus === 'function') {
            funcForDelete = currentConnection + '.' + currentKeyspace + '.' + targetFunction.signature;
        }


        if (!loading) {
            let copyRightPanel = _.cloneDeep(rightPanelContent)
            let map = _.cloneDeep(connections);
            let contentConnection = map.get(currentConnection);


            let deletingItem = this.findById(contentConnection, 'id_presentation', focusId);


            deletingItem['rotation'] = 'spinner'

            this.setState(() => {
                return {showcontext: false, loading: true, connections: map}
            })


            this.service.dropUserFunction(funcForDelete).then(e => {

                if (e instanceof ArrayBuffer) {

                    let uint8View = new Uint8Array(e);

                    let response = new TextDecoder("utf-8").decode(uint8View);

                    if (this.makeDataForToast(response)) {
                        if (rightPanelContent.length !== 0) {


                            let number = rightPanelContent.findIndex(el => el.name === funcForDelete);
                            if (number !== -1) {
                                // todo : not remove! simple null set
                                copyRightPanel.splice(number, 1);
                                this.setState(() => {
                                    return {rightPanelContent: copyRightPanel}
                                })
                            }
                        }
                    } else {
                        deletingItem['rotation'] = ''
                        this.setState(() => {
                            return {rightPanelContent: copyRightPanel}
                        })

                    }

                    let {host, port, user, pass, connection_alias} = this.getConnectionProperies(currentConnection);

                    if (currentKeyspace)
                        this.service.getUserFunctions(host, port, connection_alias, user, pass, currentKeyspace).then(result => {

                                if (result instanceof ArrayBuffer) {

                                    let uint8View = new Uint8Array(result);
                                    try {

                                        let decoded = KeySpace.decode(uint8View);

                                        if (decoded.length === 0) {
                                            this.disconnectState()
                                        } else {

                                            let userTypes = decoded.userFunctions;

                                            this.addAdditionalProperties(userTypes)

                                            //todo: search will implement otherwise
                                            let keyspace = this.findById(contentConnection, 'name', currentKeyspace);

                                            keyspace.userFunctions = userTypes;

                                            this.setState(() => {
                                                return {connections: map, loading: false}
                                            })
                                        }

                                    } catch (e) {

                                    }
                                }
                            }
                        ).catch(e => {
                            this.setState(() => {
                                return {loading: false}
                            })
                        })


                }

            }).catch((e) => {
                    this.makeDataForToast(e.toString())
                    this.setState(() => {
                        return {loading: false}
                    })
                }
            )
        }

        this.setState(() => {
            return {action: ''}
        })

    }
    dropAggregateFunction = () => {

        let {rightPanelContent, currentConnection, currentKeyspace, typeFocus, loading, focusId, connections} = this.state;
        let funcForDelete;
        let data = connections.get(currentConnection);
        let targetFunction = this.findById(data, 'id_presentation', focusId);
        if (typeFocus === 'agfunction') {
            funcForDelete = currentConnection + '.' + currentKeyspace + '.' + targetFunction.signature;
        }


        if (!loading) {
            let copyRightPanel = _.cloneDeep(rightPanelContent)
            let map = _.cloneDeep(connections);
            let contentConnection = map.get(currentConnection);


            let deletingItem = this.findById(contentConnection, 'id_presentation', focusId);


            deletingItem['rotation'] = 'spinner'

            this.setState(() => {
                return {showcontext: false, loading: true, connections: map}
            })


            this.service.dropAggregateFunction(funcForDelete).then(e => {

                if (e instanceof ArrayBuffer) {

                    let uint8View = new Uint8Array(e);

                    let response = new TextDecoder("utf-8").decode(uint8View);

                    if (this.makeDataForToast(response)) {
                        if (rightPanelContent.length !== 0) {


                            let number = rightPanelContent.findIndex(el => el.name === funcForDelete);
                            if (number !== -1) {

                                copyRightPanel.splice(number, 1);
                                this.setState(() => {
                                    return {rightPanelContent: copyRightPanel}
                                })
                            }
                        }
                    } else {
                        deletingItem['rotation'] = ''
                        this.setState(() => {
                            return {rightPanelContent: copyRightPanel}
                        })

                    }

                    let {host, port, user, pass, connection_alias} = this.getConnectionProperies(currentConnection);

                    if (currentKeyspace)
                        this.service.getAggregateFunctions(host, port, connection_alias, user, pass, currentKeyspace).then(result => {

                                if (result instanceof ArrayBuffer) {

                                    let uint8View = new Uint8Array(result);
                                    try {

                                        let decoded = KeySpace.decode(uint8View);

                                        if (decoded.length === 0) {
                                            this.disconnectState()
                                        } else {

                                            let userTypes = decoded.aggregateFunctions;

                                            this.addAdditionalProperties(userTypes)

                                            //todo: search will implement otherwise
                                            let keyspace = this.findById(contentConnection, 'name', currentKeyspace);

                                            keyspace.aggregateFunctions = userTypes;

                                            this.setState(() => {
                                                return {connections: map, loading: false}
                                            })
                                        }

                                    } catch (e) {

                                    }
                                }
                            }
                        ).catch(e => {
                            this.setState(() => {
                                return {loading: false}
                            })
                        })


                }

            }).catch((e) => {
                    this.makeDataForToast(e.toString())
                    this.setState(() => {
                        return {loading: false}
                    })
                }
            )
        }

        this.setState(() => {
            return {action: ''}
        })

    }
    dropMaterializedView = () => {

        let {rightPanelContent, currentConnection, currentKeyspace, typeFocus, loading, focusId, connections} = this.state;
        let viewForDelete;
        let data = connections.get(currentConnection);
        let targetView = this.findById(data, 'id_presentation', focusId);
        if (typeFocus === 'view') {
            viewForDelete = currentConnection + '.' + currentKeyspace + '.' + targetView.name;
        }


        if (!loading) {
            let copyRightPanel = _.cloneDeep(rightPanelContent)
            let map = _.cloneDeep(connections);
            let contentConnection = map.get(currentConnection);


            let deletingItem = this.findById(contentConnection, 'id_presentation', focusId);


            deletingItem['rotation'] = 'spinner'

            this.setState(() => {
                return {showcontext: false, loading: true, connections: map}
            })


            this.service.dropMView(viewForDelete).then(e => {

                if (e instanceof ArrayBuffer) {

                    let uint8View = new Uint8Array(e);

                    let response = new TextDecoder("utf-8").decode(uint8View);

                    if (this.makeDataForToast(response)) {
                        if (rightPanelContent.length !== 0) {


                            let number = rightPanelContent.findIndex(el => el.name === viewForDelete);
                            if (number !== -1) {

                                copyRightPanel.splice(number, 1);
                                this.setState(() => {
                                    return {rightPanelContent: copyRightPanel}
                                })
                            }
                        }
                    } else {
                        deletingItem['rotation'] = ''
                        this.setState(() => {
                            return {rightPanelContent: copyRightPanel}
                        })

                    }

                    let {host, port, user, pass, connection_alias} = this.getConnectionProperies(currentConnection);

                    if (currentKeyspace)
                        this.service.getMViews(host, port, connection_alias, user, pass, currentKeyspace).then(result => {

                                if (result instanceof ArrayBuffer) {

                                    let uint8View = new Uint8Array(result);
                                    try {

                                        let decoded = KeySpace.decode(uint8View);

                                        if (decoded.length === 0) {
                                            this.disconnectState()
                                        } else {

                                            let views = decoded.views;

                                            this.addAdditionalProperties(views)

                                            //todo: search will implement otherwise
                                            let keyspace = this.findById(contentConnection, 'name', currentKeyspace);

                                            keyspace.views = views;

                                            this.setState(() => {
                                                return {connections: map, loading: false}
                                            })
                                        }

                                    } catch (e) {

                                    }
                                }
                            }
                        ).catch(e => {
                            this.setState(() => {
                                return {loading: false}
                            })
                        })


                }

            }).catch((e) => {
                    this.makeDataForToast(e.toString())
                    this.setState(() => {
                        return {loading: false}
                    })
                }
            )
        }

        this.setState(() => {
            return {action: ''}
        })

    }

    dropTable = () => {

        let {rightPanelContent, currentConnection, currentKeyspace, typeFocus, loading, focusId, connections} = this.state;
        let viewForDelete;
        let data = connections.get(currentConnection);
        let targetView = this.findById(data, 'id_presentation', focusId);
        if (typeFocus === 'table') {
            viewForDelete = currentConnection + '.' + currentKeyspace + '.' + targetView.name;
        }


        if (!loading) {
            let copyRightPanel = _.cloneDeep(rightPanelContent)
            let map = _.cloneDeep(connections);
            let contentConnection = map.get(currentConnection);


            let deletingItem = this.findById(contentConnection, 'id_presentation', focusId);


            deletingItem['rotation'] = 'spinner'

            this.setState(() => {
                return {showcontext: false, loading: true, connections: map}
            })


            this.service.dropTable(viewForDelete).then(e => {

                if (e instanceof ArrayBuffer) {

                    let uint8View = new Uint8Array(e);

                    let response = new TextDecoder("utf-8").decode(uint8View);

                    if (this.makeDataForToast(response)) {
                        if (rightPanelContent.length !== 0) {


                            let number = rightPanelContent.findIndex(el => el.name === viewForDelete);
                            if (number !== -1) {

                                copyRightPanel.splice(number, 1);
                                this.setState(() => {
                                    return {rightPanelContent: copyRightPanel}
                                })
                            }
                        }
                    } else {
                        deletingItem['rotation'] = ''
                        this.setState(() => {
                            return {rightPanelContent: copyRightPanel}
                        })

                    }

                    let {host, port, user, pass, connection_alias} = this.getConnectionProperies(currentConnection);

                    if (currentKeyspace)
                        this.service.getTables(host, port, connection_alias, user, pass, currentKeyspace).then(result => {

                                if (result instanceof ArrayBuffer) {

                                    let uint8View = new Uint8Array(result);
                                    try {

                                        let decoded = KeySpace.decode(uint8View);

                                        if (decoded.length === 0) {
                                            this.disconnectState()
                                        } else {

                                            let tables = decoded.tables;

                                            this.addAdditionalProperties(tables)

                                            //todo: search will implement otherwise
                                            let keyspace = this.findById(contentConnection, 'name', currentKeyspace);

                                            keyspace.tables = tables;

                                            this.setState(() => {
                                                return {connections: map, loading: false}
                                            })
                                        }

                                    } catch (e) {

                                    }
                                }
                            }
                        ).catch(e => {
                            this.setState(() => {
                                return {loading: false}
                            })
                        })


                }

            }).catch((e) => {
                    this.makeDataForToast(e.toString())
                    this.setState(() => {
                        return {loading: false}
                    })
                }
            )
        }

        this.setState(() => {
            return {action: ''}
        })

    }

    currentFocus = (e) => {
        try {
            let {connected, connections, currentConnection, loading} = this.state;
            if (e.target.closest('.context-menu__item')) {
                let text = e.target.closest('.context-menu__item').innerText;
                this.executeContextMenuAction(text)
            } else if (e.target.closest('.headerbuttons')) {
            } else {
                // hover handler
                if (e.type === 'mouseover' || e.type === 'mouseout') {

                    let closestItem = e.target.closest('[role=tree-item]');

                    if (closestItem) {
                        closestItem.classList.toggle('hover')
                    }

                }

                // click handler
                if (e.type === 'click') {
                    console.log('click ')
                    let {target, typeFocus} = this.setFocus(e);

                    if (e.target.classList.contains('tree-push')) {


                        if (!connected.includes(currentConnection)) {

                            if (typeFocus === 'connection') {
                                this.tryConnect();
                            }

                        } else {

                            let id = target.id;

                            let map = new Map(connections);
                            let newVar = map.get(currentConnection);


                            this.setDown(newVar, id)

                            this.setState(() => {
                                return {connections: map}
                            })
                        }
                    }
                }
                // context menu
                if (e.type === 'contextmenu') {
                    if (!e.target.closest('[role=presentation]')) {
                        this.setState(() => {
                            return {showcontext: false}
                        })
                    } else {
                        e.preventDefault();
                        let {typeFocus} = this.setFocus(e);

                        //prepare data
                        let data = this.makeContextData(typeFocus);


                        this.setState(() => {
                            return {
                                showcontext: true,
                                stylecontext: {'left': e.x, 'top': e.y},
                                dataContext: data
                            }
                        })
                    }
                }


                // dblclick handler
                if (e.type === 'dblclick') {
                    let {target} = this.setFocus(e);


                    if (target) {

                        if (!connected.includes(currentConnection)) {
                            if (!loading)
                                this.tryConnect();
                        } else {
                            let id = target.id;


                            let map = new Map(connections);

                            let newVar = map.get(currentConnection);


                            this.setDown(newVar, id)

                            this.setState(() => {
                                return {connections: map}
                            })
                        }

                    }
                }
            }
        } catch (e) {
            //nop
            //todo: think about it
            if (this.state.showcontext) {
                this.setState(() => {
                    return {showcontext: false}
                })
                console.log(e)
            }


        }

    }

    // guidGenerator() {
    //     let S4 = function () {
    //         return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    //     };
    //     return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    // }


    setFocus(e) {
        try {
            let target = e.target.closest('[role=presentation]');
            let closestConnection = e.target.closest('li.connection');
            let closestKeyspace = e.target.closest('li.keyspace');

            let nameConnection = closestConnection.querySelector('.tree-text').innerHTML;

            let typeFocus = target.className;

            let id = target.id;

            let newmap = new Map(this.state.connections)
            let valueMap = newmap.get(nameConnection);


            newmap.forEach((value, name) => {
                this.resetFocus(value);
            })


            this.focusSet(valueMap, id)

            let map = newmap.set(nameConnection, valueMap);


            this.setState(() => {
                return {
                    focusId: id,
                    focus: target.querySelector('.tree-text').innerHTML,
                    typeFocus: typeFocus,
                    currentConnection: closestConnection.querySelector('.tree-text').innerHTML,
                    currentKeyspace: closestKeyspace ? closestKeyspace.querySelector('.tree-text').innerHTML : '',
                    connections: map,
                    showcontext: false
                }
            });

            return {target, typeFocus};
        } catch (e) {
            //nop
        }
    }

    setDown = (object, id) => {
        if (object.id_presentation === id) {
            if (object.rotation) {
                object.rotation = '';
            } else {
                object.rotation = 'down';
            }
            return true;
        }
        Object.values(object).forEach((k) => {
            if (k instanceof Object) {
                let result = this.setDown(k, id)
                if (result) {
                    return result;
                }
            }
        })
    }

    resetFocus = (object) => {
        if (object.id_tree_item) {
            if (object.id_tree_item !== '') {
                object.id_tree_item = ''
            }
        }
        Object.values(object).forEach((k) => {
            if (k instanceof Object) {
                this.resetFocus(k)
            }
        })
    }
    focusSet = (object, id) => {
        if (object.id_presentation === id) {
            if (object.id_tree_item === '') {
                object.id_tree_item = {id: 'focus'}
            } else {
                if (object.id_tree_item) {
                } else {
                    object.id_tree_item = ''
                }

            }
            return;
        }
        Object.values(object).forEach((k) => {
            if (k instanceof Object) {
                this.focusSet(k, id)
            }
        })

    }


    addConnection = (cs) => {
        if (cs) {
            let elements = this.makeConnectionWithChangedProps();
            this.setState(() => {
                return ({connections: elements, focus: '', action: ''})
            })
        }

    }


    deleteConnection = () => {

        let {focus, typeFocus} = this.state;

        if (typeFocus === 'connection' && focus !== '') {

            let newConnections = [];

            let stringConnections = this.storage.get();


            if (!!stringConnections) {

                let map = new Map(this.state.connections);

                for (let i = 0; i < stringConnections.length; i++) {

                    if (focus === JSON.parse(stringConnections[i]).connection_alias) {
                        this.setState(() => {
                            return ({focus: '', currentClassName: '', currentConnection: '', typeFocus: ''})
                        })
                        map.delete(focus)
                    } else {
                        newConnections.push(stringConnections[i])
                    }

                }

                if (map.size === 0) {
                    this.storage.clear();
                    this.setState(({connections}) => {
                        return ({connections: ''})
                    })
                } else {

                    this.storage.saveAll(newConnections);
                    this.setState(() => {
                        return ({connections: map})
                    })
                }
            }

        }
        this.setState(() => {
            return {action: ''}
        })
    }

    disconnectState = () => {
        if (this.state.currentConnection !== '' && this.state.connected.includes(this.state.currentConnection)) {
            let connected = [];
            if (this.state.connected.length === 0) {

            } else {
                connected.push(...this.state.connected);
                let index = connected.findIndex(el => el === this.state.currentConnection);
                connected.splice(index, 1)
            }

            this.setState(() => {
                return {connected: connected, showcontext: false, rightPanelContent: [], dataToast: '', loading: false}
            });
        }
    }


    // todo: limit connection call
    tryConnect = () => {
        let {host, port, user, pass, connection_alias} = this.getConnectionProperies(this.state.currentConnection);

        let map = _.cloneDeep(this.state.connections);

        let contentConnection = map.get(this.state.currentConnection);

        contentConnection['rotation'] = 'spinner'


        this.setState(() => {
            return {connections: map, loading: true}
        })

        this.service.getKeySpaces(host, port, connection_alias, user, pass).then(result => {

                if (result instanceof ArrayBuffer) {
                    let {currentConnection, connected} = this.state;
                    let uint8View = new Uint8Array(result);
                    try {

                        let decoded = KeySpaces.decode(uint8View);

                        if (decoded.length === 0) {
                            this.disconnectState()
                        } else {


                            for (let item of decoded.keyspaces) {
                                this.addAdditionalProperties(item);
                            }
                            let users = _.cloneDeep(decoded.roles);

                            this.addAdditionalProperties(decoded.roles);
                            this.addAdditionalProperties(users);


                            contentConnection['keyspaces'] = decoded.keyspaces;
                            contentConnection['roles'] = decoded.roles;
                            contentConnection['users'] = users.filter(item => {

                                    if (item.name === undefined) return true;
                                    if (item.options) {
                                        return item.options.login === 'true';

                                    }
                                }
                            )


                            contentConnection['rotation'] = 'down'


                            if (currentConnection !== '' && !connected.includes(currentConnection)) {
                                let connect = [];
                                if (connected.length === 0) {
                                    connect.push(currentConnection);
                                } else {
                                    connect = _.cloneDeep(connected);
                                    connect.push(currentConnection);
                                }


                                this.setState(() => {
                                    return {connected: connect}
                                });

                                this.makeDataForToast('Connected successfully')
                            }

                            this.setState(() => {
                                return {connections: map, loading: false}
                            });


                        }
                    } catch (e) {
                        try {
                            contentConnection['rotation'] = ''
                            this.setState(() => {
                                return {connections: map, loading: true}
                            })

                            let error = Error.decode(uint8View);
                            this.makeDataForToast(error.text)
                        } catch (ee) {
                            //nop
                        }
                    }

                }

            }
        ).catch((e) => {
            contentConnection['rotation'] = ''
            this.setState(() => {
                return {connections: map, loading: true}
            })

            this.makeDataForToast(e.toString());
        })

    }

    getConnectionProperies(connection) {
        let focus = this.storage.get(connection);
        let host = JSON.parse(focus).host;
        let port = JSON.parse(focus).port;
        let user = JSON.parse(focus).authUser;
        let pass = JSON.parse(focus).authPass;

        let connection_alias = JSON.parse(focus).connection_alias;
        return {host, port, user, pass, connection_alias};
    }

    getKeyspace = (keyspaceName, action) => {

        let {host, port, user, pass, connection_alias} = this.getConnectionProperies(this.state.currentConnection);

        let map = _.cloneDeep(this.state.connections);

        let contentConnection = map.get(this.state.currentConnection);

        this.service.getKeySpace(host, port, connection_alias, user, pass, keyspaceName).then(result => {

                if (result instanceof ArrayBuffer) {
                    let {currentConnection, connected} = this.state;
                    let uint8View = new Uint8Array(result);
                    try {

                        let decoded = KeySpaces.decode(uint8View);

                        for (let item of decoded.keyspaces) {
                            this.addAdditionalProperties(item);
                        }

                        if (action === 'edit') {
                            if (decoded.keyspaces[0] instanceof Object) {
                                let editedObject = decoded.keyspaces[0];
                                let findIndex = contentConnection['keyspaces'].findIndex(el => el.name === editedObject.name);
                                contentConnection['keyspaces'][findIndex] = editedObject;
                            }
                        }
                        if (action === 'create') {
                            if (decoded.keyspaces[0] instanceof Object) {
                                contentConnection['keyspaces'].push(decoded.keyspaces[0])
                                contentConnection['rotation'] = 'down'
                            }
                        }

                        this.setState(() => {
                            return {connections: map, loading: false}
                        });


                    } catch (e) {
                        try {
                            if (action === 'create') {
                                contentConnection['rotation'] = ''
                            }
                            this.setState(() => {
                                return {connections: map}
                            })

                            let error = Error.decode(uint8View);
                            this.makeDataForToast(error.text)
                        } catch (ee) {
                            //nop
                        }
                    }
                }
            }
        ).catch((e) => {
            if (action === 'create') {
                contentConnection['rotation'] = ''
            }
            this.setState(() => {
                return {connections: map}
            })
            this.makeDataForToast(e.toString());
        })

    }

    connect = () => {
        let {currentConnection, loading} = this.state;
        if (currentConnection !== '') {
            if (!loading)
                this.tryConnect()
        }
    }

    disconnect = () => {
        if (this.state.currentConnection !== '') {
            this.service.disConnect(this.state.currentConnection).then((e) => {

                    if (e) {
                        let map = new Map(this.state.connections);
                        delete map.get(this.state.currentConnection).keyspaces;

                        map.get(this.state.currentConnection).rotation = ''


                        this.findById(map.get(this.state.currentConnection),
                            'id_presentation', this.state.focusId)


                        this.disconnectState();
                        this.setState(() => {
                            return {
                                connections: map
                            }
                        })
                    } else {
                        // modal exeption
                    }
                }
            );
        }
    }

    setAction = (action) => {
        this.setState(() => {
            return {action: action}
        })
    }
    closeElement = () => {
        this.setState(() => {
            return {action: ''}
        })
    }

    showCurrentModalWindow = (action) => {


        if (action === 'createconnection') {
            return (<CreateConnection save={this.addConnection}
                                      id={'createconnection'}
                                      close={this.closeElement}/>)
        }
        if (action === 'editconnection') {
            return (<CreateConnection save={this.addConnection}
                                      focus={this.state.focus}
                                      close={this.closeElement}
                                      id={'editconnection'}/>)
        }
        if (action === 'deleteconnection') {
            return (<ConfirmationModal close={this.closeElement} textToConfirm={`Do you really wish to delete '${this.state.focus}' connection ?`}
                                       killerFunction={this.deleteConnection}/>)
        }
        if (action === 'createrole') {
            let rolesExclude = [];
            let connection = this.state.connections.get(this.state.currentConnection);
            if (connection.roles) {
                connection.roles.forEach(item => {
                    if (item.name !== undefined) {
                        rolesExclude.push(item.name)
                    }
                })
            }

            return (<Role save={this.createRole}
                          connect={this.state.currentConnection}
                          exclud={rolesExclude}
                          id={'createrole'}
                          close={this.closeElement}/>)
        }

        if (action === 'signout') {
            return (<ConfirmationModal close={this.closeElement} textToConfirm={`Do you really wish to exit ?`}
                                       killerFunction={this.service.exit}/>)
        }
        if (action === 'editrole') {

            let {focusId, connections, currentConnection} = this.state;

            let objectForSeek = connections.get(currentConnection);


            let roleForEdit = this.findById(objectForSeek, 'id_presentation', focusId);

            return (<Role save={this.createRole}
                          roleForEdit={roleForEdit}
                          connect={this.state.currentConnection}
                          focus={this.state.focus}
                          close={this.closeElement}
                          id={'editrole'}/>)
        }
        if (action === 'createuser') {
            let rolesExclude = [];
            let connection = this.state.connections.get(this.state.currentConnection);
            if (connection.roles) {
                connection.roles.forEach(item => {
                    if (item.name !== undefined) {
                        rolesExclude.push(item.name)
                    }
                })
            }

            return (<Role save={this.createRole}
                          connect={this.state.currentConnection}
                          exclud={rolesExclude}
                          id={'createuser'}
                          close={this.closeElement}/>)
        }
        if (action === 'edituser') {
            let {focusId, connections, currentConnection} = this.state;

            let objectForSeek = connections.get(currentConnection);


            let roleForEdit = this.findById(objectForSeek, 'id_presentation', focusId);

            return (<Role save={this.createRole}
                          roleForEdit={roleForEdit}
                          connect={this.state.currentConnection}
                          focus={this.state.focus}
                          close={this.closeElement}
                          id={'edituser'}/>)
        }
        if (action === 'createkeyspace') {
            let namesKS;
            if (this.state.connections.get(this.state.currentConnection)) {
                namesKS = this.state.connections.get(this.state.currentConnection).keyspaces.map(el => {
                    return el.name;
                })
            }


            return (<Keyspace id={'createkeyspace'}
                              createKS={this.createKS}
                              close={this.closeElement}
                              excludes={namesKS}/>)


        }
        if (action === 'editkeyspace') {
            let objectForEdit = {};
            this.state.connections.get(this.state.currentConnection).keyspaces.forEach(ks => {

                if (ks.id_presentation === this.state.focusId) {
                    objectForEdit.durableWrites = ks.durableWrites;
                    objectForEdit.name = ks.name;
                    objectForEdit.replication = ks.replication;
                }
            })

            return (<Keyspace id={'editkeyspace'}
                              close={this.closeElement}
                              objectForEdit={objectForEdit}
                              createKS={this.createKS}/>)
        }

        if (action === 'dropkeyspace') {
            return (<ConfirmationModal close={this.closeElement} textToConfirm={`Do you really wish to delete '${this.state.focus}' keyspace ?`}
                                       killerFunction={this.dropKeyspace}/>)
        }
        if (action === 'droptype') {
            return (<ConfirmationModal close={this.closeElement} textToConfirm={`Do you really wish to delete '${this.state.focus}' type ?`}
                                       killerFunction={this.dropUDTType}/>)
        }
        if (action === 'dropfunction') {
            return (<ConfirmationModal close={this.closeElement} textToConfirm={`Do you really wish to delete '${this.state.focus}' function ?`}
                                       killerFunction={this.dropUserFunction}/>)
        }
        if (action === 'dropagfunction') {
            return (<ConfirmationModal close={this.closeElement}
                                       textToConfirm={`Do you really wish to delete '${this.state.focus}' aggredate function ?`}
                                       killerFunction={this.dropAggregateFunction}/>)
        }
        if (action === 'droptable') {
            return (<ConfirmationModal close={this.closeElement} textToConfirm={`Do you really wish to delete '${this.state.focus}' table ?`}
                                       killerFunction={this.dropTable}/>)
        }
        if (action === 'dropview') {
            return (
                <ConfirmationModal close={this.closeElement} textToConfirm={`Do you really wish to delete '${this.state.focus}' materialized view?`}
                                   killerFunction={this.dropMaterializedView}/>)
        }
        if (action === 'droprole') {
            return (<ConfirmationModal close={this.closeElement} textToConfirm={`Do you really wish to delete '${this.state.focus}' role ?`}
                                       killerFunction={this.dropRole}/>)
        }
        if (action === 'dropuser') {
            return (<ConfirmationModal close={this.closeElement} textToConfirm={`Do you really wish to delete '${this.state.focus}' user ?`}
                                       killerFunction={this.dropRole}/>)
        }

        if (action === 'connect') {

            this.connect();
            this.setState(() => {
                return {action: '', showcontext: false}
            });
        }
        if (action === 'disconnect') {
            this.disconnect();
            this.setState(() => {
                return {action: '', showcontext: false}
            });
        }
        if (action === 'createuserfunction') {

            this.setState(() => {
                return {action: '', showcontext: false}
            });
        }
    }

    dropKeyspace = () => {
        let message = KeySpace.create({name: this.state.focus, connectionAlias: this.state.currentConnection});
        let envelope = KeySpace.encode(message).finish();

        let map = _.cloneDeep(this.state.connections);
        let contentConnection = map.get(this.state.currentConnection);


        let findIndex = contentConnection['keyspaces'].findIndex(el => el.name === this.state.focus);

        contentConnection['keyspaces'][findIndex].rotation = 'spinner'

        this.setState(() => {
            return {connections: map}
        })

        this.service.dropKeySpaces(envelope).then(e => {

            if (e instanceof ArrayBuffer) {
                let uint8View = new Uint8Array(e);

                let response = new TextDecoder("utf-8").decode(uint8View);

                if (this.makeDataForToast(response)) {
                    contentConnection['keyspaces'].splice(findIndex, 1)

                } else {
                    contentConnection['keyspaces'][findIndex].rotation = ''
                }
                this.setState(() => {
                    return {
                        connections: map,
                        typeFocus: '',
                        focus: '',
                        focusId: '',
                        currenKeyspace: '',
                        currentConnection: ''
                    }
                })
            }

        }).catch((e) => {
            contentConnection['keyspaces'][findIndex].rotation = ''
            this.setState(() => {
                return {
                    connections: map,
                    typeFocus: '',
                    focus: '',
                    focusId: '',
                    currentKeyspace: '',
                    currentConnection: ''
                }
            })

            this.makeDataForToast(e.toString());
        })

        this.setState(() => {
            return {
                action: '',
                showcontext: false,
                typeFocus: '',
                focus: '',
                focusId: '',
                currentKeyspace: '',
                currentConnection: ''
            }
        });

    }

    createRole = (id) => {
        $(`#${id}`).modal('hide')
        this.setState(() => {
            return {action: ''}
        });
        this.tryConnect();
    }

    createKS = (data) => {
        data.connectionAlias = this.state.currentConnection;
        let message = KeySpace.create(data);

        let finish = KeySpace.encode(message).finish();

        let map = _.cloneDeep(this.state.connections);
        let contentConnection = map.get(this.state.currentConnection);


        if (this.state.action === 'createkeyspace') {

            contentConnection['rotation'] = 'spinner'

            this.setState(() => {
                return {connections: map}
            })

            this.service.createKeySpaces(finish).then((e) => {

                if (e instanceof ArrayBuffer) {

                    let uint8View = new Uint8Array(e);

                    let response = new TextDecoder("utf-8").decode(uint8View);

                    if (this.makeDataForToast(response)) {
                        this.getKeyspace(data.name, 'create')
                    } else {
                        contentConnection['rotation'] = ''
                        this.setState(() => {
                            return {connections: map}
                        })
                    }
                }
            }).catch((e) => {
                contentConnection['rotation'] = ''
                this.setState(() => {
                    return {connections: map}
                })

                this.makeDataForToast(e.toString());
            })
            $('#createkeyspace').modal('hide');

        } else if (this.state.action === 'editkeyspace') {

            let focusObject = this.findById(contentConnection, 'id_presentation', this.state.focusId);

            if (focusObject) {
                focusObject['rotation'] = 'spinner';
            }

            this.setState(() => {
                return {connections: map}
            })

            this.service.editKeySpaces(finish).then((e) => {

                if (e instanceof ArrayBuffer) {

                    let uint8View = new Uint8Array(e);

                    let response = new TextDecoder("utf-8").decode(uint8View);

                    if (this.makeDataForToast(response)) {
                        this.getKeyspace(data.name, 'edit')
                    } else {
                        focusObject['rotation'] = ''
                        this.setState(() => {
                            return {connections: map}
                        })
                    }
                }
            }).catch((e) => {
                focusObject['rotation'] = ''
                this.setState(() => {
                    return {connections: map}
                })

                this.makeDataForToast(e.toString());
            })
            $('#editkeyspace').modal('hide');
        }

        this.setState(() => {
            return {action: '', showcontext: false}
        });

    }

    makeDataForToast(response) {
        if (response.toLowerCase().includes('successfully')) {
            this.setState(() => {
                return {
                    dataToast: {result: response, style: {color: 'green'}}
                }
            })
            return true;
        } else {
            this.setState(() => {
                return {
                    dataToast: {result: response, style: {color: 'red'}}
                }
            })
            return false;
        }
    }


    render() {

        let {
            showcontext, stylecontext, dataContext, typeFocus,
            connected, currentConnection, dataToast, action
        } = this.state;
        let context;

        if (showcontext) {
            context = <ContextMenu style={stylecontext} data={dataContext}/>
        }

        let listConnections = this.getListConnections();
        return (<div className={"container1"}>
            {context}
            <div className={"header-buttons"}>
                <HeaderButtons
                    // todo: changed to one handler setAction
                    setAction={this.setAction}
                    typeFocus={typeFocus}
                    connected={connected}
                    currentConnection={currentConnection}
                    connect={this.connect}
                    disconnect={this.disconnect}
                    createUserType={this.createUserType}
                    createUserFunction={this.createUserFunction}
                    createAggregateFunction={this.createAggregateFunction}
                    createCqlEditor={this.createCqlEditor}
                    createTableHandler={this.createTableHandler}
                    createMaterializedView={this.createMateralizedView}
                />
            </div>


            <SplitPane split="vertical" minSize={250}>
                <LeftPanel connections={listConnections}/>
                <RightPanel removeToast={this.removeToast} dataToast={dataToast}
                            content={this.state.rightPanelContent} saveContent={this.saveContent}
                            closeTabPanel={this.closeTabPanel}/>
            </SplitPane>

            {/*<SplitWrapper sizes={[25, 75]}*/}
            {/*       minSize={250}*/}
            {/*       expandToMin={false}*/}
            {/*       gutterSize={8}*/}
            {/*       gutterAlign="right"*/}
            {/*       snapOffset={30}*/}
            {/*       dragInterval={1}*/}
            {/*       direction="horizontal"*/}
            {/*       cursor="col-resize"*/}
            {/*>*/}
            {/*    <LeftPanel connections={listConnections}/>*/}
            {/*    <RightPanel removeToast={this.removeToast} dataToast={dataToast}*/}
            {/*                content={this.state.rightPanelContent} saveContent={this.saveContent}*/}
            {/*                closeTabPanel={this.closeTabPanel}/>*/}
            {/*</SplitWrapper>*/}
            {action ? this.showCurrentModalWindow(action) : null}
        </div>)
    }


    makeContent = () => {

        if (Array.isArray(this.props.content)) {
            let tabs = [];
            let tabsContent = [];

            this.props.content.forEach((element, i) => {

                if (element.type === 'userType') {

                    tabs.push((<li className="nav-item" role="presentation" key={i}>
                        <a style={{padding: 3, fontSize: 15, fontFamily: 'Apple Chancery, cursive'}}
                           className={`nav-link`} id={`type-tab${i}`}
                           data-toggle="tab" href={`#type${i}`} role="tab"
                           aria-controls={`type${i}`} aria-selected='false'>
                            {element.name}
                            <button type="button" className="close" aria-label="Close"
                                    onClick={() => this.props.closeTabPanel(`${i}`)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </a>
                    </li>));

                    tabsContent.push(
                        <div className={`tab-pane fade `} id={`type${i}`} role="tabpanel"
                             aria-labelledby="types-tab">
                            <UserType element={element} saveContent={(content) => this.supportFunc(content, `${+i}`)}/>
                        </div>
                    )
                }
                if (element.type === 'userFunction') {

                    tabs.push((<li className="nav-item" role="presentation" key={i}>
                        <a style={{padding: 3, fontSize: 15, fontFamily: 'Apple Chancery, cursive'}}
                           className={`nav-link`} id={`udf-tab${i}`}
                           data-toggle="tab" href={`#udf${i}`} role="tab"
                           aria-controls={`udf${i}`} aria-selected='false'>
                            {element.name}
                            <button type="button" className="close" aria-label="Close"
                                    onClick={() => this.props.closeTabPanel(`${i}`)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </a>
                    </li>));

                    tabsContent.push(
                        <div className={`tab-pane fade `} id={`udf${i}`} role="tabpanel"
                             aria-labelledby="udfs-tab">
                            <UserFunction element={element}
                                          saveContent={(content) => this.supportFunc(content, `${+i}`)}/>
                        </div>
                    )
                }
            })

            this.setState(() => {
                return {
                    tabs, tabsContent
                }
            })

        }
    }


//todo: rename
    saveContent = (content, i) => {

        let map = _.cloneDeep(this.state.connections);

        let copy = _.cloneDeep(this.state.rightPanelContent);
        if (copy[i].type === 'userType') {

            let connectionName = content.path.split('.')[0];
            let nameKs = content.path.split('.')[1];
            let fieldName = content.path.split('.')[2];
            let contentConnection = map.get(connectionName);


            if (content.action === 'create') {

                let find = this.findById(contentConnection, 'name', nameKs);

                let wrap;
                if (find) {
                    wrap = find.userTypes.find(el => el.name === undefined);
                    wrap['rotation'] = 'spinner'
                }


                this.setState(() => {
                    return {connections: map, loading: true}
                })

                // show structure in applyType method user-type.js
                this.service.createUserType(content).then((e) => {

                    if (e instanceof ArrayBuffer) {

                        let uint8View = new Uint8Array(e);

                        let response = new TextDecoder("utf-8").decode(uint8View);


                        if (this.makeDataForToast(response)) {
                            if (this.state.rightPanelContent.length !== 0) {
                                // todo: copy maked another

                                copy[i].action = 'edit'
                                let nameType = content.nameType;
                                let path = content.path.split('.');
                                copy[i].name = path[0] + '.' + path[1] + '.' + nameType;
                                this.setState(() => {
                                    return {rightPanelContent: copy, loading: true}
                                })
                            }
                        } else {
                            this.setState(() => {
                                return {rightPanelContent: copy, loading: true}
                            })
                        }


                        let {host, port, user, pass, connection_alias} = this.getConnectionProperies(connectionName);

                        if (nameKs)
                            this.service.getTypes(host, port, connection_alias, user, pass, nameKs).then(result => {

                                    if (result instanceof ArrayBuffer) {

                                        let uint8View = new Uint8Array(result);
                                        try {

                                            let decoded = KeySpace.decode(uint8View);

                                            if (decoded.length === 0) {
                                                this.disconnectState()
                                            } else {

                                                let userTypes = decoded.userTypes;

                                                this.addAdditionalProperties(userTypes)


                                                let keyspace = this.findById(contentConnection, 'name', nameKs);

                                                keyspace.userTypes = userTypes;

                                                this.setState(() => {
                                                    return {connections: map, loading: false}
                                                })
                                            }

                                        } catch (e) {
                                            this.setState(() => {
                                                return {rightPanelContent: copy, loading: false}
                                            })
                                        }
                                    }
                                }
                            ).catch(e => {
                                this.setState(() => {
                                    return {rightPanelContent: copy, loading: false}
                                })
                            })

                    }

                }).catch((e) => {
                        this.setState(() => {
                            return {rightPanelContent: copy, loading: false}
                        });
                        this.makeDataForToast(e.toString());
                    }
                )
            }
            if (content.action === 'edit') {

                let find = this.findById(contentConnection, 'name', nameKs);

                let wrap;
                if (find) {
                    wrap = find.userTypes.find(el => el.name === fieldName);
                    wrap['rotation'] = 'spinner'
                }


                this.setState(() => {
                    return {connections: map, loading: true}
                })

                this.service.editUserType(content).then((e) => {

                    if (e instanceof ArrayBuffer) {

                        let uint8View = new Uint8Array(e);

                        let response = new TextDecoder("utf-8").decode(uint8View);

                        let copy = _.cloneDeep(this.state.rightPanelContent);
                        if (this.makeDataForToast(response)) {
                            if (this.state.rightPanelContent.length !== 0) {
                                if (copy[i].action !== 'edit') {
                                    copy[i].action = 'edit'
                                    let nameType = content.nameType;
                                    let path = content.path.split('.');
                                    copy[i].name = path[0] + '.' + path[1] + '.' + nameType;
                                    this.setState(() => {
                                        return {rightPanelContent: copy, loading: false}
                                    })
                                }
                            }

                        } else {

                            this.setState(() => {
                                return {rightPanelContent: copy, loading: false}
                            })
                        }


                        let {host, port, user, pass, connection_alias} = this.getConnectionProperies(connectionName);

                        if (nameKs)
                            this.service.getTypes(host, port, connection_alias, user, pass, nameKs).then(result => {

                                    if (result instanceof ArrayBuffer) {

                                        let uint8View = new Uint8Array(result);
                                        try {

                                            let decoded = KeySpace.decode(uint8View);

                                            if (decoded.length === 0) {
                                                this.disconnectState()
                                            } else {

                                                let fieldIndexFromServer = decoded.userTypes.findIndex(el => el.name === fieldName)

                                                let editedTypeFromServer = decoded.userTypes[fieldIndexFromServer];
                                                this.addAdditionalProperties(editedTypeFromServer)

                                                editedTypeFromServer.rotation = 'down'

                                                let keyspace = this.findById(contentConnection, 'name', nameKs);

                                                let fieldIndexFromUi = keyspace.userTypes.findIndex(el => el.name === fieldName)

                                                keyspace.userTypes[fieldIndexFromUi] = editedTypeFromServer

                                                copy[i].fields = editedTypeFromServer.fields;


                                                this.setState(() => {
                                                    return {connections: map, loading: false, rightPanelContent: copy}
                                                })
                                            }

                                        } catch (e) {
                                            this.setState(() => {
                                                return {rightPanelContent: copy, loading: false}
                                            })
                                        }
                                    }
                                }
                            ).catch(e => {
                                this.setState(() => {
                                    return {rightPanelContent: copy, loading: false}
                                })
                            })

                    }

                }).catch((e) => {
                        this.makeDataForToast(e.toString());

                        wrap['rotation'] = ''

                        this.setState(() => {
                            return {connections: map, loading: false, rightPanelContent: copy}
                        })

                    }
                )
            }
        }

        if (copy[i].type === 'userFunction') {

            let tab = this.state.rightPanelContent[i];
            let connectionName = tab.name.split('.')[0];
            let nameKs = tab.name.split('.')[1];
            // let fieldName = tab.name.split('.')[2];
            let contentConnection = map.get(connectionName);

            let find = this.findById(contentConnection, 'name', nameKs);

            let wrap;
            if (find) {
                wrap = find.userFunctions.find(el => el.name === undefined);
                wrap['rotation'] = 'spinner'
            }

            this.setState(() => {
                return {connections: map}
            })

            this.service.createUserFunction(content).then(result => {
                    if (result instanceof ArrayBuffer) {
                        let uint8View = new Uint8Array(result);
                        let response = new TextDecoder("utf-8").decode(uint8View);
                        if (this.makeDataForToast(response)) {
                            if (this.state.rightPanelContent.length !== 0) {

                                try {
                                    let match = response.matchAll(/'.*'/g);
                                    let regExpMatchArrays = Array.from(match);
                                    let nameFunc = regExpMatchArrays[0][0]
                                    nameFunc = nameFunc.replace(/'/g, '');

                                    copy[i].name = connectionName + '.' + nameKs + '.' + nameFunc;
                                    this.setState(() => {
                                        return {rightPanelContent: copy, loading: false}
                                    })
                                } catch (e) {
                                    console.log(e)
                                }

                            }

                        } else {
                            this.setState(() => {
                                return {rightPanelContent: copy, loading: false}
                            })
                        }

                        let {host, port, user, pass, connection_alias} = this.getConnectionProperies(connectionName);

                        if (nameKs)
                            this.service.getUserFunctions(host, port, connection_alias, user, pass, nameKs).then(result => {

                                    if (result instanceof ArrayBuffer) {

                                        let uint8View = new Uint8Array(result);
                                        try {

                                            let decoded = KeySpace.decode(uint8View);

                                            if (decoded.length === 0) {
                                                this.disconnectState()
                                            } else {

                                                let userFunctions = decoded.userFunctions;

                                                this.addAdditionalProperties(userFunctions)


                                                let keyspace = this.findById(contentConnection, 'name', nameKs);

                                                keyspace.userFunctions = userFunctions;

                                                this.setState(() => {
                                                    return {connections: map, loading: false}
                                                })
                                            }

                                        } catch (e) {
                                            this.setState(() => {
                                                return {rightPanelContent: copy, loading: false}
                                            })
                                        }
                                    }
                                }
                            ).catch(e => {
                                this.setState(() => {
                                    return {rightPanelContent: copy, loading: false}
                                })
                            })


                    }
                }
            ).catch(e => console.log(e))

        }
        if (copy[i].type === 'aggregateFunction') {

            let tab = copy[i];
            let connectionName = tab.name.split('.')[0];
            let nameKs = tab.name.split('.')[1];
            let contentConnection = map.get(connectionName);

            let find = this.findById(contentConnection, 'name', nameKs);

            let wrap;
            if (find) {
                wrap = find.aggregateFunctions.find(el => el.name === undefined);
                wrap['rotation'] = 'spinner'
            }

            this.setState(() => {
                return {connections: map}
            })

            this.service.createAggregateFunction(content).then(result => {
                    if (result instanceof ArrayBuffer) {
                        let uint8View = new Uint8Array(result);
                        let response = new TextDecoder("utf-8").decode(uint8View);
                        if (this.makeDataForToast(response)) {
                            if (copy.length !== 0) {

                                try {
                                    let match = response.matchAll(/'.*'/g);
                                    let regExpMatchArrays = Array.from(match);
                                    let nameFunc = regExpMatchArrays[0][0]
                                    nameFunc = nameFunc.replace(/'/g, '');

                                    copy[i].name = connectionName + '.' + nameKs + '.' + nameFunc;
                                    this.setState(() => {
                                        return {rightPanelContent: copy, loading: false}
                                    })
                                } catch (e) {
                                    console.log(e)
                                }

                            }

                        } else {
                            this.setState(() => {
                                return {rightPanelContent: copy, loading: false}
                            })
                        }

                        let {host, port, user, pass, connection_alias} = this.getConnectionProperies(connectionName);

                        if (nameKs)
                            this.service.getAggregateFunctions(host, port, connection_alias, user, pass, nameKs).then(result => {

                                    if (result instanceof ArrayBuffer) {

                                        let uint8View = new Uint8Array(result);
                                        try {

                                            let decoded = KeySpace.decode(uint8View);

                                            if (decoded.length === 0) {
                                                this.disconnectState()
                                            } else {

                                                let userFunctions = decoded.aggregateFunctions;

                                                this.addAdditionalProperties(userFunctions)


                                                let keyspace = this.findById(contentConnection, 'name', nameKs);

                                                keyspace.aggregateFunctions = userFunctions;

                                                this.setState(() => {
                                                    return {connections: map, loading: false}
                                                })
                                            }

                                        } catch (e) {
                                            this.setState(() => {
                                                return {rightPanelContent: copy, loading: false}
                                            })
                                        }
                                    }
                                }
                            ).catch(e => {
                                this.setState(() => {
                                    return {rightPanelContent: copy, loading: false}
                                })
                            })


                    }
                }
            ).catch(e => console.log(e))
        }
        if (copy[i].type === 'view') {

            let tab = copy[i];
            let connectionName = tab.name.split('.')[0];
            let nameKs = tab.name.split('.')[1];
            let contentConnection = map.get(connectionName);

            let find = this.findById(contentConnection, 'name', nameKs);

            let wrap;
            if (find) {
                wrap = find.views.find(el => el.name === undefined);
                wrap['rotation'] = 'spinner'
            }

            this.setState(() => {
                return {connections: map}
            })


            this.service.createMV(content).then(result => {
                if (result instanceof ArrayBuffer) {
                    let uint8View = new Uint8Array(result);
                    let response = new TextDecoder("utf-8").decode(uint8View);
                    if (this.makeDataForToast(response)) {
                        if (this.state.rightPanelContent.length !== 0) {

                            try {
                                let match = response.matchAll(/'.*'/g);
                                let regExpMatchArrays = Array.from(match);
                                let nameFunc = regExpMatchArrays[0][0]
                                nameFunc = nameFunc.replace(/'/g, '');

                                copy[i].name = copy[i].name.split(".")[0] + '.' + copy[i].name.split(".")[1] + '.' + nameFunc;
                                this.setState(() => {
                                    return {rightPanelContent: copy, loading: false}
                                })
                            } catch (e) {
                                console.log(e)
                            }

                            let {host, port, user, pass, connection_alias} = this.getConnectionProperies(connectionName);

                            if (nameKs)
                                this.service.getMViews(host, port, connection_alias, user, pass, nameKs).then(result => {

                                        if (result instanceof ArrayBuffer) {

                                            let uint8View = new Uint8Array(result);
                                            try {

                                                let decoded = KeySpace.decode(uint8View);

                                                if (decoded.length === 0) {
                                                    this.disconnectState()
                                                } else {

                                                    let views = decoded.views;

                                                    this.addAdditionalProperties(views)


                                                    let keyspace = this.findById(contentConnection, 'name', nameKs);

                                                    keyspace.views = views;

                                                    this.setState(() => {
                                                        return {connections: map, loading: false}
                                                    })
                                                }

                                            } catch (e) {
                                                this.setState(() => {
                                                    return {rightPanelContent: copy, loading: false}
                                                })
                                            }
                                        }
                                    }
                                ).catch(e => {
                                    this.setState(() => {
                                        return {rightPanelContent: copy, loading: false}
                                    })
                                })


                        }

                    } else {

                        wrap['rotation'] = ''

                        this.setState(() => {
                            return {rightPanelContent: copy, loading: false, connections: map}
                        })
                    }

                }
            }).catch(e => console.log(e))

        }

        if (copy[i].type === 'table') {

            let tab = copy[i];
            let connectionName = tab.name.split('.')[0];
            let nameKs = tab.name.split('.')[1];
            let contentConnection = map.get(connectionName);

            let find = this.findById(contentConnection, 'name', nameKs);

            let wrap;
            if (find) {
                wrap = find.tables.find(el => el.name === undefined);
                wrap['rotation'] = 'spinner'
            }

            this.setState(() => {
                return {connections: map}
            })

            if (content.action === 'create') {
                this.service.createTable(content.finish).then(result => {
                    if (result instanceof ArrayBuffer) {
                        let uint8View = new Uint8Array(result);
                        let response = new TextDecoder("utf-8").decode(uint8View);
                        if (this.makeDataForToast(response)) {
                            if (this.state.rightPanelContent.length !== 0) {

                                try {
                                    // let match = response.matchAll(/'.*'/g);
                                    // let regExpMatchArrays = Array.from(match);
                                    // let nameFunc = regExpMatchArrays[0][0]
                                    // nameFunc = nameFunc.replace(/'/g, '');
                                    //
                                    // copy[i].name = copy[i].name.split(".")[0] + '.' + copy[i].name.split(".")[1] + '.' + nameFunc;
                                    // this.setState(() => {
                                    //     return {rightPanelContent: copy, loading: false}
                                    // })
                                    // todo: just will close tab or ?
                                    this.closeTabPanel(i)
                                } catch (e) {
                                    console.log(e)
                                }
                            }
                        } else {
                            wrap['rotation'] = ''
                            this.setState(() => {
                                return {rightPanelContent: copy, loading: false, connections: map}
                            })
                        }


                        let {host, port, user, pass, connection_alias} = this.getConnectionProperies(connectionName);

                        if (nameKs)
                            this.service.getTables(host, port, connection_alias, user, pass, nameKs).then(result => {

                                    if (result instanceof ArrayBuffer) {

                                        let uint8View = new Uint8Array(result);
                                        try {

                                            let decoded = KeySpace.decode(uint8View);

                                            if (decoded.length === 0) {
                                                this.disconnectState()
                                            } else {

                                                let tables = decoded.tables;

                                                this.addAdditionalProperties(tables)


                                                let keyspace = this.findById(contentConnection, 'name', nameKs);

                                                keyspace.tables = tables;

                                                this.setState(() => {
                                                    return {connections: map, loading: false}
                                                })
                                            }

                                        } catch (e) {
                                            this.setState(() => {
                                                return {rightPanelContent: copy, loading: false}
                                            })
                                        }
                                    }
                                }
                            ).catch(e => {
                                this.setState(() => {
                                    return {rightPanelContent: copy, loading: false}
                                })
                            })


                    }
                }).catch(e => console.log(e))
            }
            if (content.action === 'edit') {


                this.service.editTable(content).then(result => {

                    if (result instanceof ArrayBuffer) {
                        let uint8View = new Uint8Array(result);
                        let response = new TextDecoder("utf-8").decode(uint8View);
                        if (this.makeDataForToast(response)) {
                            if (this.state.rightPanelContent.length !== 0) {
                                try {
                                    // todo: just will close tab or ?
                                    this.closeTabPanel(i)
                                } catch (e) {
                                }
                            }
                        } else {
                            wrap['rotation'] = ''
                            this.setState(() => {
                                return {rightPanelContent: copy, loading: false, connections: map}
                            })
                        }

                        let {host, port, user, pass, connection_alias} = this.getConnectionProperies(connectionName);

                        if (nameKs)
                            this.service.getTables(host, port, connection_alias, user, pass, nameKs).then(result => {

                                    if (result instanceof ArrayBuffer) {

                                        let uint8View = new Uint8Array(result);
                                        try {

                                            let decoded = KeySpace.decode(uint8View);

                                            if (decoded.length === 0) {
                                                this.disconnectState()
                                            } else {

                                                let tables = decoded.tables

                                                this.addAdditionalProperties(tables)

                                                try {
                                                    let findIndex = tables.findIndex(item => item.name === content.nameTable);

                                                    if (findIndex > -1) {
                                                        this.editTableHandler(tables[findIndex]);
                                                    }

                                                } catch (e) {
                                                }


                                                let keyspace = this.findById(contentConnection, 'name', nameKs);

                                                keyspace.tables = tables;

                                                this.setState(() => {
                                                    return {connections: map, loading: false}
                                                })
                                            }

                                        } catch (e) {
                                            this.setState(() => {
                                                return {rightPanelContent: copy, loading: false}
                                            })
                                        }
                                    }
                                }
                            ).catch(e => {
                                this.setState(() => {
                                    return {rightPanelContent: copy, loading: false}
                                })
                            })

                    }


                }).catch((e) => console.log(e))

            }
        }


    }


    closeTabPanel = (index) => {
        if (this.state.rightPanelContent.length > 0) {
            let copyContent = _.cloneDeep(this.state.rightPanelContent);

            // todo: i not delete item from array, just set null, may be have something best
            // copyContent.splice(index, 1);

            copyContent[index] = null;

            let allNull = 0;

            copyContent.forEach(el => {
                if (el === null) {
                    allNull++
                }
            });


            if (allNull && allNull === copyContent.length) {
                copyContent = []
            }

            this.setState(() => {
                return {
                    rightPanelContent: copyContent
                }
            })
        }
    }

    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    removeToast = () => {
        this.setState(() => {
            return {dataToast: ''}
        })
    }

    addAdditionalProperties = (object) => {
        Object.values(object).forEach((val) => {
            if (val instanceof Object) {
                let keyByValue = this.getKeyByValue(object, val);
                if (keyByValue !== 'replication') {
                    this.addAdditionalProperties(val)
                }

            }
        })

        if (object instanceof Array) {
            object.push({'rotation': '', 'id_tree_item': '', 'id_presentation': guidGenerator()})
        } else {
            if (object['rotation'] === undefined) {
                object['rotation'] = '';
            }
            if (object['id_tree_item'] === undefined) {
                object['id_tree_item'] = '';
            }
            if (object['id_presentation'] === undefined) {
                object['id_presentation'] = guidGenerator();
            }
        }


        return object;
    }


}

