export default class Service {

    _spark = window.location.href;
    // _spark = 'http://localhost:8080';


    initialized(body) {
        let object = {};
        object.method = 'POST';
        object.mode = 'cors';
        object.cache = 'no-cache';
        object.credentials = 'omit';
        object.redirect = 'follow';
        object.referrerPolicy = 'no-referrer';
        object.body = body;
        return object;
    }


    async getResource(url, init) {
        const response = await fetch(`${this._spark}${url}`, init);
        if (!response.ok) {
            throw  new Error(`Could not fetch ${url}, received ${response.status}`)
        }
        return await response.arrayBuffer();

    }

    async testConnection(host, port, user, pass) {
        let url = new URL(`${this._spark}/testConnection`),
            params = {host: host, port: port, user: user, pass: pass};
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        let response = await fetch(url);

        if (!response.ok) {
            throw  new Error(`Could not fetch ${url}, received ${response.status}`)
        }

        return await response.text();
    }

    exit = async () => {
        try {
            let response = await fetch(`${this._spark}/exit`);
            if (!response.ok) {
                window.close();
            }
        } catch (e) {
            window.close();
        }
    }

    async getKeySpaces(host, port, connection_alias, user, pass) {
        let s = JSON.stringify({host, port, connection_alias, user, pass})
        let o = this.initialized(`${s}`);
        return await this.getResource("/keyspaces", o);
    }

    async getKeySpace(host, port, connection_alias, user, pass, nameKeySpace) {
        let s = JSON.stringify({host, port, connection_alias, user, pass, nameKeySpace})
        let o = this.initialized(`${s}`);
        return await this.getResource("/keyspaces", o);
    }

    async getTypes(host, port, connection_alias, user, pass, nameKeySpace) {
        let s = JSON.stringify({host, port, connection_alias, user, pass, nameKeySpace})
        let o = this.initialized(`${s}`);
        return await this.getResource("/gettypes", o);
    }

    async getUserFunctions(host, port, connection_alias, user, pass, nameKeySpace) {
        let s = JSON.stringify({host, port, connection_alias, user, pass, nameKeySpace})
        let o = this.initialized(`${s}`);
        return await this.getResource("/getfunctions", o);
    }

    async getRoles(host, port, connection_alias, user, pass) {
        let s = JSON.stringify({host, port, connection_alias, user, pass})
        let o = this.initialized(`${s}`);
        return await this.getResource("/getroles", o);
    }

    async getTables(host, port, connection_alias, user, pass, nameKeySpace) {
        let s = JSON.stringify({host, port, connection_alias, user, pass, nameKeySpace})
        let o = this.initialized(`${s}`);
        return await this.getResource("/gettables", o);
    }

    async getAggregateFunctions(host, port, connection_alias, user, pass, nameKeySpace) {
        let s = JSON.stringify({host, port, connection_alias, user, pass, nameKeySpace})
        let o = this.initialized(`${s}`);
        return await this.getResource("/getaggregatefunctions", o);
    }

    async getMViews(host, port, connection_alias, user, pass, nameKeySpace) {
        let s = JSON.stringify({host, port, connection_alias, user, pass, nameKeySpace})
        let o = this.initialized(`${s}`);
        return await this.getResource("/getmaterializedviews", o);
    }

    async createKeySpaces(buffer) {
        let o = this.initialized(buffer);
        return await this.getResource("/createkeyspace", o);
    }

    async editKeySpaces(buffer) {
        let o = this.initialized(buffer);
        return await this.getResource("/editkeyspace", o);
    }

    async dropKeySpaces(buffer) {
        let o = this.initialized(buffer);
        return await this.getResource("/dropkeyspace", o);
    }

    async createUserType(object) {
        let json = JSON.stringify(object)
        let o = this.initialized(json);
        return await this.getResource("/createusertype", o);
    }

    async executeQuery(object) {
        let json = JSON.stringify(object)
        let o = this.initialized(json);
        return await this.getResource("/executequery", o);
    }

    async createMV(object) {
        let o = this.initialized(object);
        return await this.getResource("/creatematerializedview", o);
    }

    async createRole(object) {
        let o = this.initialized(object);
        return await this.getResource("/createrole", o);
    }

    async createTable(object) {
        let o = this.initialized(object);
        return await this.getResource("/createtable", o);
    }

    async editUserType(object) {
        let json = JSON.stringify(object)
        let o = this.initialized(json);
        return await this.getResource("/editusertype", o);
    }

    async editTable(object) {
        let json = JSON.stringify(object)
        let o = this.initialized(json);
        return await this.getResource("/edittable", o);
    }

    async editRole(object) {
        let o = this.initialized(object);
        return await this.getResource("/editrole", o);
    }

    async dropUserType(string) {
        let o = this.initialized(string);
        return await this.getResource("/dropusertype", o);
    }

    async dropRole(string) {
        let o = this.initialized(string);
        return await this.getResource("/droprole", o);
    }

    async dropUserFunction(string) {
        let o = this.initialized(string);
        return await this.getResource("/dropuserfunction", o);
    }

    async dropAggregateFunction(string) {
        let o = this.initialized(string);
        return await this.getResource("/dropaggregatefunction", o);
    }

    async dropMView(string) {
        let o = this.initialized(string);
        return await this.getResource("/dropmaterializedview", o);
    }

    async dropTable(string) {
        let o = this.initialized(string);
        return await this.getResource("/droptable", o);
    }

    async createUserFunction(buffer) {
        let o = this.initialized(buffer);
        return await this.getResource("/createuserfunction", o);
    }

    async createAggregateFunction(buffer) {
        let o = this.initialized(buffer);
        return await this.getResource("/createaggregatefunction", o);
    }

    async disConnect(connection_alias) {
        let url = new URL(`${this._spark}/disconnect`);
        let params = {connection_alias: connection_alias};
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        let response = await fetch(url);

        if (!response.ok) {
            throw  new Error(`Could not fetch ${url}, received ${response.status}`)
        }
        return await response.text();
    }

    async proto(host) {
        return await this.getResource("/hello", this.initialize(host));
    }


}