import React from "react";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import './connection.css';
 const wrapBranch = (data, times) => {
    let initial = data;
    for (let i = 0; i < times; i++) {
        initial = <div className={"branch"}>{initial}</div>;
    }
    return initial;
}
 const getItem = (level = 0, icon = '', role = '', text = '', rotation = '', id = {}) => {

    const wraped = (
        <div className={"tree-entry"} role={role}>
                <span className={"tree-button"}>
                    {  rotation === 'spinner'
                        ? <FontAwesomeIcon icon={faSpinner} pulse={true}/>
                        : <span className={`tree-push ${rotation}`}></span>}

                </span>

            <span className={`tree-icon ${icon}`}></span>
            <span className={"tree-text"}>{text}</span>
        </div>
    );

    return (<>
        <div role={"tree-item"} {...id}>
            {wrapBranch(wraped, level)}
        </div>
    </>)
}

// todo: may change name?
const Connection = ({data}) => {
    if (data === undefined || data === null) return '';
    let alias = data.connection_alias;
    let rotation = data.rotation;
    let show = rotation === 'down' ? {className: 'show'} : {};
    let id = data.id_tree_item;
    let id_presentation = data.id_presentation;

    return (<li className={'connection'} role={"presentation"} id={id_presentation} key={id_presentation}>
        {getItem(0, 'connection-icon', '', alias, rotation, id)}
        <KS action={show} dataks={data.keyspaces ? data.keyspaces : null}/>
        <Roles action={show} data={data.roles ? data.roles : null}/>
        <Users action={show} data={data.users ? data.users : null}/>
    </li>)

}


const KS = ({action, dataks}) => {
    if (dataks === undefined || dataks === null) return '';
    return dataks.map((ks) => {
        const name = ks.name;
        const rotation = ks.rotation;
        const show = rotation === 'down' ? {className: 'show'} : {};
        const id = ks.id_tree_item;
        const id_presentation = ks.id_presentation;

        return (<ul role={"group"} {...action}>
            <li role={"presentation"} className={'keyspace'} id={id_presentation} key={id_presentation}>
                {getItem(1, 'keyspace', '', name, rotation, id)}
                <Tables data={ks.tables} action={show}/>
                <UserFunctions data={ks.userFunctions} action={show}/>
                <AggregateFunctions data={ks.aggregateFunctions} action={show}/>
                <UserTypes data={ks.userTypes} action={show}/>
                <MaterializedViews data={ks.views} action={show}/>
            </li>
        </ul>)
    })
}
const Roles = ({data, action}) => {
    if (data === undefined || data === null) return '';
    let {rotation, id_tree_item, id_presentation} = data.find(el => el.name === undefined);
    const show = rotation === 'down' ? {className: 'show'} : {};
    return (<ul role={"group"} {...action}>
        <li role={"presentation"} className={'roles'} id={id_presentation} key={id_presentation}>
            {getItem(1, '', '', `Roles ${data.length === 0 ? '' : '(' + (data.length - 1) + ')'}`, rotation, id_tree_item)}
            <Role data={data} action={show}/>
        </li>
    </ul>)
}
const Role = ({data, action}) => {

    const elements = data.map(item => {
        if(item.name){
            const name = item.name;
            const rotation = item.rotation=== 'spinner'? 'spinner': 'clear';
            const id = item.id_tree_item;
            const id_presentation = item.id_presentation;

            return (<li role={"presentation"} className={'role'} id={id_presentation} key={id_presentation}>
                {getItem(2, '', '', name, rotation, id)}
            </li>)
        }
    })
    return (<ul role={"group"} {...action}>{elements}</ul>)
}
 const Users = ({data, action}) => {
    if (data === undefined || data === null) return '';
    let {rotation, id_tree_item, id_presentation} = data.find(el => el.name === undefined);
    const show = rotation === 'down' ? {className: 'show'} : {};
    return (<ul role={"group"} {...action}>
        <li role={"presentation"} className={'users'} id={id_presentation} key={id_presentation}>
            {getItem(1, '', '', `Users ${data.length === 0 ? '' : '(' + (data.length - 1) + ')'}`, rotation, id_tree_item)}
            <User data={data} action={show}/>
        </li>
    </ul>)
}
 const User = ({data, action}) => {

    const elements = data.map(item => {
        if(item.name){
            const name = item.name;
            const rotation = item.rotation=== 'spinner'? 'spinner': 'clear';
            const id = item.id_tree_item;
            const id_presentation = item.id_presentation;

            return (<li role={"presentation"} className={'user'} id={id_presentation} key={id_presentation}>
                {getItem(2, '', '', name, rotation, id)}
            </li>)
        }
    })
    return (<ul role={"group"} {...action}>{elements}</ul>)
}

 const Tables = ({data, action}) => {
    // find properties for array
    let {rotation, id_tree_item, id_presentation} = data.find(el => el.name === undefined);
    const show = rotation === 'down' ? {className: 'show'} : {};
    return (<ul role={"group"} {...action}>
        <li role={"presentation"} className={'tables'} id={id_presentation} key={id_presentation}>
            {getItem(3, '', '', `Tables ${data.length === 0 ? '' : '(' + (data.length - 1) + ')'}`, rotation, id_tree_item)}
            <Table data={data} action={show}/>
        </li>
    </ul>)

}

 const Table = ({data, action}) => {

    const elements = data.map(item => {

        if(item.name){
        const name = item.name;
        const rotation = item.rotation;
        const show = rotation === 'down' ? {className: 'show'} : {};
        const id = item.id_tree_item;
        const id_presentation = item.id_presentation;

        return (<li role={"presentation"} className={'table'} id={id_presentation} key={id_presentation}>
            {getItem(4, '', '', name, rotation, id)}
            <Columns data={item.columns} action={show}/>
        </li>)
        }
    })
    return (<ul role={"group"} {...action}>{elements}</ul>)

}
 const UserFunctions = ({data, action}) => {

    let {rotation, id_tree_item, id_presentation} = data.find(el => el.name === undefined);
    const show = rotation === 'down' ? {className: 'show'} : {};
    return (<ul role={"group"} {...action}>
        <li role={"presentation"} className={'functions'} id={id_presentation} key={id_presentation}>
            {getItem(3, '', '', `User Defined Functions ${data.length === 0 ? '' : '(' + (data.length - 1) + ')'}`, rotation, id_tree_item)}
            <UserFunction data={data} action={show}/>
        </li>
    </ul>)

}

 const UserFunction = ({data, action}) => {

    const elements = data.map(item => {
        if(item.name){
        const name = item.name;
        const rotation = item.rotation=== 'spinner'? 'spinner': 'clear';
        const id = item.id_tree_item;
        const id_presentation = item.id_presentation;

        return (<li role={"presentation"} className={'function'} id={id_presentation} key={id_presentation}>
            {getItem(5, '', '', name.split("(")[0], rotation, id)}
        </li>)
        }
    })
    return (<ul role={"group"} {...action}>{elements}</ul>)

}
 const AggregateFunctions = ({data, action}) => {

    let {rotation, id_tree_item, id_presentation} = data.find(el => el.name === undefined);
    const show = rotation === 'down' ? {className: 'show'} : {};
    return (<ul role={"group"} {...action}>
        <li role={"presentation"} className={'agfunctions'} id={id_presentation} key={id_presentation}>
            {getItem(3, '', '', `Aggregate Functions ${data.length === 0 ? '' : '(' + (data.length -1) + ')'}`, rotation, id_tree_item)}
            <AggregateFunction data={data} action={show}/>
        </li>
    </ul>)

}

 const AggregateFunction = ({data, action}) => {

    const elements = data.map(item => {
        if(item.name){
        const name = item.name;
        const rotation = item.rotation=== 'spinner'? 'spinner': 'clear';
        const id = item.id_tree_item;
        const id_presentation = item.id_presentation;

        return (<li role={"presentation"} className={'agfunction'} id={id_presentation} key={id_presentation}>
            {getItem(5, '', '', name, rotation, id)}
        </li>)
        }
    })
    return (<ul role={"group"} {...action}>{elements}</ul>)

}

 const UserTypes = ({data, action}) => {

    let {rotation, id_tree_item, id_presentation} = data.find(el => el.name === undefined);
    const show = rotation === 'down' ? {className: 'show'} : {};
    return (<ul role={"group"} {...action}>
        <li role={"presentation"} className={'types'} id={id_presentation} key={id_presentation}>
            {getItem(3, '', '', `User Types ${data.length === 0 ? '' : '(' + (data.length - 1) + ')'}`, rotation, id_tree_item)}
            <UserType data={data} action={show}/>
        </li>
    </ul>)

}

 const UserType = ({data, action}) => {

    const elements = data.map(item => {
        if(item.name){
        const name = item.name;
        const rotation =  item.rotation;
        const show = rotation === 'down' ? {className: 'show'} : {};
        const id = item.id_tree_item;
        const id_presentation = item.id_presentation;

        return (<li role={"presentation"} className={'type'} id={id_presentation} key={id_presentation}>
            {getItem(4, '', '', name, rotation, id)}
            <TypeFields data={item.fields} action={show}/>
        </li>)
        }
    })
    return (<ul role={"group"} {...action}>{elements}</ul>)

}
 const TypeFields = ({data, action}) => {

    const elements = data.map(item => {
        if(item.name){
        const name = item.name;
        const type = item.type;
        const rotation = 'clear';
        const id = item.id_tree_item;
        const id_presentation = item.id_presentation;

        return (<li role={"presentation"} className={'field'} id={id_presentation} key={id_presentation}>
            {getItem(6, '', '', <>{name} <span
                className={"type-column"}>{type}</span></>, rotation, id)}
        </li>)
        }
    })
    return (<ul role={"group"} {...action}>{elements}</ul>)

}

 const MaterializedViews = ({data, action}) => {

    let {rotation, id_tree_item, id_presentation} = data.find(el => el.name === undefined);
    const show = rotation === 'down' ? {className: 'show'} : {};
    return (<ul role={"group"} {...action}>
        <li role={"presentation"} className={'views'} id={id_presentation} key={id_presentation}>
            {getItem(3, '', '', `Materialized Views ${data.length === 0 ? '' : '(' + (data.length - 1) + ')'}`, rotation, id_tree_item)}
            <MaterializedView data={data} action={show}/>
        </li>
    </ul>)

}

 const MaterializedView = ({data, action}) => {

    const elements = data.map(item => {
        if(item.name){
        const name = item.name;
        const rotation = item.rotation=== 'spinner'? 'spinner': 'clear';
        const id = item.id_tree_item;
        const id_presentation = item.id_presentation;

        return (<li role={"presentation"} className={'view'} id={id_presentation} key={id_presentation}>
            {getItem(5, '', '', name, rotation, id)}
        </li>)
    }
    })
    return (<ul role={"group"} {...action}>{elements}</ul>)

}

 const Columns = ({data, action}) => {

    const elements = data.map(item => {
        if(item.name){
        const name = item.name;
        const type = item.type;
        const rotation = 'clear';
        const id = item.id_tree_item;
        const id_presentation = item.id_presentation;

        return (<li role={"presentation"} className={'column'} id={id_presentation} key={id_presentation}>
            {getItem(5, '', '', <>{name} <span
                className={"type-column"}>{type}</span></>, rotation, id)}

        </li>)
        }
    })
    return (<ul role={"group"} {...action}>{elements}</ul>)

}

export default Connection;

