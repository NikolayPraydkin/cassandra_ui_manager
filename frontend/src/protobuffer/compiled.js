/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.KeySpaces = (function() {

    /**
     * Properties of a KeySpaces.
     * @exports IKeySpaces
     * @interface IKeySpaces
     * @property {Array.<IKeySpace>|null} [keyspaces] KeySpaces keyspaces
     * @property {Array.<IRole>|null} [role] KeySpaces role
     */

    /**
     * Constructs a new KeySpaces.
     * @exports KeySpaces
     * @classdesc Represents a KeySpaces.
     * @implements IKeySpaces
     * @constructor
     * @param {IKeySpaces=} [properties] Properties to set
     */
    function KeySpaces(properties) {
        this.keyspaces = [];
        this.roles = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * KeySpaces keyspaces.
     * @member {Array.<IKeySpace>} keyspaces
     * @memberof KeySpaces
     * @instance
     */
    KeySpaces.prototype.keyspaces = $util.emptyArray;

    /**
     * KeySpaces role.
     * @member {Array.<IRole>} role
     * @memberof KeySpaces
     * @instance
     */
    KeySpaces.prototype.roles = $util.emptyArray;

    /**
     * Creates a new KeySpaces instance using the specified properties.
     * @function create
     * @memberof KeySpaces
     * @static
     * @param {IKeySpaces=} [properties] Properties to set
     * @returns {KeySpaces} KeySpaces instance
     */
    KeySpaces.create = function create(properties) {
        return new KeySpaces(properties);
    };

    /**
     * Encodes the specified KeySpaces message. Does not implicitly {@link KeySpaces.verify|verify} messages.
     * @function encode
     * @memberof KeySpaces
     * @static
     * @param {IKeySpaces} message KeySpaces message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KeySpaces.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.keyspaces != null && message.keyspaces.length)
            for (var i = 0; i < message.keyspaces.length; ++i)
                $root.KeySpace.encode(message.keyspaces[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.roles != null && message.roles.length)
            for (var i = 0; i < message.roles.length; ++i)
                $root.Role.encode(message.roles[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified KeySpaces message, length delimited. Does not implicitly {@link KeySpaces.verify|verify} messages.
     * @function encodeDelimited
     * @memberof KeySpaces
     * @static
     * @param {IKeySpaces} message KeySpaces message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KeySpaces.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KeySpaces message from the specified reader or buffer.
     * @function decode
     * @memberof KeySpaces
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {KeySpaces} KeySpaces
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KeySpaces.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.KeySpaces();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.keyspaces && message.keyspaces.length))
                    message.keyspaces = [];
                message.keyspaces.push($root.KeySpace.decode(reader, reader.uint32()));
                break;
            case 2:
                if (!(message.roles && message.roles.length))
                    message.roles = [];
                message.roles.push($root.Role.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a KeySpaces message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof KeySpaces
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {KeySpaces} KeySpaces
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KeySpaces.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KeySpaces message.
     * @function verify
     * @memberof KeySpaces
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KeySpaces.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.keyspaces != null && message.hasOwnProperty("keyspaces")) {
            if (!Array.isArray(message.keyspaces))
                return "keyspaces: array expected";
            for (var i = 0; i < message.keyspaces.length; ++i) {
                var error = $root.KeySpace.verify(message.keyspaces[i]);
                if (error)
                    return "keyspaces." + error;
            }
        }
        if (message.roles != null && message.hasOwnProperty("roles")) {
            if (!Array.isArray(message.roles))
                return "role: array expected";
            for (var i = 0; i < message.roles.length; ++i) {
                var error = $root.Role.verify(message.roles[i]);
                if (error)
                    return "role." + error;
            }
        }
        return null;
    };

    /**
     * Creates a KeySpaces message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof KeySpaces
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {KeySpaces} KeySpaces
     */
    KeySpaces.fromObject = function fromObject(object) {
        if (object instanceof $root.KeySpaces)
            return object;
        var message = new $root.KeySpaces();
        if (object.keyspaces) {
            if (!Array.isArray(object.keyspaces))
                throw TypeError(".KeySpaces.keyspaces: array expected");
            message.keyspaces = [];
            for (var i = 0; i < object.keyspaces.length; ++i) {
                if (typeof object.keyspaces[i] !== "object")
                    throw TypeError(".KeySpaces.keyspaces: object expected");
                message.keyspaces[i] = $root.KeySpace.fromObject(object.keyspaces[i]);
            }
        }
        if (object.roles) {
            if (!Array.isArray(object.roles))
                throw TypeError(".KeySpaces.role: array expected");
            message.roles = [];
            for (var i = 0; i < object.roles.length; ++i) {
                if (typeof object.roles[i] !== "object")
                    throw TypeError(".KeySpaces.role: object expected");
                message.roles[i] = $root.Role.fromObject(object.roles[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a KeySpaces message. Also converts values to other types if specified.
     * @function toObject
     * @memberof KeySpaces
     * @static
     * @param {KeySpaces} message KeySpaces
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KeySpaces.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults) {
            object.keyspaces = [];
            object.roles = [];
        }
        if (message.keyspaces && message.keyspaces.length) {
            object.keyspaces = [];
            for (var j = 0; j < message.keyspaces.length; ++j)
                object.keyspaces[j] = $root.KeySpace.toObject(message.keyspaces[j], options);
        }
        if (message.roles && message.roles.length) {
            object.roles = [];
            for (var j = 0; j < message.roles.length; ++j)
                object.roles[j] = $root.Role.toObject(message.roles[j], options);
        }
        return object;
    };

    /**
     * Converts this KeySpaces to JSON.
     * @function toJSON
     * @memberof KeySpaces
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KeySpaces.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return KeySpaces;
})();

$root.KeySpace = (function() {

    /**
     * Properties of a KeySpace.
     * @exports IKeySpace
     * @interface IKeySpace
     * @property {string|null} [name] KeySpace name
     * @property {boolean|null} [durableWrites] KeySpace durableWrites
     * @property {Object.<string,string>|null} [replication] KeySpace replication
     * @property {Array.<ITable>|null} [table] KeySpace table
     * @property {Array.<IUserType>|null} [userTypes] KeySpace userTypes
     * @property {Array.<IUserFunction>|null} [userFunctions] KeySpace userFunctions
     * @property {Array.<IAggregateFunction>|null} [aggregateFunctions] KeySpace aggregateFunctions
     * @property {Array.<IMateriliazedView>|null} [views] KeySpace views
     * @property {string|null} [connectionAlias] KeySpace connectionAlias
     */

    /**
     * Constructs a new KeySpace.
     * @exports KeySpace
     * @classdesc Represents a KeySpace.
     * @implements IKeySpace
     * @constructor
     * @param {IKeySpace=} [properties] Properties to set
     */
    function KeySpace(properties) {
        this.replication = {};
        this.tables = [];
        this.userTypes = [];
        this.userFunctions = [];
        this.aggregateFunctions = [];
        this.views = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * KeySpace name.
     * @member {string} name
     * @memberof KeySpace
     * @instance
     */
    KeySpace.prototype.name = "";

    /**
     * KeySpace durableWrites.
     * @member {boolean} durableWrites
     * @memberof KeySpace
     * @instance
     */
    KeySpace.prototype.durableWrites = false;

    /**
     * KeySpace replication.
     * @member {Object.<string,string>} replication
     * @memberof KeySpace
     * @instance
     */
    KeySpace.prototype.replication = $util.emptyObject;

    /**
     * KeySpace table.
     * @member {Array.<ITable>} table
     * @memberof KeySpace
     * @instance
     */
    KeySpace.prototype.tables = $util.emptyArray;

    /**
     * KeySpace userTypes.
     * @member {Array.<IUserType>} userTypes
     * @memberof KeySpace
     * @instance
     */
    KeySpace.prototype.userTypes = $util.emptyArray;

    /**
     * KeySpace userFunctions.
     * @member {Array.<IUserFunction>} userFunctions
     * @memberof KeySpace
     * @instance
     */
    KeySpace.prototype.userFunctions = $util.emptyArray;

    /**
     * KeySpace aggregateFunctions.
     * @member {Array.<IAggregateFunction>} aggregateFunctions
     * @memberof KeySpace
     * @instance
     */
    KeySpace.prototype.aggregateFunctions = $util.emptyArray;

    /**
     * KeySpace views.
     * @member {Array.<IMateriliazedView>} views
     * @memberof KeySpace
     * @instance
     */
    KeySpace.prototype.views = $util.emptyArray;

    /**
     * KeySpace connectionAlias.
     * @member {string} connectionAlias
     * @memberof KeySpace
     * @instance
     */
    KeySpace.prototype.connectionAlias = "";

    /**
     * Creates a new KeySpace instance using the specified properties.
     * @function create
     * @memberof KeySpace
     * @static
     * @param {IKeySpace=} [properties] Properties to set
     * @returns {KeySpace} KeySpace instance
     */
    KeySpace.create = function create(properties) {
        return new KeySpace(properties);
    };

    /**
     * Encodes the specified KeySpace message. Does not implicitly {@link KeySpace.verify|verify} messages.
     * @function encode
     * @memberof KeySpace
     * @static
     * @param {IKeySpace} message KeySpace message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KeySpace.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.durableWrites != null && Object.hasOwnProperty.call(message, "durableWrites"))
            writer.uint32(/* id 2, wireType 0 =*/16).bool(message.durableWrites);
        if (message.replication != null && Object.hasOwnProperty.call(message, "replication"))
            for (var keys = Object.keys(message.replication), i = 0; i < keys.length; ++i)
                writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.replication[keys[i]]).ldelim();
        if (message.tables != null && message.tables.length)
            for (var i = 0; i < message.tables.length; ++i)
                $root.Table.encode(message.tables[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.userTypes != null && message.userTypes.length)
            for (var i = 0; i < message.userTypes.length; ++i)
                $root.UserType.encode(message.userTypes[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.userFunctions != null && message.userFunctions.length)
            for (var i = 0; i < message.userFunctions.length; ++i)
                $root.UserFunction.encode(message.userFunctions[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        if (message.aggregateFunctions != null && message.aggregateFunctions.length)
            for (var i = 0; i < message.aggregateFunctions.length; ++i)
                $root.AggregateFunction.encode(message.aggregateFunctions[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
        if (message.views != null && message.views.length)
            for (var i = 0; i < message.views.length; ++i)
                $root.MateriliazedView.encode(message.views[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
        if (message.connectionAlias != null && Object.hasOwnProperty.call(message, "connectionAlias"))
            writer.uint32(/* id 9, wireType 2 =*/74).string(message.connectionAlias);
        return writer;
    };

    /**
     * Encodes the specified KeySpace message, length delimited. Does not implicitly {@link KeySpace.verify|verify} messages.
     * @function encodeDelimited
     * @memberof KeySpace
     * @static
     * @param {IKeySpace} message KeySpace message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KeySpace.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KeySpace message from the specified reader or buffer.
     * @function decode
     * @memberof KeySpace
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {KeySpace} KeySpace
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KeySpace.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.KeySpace(), key;
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.durableWrites = reader.bool();
                break;
            case 3:
                reader.skip().pos++;
                if (message.replication === $util.emptyObject)
                    message.replication = {};
                key = reader.string();
                reader.pos++;
                message.replication[key] = reader.string();
                break;
            case 4:
                if (!(message.tables && message.tables.length))
                    message.tables = [];
                message.tables.push($root.Table.decode(reader, reader.uint32()));
                break;
            case 5:
                if (!(message.userTypes && message.userTypes.length))
                    message.userTypes = [];
                message.userTypes.push($root.UserType.decode(reader, reader.uint32()));
                break;
            case 6:
                if (!(message.userFunctions && message.userFunctions.length))
                    message.userFunctions = [];
                message.userFunctions.push($root.UserFunction.decode(reader, reader.uint32()));
                break;
            case 7:
                if (!(message.aggregateFunctions && message.aggregateFunctions.length))
                    message.aggregateFunctions = [];
                message.aggregateFunctions.push($root.AggregateFunction.decode(reader, reader.uint32()));
                break;
            case 8:
                if (!(message.views && message.views.length))
                    message.views = [];
                message.views.push($root.MateriliazedView.decode(reader, reader.uint32()));
                break;
            case 9:
                message.connectionAlias = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a KeySpace message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof KeySpace
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {KeySpace} KeySpace
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KeySpace.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KeySpace message.
     * @function verify
     * @memberof KeySpace
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KeySpace.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.durableWrites != null && message.hasOwnProperty("durableWrites"))
            if (typeof message.durableWrites !== "boolean")
                return "durableWrites: boolean expected";
        if (message.replication != null && message.hasOwnProperty("replication")) {
            if (!$util.isObject(message.replication))
                return "replication: object expected";
            var key = Object.keys(message.replication);
            for (var i = 0; i < key.length; ++i)
                if (!$util.isString(message.replication[key[i]]))
                    return "replication: string{k:string} expected";
        }
        if (message.tables != null && message.hasOwnProperty("tables")) {
            if (!Array.isArray(message.tables))
                return "table: array expected";
            for (var i = 0; i < message.tables.length; ++i) {
                var error = $root.Table.verify(message.tables[i]);
                if (error)
                    return "table." + error;
            }
        }
        if (message.userTypes != null && message.hasOwnProperty("userTypes")) {
            if (!Array.isArray(message.userTypes))
                return "userTypes: array expected";
            for (var i = 0; i < message.userTypes.length; ++i) {
                var error = $root.UserType.verify(message.userTypes[i]);
                if (error)
                    return "userTypes." + error;
            }
        }
        if (message.userFunctions != null && message.hasOwnProperty("userFunctions")) {
            if (!Array.isArray(message.userFunctions))
                return "userFunctions: array expected";
            for (var i = 0; i < message.userFunctions.length; ++i) {
                var error = $root.UserFunction.verify(message.userFunctions[i]);
                if (error)
                    return "userFunctions." + error;
            }
        }
        if (message.aggregateFunctions != null && message.hasOwnProperty("aggregateFunctions")) {
            if (!Array.isArray(message.aggregateFunctions))
                return "aggregateFunctions: array expected";
            for (var i = 0; i < message.aggregateFunctions.length; ++i) {
                var error = $root.AggregateFunction.verify(message.aggregateFunctions[i]);
                if (error)
                    return "aggregateFunctions." + error;
            }
        }
        if (message.views != null && message.hasOwnProperty("views")) {
            if (!Array.isArray(message.views))
                return "views: array expected";
            for (var i = 0; i < message.views.length; ++i) {
                var error = $root.MateriliazedView.verify(message.views[i]);
                if (error)
                    return "views." + error;
            }
        }
        if (message.connectionAlias != null && message.hasOwnProperty("connectionAlias"))
            if (!$util.isString(message.connectionAlias))
                return "connectionAlias: string expected";
        return null;
    };

    /**
     * Creates a KeySpace message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof KeySpace
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {KeySpace} KeySpace
     */
    KeySpace.fromObject = function fromObject(object) {
        if (object instanceof $root.KeySpace)
            return object;
        var message = new $root.KeySpace();
        if (object.name != null)
            message.name = String(object.name);
        if (object.durableWrites != null)
            message.durableWrites = Boolean(object.durableWrites);
        if (object.replication) {
            if (typeof object.replication !== "object")
                throw TypeError(".KeySpace.replication: object expected");
            message.replication = {};
            for (var keys = Object.keys(object.replication), i = 0; i < keys.length; ++i)
                message.replication[keys[i]] = String(object.replication[keys[i]]);
        }
        if (object.tables) {
            if (!Array.isArray(object.tables))
                throw TypeError(".KeySpace.table: array expected");
            message.tables = [];
            for (var i = 0; i < object.tables.length; ++i) {
                if (typeof object.tables[i] !== "object")
                    throw TypeError(".KeySpace.table: object expected");
                message.tables[i] = $root.Table.fromObject(object.tables[i]);
            }
        }
        if (object.userTypes) {
            if (!Array.isArray(object.userTypes))
                throw TypeError(".KeySpace.userTypes: array expected");
            message.userTypes = [];
            for (var i = 0; i < object.userTypes.length; ++i) {
                if (typeof object.userTypes[i] !== "object")
                    throw TypeError(".KeySpace.userTypes: object expected");
                message.userTypes[i] = $root.UserType.fromObject(object.userTypes[i]);
            }
        }
        if (object.userFunctions) {
            if (!Array.isArray(object.userFunctions))
                throw TypeError(".KeySpace.userFunctions: array expected");
            message.userFunctions = [];
            for (var i = 0; i < object.userFunctions.length; ++i) {
                if (typeof object.userFunctions[i] !== "object")
                    throw TypeError(".KeySpace.userFunctions: object expected");
                message.userFunctions[i] = $root.UserFunction.fromObject(object.userFunctions[i]);
            }
        }
        if (object.aggregateFunctions) {
            if (!Array.isArray(object.aggregateFunctions))
                throw TypeError(".KeySpace.aggregateFunctions: array expected");
            message.aggregateFunctions = [];
            for (var i = 0; i < object.aggregateFunctions.length; ++i) {
                if (typeof object.aggregateFunctions[i] !== "object")
                    throw TypeError(".KeySpace.aggregateFunctions: object expected");
                message.aggregateFunctions[i] = $root.AggregateFunction.fromObject(object.aggregateFunctions[i]);
            }
        }
        if (object.views) {
            if (!Array.isArray(object.views))
                throw TypeError(".KeySpace.views: array expected");
            message.views = [];
            for (var i = 0; i < object.views.length; ++i) {
                if (typeof object.views[i] !== "object")
                    throw TypeError(".KeySpace.views: object expected");
                message.views[i] = $root.MateriliazedView.fromObject(object.views[i]);
            }
        }
        if (object.connectionAlias != null)
            message.connectionAlias = String(object.connectionAlias);
        return message;
    };

    /**
     * Creates a plain object from a KeySpace message. Also converts values to other types if specified.
     * @function toObject
     * @memberof KeySpace
     * @static
     * @param {KeySpace} message KeySpace
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KeySpace.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults) {
            object.tables = [];
            object.userTypes = [];
            object.userFunctions = [];
            object.aggregateFunctions = [];
            object.views = [];
        }
        if (options.objects || options.defaults)
            object.replication = {};
        if (options.defaults) {
            object.name = "";
            object.durableWrites = false;
            object.connectionAlias = "";
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.durableWrites != null && message.hasOwnProperty("durableWrites"))
            object.durableWrites = message.durableWrites;
        var keys2;
        if (message.replication && (keys2 = Object.keys(message.replication)).length) {
            object.replication = {};
            for (var j = 0; j < keys2.length; ++j)
                object.replication[keys2[j]] = message.replication[keys2[j]];
        }
        if (message.tables && message.tables.length) {
            object.tables = [];
            for (var j = 0; j < message.tables.length; ++j)
                object.tables[j] = $root.Table.toObject(message.tables[j], options);
        }
        if (message.userTypes && message.userTypes.length) {
            object.userTypes = [];
            for (var j = 0; j < message.userTypes.length; ++j)
                object.userTypes[j] = $root.UserType.toObject(message.userTypes[j], options);
        }
        if (message.userFunctions && message.userFunctions.length) {
            object.userFunctions = [];
            for (var j = 0; j < message.userFunctions.length; ++j)
                object.userFunctions[j] = $root.UserFunction.toObject(message.userFunctions[j], options);
        }
        if (message.aggregateFunctions && message.aggregateFunctions.length) {
            object.aggregateFunctions = [];
            for (var j = 0; j < message.aggregateFunctions.length; ++j)
                object.aggregateFunctions[j] = $root.AggregateFunction.toObject(message.aggregateFunctions[j], options);
        }
        if (message.views && message.views.length) {
            object.views = [];
            for (var j = 0; j < message.views.length; ++j)
                object.views[j] = $root.MateriliazedView.toObject(message.views[j], options);
        }
        if (message.connectionAlias != null && message.hasOwnProperty("connectionAlias"))
            object.connectionAlias = message.connectionAlias;
        return object;
    };

    /**
     * Converts this KeySpace to JSON.
     * @function toJSON
     * @memberof KeySpace
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KeySpace.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return KeySpace;
})();

$root.Table = (function() {

    /**
     * Properties of a Table.
     * @exports ITable
     * @interface ITable
     * @property {string|null} [name] Table name
     * @property {Array.<IColumn>|null} [columns] Table columns
     * @property {Array.<string>|null} [partitionKey] Table partitionKey
     * @property {Array.<string>|null} [clusteringKey] Table clusteringKey
     * @property {Object.<string,string>|null} [options] Table options
     * @property {Array.<IIndex>|null} [indices] Table indices
     * @property {string|null} [describe] Table describe
     * @property {string|null} [connectionAlias] Table connectionAlias
     * @property {string|null} [keyspace] Table keyspace
     */

    /**
     * Constructs a new Table.
     * @exports Table
     * @classdesc Represents a Table.
     * @implements ITable
     * @constructor
     * @param {ITable=} [properties] Properties to set
     */
    function Table(properties) {
        this.columns = [];
        this.partitionKey = [];
        this.clusteringKey = [];
        this.options = {};
        this.indices = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Table name.
     * @member {string} name
     * @memberof Table
     * @instance
     */
    Table.prototype.name = "";

    /**
     * Table columns.
     * @member {Array.<IColumn>} columns
     * @memberof Table
     * @instance
     */
    Table.prototype.columns = $util.emptyArray;

    /**
     * Table partitionKey.
     * @member {Array.<string>} partitionKey
     * @memberof Table
     * @instance
     */
    Table.prototype.partitionKey = $util.emptyArray;

    /**
     * Table clusteringKey.
     * @member {Array.<string>} clusteringKey
     * @memberof Table
     * @instance
     */
    Table.prototype.clusteringKey = $util.emptyArray;

    /**
     * Table options.
     * @member {Object.<string,string>} options
     * @memberof Table
     * @instance
     */
    Table.prototype.options = $util.emptyObject;

    /**
     * Table indices.
     * @member {Array.<IIndex>} indices
     * @memberof Table
     * @instance
     */
    Table.prototype.indices = $util.emptyArray;

    /**
     * Table describe.
     * @member {string} describe
     * @memberof Table
     * @instance
     */
    Table.prototype.describe = "";

    /**
     * Table connectionAlias.
     * @member {string} connectionAlias
     * @memberof Table
     * @instance
     */
    Table.prototype.connectionAlias = "";

    /**
     * Table keyspace.
     * @member {string} keyspace
     * @memberof Table
     * @instance
     */
    Table.prototype.keyspace = "";

    /**
     * Creates a new Table instance using the specified properties.
     * @function create
     * @memberof Table
     * @static
     * @param {ITable=} [properties] Properties to set
     * @returns {Table} Table instance
     */
    Table.create = function create(properties) {
        return new Table(properties);
    };

    /**
     * Encodes the specified Table message. Does not implicitly {@link Table.verify|verify} messages.
     * @function encode
     * @memberof Table
     * @static
     * @param {ITable} message Table message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Table.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.columns != null && message.columns.length)
            for (var i = 0; i < message.columns.length; ++i)
                $root.Column.encode(message.columns[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.partitionKey != null && message.partitionKey.length)
            for (var i = 0; i < message.partitionKey.length; ++i)
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.partitionKey[i]);
        if (message.clusteringKey != null && message.clusteringKey.length)
            for (var i = 0; i < message.clusteringKey.length; ++i)
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.clusteringKey[i]);
        if (message.options != null && Object.hasOwnProperty.call(message, "options"))
            for (var keys = Object.keys(message.options), i = 0; i < keys.length; ++i)
                writer.uint32(/* id 5, wireType 2 =*/42).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.options[keys[i]]).ldelim();
        if (message.indices != null && message.indices.length)
            for (var i = 0; i < message.indices.length; ++i)
                $root.Index.encode(message.indices[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        if (message.describe != null && Object.hasOwnProperty.call(message, "describe"))
            writer.uint32(/* id 7, wireType 2 =*/58).string(message.describe);
        if (message.connectionAlias != null && Object.hasOwnProperty.call(message, "connectionAlias"))
            writer.uint32(/* id 8, wireType 2 =*/66).string(message.connectionAlias);
        if (message.keyspace != null && Object.hasOwnProperty.call(message, "keyspace"))
            writer.uint32(/* id 9, wireType 2 =*/74).string(message.keyspace);
        return writer;
    };

    /**
     * Encodes the specified Table message, length delimited. Does not implicitly {@link Table.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Table
     * @static
     * @param {ITable} message Table message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Table.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Table message from the specified reader or buffer.
     * @function decode
     * @memberof Table
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Table} Table
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Table.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Table(), key;
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                if (!(message.columns && message.columns.length))
                    message.columns = [];
                message.columns.push($root.Column.decode(reader, reader.uint32()));
                break;
            case 3:
                if (!(message.partitionKey && message.partitionKey.length))
                    message.partitionKey = [];
                message.partitionKey.push(reader.string());
                break;
            case 4:
                if (!(message.clusteringKey && message.clusteringKey.length))
                    message.clusteringKey = [];
                message.clusteringKey.push(reader.string());
                break;
            case 5:
                reader.skip().pos++;
                if (message.options === $util.emptyObject)
                    message.options = {};
                key = reader.string();
                reader.pos++;
                message.options[key] = reader.string();
                break;
            case 6:
                if (!(message.indices && message.indices.length))
                    message.indices = [];
                message.indices.push($root.Index.decode(reader, reader.uint32()));
                break;
            case 7:
                message.describe = reader.string();
                break;
            case 8:
                message.connectionAlias = reader.string();
                break;
            case 9:
                message.keyspace = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Table message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Table
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Table} Table
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Table.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Table message.
     * @function verify
     * @memberof Table
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Table.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.columns != null && message.hasOwnProperty("columns")) {
            if (!Array.isArray(message.columns))
                return "columns: array expected";
            for (var i = 0; i < message.columns.length; ++i) {
                var error = $root.Column.verify(message.columns[i]);
                if (error)
                    return "columns." + error;
            }
        }
        if (message.partitionKey != null && message.hasOwnProperty("partitionKey")) {
            if (!Array.isArray(message.partitionKey))
                return "partitionKey: array expected";
            for (var i = 0; i < message.partitionKey.length; ++i)
                if (!$util.isString(message.partitionKey[i]))
                    return "partitionKey: string[] expected";
        }
        if (message.clusteringKey != null && message.hasOwnProperty("clusteringKey")) {
            if (!Array.isArray(message.clusteringKey))
                return "clusteringKey: array expected";
            for (var i = 0; i < message.clusteringKey.length; ++i)
                if (!$util.isString(message.clusteringKey[i]))
                    return "clusteringKey: string[] expected";
        }
        if (message.options != null && message.hasOwnProperty("options")) {
            if (!$util.isObject(message.options))
                return "options: object expected";
            var key = Object.keys(message.options);
            for (var i = 0; i < key.length; ++i)
                if (!$util.isString(message.options[key[i]]))
                    return "options: string{k:string} expected";
        }
        if (message.indices != null && message.hasOwnProperty("indices")) {
            if (!Array.isArray(message.indices))
                return "indices: array expected";
            for (var i = 0; i < message.indices.length; ++i) {
                var error = $root.Index.verify(message.indices[i]);
                if (error)
                    return "indices." + error;
            }
        }
        if (message.describe != null && message.hasOwnProperty("describe"))
            if (!$util.isString(message.describe))
                return "describe: string expected";
        if (message.connectionAlias != null && message.hasOwnProperty("connectionAlias"))
            if (!$util.isString(message.connectionAlias))
                return "connectionAlias: string expected";
        if (message.keyspace != null && message.hasOwnProperty("keyspace"))
            if (!$util.isString(message.keyspace))
                return "keyspace: string expected";
        return null;
    };

    /**
     * Creates a Table message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Table
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Table} Table
     */
    Table.fromObject = function fromObject(object) {
        if (object instanceof $root.Table)
            return object;
        var message = new $root.Table();
        if (object.name != null)
            message.name = String(object.name);
        if (object.columns) {
            if (!Array.isArray(object.columns))
                throw TypeError(".Table.columns: array expected");
            message.columns = [];
            for (var i = 0; i < object.columns.length; ++i) {
                if (typeof object.columns[i] !== "object")
                    throw TypeError(".Table.columns: object expected");
                message.columns[i] = $root.Column.fromObject(object.columns[i]);
            }
        }
        if (object.partitionKey) {
            if (!Array.isArray(object.partitionKey))
                throw TypeError(".Table.partitionKey: array expected");
            message.partitionKey = [];
            for (var i = 0; i < object.partitionKey.length; ++i)
                message.partitionKey[i] = String(object.partitionKey[i]);
        }
        if (object.clusteringKey) {
            if (!Array.isArray(object.clusteringKey))
                throw TypeError(".Table.clusteringKey: array expected");
            message.clusteringKey = [];
            for (var i = 0; i < object.clusteringKey.length; ++i)
                message.clusteringKey[i] = String(object.clusteringKey[i]);
        }
        if (object.options) {
            if (typeof object.options !== "object")
                throw TypeError(".Table.options: object expected");
            message.options = {};
            for (var keys = Object.keys(object.options), i = 0; i < keys.length; ++i)
                message.options[keys[i]] = String(object.options[keys[i]]);
        }
        if (object.indices) {
            if (!Array.isArray(object.indices))
                throw TypeError(".Table.indices: array expected");
            message.indices = [];
            for (var i = 0; i < object.indices.length; ++i) {
                if (typeof object.indices[i] !== "object")
                    throw TypeError(".Table.indices: object expected");
                message.indices[i] = $root.Index.fromObject(object.indices[i]);
            }
        }
        if (object.describe != null)
            message.describe = String(object.describe);
        if (object.connectionAlias != null)
            message.connectionAlias = String(object.connectionAlias);
        if (object.keyspace != null)
            message.keyspace = String(object.keyspace);
        return message;
    };

    /**
     * Creates a plain object from a Table message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Table
     * @static
     * @param {Table} message Table
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Table.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults) {
            object.columns = [];
            object.partitionKey = [];
            object.clusteringKey = [];
            object.indices = [];
        }
        if (options.objects || options.defaults)
            object.options = {};
        if (options.defaults) {
            object.name = "";
            object.describe = "";
            object.connectionAlias = "";
            object.keyspace = "";
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.columns && message.columns.length) {
            object.columns = [];
            for (var j = 0; j < message.columns.length; ++j)
                object.columns[j] = $root.Column.toObject(message.columns[j], options);
        }
        if (message.partitionKey && message.partitionKey.length) {
            object.partitionKey = [];
            for (var j = 0; j < message.partitionKey.length; ++j)
                object.partitionKey[j] = message.partitionKey[j];
        }
        if (message.clusteringKey && message.clusteringKey.length) {
            object.clusteringKey = [];
            for (var j = 0; j < message.clusteringKey.length; ++j)
                object.clusteringKey[j] = message.clusteringKey[j];
        }
        var keys2;
        if (message.options && (keys2 = Object.keys(message.options)).length) {
            object.options = {};
            for (var j = 0; j < keys2.length; ++j)
                object.options[keys2[j]] = message.options[keys2[j]];
        }
        if (message.indices && message.indices.length) {
            object.indices = [];
            for (var j = 0; j < message.indices.length; ++j)
                object.indices[j] = $root.Index.toObject(message.indices[j], options);
        }
        if (message.describe != null && message.hasOwnProperty("describe"))
            object.describe = message.describe;
        if (message.connectionAlias != null && message.hasOwnProperty("connectionAlias"))
            object.connectionAlias = message.connectionAlias;
        if (message.keyspace != null && message.hasOwnProperty("keyspace"))
            object.keyspace = message.keyspace;
        return object;
    };

    /**
     * Converts this Table to JSON.
     * @function toJSON
     * @memberof Table
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Table.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Table;
})();

$root.Index = (function() {

    /**
     * Properties of an Index.
     * @exports IIndex
     * @interface IIndex
     * @property {string|null} [name] Index name
     * @property {string|null} [className] Index className
     * @property {boolean|null} [isIndexOnKeys] Index isIndexOnKeys
     * @property {boolean|null} [isIndexOnValues] Index isIndexOnValues
     * @property {string|null} [column] Index column
     * @property {string|null} [keyspace] Index keyspace
     */

    /**
     * Constructs a new Index.
     * @exports Index
     * @classdesc Represents an Index.
     * @implements IIndex
     * @constructor
     * @param {IIndex=} [properties] Properties to set
     */
    function Index(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Index name.
     * @member {string} name
     * @memberof Index
     * @instance
     */
    Index.prototype.name = "";

    /**
     * Index className.
     * @member {string} className
     * @memberof Index
     * @instance
     */
    Index.prototype.className = "";

    /**
     * Index isIndexOnKeys.
     * @member {boolean} isIndexOnKeys
     * @memberof Index
     * @instance
     */
    Index.prototype.isIndexOnKeys = false;

    /**
     * Index isIndexOnValues.
     * @member {boolean} isIndexOnValues
     * @memberof Index
     * @instance
     */
    Index.prototype.isIndexOnValues = false;

    /**
     * Index column.
     * @member {string} column
     * @memberof Index
     * @instance
     */
    Index.prototype.column = "";

    /**
     * Index keyspace.
     * @member {string} keyspace
     * @memberof Index
     * @instance
     */
    Index.prototype.keyspace = "";

    /**
     * Creates a new Index instance using the specified properties.
     * @function create
     * @memberof Index
     * @static
     * @param {IIndex=} [properties] Properties to set
     * @returns {Index} Index instance
     */
    Index.create = function create(properties) {
        return new Index(properties);
    };

    /**
     * Encodes the specified Index message. Does not implicitly {@link Index.verify|verify} messages.
     * @function encode
     * @memberof Index
     * @static
     * @param {IIndex} message Index message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Index.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.className != null && Object.hasOwnProperty.call(message, "className"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.className);
        if (message.isIndexOnKeys != null && Object.hasOwnProperty.call(message, "isIndexOnKeys"))
            writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isIndexOnKeys);
        if (message.isIndexOnValues != null && Object.hasOwnProperty.call(message, "isIndexOnValues"))
            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isIndexOnValues);
        if (message.column != null && Object.hasOwnProperty.call(message, "column"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.column);
        if (message.keyspace != null && Object.hasOwnProperty.call(message, "keyspace"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.keyspace);
        return writer;
    };

    /**
     * Encodes the specified Index message, length delimited. Does not implicitly {@link Index.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Index
     * @static
     * @param {IIndex} message Index message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Index.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Index message from the specified reader or buffer.
     * @function decode
     * @memberof Index
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Index} Index
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Index.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Index();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.className = reader.string();
                break;
            case 3:
                message.isIndexOnKeys = reader.bool();
                break;
            case 4:
                message.isIndexOnValues = reader.bool();
                break;
            case 5:
                message.column = reader.string();
                break;
            case 6:
                message.keyspace = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Index message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Index
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Index} Index
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Index.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Index message.
     * @function verify
     * @memberof Index
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Index.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.className != null && message.hasOwnProperty("className"))
            if (!$util.isString(message.className))
                return "className: string expected";
        if (message.isIndexOnKeys != null && message.hasOwnProperty("isIndexOnKeys"))
            if (typeof message.isIndexOnKeys !== "boolean")
                return "isIndexOnKeys: boolean expected";
        if (message.isIndexOnValues != null && message.hasOwnProperty("isIndexOnValues"))
            if (typeof message.isIndexOnValues !== "boolean")
                return "isIndexOnValues: boolean expected";
        if (message.column != null && message.hasOwnProperty("column"))
            if (!$util.isString(message.column))
                return "column: string expected";
        if (message.keyspace != null && message.hasOwnProperty("keyspace"))
            if (!$util.isString(message.keyspace))
                return "keyspace: string expected";
        return null;
    };

    /**
     * Creates an Index message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Index
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Index} Index
     */
    Index.fromObject = function fromObject(object) {
        if (object instanceof $root.Index)
            return object;
        var message = new $root.Index();
        if (object.name != null)
            message.name = String(object.name);
        if (object.className != null)
            message.className = String(object.className);
        if (object.isIndexOnKeys != null)
            message.isIndexOnKeys = Boolean(object.isIndexOnKeys);
        if (object.isIndexOnValues != null)
            message.isIndexOnValues = Boolean(object.isIndexOnValues);
        if (object.column != null)
            message.column = String(object.column);
        if (object.keyspace != null)
            message.keyspace = String(object.keyspace);
        return message;
    };

    /**
     * Creates a plain object from an Index message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Index
     * @static
     * @param {Index} message Index
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Index.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.name = "";
            object.className = "";
            object.isIndexOnKeys = false;
            object.isIndexOnValues = false;
            object.column = "";
            object.keyspace = "";
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.className != null && message.hasOwnProperty("className"))
            object.className = message.className;
        if (message.isIndexOnKeys != null && message.hasOwnProperty("isIndexOnKeys"))
            object.isIndexOnKeys = message.isIndexOnKeys;
        if (message.isIndexOnValues != null && message.hasOwnProperty("isIndexOnValues"))
            object.isIndexOnValues = message.isIndexOnValues;
        if (message.column != null && message.hasOwnProperty("column"))
            object.column = message.column;
        if (message.keyspace != null && message.hasOwnProperty("keyspace"))
            object.keyspace = message.keyspace;
        return object;
    };

    /**
     * Converts this Index to JSON.
     * @function toJSON
     * @memberof Index
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Index.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Index;
})();

$root.Column = (function() {

    /**
     * Properties of a Column.
     * @exports IColumn
     * @interface IColumn
     * @property {string|null} [name] Column name
     * @property {string|null} [type] Column type
     * @property {boolean|null} [isPartitionKey] Column isPartitionKey
     * @property {boolean|null} [isClusteringKey] Column isClusteringKey
     * @property {boolean|null} [isStatic] Column isStatic
     */

    /**
     * Constructs a new Column.
     * @exports Column
     * @classdesc Represents a Column.
     * @implements IColumn
     * @constructor
     * @param {IColumn=} [properties] Properties to set
     */
    function Column(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Column name.
     * @member {string} name
     * @memberof Column
     * @instance
     */
    Column.prototype.name = "";

    /**
     * Column type.
     * @member {string} type
     * @memberof Column
     * @instance
     */
    Column.prototype.type = "";

    /**
     * Column isPartitionKey.
     * @member {boolean} isPartitionKey
     * @memberof Column
     * @instance
     */
    Column.prototype.isPartitionKey = false;

    /**
     * Column isClusteringKey.
     * @member {boolean} isClusteringKey
     * @memberof Column
     * @instance
     */
    Column.prototype.isClusteringKey = false;

    /**
     * Column isStatic.
     * @member {boolean} isStatic
     * @memberof Column
     * @instance
     */
    Column.prototype.isStatic = false;

    /**
     * Creates a new Column instance using the specified properties.
     * @function create
     * @memberof Column
     * @static
     * @param {IColumn=} [properties] Properties to set
     * @returns {Column} Column instance
     */
    Column.create = function create(properties) {
        return new Column(properties);
    };

    /**
     * Encodes the specified Column message. Does not implicitly {@link Column.verify|verify} messages.
     * @function encode
     * @memberof Column
     * @static
     * @param {IColumn} message Column message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Column.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
        if (message.isPartitionKey != null && Object.hasOwnProperty.call(message, "isPartitionKey"))
            writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isPartitionKey);
        if (message.isClusteringKey != null && Object.hasOwnProperty.call(message, "isClusteringKey"))
            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isClusteringKey);
        if (message.isStatic != null && Object.hasOwnProperty.call(message, "isStatic"))
            writer.uint32(/* id 5, wireType 0 =*/40).bool(message.isStatic);
        return writer;
    };

    /**
     * Encodes the specified Column message, length delimited. Does not implicitly {@link Column.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Column
     * @static
     * @param {IColumn} message Column message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Column.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Column message from the specified reader or buffer.
     * @function decode
     * @memberof Column
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Column} Column
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Column.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Column();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.type = reader.string();
                break;
            case 3:
                message.isPartitionKey = reader.bool();
                break;
            case 4:
                message.isClusteringKey = reader.bool();
                break;
            case 5:
                message.isStatic = reader.bool();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Column message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Column
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Column} Column
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Column.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Column message.
     * @function verify
     * @memberof Column
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Column.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.type != null && message.hasOwnProperty("type"))
            if (!$util.isString(message.type))
                return "type: string expected";
        if (message.isPartitionKey != null && message.hasOwnProperty("isPartitionKey"))
            if (typeof message.isPartitionKey !== "boolean")
                return "isPartitionKey: boolean expected";
        if (message.isClusteringKey != null && message.hasOwnProperty("isClusteringKey"))
            if (typeof message.isClusteringKey !== "boolean")
                return "isClusteringKey: boolean expected";
        if (message.isStatic != null && message.hasOwnProperty("isStatic"))
            if (typeof message.isStatic !== "boolean")
                return "isStatic: boolean expected";
        return null;
    };

    /**
     * Creates a Column message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Column
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Column} Column
     */
    Column.fromObject = function fromObject(object) {
        if (object instanceof $root.Column)
            return object;
        var message = new $root.Column();
        if (object.name != null)
            message.name = String(object.name);
        if (object.type != null)
            message.type = String(object.type);
        if (object.isPartitionKey != null)
            message.isPartitionKey = Boolean(object.isPartitionKey);
        if (object.isClusteringKey != null)
            message.isClusteringKey = Boolean(object.isClusteringKey);
        if (object.isStatic != null)
            message.isStatic = Boolean(object.isStatic);
        return message;
    };

    /**
     * Creates a plain object from a Column message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Column
     * @static
     * @param {Column} message Column
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Column.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.name = "";
            object.type = "";
            object.isPartitionKey = false;
            object.isClusteringKey = false;
            object.isStatic = false;
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = message.type;
        if (message.isPartitionKey != null && message.hasOwnProperty("isPartitionKey"))
            object.isPartitionKey = message.isPartitionKey;
        if (message.isClusteringKey != null && message.hasOwnProperty("isClusteringKey"))
            object.isClusteringKey = message.isClusteringKey;
        if (message.isStatic != null && message.hasOwnProperty("isStatic"))
            object.isStatic = message.isStatic;
        return object;
    };

    /**
     * Converts this Column to JSON.
     * @function toJSON
     * @memberof Column
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Column.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Column;
})();

$root.UserType = (function() {

    /**
     * Properties of a UserType.
     * @exports IUserType
     * @interface IUserType
     * @property {string|null} [name] UserType name
     * @property {Array.<IField>|null} [fields] UserType fields
     */

    /**
     * Constructs a new UserType.
     * @exports UserType
     * @classdesc Represents a UserType.
     * @implements IUserType
     * @constructor
     * @param {IUserType=} [properties] Properties to set
     */
    function UserType(properties) {
        this.fields = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * UserType name.
     * @member {string} name
     * @memberof UserType
     * @instance
     */
    UserType.prototype.name = "";

    /**
     * UserType fields.
     * @member {Array.<IField>} fields
     * @memberof UserType
     * @instance
     */
    UserType.prototype.fields = $util.emptyArray;

    /**
     * Creates a new UserType instance using the specified properties.
     * @function create
     * @memberof UserType
     * @static
     * @param {IUserType=} [properties] Properties to set
     * @returns {UserType} UserType instance
     */
    UserType.create = function create(properties) {
        return new UserType(properties);
    };

    /**
     * Encodes the specified UserType message. Does not implicitly {@link UserType.verify|verify} messages.
     * @function encode
     * @memberof UserType
     * @static
     * @param {IUserType} message UserType message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserType.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.fields != null && message.fields.length)
            for (var i = 0; i < message.fields.length; ++i)
                $root.Field.encode(message.fields[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified UserType message, length delimited. Does not implicitly {@link UserType.verify|verify} messages.
     * @function encodeDelimited
     * @memberof UserType
     * @static
     * @param {IUserType} message UserType message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserType.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a UserType message from the specified reader or buffer.
     * @function decode
     * @memberof UserType
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {UserType} UserType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserType.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UserType();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                if (!(message.fields && message.fields.length))
                    message.fields = [];
                message.fields.push($root.Field.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a UserType message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof UserType
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {UserType} UserType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserType.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a UserType message.
     * @function verify
     * @memberof UserType
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    UserType.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.fields != null && message.hasOwnProperty("fields")) {
            if (!Array.isArray(message.fields))
                return "fields: array expected";
            for (var i = 0; i < message.fields.length; ++i) {
                var error = $root.Field.verify(message.fields[i]);
                if (error)
                    return "fields." + error;
            }
        }
        return null;
    };

    /**
     * Creates a UserType message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof UserType
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {UserType} UserType
     */
    UserType.fromObject = function fromObject(object) {
        if (object instanceof $root.UserType)
            return object;
        var message = new $root.UserType();
        if (object.name != null)
            message.name = String(object.name);
        if (object.fields) {
            if (!Array.isArray(object.fields))
                throw TypeError(".UserType.fields: array expected");
            message.fields = [];
            for (var i = 0; i < object.fields.length; ++i) {
                if (typeof object.fields[i] !== "object")
                    throw TypeError(".UserType.fields: object expected");
                message.fields[i] = $root.Field.fromObject(object.fields[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a UserType message. Also converts values to other types if specified.
     * @function toObject
     * @memberof UserType
     * @static
     * @param {UserType} message UserType
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    UserType.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.fields = [];
        if (options.defaults)
            object.name = "";
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.fields && message.fields.length) {
            object.fields = [];
            for (var j = 0; j < message.fields.length; ++j)
                object.fields[j] = $root.Field.toObject(message.fields[j], options);
        }
        return object;
    };

    /**
     * Converts this UserType to JSON.
     * @function toJSON
     * @memberof UserType
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    UserType.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return UserType;
})();

$root.Field = (function() {

    /**
     * Properties of a Field.
     * @exports IField
     * @interface IField
     * @property {string|null} [name] Field name
     * @property {string|null} [type] Field type
     */

    /**
     * Constructs a new Field.
     * @exports Field
     * @classdesc Represents a Field.
     * @implements IField
     * @constructor
     * @param {IField=} [properties] Properties to set
     */
    function Field(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Field name.
     * @member {string} name
     * @memberof Field
     * @instance
     */
    Field.prototype.name = "";

    /**
     * Field type.
     * @member {string} type
     * @memberof Field
     * @instance
     */
    Field.prototype.type = "";

    /**
     * Creates a new Field instance using the specified properties.
     * @function create
     * @memberof Field
     * @static
     * @param {IField=} [properties] Properties to set
     * @returns {Field} Field instance
     */
    Field.create = function create(properties) {
        return new Field(properties);
    };

    /**
     * Encodes the specified Field message. Does not implicitly {@link Field.verify|verify} messages.
     * @function encode
     * @memberof Field
     * @static
     * @param {IField} message Field message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Field.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
        return writer;
    };

    /**
     * Encodes the specified Field message, length delimited. Does not implicitly {@link Field.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Field
     * @static
     * @param {IField} message Field message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Field.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Field message from the specified reader or buffer.
     * @function decode
     * @memberof Field
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Field} Field
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Field.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Field();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.type = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Field message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Field
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Field} Field
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Field.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Field message.
     * @function verify
     * @memberof Field
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Field.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.type != null && message.hasOwnProperty("type"))
            if (!$util.isString(message.type))
                return "type: string expected";
        return null;
    };

    /**
     * Creates a Field message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Field
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Field} Field
     */
    Field.fromObject = function fromObject(object) {
        if (object instanceof $root.Field)
            return object;
        var message = new $root.Field();
        if (object.name != null)
            message.name = String(object.name);
        if (object.type != null)
            message.type = String(object.type);
        return message;
    };

    /**
     * Creates a plain object from a Field message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Field
     * @static
     * @param {Field} message Field
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Field.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.name = "";
            object.type = "";
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = message.type;
        return object;
    };

    /**
     * Converts this Field to JSON.
     * @function toJSON
     * @memberof Field
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Field.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Field;
})();

$root.UserFunction = (function() {

    /**
     * Properties of a UserFunction.
     * @exports IUserFunction
     * @interface IUserFunction
     * @property {string|null} [name] UserFunction name
     * @property {string|null} [keyspace] UserFunction keyspace
     * @property {boolean|null} [orReplace] UserFunction orReplace
     * @property {boolean|null} [ifNotExist] UserFunction ifNotExist
     * @property {string|null} [returnType] UserFunction returnType
     * @property {boolean|null} [calledOnNullInput] UserFunction calledOnNullInput
     * @property {string|null} [language] UserFunction language
     * @property {string|null} [signature] UserFunction signature
     * @property {string|null} [body] UserFunction body
     * @property {string|null} [connection] UserFunction connection
     */

    /**
     * Constructs a new UserFunction.
     * @exports UserFunction
     * @classdesc Represents a UserFunction.
     * @implements IUserFunction
     * @constructor
     * @param {IUserFunction=} [properties] Properties to set
     */
    function UserFunction(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * UserFunction name.
     * @member {string} name
     * @memberof UserFunction
     * @instance
     */
    UserFunction.prototype.name = "";

    /**
     * UserFunction keyspace.
     * @member {string} keyspace
     * @memberof UserFunction
     * @instance
     */
    UserFunction.prototype.keyspace = "";

    /**
     * UserFunction orReplace.
     * @member {boolean} orReplace
     * @memberof UserFunction
     * @instance
     */
    UserFunction.prototype.orReplace = false;

    /**
     * UserFunction ifNotExist.
     * @member {boolean} ifNotExist
     * @memberof UserFunction
     * @instance
     */
    UserFunction.prototype.ifNotExist = false;

    /**
     * UserFunction returnType.
     * @member {string} returnType
     * @memberof UserFunction
     * @instance
     */
    UserFunction.prototype.returnType = "";

    /**
     * UserFunction calledOnNullInput.
     * @member {boolean} calledOnNullInput
     * @memberof UserFunction
     * @instance
     */
    UserFunction.prototype.calledOnNullInput = false;

    /**
     * UserFunction language.
     * @member {string} language
     * @memberof UserFunction
     * @instance
     */
    UserFunction.prototype.language = "";

    /**
     * UserFunction signature.
     * @member {string} signature
     * @memberof UserFunction
     * @instance
     */
    UserFunction.prototype.signature = "";

    /**
     * UserFunction body.
     * @member {string} body
     * @memberof UserFunction
     * @instance
     */
    UserFunction.prototype.body = "";

    /**
     * UserFunction connection.
     * @member {string} connection
     * @memberof UserFunction
     * @instance
     */
    UserFunction.prototype.connection = "";

    /**
     * Creates a new UserFunction instance using the specified properties.
     * @function create
     * @memberof UserFunction
     * @static
     * @param {IUserFunction=} [properties] Properties to set
     * @returns {UserFunction} UserFunction instance
     */
    UserFunction.create = function create(properties) {
        return new UserFunction(properties);
    };

    /**
     * Encodes the specified UserFunction message. Does not implicitly {@link UserFunction.verify|verify} messages.
     * @function encode
     * @memberof UserFunction
     * @static
     * @param {IUserFunction} message UserFunction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserFunction.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.keyspace != null && Object.hasOwnProperty.call(message, "keyspace"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.keyspace);
        if (message.orReplace != null && Object.hasOwnProperty.call(message, "orReplace"))
            writer.uint32(/* id 3, wireType 0 =*/24).bool(message.orReplace);
        if (message.ifNotExist != null && Object.hasOwnProperty.call(message, "ifNotExist"))
            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.ifNotExist);
        if (message.returnType != null && Object.hasOwnProperty.call(message, "returnType"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.returnType);
        if (message.calledOnNullInput != null && Object.hasOwnProperty.call(message, "calledOnNullInput"))
            writer.uint32(/* id 6, wireType 0 =*/48).bool(message.calledOnNullInput);
        if (message.language != null && Object.hasOwnProperty.call(message, "language"))
            writer.uint32(/* id 7, wireType 2 =*/58).string(message.language);
        if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
            writer.uint32(/* id 8, wireType 2 =*/66).string(message.signature);
        if (message.body != null && Object.hasOwnProperty.call(message, "body"))
            writer.uint32(/* id 9, wireType 2 =*/74).string(message.body);
        if (message.connection != null && Object.hasOwnProperty.call(message, "connection"))
            writer.uint32(/* id 11, wireType 2 =*/90).string(message.connection);
        return writer;
    };

    /**
     * Encodes the specified UserFunction message, length delimited. Does not implicitly {@link UserFunction.verify|verify} messages.
     * @function encodeDelimited
     * @memberof UserFunction
     * @static
     * @param {IUserFunction} message UserFunction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserFunction.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a UserFunction message from the specified reader or buffer.
     * @function decode
     * @memberof UserFunction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {UserFunction} UserFunction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserFunction.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UserFunction();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.keyspace = reader.string();
                break;
            case 3:
                message.orReplace = reader.bool();
                break;
            case 4:
                message.ifNotExist = reader.bool();
                break;
            case 5:
                message.returnType = reader.string();
                break;
            case 6:
                message.calledOnNullInput = reader.bool();
                break;
            case 7:
                message.language = reader.string();
                break;
            case 8:
                message.signature = reader.string();
                break;
            case 9:
                message.body = reader.string();
                break;
            case 11:
                message.connection = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a UserFunction message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof UserFunction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {UserFunction} UserFunction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserFunction.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a UserFunction message.
     * @function verify
     * @memberof UserFunction
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    UserFunction.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.keyspace != null && message.hasOwnProperty("keyspace"))
            if (!$util.isString(message.keyspace))
                return "keyspace: string expected";
        if (message.orReplace != null && message.hasOwnProperty("orReplace"))
            if (typeof message.orReplace !== "boolean")
                return "orReplace: boolean expected";
        if (message.ifNotExist != null && message.hasOwnProperty("ifNotExist"))
            if (typeof message.ifNotExist !== "boolean")
                return "ifNotExist: boolean expected";
        if (message.returnType != null && message.hasOwnProperty("returnType"))
            if (!$util.isString(message.returnType))
                return "returnType: string expected";
        if (message.calledOnNullInput != null && message.hasOwnProperty("calledOnNullInput"))
            if (typeof message.calledOnNullInput !== "boolean")
                return "calledOnNullInput: boolean expected";
        if (message.language != null && message.hasOwnProperty("language"))
            if (!$util.isString(message.language))
                return "language: string expected";
        if (message.signature != null && message.hasOwnProperty("signature"))
            if (!$util.isString(message.signature))
                return "signature: string expected";
        if (message.body != null && message.hasOwnProperty("body"))
            if (!$util.isString(message.body))
                return "body: string expected";
        if (message.connection != null && message.hasOwnProperty("connection"))
            if (!$util.isString(message.connection))
                return "connection: string expected";
        return null;
    };

    /**
     * Creates a UserFunction message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof UserFunction
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {UserFunction} UserFunction
     */
    UserFunction.fromObject = function fromObject(object) {
        if (object instanceof $root.UserFunction)
            return object;
        var message = new $root.UserFunction();
        if (object.name != null)
            message.name = String(object.name);
        if (object.keyspace != null)
            message.keyspace = String(object.keyspace);
        if (object.orReplace != null)
            message.orReplace = Boolean(object.orReplace);
        if (object.ifNotExist != null)
            message.ifNotExist = Boolean(object.ifNotExist);
        if (object.returnType != null)
            message.returnType = String(object.returnType);
        if (object.calledOnNullInput != null)
            message.calledOnNullInput = Boolean(object.calledOnNullInput);
        if (object.language != null)
            message.language = String(object.language);
        if (object.signature != null)
            message.signature = String(object.signature);
        if (object.body != null)
            message.body = String(object.body);
        if (object.connection != null)
            message.connection = String(object.connection);
        return message;
    };

    /**
     * Creates a plain object from a UserFunction message. Also converts values to other types if specified.
     * @function toObject
     * @memberof UserFunction
     * @static
     * @param {UserFunction} message UserFunction
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    UserFunction.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.name = "";
            object.keyspace = "";
            object.orReplace = false;
            object.ifNotExist = false;
            object.returnType = "";
            object.calledOnNullInput = false;
            object.language = "";
            object.signature = "";
            object.body = "";
            object.connection = "";
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.keyspace != null && message.hasOwnProperty("keyspace"))
            object.keyspace = message.keyspace;
        if (message.orReplace != null && message.hasOwnProperty("orReplace"))
            object.orReplace = message.orReplace;
        if (message.ifNotExist != null && message.hasOwnProperty("ifNotExist"))
            object.ifNotExist = message.ifNotExist;
        if (message.returnType != null && message.hasOwnProperty("returnType"))
            object.returnType = message.returnType;
        if (message.calledOnNullInput != null && message.hasOwnProperty("calledOnNullInput"))
            object.calledOnNullInput = message.calledOnNullInput;
        if (message.language != null && message.hasOwnProperty("language"))
            object.language = message.language;
        if (message.signature != null && message.hasOwnProperty("signature"))
            object.signature = message.signature;
        if (message.body != null && message.hasOwnProperty("body"))
            object.body = message.body;
        if (message.connection != null && message.hasOwnProperty("connection"))
            object.connection = message.connection;
        return object;
    };

    /**
     * Converts this UserFunction to JSON.
     * @function toJSON
     * @memberof UserFunction
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    UserFunction.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return UserFunction;
})();

$root.AggregateFunction = (function() {

    /**
     * Properties of an AggregateFunction.
     * @exports IAggregateFunction
     * @interface IAggregateFunction
     * @property {string|null} [name] AggregateFunction name
     * @property {string|null} [keyspace] AggregateFunction keyspace
     * @property {boolean|null} [orReplace] AggregateFunction orReplace
     * @property {boolean|null} [ifNotExist] AggregateFunction ifNotExist
     * @property {string|null} [signature] AggregateFunction signature
     * @property {string|null} [sFunc] AggregateFunction sFunc
     * @property {string|null} [sType] AggregateFunction sType
     * @property {string|null} [finalFunc] AggregateFunction finalFunc
     * @property {string|null} [initCond] AggregateFunction initCond
     * @property {string|null} [connection] AggregateFunction connection
     */

    /**
     * Constructs a new AggregateFunction.
     * @exports AggregateFunction
     * @classdesc Represents an AggregateFunction.
     * @implements IAggregateFunction
     * @constructor
     * @param {IAggregateFunction=} [properties] Properties to set
     */
    function AggregateFunction(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AggregateFunction name.
     * @member {string} name
     * @memberof AggregateFunction
     * @instance
     */
    AggregateFunction.prototype.name = "";

    /**
     * AggregateFunction keyspace.
     * @member {string} keyspace
     * @memberof AggregateFunction
     * @instance
     */
    AggregateFunction.prototype.keyspace = "";

    /**
     * AggregateFunction orReplace.
     * @member {boolean} orReplace
     * @memberof AggregateFunction
     * @instance
     */
    AggregateFunction.prototype.orReplace = false;

    /**
     * AggregateFunction ifNotExist.
     * @member {boolean} ifNotExist
     * @memberof AggregateFunction
     * @instance
     */
    AggregateFunction.prototype.ifNotExist = false;

    /**
     * AggregateFunction signature.
     * @member {string} signature
     * @memberof AggregateFunction
     * @instance
     */
    AggregateFunction.prototype.signature = "";

    /**
     * AggregateFunction sFunc.
     * @member {string} sFunc
     * @memberof AggregateFunction
     * @instance
     */
    AggregateFunction.prototype.sFunc = "";

    /**
     * AggregateFunction sType.
     * @member {string} sType
     * @memberof AggregateFunction
     * @instance
     */
    AggregateFunction.prototype.sType = "";

    /**
     * AggregateFunction finalFunc.
     * @member {string} finalFunc
     * @memberof AggregateFunction
     * @instance
     */
    AggregateFunction.prototype.finalFunc = "";

    /**
     * AggregateFunction initCond.
     * @member {string} initCond
     * @memberof AggregateFunction
     * @instance
     */
    AggregateFunction.prototype.initCond = "";

    /**
     * AggregateFunction connection.
     * @member {string} connection
     * @memberof AggregateFunction
     * @instance
     */
    AggregateFunction.prototype.connection = "";

    /**
     * Creates a new AggregateFunction instance using the specified properties.
     * @function create
     * @memberof AggregateFunction
     * @static
     * @param {IAggregateFunction=} [properties] Properties to set
     * @returns {AggregateFunction} AggregateFunction instance
     */
    AggregateFunction.create = function create(properties) {
        return new AggregateFunction(properties);
    };

    /**
     * Encodes the specified AggregateFunction message. Does not implicitly {@link AggregateFunction.verify|verify} messages.
     * @function encode
     * @memberof AggregateFunction
     * @static
     * @param {IAggregateFunction} message AggregateFunction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AggregateFunction.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.keyspace != null && Object.hasOwnProperty.call(message, "keyspace"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.keyspace);
        if (message.orReplace != null && Object.hasOwnProperty.call(message, "orReplace"))
            writer.uint32(/* id 3, wireType 0 =*/24).bool(message.orReplace);
        if (message.ifNotExist != null && Object.hasOwnProperty.call(message, "ifNotExist"))
            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.ifNotExist);
        if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.signature);
        if (message.sFunc != null && Object.hasOwnProperty.call(message, "sFunc"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.sFunc);
        if (message.sType != null && Object.hasOwnProperty.call(message, "sType"))
            writer.uint32(/* id 7, wireType 2 =*/58).string(message.sType);
        if (message.finalFunc != null && Object.hasOwnProperty.call(message, "finalFunc"))
            writer.uint32(/* id 8, wireType 2 =*/66).string(message.finalFunc);
        if (message.initCond != null && Object.hasOwnProperty.call(message, "initCond"))
            writer.uint32(/* id 9, wireType 2 =*/74).string(message.initCond);
        if (message.connection != null && Object.hasOwnProperty.call(message, "connection"))
            writer.uint32(/* id 10, wireType 2 =*/82).string(message.connection);
        return writer;
    };

    /**
     * Encodes the specified AggregateFunction message, length delimited. Does not implicitly {@link AggregateFunction.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AggregateFunction
     * @static
     * @param {IAggregateFunction} message AggregateFunction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AggregateFunction.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AggregateFunction message from the specified reader or buffer.
     * @function decode
     * @memberof AggregateFunction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AggregateFunction} AggregateFunction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AggregateFunction.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AggregateFunction();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.keyspace = reader.string();
                break;
            case 3:
                message.orReplace = reader.bool();
                break;
            case 4:
                message.ifNotExist = reader.bool();
                break;
            case 5:
                message.signature = reader.string();
                break;
            case 6:
                message.sFunc = reader.string();
                break;
            case 7:
                message.sType = reader.string();
                break;
            case 8:
                message.finalFunc = reader.string();
                break;
            case 9:
                message.initCond = reader.string();
                break;
            case 10:
                message.connection = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an AggregateFunction message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AggregateFunction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AggregateFunction} AggregateFunction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AggregateFunction.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AggregateFunction message.
     * @function verify
     * @memberof AggregateFunction
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AggregateFunction.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.keyspace != null && message.hasOwnProperty("keyspace"))
            if (!$util.isString(message.keyspace))
                return "keyspace: string expected";
        if (message.orReplace != null && message.hasOwnProperty("orReplace"))
            if (typeof message.orReplace !== "boolean")
                return "orReplace: boolean expected";
        if (message.ifNotExist != null && message.hasOwnProperty("ifNotExist"))
            if (typeof message.ifNotExist !== "boolean")
                return "ifNotExist: boolean expected";
        if (message.signature != null && message.hasOwnProperty("signature"))
            if (!$util.isString(message.signature))
                return "signature: string expected";
        if (message.sFunc != null && message.hasOwnProperty("sFunc"))
            if (!$util.isString(message.sFunc))
                return "sFunc: string expected";
        if (message.sType != null && message.hasOwnProperty("sType"))
            if (!$util.isString(message.sType))
                return "sType: string expected";
        if (message.finalFunc != null && message.hasOwnProperty("finalFunc"))
            if (!$util.isString(message.finalFunc))
                return "finalFunc: string expected";
        if (message.initCond != null && message.hasOwnProperty("initCond"))
            if (!$util.isString(message.initCond))
                return "initCond: string expected";
        if (message.connection != null && message.hasOwnProperty("connection"))
            if (!$util.isString(message.connection))
                return "connection: string expected";
        return null;
    };

    /**
     * Creates an AggregateFunction message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AggregateFunction
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AggregateFunction} AggregateFunction
     */
    AggregateFunction.fromObject = function fromObject(object) {
        if (object instanceof $root.AggregateFunction)
            return object;
        var message = new $root.AggregateFunction();
        if (object.name != null)
            message.name = String(object.name);
        if (object.keyspace != null)
            message.keyspace = String(object.keyspace);
        if (object.orReplace != null)
            message.orReplace = Boolean(object.orReplace);
        if (object.ifNotExist != null)
            message.ifNotExist = Boolean(object.ifNotExist);
        if (object.signature != null)
            message.signature = String(object.signature);
        if (object.sFunc != null)
            message.sFunc = String(object.sFunc);
        if (object.sType != null)
            message.sType = String(object.sType);
        if (object.finalFunc != null)
            message.finalFunc = String(object.finalFunc);
        if (object.initCond != null)
            message.initCond = String(object.initCond);
        if (object.connection != null)
            message.connection = String(object.connection);
        return message;
    };

    /**
     * Creates a plain object from an AggregateFunction message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AggregateFunction
     * @static
     * @param {AggregateFunction} message AggregateFunction
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AggregateFunction.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.name = "";
            object.keyspace = "";
            object.orReplace = false;
            object.ifNotExist = false;
            object.signature = "";
            object.sFunc = "";
            object.sType = "";
            object.finalFunc = "";
            object.initCond = "";
            object.connection = "";
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.keyspace != null && message.hasOwnProperty("keyspace"))
            object.keyspace = message.keyspace;
        if (message.orReplace != null && message.hasOwnProperty("orReplace"))
            object.orReplace = message.orReplace;
        if (message.ifNotExist != null && message.hasOwnProperty("ifNotExist"))
            object.ifNotExist = message.ifNotExist;
        if (message.signature != null && message.hasOwnProperty("signature"))
            object.signature = message.signature;
        if (message.sFunc != null && message.hasOwnProperty("sFunc"))
            object.sFunc = message.sFunc;
        if (message.sType != null && message.hasOwnProperty("sType"))
            object.sType = message.sType;
        if (message.finalFunc != null && message.hasOwnProperty("finalFunc"))
            object.finalFunc = message.finalFunc;
        if (message.initCond != null && message.hasOwnProperty("initCond"))
            object.initCond = message.initCond;
        if (message.connection != null && message.hasOwnProperty("connection"))
            object.connection = message.connection;
        return object;
    };

    /**
     * Converts this AggregateFunction to JSON.
     * @function toJSON
     * @memberof AggregateFunction
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AggregateFunction.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AggregateFunction;
})();

$root.MateriliazedView = (function() {

    /**
     * Properties of a MateriliazedView.
     * @exports IMateriliazedView
     * @interface IMateriliazedView
     * @property {string|null} [name] MateriliazedView name
     * @property {string|null} [baseTable] MateriliazedView baseTable
     * @property {string|null} [select] MateriliazedView select
     * @property {boolean|null} [includesAllColumns] MateriliazedView includesAllColumns
     * @property {string|null} [whereClause] MateriliazedView whereClause
     * @property {Array.<string>|null} [primaryKeyNames] MateriliazedView primaryKeyNames
     * @property {Object.<string,string>|null} [options] MateriliazedView options
     * @property {string|null} [connection] MateriliazedView connection
     * @property {string|null} [nameKeySpace] MateriliazedView nameKeySpace
     * @property {string|null} [describe] MateriliazedView describe
     */

    /**
     * Constructs a new MateriliazedView.
     * @exports MateriliazedView
     * @classdesc Represents a MateriliazedView.
     * @implements IMateriliazedView
     * @constructor
     * @param {IMateriliazedView=} [properties] Properties to set
     */
    function MateriliazedView(properties) {
        this.primaryKeyNames = [];
        this.options = {};
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MateriliazedView name.
     * @member {string} name
     * @memberof MateriliazedView
     * @instance
     */
    MateriliazedView.prototype.name = "";

    /**
     * MateriliazedView baseTable.
     * @member {string} baseTable
     * @memberof MateriliazedView
     * @instance
     */
    MateriliazedView.prototype.baseTable = "";

    /**
     * MateriliazedView select.
     * @member {string} select
     * @memberof MateriliazedView
     * @instance
     */
    MateriliazedView.prototype.select = "";

    /**
     * MateriliazedView includesAllColumns.
     * @member {boolean} includesAllColumns
     * @memberof MateriliazedView
     * @instance
     */
    MateriliazedView.prototype.includesAllColumns = false;

    /**
     * MateriliazedView whereClause.
     * @member {string} whereClause
     * @memberof MateriliazedView
     * @instance
     */
    MateriliazedView.prototype.whereClause = "";

    /**
     * MateriliazedView primaryKeyNames.
     * @member {Array.<string>} primaryKeyNames
     * @memberof MateriliazedView
     * @instance
     */
    MateriliazedView.prototype.primaryKeyNames = $util.emptyArray;

    /**
     * MateriliazedView options.
     * @member {Object.<string,string>} options
     * @memberof MateriliazedView
     * @instance
     */
    MateriliazedView.prototype.options = $util.emptyObject;

    /**
     * MateriliazedView connection.
     * @member {string} connection
     * @memberof MateriliazedView
     * @instance
     */
    MateriliazedView.prototype.connection = "";

    /**
     * MateriliazedView nameKeySpace.
     * @member {string} nameKeySpace
     * @memberof MateriliazedView
     * @instance
     */
    MateriliazedView.prototype.nameKeySpace = "";

    /**
     * MateriliazedView describe.
     * @member {string} describe
     * @memberof MateriliazedView
     * @instance
     */
    MateriliazedView.prototype.describe = "";

    /**
     * Creates a new MateriliazedView instance using the specified properties.
     * @function create
     * @memberof MateriliazedView
     * @static
     * @param {IMateriliazedView=} [properties] Properties to set
     * @returns {MateriliazedView} MateriliazedView instance
     */
    MateriliazedView.create = function create(properties) {
        return new MateriliazedView(properties);
    };

    /**
     * Encodes the specified MateriliazedView message. Does not implicitly {@link MateriliazedView.verify|verify} messages.
     * @function encode
     * @memberof MateriliazedView
     * @static
     * @param {IMateriliazedView} message MateriliazedView message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MateriliazedView.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.baseTable != null && Object.hasOwnProperty.call(message, "baseTable"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.baseTable);
        if (message.select != null && Object.hasOwnProperty.call(message, "select"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.select);
        if (message.includesAllColumns != null && Object.hasOwnProperty.call(message, "includesAllColumns"))
            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.includesAllColumns);
        if (message.whereClause != null && Object.hasOwnProperty.call(message, "whereClause"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.whereClause);
        if (message.primaryKeyNames != null && message.primaryKeyNames.length)
            for (var i = 0; i < message.primaryKeyNames.length; ++i)
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.primaryKeyNames[i]);
        if (message.options != null && Object.hasOwnProperty.call(message, "options"))
            for (var keys = Object.keys(message.options), i = 0; i < keys.length; ++i)
                writer.uint32(/* id 7, wireType 2 =*/58).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.options[keys[i]]).ldelim();
        if (message.connection != null && Object.hasOwnProperty.call(message, "connection"))
            writer.uint32(/* id 8, wireType 2 =*/66).string(message.connection);
        if (message.nameKeySpace != null && Object.hasOwnProperty.call(message, "nameKeySpace"))
            writer.uint32(/* id 9, wireType 2 =*/74).string(message.nameKeySpace);
        if (message.describe != null && Object.hasOwnProperty.call(message, "describe"))
            writer.uint32(/* id 10, wireType 2 =*/82).string(message.describe);
        return writer;
    };

    /**
     * Encodes the specified MateriliazedView message, length delimited. Does not implicitly {@link MateriliazedView.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MateriliazedView
     * @static
     * @param {IMateriliazedView} message MateriliazedView message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MateriliazedView.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MateriliazedView message from the specified reader or buffer.
     * @function decode
     * @memberof MateriliazedView
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MateriliazedView} MateriliazedView
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MateriliazedView.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MateriliazedView(), key;
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.baseTable = reader.string();
                break;
            case 3:
                message.select = reader.string();
                break;
            case 4:
                message.includesAllColumns = reader.bool();
                break;
            case 5:
                message.whereClause = reader.string();
                break;
            case 6:
                if (!(message.primaryKeyNames && message.primaryKeyNames.length))
                    message.primaryKeyNames = [];
                message.primaryKeyNames.push(reader.string());
                break;
            case 7:
                reader.skip().pos++;
                if (message.options === $util.emptyObject)
                    message.options = {};
                key = reader.string();
                reader.pos++;
                message.options[key] = reader.string();
                break;
            case 8:
                message.connection = reader.string();
                break;
            case 9:
                message.nameKeySpace = reader.string();
                break;
            case 10:
                message.describe = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a MateriliazedView message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MateriliazedView
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MateriliazedView} MateriliazedView
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MateriliazedView.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MateriliazedView message.
     * @function verify
     * @memberof MateriliazedView
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MateriliazedView.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.baseTable != null && message.hasOwnProperty("baseTable"))
            if (!$util.isString(message.baseTable))
                return "baseTable: string expected";
        if (message.select != null && message.hasOwnProperty("select"))
            if (!$util.isString(message.select))
                return "select: string expected";
        if (message.includesAllColumns != null && message.hasOwnProperty("includesAllColumns"))
            if (typeof message.includesAllColumns !== "boolean")
                return "includesAllColumns: boolean expected";
        if (message.whereClause != null && message.hasOwnProperty("whereClause"))
            if (!$util.isString(message.whereClause))
                return "whereClause: string expected";
        if (message.primaryKeyNames != null && message.hasOwnProperty("primaryKeyNames")) {
            if (!Array.isArray(message.primaryKeyNames))
                return "primaryKeyNames: array expected";
            for (var i = 0; i < message.primaryKeyNames.length; ++i)
                if (!$util.isString(message.primaryKeyNames[i]))
                    return "primaryKeyNames: string[] expected";
        }
        if (message.options != null && message.hasOwnProperty("options")) {
            if (!$util.isObject(message.options))
                return "options: object expected";
            var key = Object.keys(message.options);
            for (var i = 0; i < key.length; ++i)
                if (!$util.isString(message.options[key[i]]))
                    return "options: string{k:string} expected";
        }
        if (message.connection != null && message.hasOwnProperty("connection"))
            if (!$util.isString(message.connection))
                return "connection: string expected";
        if (message.nameKeySpace != null && message.hasOwnProperty("nameKeySpace"))
            if (!$util.isString(message.nameKeySpace))
                return "nameKeySpace: string expected";
        if (message.describe != null && message.hasOwnProperty("describe"))
            if (!$util.isString(message.describe))
                return "describe: string expected";
        return null;
    };

    /**
     * Creates a MateriliazedView message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MateriliazedView
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MateriliazedView} MateriliazedView
     */
    MateriliazedView.fromObject = function fromObject(object) {
        if (object instanceof $root.MateriliazedView)
            return object;
        var message = new $root.MateriliazedView();
        if (object.name != null)
            message.name = String(object.name);
        if (object.baseTable != null)
            message.baseTable = String(object.baseTable);
        if (object.select != null)
            message.select = String(object.select);
        if (object.includesAllColumns != null)
            message.includesAllColumns = Boolean(object.includesAllColumns);
        if (object.whereClause != null)
            message.whereClause = String(object.whereClause);
        if (object.primaryKeyNames) {
            if (!Array.isArray(object.primaryKeyNames))
                throw TypeError(".MateriliazedView.primaryKeyNames: array expected");
            message.primaryKeyNames = [];
            for (var i = 0; i < object.primaryKeyNames.length; ++i)
                message.primaryKeyNames[i] = String(object.primaryKeyNames[i]);
        }
        if (object.options) {
            if (typeof object.options !== "object")
                throw TypeError(".MateriliazedView.options: object expected");
            message.options = {};
            for (var keys = Object.keys(object.options), i = 0; i < keys.length; ++i)
                message.options[keys[i]] = String(object.options[keys[i]]);
        }
        if (object.connection != null)
            message.connection = String(object.connection);
        if (object.nameKeySpace != null)
            message.nameKeySpace = String(object.nameKeySpace);
        if (object.describe != null)
            message.describe = String(object.describe);
        return message;
    };

    /**
     * Creates a plain object from a MateriliazedView message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MateriliazedView
     * @static
     * @param {MateriliazedView} message MateriliazedView
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MateriliazedView.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.primaryKeyNames = [];
        if (options.objects || options.defaults)
            object.options = {};
        if (options.defaults) {
            object.name = "";
            object.baseTable = "";
            object.select = "";
            object.includesAllColumns = false;
            object.whereClause = "";
            object.connection = "";
            object.nameKeySpace = "";
            object.describe = "";
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.baseTable != null && message.hasOwnProperty("baseTable"))
            object.baseTable = message.baseTable;
        if (message.select != null && message.hasOwnProperty("select"))
            object.select = message.select;
        if (message.includesAllColumns != null && message.hasOwnProperty("includesAllColumns"))
            object.includesAllColumns = message.includesAllColumns;
        if (message.whereClause != null && message.hasOwnProperty("whereClause"))
            object.whereClause = message.whereClause;
        if (message.primaryKeyNames && message.primaryKeyNames.length) {
            object.primaryKeyNames = [];
            for (var j = 0; j < message.primaryKeyNames.length; ++j)
                object.primaryKeyNames[j] = message.primaryKeyNames[j];
        }
        var keys2;
        if (message.options && (keys2 = Object.keys(message.options)).length) {
            object.options = {};
            for (var j = 0; j < keys2.length; ++j)
                object.options[keys2[j]] = message.options[keys2[j]];
        }
        if (message.connection != null && message.hasOwnProperty("connection"))
            object.connection = message.connection;
        if (message.nameKeySpace != null && message.hasOwnProperty("nameKeySpace"))
            object.nameKeySpace = message.nameKeySpace;
        if (message.describe != null && message.hasOwnProperty("describe"))
            object.describe = message.describe;
        return object;
    };

    /**
     * Converts this MateriliazedView to JSON.
     * @function toJSON
     * @memberof MateriliazedView
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MateriliazedView.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return MateriliazedView;
})();

$root.Roles = (function() {

    /**
     * Properties of a Roles.
     * @exports IRoles
     * @interface IRoles
     * @property {Array.<IRole>|null} [role] Roles role
     */

    /**
     * Constructs a new Roles.
     * @exports Roles
     * @classdesc Represents a Roles.
     * @implements IRoles
     * @constructor
     * @param {IRoles=} [properties] Properties to set
     */
    function Roles(properties) {
        this.roles = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Roles role.
     * @member {Array.<IRole>} role
     * @memberof Roles
     * @instance
     */
    Roles.prototype.roles = $util.emptyArray;

    /**
     * Creates a new Roles instance using the specified properties.
     * @function create
     * @memberof Roles
     * @static
     * @param {IRoles=} [properties] Properties to set
     * @returns {Roles} Roles instance
     */
    Roles.create = function create(properties) {
        return new Roles(properties);
    };

    /**
     * Encodes the specified Roles message. Does not implicitly {@link Roles.verify|verify} messages.
     * @function encode
     * @memberof Roles
     * @static
     * @param {IRoles} message Roles message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Roles.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.roles != null && message.roles.length)
            for (var i = 0; i < message.roles.length; ++i)
                $root.Role.encode(message.roles[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Roles message, length delimited. Does not implicitly {@link Roles.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Roles
     * @static
     * @param {IRoles} message Roles message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Roles.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Roles message from the specified reader or buffer.
     * @function decode
     * @memberof Roles
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Roles} Roles
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Roles.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Roles();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.roles && message.roles.length))
                    message.roles = [];
                message.roles.push($root.Role.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Roles message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Roles
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Roles} Roles
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Roles.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Roles message.
     * @function verify
     * @memberof Roles
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Roles.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.roles != null && message.hasOwnProperty("roles")) {
            if (!Array.isArray(message.roles))
                return "role: array expected";
            for (var i = 0; i < message.roles.length; ++i) {
                var error = $root.Role.verify(message.roles[i]);
                if (error)
                    return "role." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Roles message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Roles
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Roles} Roles
     */
    Roles.fromObject = function fromObject(object) {
        if (object instanceof $root.Roles)
            return object;
        var message = new $root.Roles();
        if (object.roles) {
            if (!Array.isArray(object.roles))
                throw TypeError(".Roles.role: array expected");
            message.roles = [];
            for (var i = 0; i < object.roles.length; ++i) {
                if (typeof object.roles[i] !== "object")
                    throw TypeError(".Roles.role: object expected");
                message.roles[i] = $root.Role.fromObject(object.roles[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a Roles message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Roles
     * @static
     * @param {Roles} message Roles
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Roles.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.roles = [];
        if (message.roles && message.roles.length) {
            object.roles = [];
            for (var j = 0; j < message.roles.length; ++j)
                object.roles[j] = $root.Role.toObject(message.roles[j], options);
        }
        return object;
    };

    /**
     * Converts this Roles to JSON.
     * @function toJSON
     * @memberof Roles
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Roles.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Roles;
})();

$root.Role = (function() {

    /**
     * Properties of a Role.
     * @exports IRole
     * @interface IRole
     * @property {string|null} [name] Role name
     * @property {string|null} [memberOf] Role memberOf
     * @property {string|null} [saltedHash] Role saltedHash
     * @property {Object.<string,string>|null} [options] Role options
     * @property {string|null} [connection] Role connection
     */

    /**
     * Constructs a new Role.
     * @exports Role
     * @classdesc Represents a Role.
     * @implements IRole
     * @constructor
     * @param {IRole=} [properties] Properties to set
     */
    function Role(properties) {
        this.options = {};
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Role name.
     * @member {string} name
     * @memberof Role
     * @instance
     */
    Role.prototype.name = "";

    /**
     * Role memberOf.
     * @member {string} memberOf
     * @memberof Role
     * @instance
     */
    Role.prototype.memberOf = "";

    /**
     * Role saltedHash.
     * @member {string} saltedHash
     * @memberof Role
     * @instance
     */
    Role.prototype.saltedHash = "";

    /**
     * Role options.
     * @member {Object.<string,string>} options
     * @memberof Role
     * @instance
     */
    Role.prototype.options = $util.emptyObject;

    /**
     * Role connection.
     * @member {string} connection
     * @memberof Role
     * @instance
     */
    Role.prototype.connection = "";

    /**
     * Creates a new Role instance using the specified properties.
     * @function create
     * @memberof Role
     * @static
     * @param {IRole=} [properties] Properties to set
     * @returns {Role} Role instance
     */
    Role.create = function create(properties) {
        return new Role(properties);
    };

    /**
     * Encodes the specified Role message. Does not implicitly {@link Role.verify|verify} messages.
     * @function encode
     * @memberof Role
     * @static
     * @param {IRole} message Role message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Role.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.memberOf != null && Object.hasOwnProperty.call(message, "memberOf"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.memberOf);
        if (message.saltedHash != null && Object.hasOwnProperty.call(message, "saltedHash"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.saltedHash);
        if (message.options != null && Object.hasOwnProperty.call(message, "options"))
            for (var keys = Object.keys(message.options), i = 0; i < keys.length; ++i)
                writer.uint32(/* id 4, wireType 2 =*/34).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.options[keys[i]]).ldelim();
        if (message.connection != null && Object.hasOwnProperty.call(message, "connection"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.connection);
        return writer;
    };

    /**
     * Encodes the specified Role message, length delimited. Does not implicitly {@link Role.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Role
     * @static
     * @param {IRole} message Role message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Role.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Role message from the specified reader or buffer.
     * @function decode
     * @memberof Role
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Role} Role
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Role.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Role(), key;
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.memberOf = reader.string();
                break;
            case 3:
                message.saltedHash = reader.string();
                break;
            case 4:
                reader.skip().pos++;
                if (message.options === $util.emptyObject)
                    message.options = {};
                key = reader.string();
                reader.pos++;
                message.options[key] = reader.string();
                break;
            case 5:
                message.connection = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Role message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Role
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Role} Role
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Role.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Role message.
     * @function verify
     * @memberof Role
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Role.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.memberOf != null && message.hasOwnProperty("memberOf"))
            if (!$util.isString(message.memberOf))
                return "memberOf: string expected";
        if (message.saltedHash != null && message.hasOwnProperty("saltedHash"))
            if (!$util.isString(message.saltedHash))
                return "saltedHash: string expected";
        if (message.options != null && message.hasOwnProperty("options")) {
            if (!$util.isObject(message.options))
                return "options: object expected";
            var key = Object.keys(message.options);
            for (var i = 0; i < key.length; ++i)
                if (!$util.isString(message.options[key[i]]))
                    return "options: string{k:string} expected";
        }
        if (message.connection != null && message.hasOwnProperty("connection"))
            if (!$util.isString(message.connection))
                return "connection: string expected";
        return null;
    };

    /**
     * Creates a Role message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Role
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Role} Role
     */
    Role.fromObject = function fromObject(object) {
        if (object instanceof $root.Role)
            return object;
        var message = new $root.Role();
        if (object.name != null)
            message.name = String(object.name);
        if (object.memberOf != null)
            message.memberOf = String(object.memberOf);
        if (object.saltedHash != null)
            message.saltedHash = String(object.saltedHash);
        if (object.options) {
            if (typeof object.options !== "object")
                throw TypeError(".Role.options: object expected");
            message.options = {};
            for (var keys = Object.keys(object.options), i = 0; i < keys.length; ++i)
                message.options[keys[i]] = String(object.options[keys[i]]);
        }
        if (object.connection != null)
            message.connection = String(object.connection);
        return message;
    };

    /**
     * Creates a plain object from a Role message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Role
     * @static
     * @param {Role} message Role
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Role.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.objects || options.defaults)
            object.options = {};
        if (options.defaults) {
            object.name = "";
            object.memberOf = "";
            object.saltedHash = "";
            object.connection = "";
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.memberOf != null && message.hasOwnProperty("memberOf"))
            object.memberOf = message.memberOf;
        if (message.saltedHash != null && message.hasOwnProperty("saltedHash"))
            object.saltedHash = message.saltedHash;
        var keys2;
        if (message.options && (keys2 = Object.keys(message.options)).length) {
            object.options = {};
            for (var j = 0; j < keys2.length; ++j)
                object.options[keys2[j]] = message.options[keys2[j]];
        }
        if (message.connection != null && message.hasOwnProperty("connection"))
            object.connection = message.connection;
        return object;
    };

    /**
     * Converts this Role to JSON.
     * @function toJSON
     * @memberof Role
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Role.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Role;
})();

$root.Rows = (function() {

    /**
     * Properties of a Rows.
     * @exports IRows
     * @interface IRows
     * @property {Array.<string>|null} [rows] Rows rows
     */

    /**
     * Constructs a new Rows.
     * @exports Rows
     * @classdesc Represents a Rows.
     * @implements IRows
     * @constructor
     * @param {IRows=} [properties] Properties to set
     */
    function Rows(properties) {
        this.rows = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Rows rows.
     * @member {Array.<string>} rows
     * @memberof Rows
     * @instance
     */
    Rows.prototype.rows = $util.emptyArray;

    /**
     * Creates a new Rows instance using the specified properties.
     * @function create
     * @memberof Rows
     * @static
     * @param {IRows=} [properties] Properties to set
     * @returns {Rows} Rows instance
     */
    Rows.create = function create(properties) {
        return new Rows(properties);
    };

    /**
     * Encodes the specified Rows message. Does not implicitly {@link Rows.verify|verify} messages.
     * @function encode
     * @memberof Rows
     * @static
     * @param {IRows} message Rows message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Rows.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.rows != null && message.rows.length)
            for (var i = 0; i < message.rows.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.rows[i]);
        return writer;
    };

    /**
     * Encodes the specified Rows message, length delimited. Does not implicitly {@link Rows.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Rows
     * @static
     * @param {IRows} message Rows message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Rows.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Rows message from the specified reader or buffer.
     * @function decode
     * @memberof Rows
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Rows} Rows
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Rows.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Rows();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.rows && message.rows.length))
                    message.rows = [];
                message.rows.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Rows message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Rows
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Rows} Rows
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Rows.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Rows message.
     * @function verify
     * @memberof Rows
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Rows.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.rows != null && message.hasOwnProperty("rows")) {
            if (!Array.isArray(message.rows))
                return "rows: array expected";
            for (var i = 0; i < message.rows.length; ++i)
                if (!$util.isString(message.rows[i]))
                    return "rows: string[] expected";
        }
        return null;
    };

    /**
     * Creates a Rows message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Rows
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Rows} Rows
     */
    Rows.fromObject = function fromObject(object) {
        if (object instanceof $root.Rows)
            return object;
        var message = new $root.Rows();
        if (object.rows) {
            if (!Array.isArray(object.rows))
                throw TypeError(".Rows.rows: array expected");
            message.rows = [];
            for (var i = 0; i < object.rows.length; ++i)
                message.rows[i] = String(object.rows[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a Rows message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Rows
     * @static
     * @param {Rows} message Rows
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Rows.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.rows = [];
        if (message.rows && message.rows.length) {
            object.rows = [];
            for (var j = 0; j < message.rows.length; ++j)
                object.rows[j] = message.rows[j];
        }
        return object;
    };

    /**
     * Converts this Rows to JSON.
     * @function toJSON
     * @memberof Rows
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Rows.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Rows;
})();

module.exports = $root;
