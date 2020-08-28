import Lockr from 'lockr';


export default class Storage {

    constructor() {
        if (localStorage.getItem('_connection_') === null || typeof localStorage.getItem('_connection_') === 'undefined') {
            Lockr.set('_connection_', []);
        }
    }

    get = (item) => {
        if (typeof item === 'undefined') {
            return Lockr.get('_connection_');
        }


        return Lockr.get('_connection_').map(object => {
            if (JSON.parse(object).connection_alias === item) {
                return object;
            }
             return undefined;
        }).filter((e) => typeof e !== "undefined")[0];

    }

    isExists = (object) => {
        if (Lockr.get('_connection_').length > 0) {
            let find = false;
            Lockr.get('_connection_').forEach(ob => {

                if (JSON.parse(ob).connection_alias === JSON.parse(object).connection_alias) {
                    find = true;
                }
            })
            return find;
        } else {
            return false;
        }

    }

    pushToStorage = (object) => {
        let arrayConnection = Lockr.get('_connection_');
        arrayConnection.push(object);
        Lockr.set('_connection_', arrayConnection);
    }

    save = (object) => {
        if (Lockr.get('_connection_').length === 0) {
            this.pushToStorage(object);
            return true;
        }

        if (this.isExists(object)) {
            throw new Error('Object ' + object + ' already exists');
        } else {
            this.pushToStorage(object);
            return true;
        }
    }

    saveAll = (connections) => {
        Lockr.set('_connection_', connections);
    }

    edit = (focus, newObject) => {
        if (Lockr.get('_connection_').length === 0) {
            throw new Error('Empty localstorage');
        }

        if(!(JSON.parse(newObject).connection_alias === focus) && this.isExists(newObject)){
            throw new Error('Object ' + newObject + ' already exists');
        }

        let newArray = Lockr.get('_connection_').map(obj => {

            if(JSON.parse(obj).connection_alias === focus){
                return newObject;
            }
            return obj;

        });

        Lockr.set('_connection_',newArray);
        return true;
    }

    clear = () => {
        Lockr.set('_connection_', []);
    }


}