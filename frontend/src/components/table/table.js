import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPlusCircle, faEdit, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {guidGenerator} from '../utils/utils'
import * as _ from "lodash";
import {Table as TableProtobuf} from '../../protobuffer/compiled'
import './table.css';

const $ = window.$

const Table = ({element, saveContent}) => {

    const [focusTab, setFocusTab] = useState('');
    const [id, setId] = useState('');
    const [action, setAction] = useState('');
    const [indexFocusElement, setIndexFocusElement] = useState(-1);
    // const [indexFocusTrigger, setIndexFocusTrigger] = useState(-1);
    const [indexFocusIndex, setIndexFocusIndex] = useState(-1);
    const [properties, setProperties] = useState('');
    const [nameTable, setNameTable] = useState('');
    const [columns, setColumns] = useState([]);
    // const [triggers, setTriggers] = useState([]);
    const [indices, setIndices] = useState([]);

    const [data, setData] = useState('');
    const [changedOptions, setChangedOptions] = useState([]);
    const [indexsForChanged, setIndexsForChanged] = useState([]);
    const [changedColumns, setchangedColumns] = useState([]);

    useEffect(() => {
        setAction(element.action)
        setId(guidGenerator());
        if (element.action === 'edit') {
            if (element.table) {
                setNameTable(() => {
                    return element.table.name
                })
                if (element.table.columns) {
                    setColumns(() => {
                        return element.table.columns
                    })
                }
                if (element.table.indices) {

                    let filter = element.table.indices.map((item) => {
                        if (item.name !== undefined) {
                            return item
                        }
                    }).filter(item => item !== undefined);
                    setIndices(() => {
                        return filter
                    })
                }
                if (element.table.options) {

                    let options = Object.keys(element.table.options).map((key) => {
                        if (key !== 'rotation' && key !== 'id_tree_item' && key !== 'id_presentation') {
                            return {name: key, value: element.table.options[key]}
                        }
                    }).filter(item => item !== undefined);
                    setProperties(() => {
                        return options
                    })
                }
            }

        }
    }, [])

    useEffect(() => {
        $(`#prop-tab${id}`).tab('show');
    }, [id])


    const onChangeOption = (e) => {


        let closestTR = e.target.closest('.option_element');
        let element = closestTR.querySelector('.name_option');

        let nameOption = element.innerHTML;
        let cloneProperties = _.cloneDeep(properties);

        let index = cloneProperties.findIndex(el => el.name === nameOption);

        let changedValue = e.target.value;
        let originValue = properties[index].value;

        originValue = originValue.replace(/\s{2,}/g, ' ').trim();
        changedValue = changedValue.replace(/\s{2,}/g, ' ').trim();


        if (changedValue !== originValue) {
            let cloneChangedOptions = _.cloneDeep(changedOptions);
            if (changedOptions.length !== 0) {

                let number = cloneChangedOptions.findIndex(element => element.name === nameOption);
                if (number > -1) {
                    if (cloneChangedOptions[number].originValue === changedValue) {
                        cloneChangedOptions.splice(number, 1);
                    } else {
                        cloneChangedOptions[number] = {
                            ...cloneChangedOptions[number],
                            name: nameOption,
                            value: changedValue
                        };
                    }
                    setChangedOptions(() => {
                        return cloneChangedOptions
                    })
                } else {
                    cloneChangedOptions.push({name: nameOption, value: changedValue, originValue})
                    setChangedOptions(() => {
                        return cloneChangedOptions
                    })
                }
            } else {
                cloneChangedOptions.push({name: nameOption, value: changedValue, originValue})
                setChangedOptions(() => {
                    return cloneChangedOptions
                })
            }
            cloneProperties[index] = {name: nameOption, value: changedValue}
            setProperties(() => {
                return cloneProperties
            })
        }


    }
    const setDisabledOption = () => {
        let result = {apply: false, add: false, edit: false, delete: false}

        if (!nameTable || columns.length === 0) {
            result.apply = true;
        }
        if (columns.length === 0) {
            result.edit = true;
            result.delete = true;
        }

        if (focusTab === 'indices') {
            if (columns.length === 0) {
                result.add = true;
            }
            if (indices.length === 0) {
                result.delete = true;
            }
        }
        // if (focusTab === 'triggers') {
        //     if (triggers.length === 0) {
        //         result.delete = true;
        //     }
        // }
        return result;
    }

    const setActiveTab = (focusTab) => {
        setFocusTab(() => {
            return focusTab
        });
    }
    const setFocus = (e) => {
        if (focusTab === 'columns') {
            let closestTR = e.target.closest('.column_element');
            let element = closestTR.querySelector('.name_element');
            if (element) {
                if (columns.length > 0) {

                    let copyColumns = _.cloneDeep(columns);
                    //reset focus
                    copyColumns.forEach(el => {
                        if (el.focus) {
                            delete el.focus;
                        }
                    })

                    let index = copyColumns.findIndex(el => el.name === element.innerHTML);
                    copyColumns[index].focus = true;

                    setColumns(() => {
                        return copyColumns
                    })
                    setIndexFocusElement(() => {
                        return index
                    })

                }
            }
        }
        // if (focusTab === 'triggers') {
        //     let closestTR = e.target.closest('.indices_element');
        //     let element = closestTR.querySelector('.name_trigger');
        //     if (element) {
        //         if (triggers.length > 0) {
        //
        //             let copyTriggers = _.cloneDeep(triggers);
        //             //reset focus
        //             copyTriggers.forEach(el => {
        //                 if (el.focus) {
        //                     delete el.focus;
        //                 }
        //             })
        //
        //             let index = copyTriggers.findIndex(el => el.name === element.innerHTML);
        //             copyTriggers[index].focus = true;
        //
        //             setTriggers(() => {
        //                 return copyTriggers
        //             })
        //             setIndexFocusTrigger(() => {
        //                 return index
        //             })
        //
        //         }
        //     }
        // }
        if (focusTab === 'indices') {
            let closestTR = e.target.closest('.indices_element');
            let element = closestTR.querySelector('.name_index');
            if (element) {
                if (indices.length > 0) {

                    let copyIndices = _.cloneDeep(indices);
                    //reset focus
                    copyIndices.forEach(el => {
                        if (el.focus) {
                            delete el.focus;
                        }
                    })

                    let index = copyIndices.findIndex(el => el.name === element.innerHTML);
                    copyIndices[index].focus = true;

                    setIndices(() => {
                        return copyIndices
                    })
                    setIndexFocusIndex(() => {
                        return index
                    })

                }
            }
        }


    }


    const saveData = (data) => {
        if (data) {
            if (focusTab === 'columns') {
                let newArrayColumns = []

                if (columns.length > 0) {
                    newArrayColumns = _.cloneDeep(columns);
                }

                if (data.process === 'adding') {
                    newArrayColumns.push(data)
                    if (element.action === 'edit') {
                        let cloneChangedColumns = _.cloneDeep(changedColumns);
                        if (cloneChangedColumns.length > 0) {

                            let number = cloneChangedColumns.findIndex(item => item.add !== undefined);

                            if (number > -1) {
                                cloneChangedColumns[number].add.push(data)

                            } else {
                                cloneChangedColumns.push({add: [data]})
                            }
                        } else {
                            cloneChangedColumns.push({add: [data]})
                        }
                        setchangedColumns(() => {
                            return cloneChangedColumns
                        })
                    }
                }
                if (data.process === 'editing') {


                    let nameOrigin = newArrayColumns[indexFocusElement].name;
                    newArrayColumns[indexFocusElement] = data
                    setIndexFocusElement(() => {
                        return -1
                    })


                    if (element.action === 'edit') {
                        let cloneChangedColumns = _.cloneDeep(changedColumns);
                        if (cloneChangedColumns.length > 0) {

                            let number = cloneChangedColumns.findIndex(item => item.rename !== undefined);

                            if (number > -1) {
                                let findExistsIndex = cloneChangedColumns[number].rename.findIndex(item => item.to === nameOrigin);

                                if (findExistsIndex > -1) {
                                    if (cloneChangedColumns[number].rename[findExistsIndex].from === data.name) {
                                        cloneChangedColumns[number].rename.splice(findExistsIndex, 1);
                                    } else {
                                        cloneChangedColumns[number].rename[findExistsIndex] = {
                                            ...cloneChangedColumns[number].rename[findExistsIndex],
                                            to: data.name
                                        };
                                    }

                                } else {
                                    cloneChangedColumns[number].rename.push({from: nameOrigin, to: data.name})
                                }

                            } else {
                                cloneChangedColumns.push({rename: [{from: nameOrigin, to: data.name}]})
                            }
                        } else {
                            cloneChangedColumns.push({rename: [{from: nameOrigin, to: data.name}]})
                        }
                        setchangedColumns(() => {
                            return cloneChangedColumns
                        })
                    }
                }


                setColumns(() => {
                    return newArrayColumns
                })
            }
            // if (focusTab === 'triggers') {
            //     let newArrayTriggers = []
            //
            //     if (triggers.length > 0) {
            //         newArrayTriggers = _.cloneDeep(triggers);
            //     }
            //
            //     if (indexFocusTrigger > -1) {
            //         newArrayTriggers[indexFocusElement] = data
            //         setIndexFocusTrigger(() => {
            //             return -1
            //         })
            //     } else {
            //         newArrayTriggers.push(data)
            //     }
            //
            //
            //     setTriggers(() => {
            //         return newArrayTriggers
            //     })
            // }
            if (focusTab === 'indices') {
                let newArrayIndices = []

                if (indices.length > 0) {
                    newArrayIndices = _.cloneDeep(indices);
                }
                if (element.action === 'edit') {

                    let cloneIndexsForChanged = _.cloneDeep(indexsForChanged);
                    if (cloneIndexsForChanged.length > 0) {

                        let index = cloneIndexsForChanged.findIndex(item => item.add !== undefined);

                        if (index > -1) {
                            cloneIndexsForChanged[index].add.push(data);

                        } else {
                            cloneIndexsForChanged.push({add: [data]})
                        }

                    } else {
                        cloneIndexsForChanged.push({add: [data]})
                    }
                    setIndexsForChanged(() => {
                        return cloneIndexsForChanged
                    })
                }

                newArrayIndices.push(data)

                setIndices(() => {
                    return newArrayIndices
                })
            }


        }

        setData(() => {
            return ''
        })

    }
    const showModal = (action) => {
        if (focusTab === 'columns') {
            if (action === 'add') {
                addColumn();
                $(`#columnsmodal${id}`).modal('show')
            }
            if (action === 'edit') {
                editColumn();
                if (indexFocusElement > -1)
                    $(`#columnsmodal${id}`).modal('show')
            }
            if (action === 'delete') {
                if (indexFocusElement > -1) {
                    deleteColumn();
                }
            }


        }
        if (action === 'apply') {
            if (element.action === 'create') {
                let connectionAlias = element.name.split('.')[0];
                let keyspace = element.name.split('.')[1];


                indices.forEach(item => {
                    item[keyspace] = keyspace
                })

                let message = TableProtobuf.create({name: nameTable, columns, indices, connectionAlias, keyspace});
                let finish = TableProtobuf.encode(message).finish();
                // todo: need think about it
                saveContent({finish, action: 'create'})
            }

            if (element.action === 'edit') {
                let connectionAlias = element.name.split('.')[0];
                let keyspace = element.name.split('.')[1];

                let objectForEdit = {
                    nameTable,
                    connectionAlias,
                    keyspace,
                    action: 'edit',
                    changedOptions,
                    changedColumns,
                    indexsForChanged
                }

                saveContent(objectForEdit)
            }


        }

        // if (focusTab === 'triggers') {
        //     if (action === 'add') {
        //         addTrigger();
        //         $(`#triggersmodal${id}`).modal('show')
        //     }
        //
        //     if (action === 'delete') {
        //         if (indexFocusTrigger > -1)
        //             deleteTrigger();
        //     }
        //
        // }
        if (focusTab === 'indices') {
            if (action === 'add') {
                addIndex();
                $(`#indicesmodal${id}`).modal('show')
            }

            if (action === 'delete') {
                if (indexFocusIndex > -1)
                    deleteIndex();
            }

        }


    }

    const addColumn = () => {
        let excludes = [];
        if (columns.length > 0) {
            columns.forEach(element => {
                excludes.push(element.name)
            })
        }

        let data = {
            title: 'New Column',
            column: '',
            type: '',
            excludesNames: excludes,
            action,
            process: 'adding'
        }

        setData(() => {
            return data
        })

    }
    // const addTrigger = () => {
    //
    //     let data = {
    //         title: 'New Trigger',
    //         name: '',
    //         clazz: '',
    //         action: 'create'
    //     }
    //
    //     setData(() => {
    //         return data
    //     })
    //
    // }
    const addIndex = () => {

        let excludes = [];
        if (indices.length > 0) {
            indices.forEach(element => {
                excludes.push(element.name)
            })
        }

        let namesColumn = columns.map(item => item.name);

        let data = {
            title: 'New Index',
            name: '',
            columnsName: namesColumn,
            action: 'create',
            excludes
        }

        setData(() => {
            return data
        })

    }

    const editColumn = () => {

        if (indexFocusElement > -1) {
            let excludes = [];
            let column = columns[indexFocusElement];

            columns.forEach((element, i) => {
                if (i !== indexFocusElement) {
                    excludes.push(element.name)
                }
            })

            let action;
            if (element.action === 'create') {
                action = 'create'
            } else {
                action = 'edit'
            }

            let data = {...column, action, process: 'editing', title: 'Edit Column', excludesNames: excludes}

            setData(() => {
                return data
            })

        }
    }
    const deleteColumn = () => {

        if (indexFocusElement > -1) {
            let cloneColumns = _.cloneDeep(columns);
            let cloneChangedColumns = _.cloneDeep(changedColumns);
            let name = cloneColumns[indexFocusElement].name;
            if (cloneChangedColumns.length > 0) {
                let number = cloneChangedColumns.findIndex(item => item.add !== undefined);
                if (number > -1) {
                    let findIndex = cloneChangedColumns[number].add.findIndex(item => item.name === name);
                    if (findIndex > -1) {
                        cloneChangedColumns[number].add.splice(findIndex, 1);
                    } else {
                        let deleteIndex = cloneChangedColumns.findIndex(item => item.delete !== undefined);
                        if (deleteIndex > -1) {
                            cloneChangedColumns[deleteIndex].delete.push(name)
                        } else {
                            cloneChangedColumns.push({delete: [name]})
                        }

                    }
                } else {
                    let deleteIndex = cloneChangedColumns.findIndex(item => item.delete !== undefined);
                    if (deleteIndex > -1) {
                        cloneChangedColumns[deleteIndex].delete.push(name)
                    } else {
                        cloneChangedColumns.push({delete: [name]})
                    }
                }
            } else {
                cloneChangedColumns.push({delete: [name]})
            }

            setchangedColumns(() => {
                return cloneChangedColumns
            })

            let newColumns = cloneColumns.slice();
            newColumns.splice(indexFocusElement, 1);

            setColumns(() => {
                return newColumns
            })
        }
    }
    // const deleteTrigger = () => {
    //
    //     if (indexFocusTrigger > -1) {
    //         let cloneTriggers = _.cloneDeep(triggers);
    //         let newTriggers = cloneTriggers.slice();
    //         newTriggers.splice(indexFocusTrigger, 1);
    //
    //         setTriggers(() => {
    //             return newTriggers
    //         })
    //     }
    // }
    const deleteIndex = () => {

        if (indexFocusIndex > -1) {
            let cloneIndices = _.cloneDeep(indices);
            let nameIndex = cloneIndices[indexFocusIndex].name;
            let cloneIndexsForChanged = _.cloneDeep(indexsForChanged);
            let newIndices = cloneIndices.slice();

            if (element.action === 'edit') {

                let indexAdd = cloneIndexsForChanged.findIndex(item => item.add !== undefined);
                if (indexAdd > -1) {
                    let findIndex = cloneIndexsForChanged[indexAdd].add.findIndex(item => item.name === nameIndex)
                    if (findIndex > -1) {
                        cloneIndexsForChanged[indexFocusIndex].add.splice(findIndex, 1);
                    } else {
                        let indexDelete = cloneIndexsForChanged.findIndex(item => item.delete !== undefined);

                        if (indexDelete > -1) {
                            cloneIndexsForChanged[indexDelete].delete.push(nameIndex)
                        } else {
                            cloneIndexsForChanged.push({delete: [nameIndex]})
                        }
                    }
                } else {
                    let indexDelete = cloneIndexsForChanged.findIndex(item => item.delete !== undefined);

                    if (indexDelete > -1) {
                        cloneIndexsForChanged[indexDelete].delete.push(nameIndex)
                    } else {
                        cloneIndexsForChanged.push({delete: [nameIndex]})
                    }

                }

            }

            setIndexsForChanged(() => {
                return cloneIndexsForChanged
            })

            newIndices.splice(indexFocusIndex, 1);

            setIndices(() => {
                return newIndices
            })
        }
    }
    const close = () => {
        setData(() => {
            return ''
        })
    }

    if (id === '') {
        return null
    } else {
        return (<div>
            <Buttons focus={focusTab} optionDisabled={setDisabledOption} runModal={showModal}/>
            {focusTab === 'columns' ? <ColumnsModal id={id} data={data} saveData={saveData} close={close}/> :
                focusTab === 'indices' ? <IndicesModal id={id} data={data} saveData={saveData} close={close}/> : null}
            {/*focusTab === 'triggers' ?*/}
            {/*    <TriggersModal id={id} data={data} saveData={saveData} close={close}/> : null}*/}
            <div className={"right-panel"}>
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <a style={{padding: 3, fontSize: 15, fontFamily: 'Apple Chancery, cursive'}}
                           className={`nav-link`} id={`prop-tab${id}`}
                           data-toggle="tab" href={`#prop${id}`} role="tab"
                           onClick={() => setActiveTab('properties')}
                           aria-controls={`prop${id}`} aria-selected='false'>
                            Properties
                        </a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a style={{padding: 3, fontSize: 15, fontFamily: 'Apple Chancery, cursive'}}
                           className={`nav-link`} id={`columns-tab${id}`}
                           data-toggle="tab" href={`#columns${id}`} role="tab"
                           onClick={() => setActiveTab('columns')}
                           aria-controls={`columns${id}`} aria-selected='false'>
                            Columns
                        </a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a style={{padding: 3, fontSize: 15, fontFamily: 'Apple Chancery, cursive'}}
                           className={`nav-link`} id={`indices-tab${id}`}
                           data-toggle="tab" href={`#indices${id}`} role="tab"
                           onClick={() => setActiveTab('indices')}
                           aria-controls={`indices${id}`} aria-selected='false'>
                            Indices
                        </a>
                    </li>
                    {/*<li className="nav-item" role="presentation">*/}
                    {/*    <a style={{padding: 3, fontSize: 15, fontFamily: 'Apple Chancery, cursive'}}*/}
                    {/*       className={`nav-link`} id={`triggers-tab${id}`}*/}
                    {/*       data-toggle="tab" href={`#triggers${id}`} role="tab"*/}
                    {/*       onClick={() => setActiveTab('triggers')}*/}
                    {/*       aria-controls={`triggers${id}`} aria-selected='false'>*/}
                    {/*        Triggers*/}
                    {/*    </a>*/}
                    {/*</li>*/}
                    <li className="nav-item" role="presentation">
                        <a style={{padding: 3, fontSize: 15, fontFamily: 'Apple Chancery, cursive'}}
                           className={`nav-link`} id={`cql-tab${id}`}
                           data-toggle="tab" href={`#cql${id}`} role="tab"
                           onClick={() => setActiveTab('cql')}
                           aria-controls={`cql${id}`} aria-selected='false'>
                            Cql
                        </a>
                    </li>
                </ul>
                <div className="tab-content" style={{marginTop: 20, marginLeft: 20, marginRight: 20}}>
                    <div className={`tab-pane fade `} id={`prop${id}`} role="tabpanel"
                         aria-labelledby="view-tab">
                        <Properties name={nameTable} options={properties} disabled={action !== 'create'}
                                    onChangeOption={onChangeOption}
                                    setName={setNameTable}/>
                    </div>
                    <div className={`tab-pane fade `} id={`columns${id}`} role="tabpanel"
                         aria-labelledby="view-tab">
                        <Columns elements={columns} setFocus={setFocus}/>
                    </div>
                    <div className={`tab-pane fade `} id={`indices${id}`} role="tabpanel"
                         aria-labelledby="view-tab">
                        <Indices elements={indices} setFocus={setFocus}/>
                    </div>
                    {/*<div className={`tab-pane fade `} id={`triggers${id}`} role="tabpanel"*/}
                    {/*     aria-labelledby="view-tab">*/}
                    {/*    <Triggers elements={triggers} setFocus={setFocus}/>*/}
                    {/*</div>*/}
                    <div className={`tab-pane fade `} id={`cql${id}`} role="tabpanel"
                         aria-labelledby="view-tab">
                        <textarea className={"cqltext"} disabled={true}>
                            {element.table ? element.table.describe : ''}
                        </textarea>
                    </div>
                </div>
            </div>
        </div>)
    }

}


const Properties = ({name, disabled, options, setName, onChangeOption}) => {


    let opt;
    if (options) {
        opt = options.map(item => {
            return (
                <tr className={`option_element ${item.focus ? 'focus' : ''}`}>
                    <td><span className={'name_option'}>{item.name}</span></td>
                    <td><input className={'value_option'} style={{width: '100%'}} value={item.value}/></td>
                </tr>
            )
        })

        opt = (<table className="table">
            <thead>
            <tr>
                <th scope="col">Name Option</th>
                <th scope="col">Value</th>
            </tr>
            </thead>
            <tbody onChange={(e) => onChangeOption(e)}>
            {opt}
            </tbody>
        </table>)
    }


    return (<div>
        <div><span style={{marginLeft: 10}}>Name</span><input style={{marginLeft: 10}}
                                                              disabled={disabled} value={name}
                                                              onChange={(e) => setName(e.target.value)}/>
        </div>
        {opt}
    </div>)
}
const Indices = ({elements, setFocus}) => {

    const elem = elements.map((item) => {

        return (<tr className={`indices_element ${item.focus ? 'focus' : ''}`}>
            <td><span className={'name_index'}>{item.name}</span></td>
            <td><span className={'index_columns'}>{item.column}</span></td>
        </tr>)
    })

    return (<table className="table">
        <thead>
        <tr>
            <th scope="col">Name</th>
            <th scope="col">Columns</th>
        </tr>
        </thead>
        <tbody onClick={setFocus}>
        {elem}
        </tbody>
    </table>)
}
// const Triggers = ({elements, setFocus}) => {
//
//     const elem = elements.map((item) => {
//         return (<tr className={`trigger_element ${item.focus ? 'focus' : ''}`}>
//             <td><span className={'name_trigger'}>{item.name}</span></td>
//             <td><span className={'class_trigger'}>{item.clazz}</span></td>
//         </tr>)
//     })
//
//     return (<table className="table">
//         <thead>
//         <tr>
//             <th scope="col">Name</th>
//             <th scope="col">Class</th>
//         </tr>
//         </thead>
//         <tbody onClick={setFocus}>
//         {elem}
//         </tbody>
//     </table>)
// }

const Columns = ({elements, setFocus}) => {

    let elem;

    if (elements.length !== 0) {

        elem = elements.map((element) => {
            if (element.name)
                return (
                    <tr className={`column_element ${element.focus ? 'focus' : ''}`}>
                        <td><span className={'name_element'}>{element.name}</span></td>
                        <td><span className={'type_element'}>{element.type}</span></td>
                        <td><input type={"checkbox"} checked={element.isStatic} disabled={true}
                                   className={'static_element'}/></td>
                        <td><input type={"checkbox"} checked={element.isPartitionKey} disabled={true}
                                   className={'partition_element'}/></td>
                        <td><input type={"checkbox"} checked={element.isClusteringKey} disabled={true}
                                   className={'clustering_element'}/>
                        </td>
                    </tr>
                )
        })
    }

    return (<table className="table">
        <thead>
        <tr>
            <th scope="col">Name</th>
            <th scope="col">Data Type</th>
            <th scope="col">Static</th>
            <th scope="col">Partition Key</th>
            <th scope="col">Clustering</th>
        </tr>
        </thead>
        <tbody onClick={setFocus}>
        {elem}
        </tbody>
    </table>)
}

const ColumnsModal = ({id, data, saveData, close}) => {

    const [name, setNameColumn] = useState('');
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [isStatic, setStatic] = useState(false);
    const [isPartitionKey, setPartition] = useState(false);
    const [isClusteringKey, setClustering] = useState(false);
    const [excludesNames, setExcludeNames] = useState('');
    const [warn, setWarn] = useState('');
    const [action, setAction] = useState('');
    const [process, setProcess] = useState('');


    useEffect(() => {
        if (data) {
            let {name, title, type, action, excludesNames, isPartitionKey, isClusteringKey, isStatic, process} = data;
            if (name) {
                setNameColumn(() => {
                    return name
                })
            }
            if (title) {
                setTitle(() => {
                    return title
                })
            }
            if (type) {
                setType(() => {
                    return type
                })
            }
            if (action) {
                setAction(() => {
                    return action
                })
            }
            if (process) {
                setProcess(() => {
                    return process
                })
            }
            if (excludesNames) {
                setExcludeNames(() => {
                    return excludesNames
                })
            }
            if (isStatic) {
                setStatic(() => {
                    return isStatic
                })
            }
            if (isPartitionKey) {
                setPartition(() => {
                    return isPartitionKey
                })
            }
            if (isClusteringKey) {
                setClustering(() => {
                    return isClusteringKey
                })
            }
        }

    }, [data])

    const setWarning = (value) => {
        setWarn(() => {
            return <span style={{color: "red"}}> this name already uses </span>
        })
        setNameColumn(() => {
            return value
        })
    }
    const clearFields = () => {
        setNameColumn(() => {
            return ''
        })
        setType(() => {
            return ''
        })
        setStatic(() => {
            return false
        })
        setPartition(() => {
            return false
        })
        setClustering(() => {
            return false
        })
    }
    const closeModal = () => {
        clearFields();
        close();
    }
    const prepareColumnAndSave = () => {
        $(`#columnsmodal${id}`).modal('hide')
        saveData({name, type, isStatic, isClusteringKey, isPartitionKey, process})
        clearFields();
    }

    const getSelectList = (type) => {
        //todo: include custom type from system_schema.types   SET LIST MAP NEED ANOTHER
        const types = ['', 'ascii', 'bigint', 'blob', 'boolean', 'counter', 'date', 'decimal',
            'double', 'duration', 'float', 'inet', 'int',
            'smallint', 'text', 'time', 'timestamp', 'timeuuid', 'tinyint', 'tuple',
            'uuid', 'varchar', 'varint']


        let index = types.findIndex(element => element === type.toLowerCase());

        return types.map((element, i) => {
            if (i === index) {
                return <option selected>{element}</option>
            } else {
                return <option>{element}</option>
            }

        })

    }
    const onChange = (e) => {
        let changed = e.target.id;
        let value = e.target.value;
        let checked = e.target.checked;
        if (changed === `columnname${id}`) {
            if (excludesNames.includes(value)) {
                setWarning(value)
            } else {
                if (warn !== '') {
                    setWarn(() => {
                        return ''
                    })
                }
                setNameColumn(() => {
                    return value
                })
            }
        }
        if (changed === `select${id}`) {
            setType(() => {
                return value
            })
        }
        if (changed === `static${id}`) {

            setStatic(() => {
                return checked
            })
        }
        if (changed === `partition${id}`) {
            if (checked) {
                setPartition(() => {
                    return checked
                })
                setClustering(() => {
                    return !checked
                })
            } else {
                setPartition(() => {
                    return checked
                })
            }


        }
        if (changed === `clustering${id}`) {
            if (checked) {
                setClustering(() => {
                    return checked
                })
                setPartition(() => {
                    return !checked
                })
            } else {
                setClustering(() => {
                    return checked
                })
            }

        }
    }

    return (
        <div className="modal fade" id={`columnsmodal${id}`} data-backdrop="static" data-keyboard="false" tabIndex="-1"
             role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"
                            id="staticBackdropLabel">{title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={() => closeModal()}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body" onChange={onChange}>
                        <div><span>Column Name</span> <input
                            disabled={!isPartitionKey && (process === 'editing' && action === 'edit')}
                            id={`columnname${id}`} className={'columnName'}
                            value={name}
                        />{warn}</div>
                        <div><span style={{float: 'left'}}>Column Type</span>
                            <select className="custom-select mr-sm-2" id={`select${id}`}
                                    disabled={process === 'editing' && action === 'edit'}>
                                {getSelectList(type)}
                            </select>
                        </div>
                        <span hidden={action !== 'create'}>Static   <input id={`static${id}`} type={"checkbox"}
                                                                           checked={isStatic}/></span>
                        <div></div>
                        <span hidden={action !== 'create'}>Partition Key  <input id={`partition${id}`} type={"checkbox"}
                                                                                 checked={isPartitionKey}/></span>
                        <div></div>
                        <span hidden={action !== 'create'}>Clustering Key  <input id={`clustering${id}`}
                                                                                  type={"checkbox"}
                                                                                  checked={isClusteringKey}/></span>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary"
                                data-dismiss="modal"
                                onClick={() => closeModal()}
                        >CANCEL
                        </button>
                        <button type="button" className="btn btn-primary"
                                disabled={warn || name === '' || type === ''}
                                onClick={() => prepareColumnAndSave()}
                        >OK
                        </button>
                    </div>
                </div>
            </div>
        </div>)
}
const IndicesModal = ({id, data, saveData, close}) => {


    const [columnName, setColumnName] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState('');
    const [nameIndex, setNameIndex] = useState('');
    const [className, setClassName] = useState('');
    const [isIndexOnKeys, setIndexOnKeys] = useState(false);
    const [isIndexOnValues, setIndexOnValues] = useState(false);
    const [excludes, setExcudes] = useState([]);
    const [warn, setWarn] = useState('');

    // const getSelectList = (type) => {
    //
    //     if (data.columnsName) {
    //         let index = data.columnsName.findIndex(element => element === type.toLowerCase());
    //
    //         let columns = data.columnsName.map((element, i) => {
    //             if (i === index) {
    //                 return (<option selected>{element}</option>);
    //             } else {
    //                 return (<option>{element}</option>);
    //             }
    //
    //         })
    //
    //         setColumnName(() => {
    //             return columns
    //         })
    //     }
    //
    // }


    const setWarning = (value) => {
        setWarn(() => {
            return <span style={{color: "red"}}> this name already uses </span>
        })
        setNameIndex(() => {
            return value
        })
    }

    useEffect(() => {
        if (data) {
            let elements = data.columnsName.map((item, i) => {
                return (<option>{item}</option>);
            });
            if (elements.length > 0) {
                setSelectedColumn(() => {
                    return data.columnsName[0]
                })
                setColumnName(() => {
                    return elements
                })
            }

            if (data.excludes) {
                setExcudes(() => {
                    return data.excludes
                })
            }

        }

    }, [data])

    const clearFields = () => {
        setColumnName(() => {
            return []
        })
        setNameIndex(() => {
            return ''
        })
        setIndexOnValues(() => {
            return false
        })
        setIndexOnKeys(() => {
            return false
        })
        setClassName(() => {
            return ''
        })
    }
    const closeModal = () => {
        clearFields();
        close();
    }

    const prepareIndexAndSave = () => {
        $(`#indicesmodal${id}`).modal('hide')
        saveData({name: nameIndex, column: selectedColumn, className, isIndexOnKeys, isIndexOnValues})
        clearFields();
    }

    const onChange = (e) => {
        let changed = e.target.id;
        let value = e.target.value;
        let checked = e.target.checked;
        if (changed === `select_index_modal${id}`) {
            setSelectedColumn(() => {
                return value
            })

        }
        if (changed === `name_index${id}`) {

            if (excludes.includes(value)) {
                setWarning(value)
            } else {
                if (warn !== '') {
                    setWarn(() => {
                        return ''
                    })
                }
                setNameIndex(() => {
                    return value
                })
            }
        }
        if (changed === `name_class${id}`) {

            setClassName(() => {
                return value
            })
        }
        if (changed === `on_keys${id}`) {
            if (checked) {
                setIndexOnKeys(() => {
                    return checked
                })
                setIndexOnValues(() => {
                    return !checked
                })
            } else {
                setIndexOnKeys(() => {
                    return checked
                })
            }

        }
        if (changed === `on_values${id}`) {
            if (checked) {
                setIndexOnValues(() => {
                    return checked
                })
                setIndexOnKeys(() => {
                    return !checked
                })
            } else {
                setIndexOnValues(() => {
                    return checked
                })
            }

        }
    }

    return (
        <div className="modal fade" id={`indicesmodal${id}`} data-backdrop="static" data-keyboard="false" tabIndex="-1"
             role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"
                            id="staticBackdropLabel">Confirmation</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={() => closeModal()}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body" onChange={onChange}>

                        <span>Field Name</span>
                        <select className="custom-select mr-sm-2" id={`select_index_modal${id}`}>
                            {columnName}
                        </select>
                        <span>Index Name  <input id={`name_index${id}`}
                                                 value={nameIndex}/> {warn}</span>
                        <div></div>
                        <span>Class Name  <input id={`name_class${id}`}
                                                 value={className}/></span>
                        <div></div>

                        <span>Index on Keys <input id={`on_keys${id}`}
                                                   type={"checkbox"}
                                                   checked={isIndexOnKeys}/></span>
                        <div></div>
                        <span>Index on Values  <input id={`on_values${id}`}
                                                      type={"checkbox"}
                                                      checked={isIndexOnValues}/></span>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary"
                                data-dismiss="modal"
                                onClick={() => closeModal()}
                        >CANCEL
                        </button>
                        <button type="button" className="btn btn-primary"
                                disabled={nameIndex === '' || warn}
                                onClick={() => prepareIndexAndSave()}
                        >OK
                        </button>
                    </div>
                </div>
            </div>
        </div>)
}
// const TriggersModal = ({id, data, saveData, close}) => {
//
//     const [name, setName] = useState()
//     const [clazz, setClazz] = useState()
//     const [title, setTitle] = useState()
//
//     useEffect(() => {
//         if (data) {
//             let {name, clazz, title} = data;
//             if (name) {
//                 setName(() => {
//                     return name
//                 })
//             }
//             if (clazz) {
//                 setClazz(() => {
//                     return clazz
//                 })
//             }
//             if (title) {
//                 setTitle(() => {
//                     return title
//                 })
//             }
//         }
//     }, [data])
//
//     const clearFields = () => {
//         setName(() => {
//             return ''
//         })
//         setClazz(() => {
//             return ''
//         })
//     }
//
//     const closeModal = () => {
//         clearFields();
//         close();
//     }
//     const prepareTriggerAndSave = () => {
//         $(`#triggersmodal${id}`).modal('hide')
//         saveData({name, clazz})
//         clearFields();
//     }
//
//     const onChange = (e) => {
//         let targetId = e.target.id;
//         let value = e.target.value;
//         if (targetId === `name_trigger${id}`) {
//             setName(() => {
//                 return value
//             })
//         }
//         if (targetId === `class_trigger${id}`) {
//             setClazz(() => {
//                 return value
//             })
//         }
//     }
//
//     return (
//         <div className="modal fade" id={`triggersmodal${id}`} data-backdrop="static" data-keyboard="false" tabIndex="-1"
//              role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
//             <div className="modal-dialog">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h5 className="modal-title"
//                             id="staticBackdropLabel">{title}</h5>
//                         <button type="button" className="close" data-dismiss="modal" aria-label="Close"
//                                 onClick={() => closeModal()}>
//                             <span aria-hidden="true">&times;</span>
//                         </button>
//                     </div>
//                     <div className="modal-body" onChange={onChange}>
//
//                         <div><span>Name Trigger</span><input id={`name_trigger${id}`} style={{marginLeft: 20}}
//                                                              value={name}/></div>
//                         <div><span>Class Name</span><input id={`class_trigger${id}`} style={{marginLeft: 20}}
//                                                            value={clazz}/></div>
//
//                     </div>
//                     <div className="modal-footer">
//                         <button type="button" className="btn btn-secondary"
//                                 data-dismiss="modal"
//                                 onClick={() => closeModal()}
//                         >CANCEL
//                         </button>
//                         <button type="button" className="btn btn-primary"
//                                 onClick={() => prepareTriggerAndSave()}
//                         >OK
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>)
// }


const Buttons = ({focus, optionDisabled, runModal}) => {

    const [buttons, setButtons] = useState([]);

    useEffect(() => {
        let options = optionDisabled();
        if (focus === 'properties' || focus === 'cql' || focus === '') {
            let elemens = [];
            elemens.push(<div>
                <button type="button" disabled={options.apply} onClick={() => runModal('apply')}
                        className="btn btn-outline-success" title="Apply Changes"
                ><FontAwesomeIcon icon={faCheck}/></button>
            </div>)
            setButtons(() => {
                return (elemens)
            })
        }
        if (focus === 'columns') {
            let elemens = [];
            elemens.push(<div>
                <button type="button" disabled={options.apply} onClick={() => runModal('apply')}
                        className="btn btn-outline-success" title="Apply Changes"
                ><FontAwesomeIcon icon={faCheck}/></button>
                <button type="button" disabled={options.add} onClick={() => runModal('add')}
                        className="btn btn-outline-secondary" title="Add column"
                ><FontAwesomeIcon icon={faPlusCircle}/></button>
                <button type="button" disabled={options.edit} onClick={() => runModal('edit')}
                        className="btn btn-outline-secondary" title="Edit column"
                ><FontAwesomeIcon icon={faEdit}/></button>
                <button type="button" disabled={options.delete} onClick={() => runModal('delete')}
                        className="btn btn-outline-secondary" title="Remove column"
                ><FontAwesomeIcon icon={faTrashAlt}/></button>

            </div>)
            setButtons(() => {
                return (elemens)
            })
        }
        if (focus === 'indices') {
            let elemens = [];
            elemens.push(<div>
                <button type="button" disabled={options.apply} onClick={() => runModal('apply')}
                        className="btn btn-outline-success" title="Apply Changes"
                ><FontAwesomeIcon icon={faCheck}/></button>
                <button type="button" disabled={options.add} onClick={() => runModal('add')}
                        className="btn btn-outline-secondary" title="Add index"
                ><FontAwesomeIcon icon={faPlusCircle}/></button>
                <button type="button" disabled={options.delete} onClick={() => runModal('delete')}
                        className="btn btn-outline-secondary" title="Delete index"
                ><FontAwesomeIcon icon={faTrashAlt}/></button>

            </div>)
            setButtons(() => {
                return (elemens)
            })
        }
        if (focus === 'triggers') {
            let elemens = [];
            elemens.push(<div>
                <button type="button" disabled={options.apply} onClick={() => runModal('apply')}
                        className="btn btn-outline-success" title="Apply Changes"
                ><FontAwesomeIcon icon={faCheck}/></button>
                <button type="button" disabled={options.add} onClick={() => runModal('add')}
                        className="btn btn-outline-secondary" title="Add trigger"
                ><FontAwesomeIcon icon={faPlusCircle}/></button>
                <button type="button" disabled={options.delete} onClick={() => runModal('delete')}
                        className="btn btn-outline-secondary" title="Delete trigger"
                ><FontAwesomeIcon icon={faTrashAlt}/></button>

            </div>)
            setButtons(() => {
                return (elemens)
            })
        }

    }, [focus, optionDisabled]);


    return (<div>{buttons}</div>)
}

export default Table;