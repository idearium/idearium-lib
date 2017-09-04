'use strict';

/**
 * Assign some defaults to the passed Mongoose query options.
 * @example
 * // returns {
 *     filter: { _id: id },
 *     lean: true,
 *     limit: 10,
 *     projection: '',
 * }
 * getOptions({ filter: { _id: id });
 * @param {Object} options Mongoose query options.
 * @param {Object} options.filter Mongo query filters.
 * @param {Boolean} options.lean Whether to return a plain JavaScript object or not.
 * @param {Number} options.limit Number of documents to return.
 * @param {String} options.projection Space delimited string containing the fields to return or '*' to return all fields.
 * @return {Object} Returns the options object for Mongoose queries.
 */
const getOptions = (options) => {

    const defaults = {
        filter: {},
        lean: true,
        limit: 10,
        projection: '_id',
    };

    Object.assign(defaults, options);

    // * must be passed to return all fields.
    if (options.projection === '*') {
        delete defaults.projection;
    }

    return defaults;

};

/**
 * Find documents from a model.
 * @example
 * query.find(UserModel, {
 *     filter: { _id: id },
 *     projection: 'email username', // _id is always returned
 * });
 * @param {Object} model Mongoose model.
 * @param {Object} options Mongoose query options.
 * @param {Object} options.filter Mongo query filters.
 * @param {String} options.projection Space delimited string containing the fields to return or '*' to return all fields.
 * @return {Promise} Returns a Mongoose query.
 */
const find = (model, options) => {

    const { filter, projection } = getOptions(options);

    return model.find(filter, projection, getOptions(options));

};

/**
 * Find one document from a model.
 * @example
 * query.findOne(UserModel, {
 *     filter: { _id: id },
 *     projection: 'email username', // _id is always returned
 * });
 * @param {Object} model Mongoose model.
 * @param {Object} options Mongoose query options.
 * @param {Object} options.filter Mongo query filters.
 * @param {String} options.projection Space delimited string containing the fields to return or '*' to return all fields.
 * @return {Promise} Returns a Mongoose query.
 */
const findOne = (model, options) => {

    const { filter, projection } = getOptions(options);

    return model.findOne(filter, projection, getOptions(options));

};

module.exports = { find, findOne };
