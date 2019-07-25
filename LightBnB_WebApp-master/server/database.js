const properties = require('./json/properties.json');
const users = require('./json/users.json');

const {Pool} = require('pg');

const pool = new Pool({
  user: 'tylercaceres',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query({
      text: `SELECT *
          FROM users
          WHERE email = $1
          LIMIT 1`,
      values: [`${email}`]
    })
    .then((res) => res.rows[0])
    .catch(() => null);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query({
      text: `SELECT *
          FROM users
          WHERE id = $1
          LIMIT 1`,
      values: [`${id}`]
    })
    .then((res) => res.rows[0])
    .catch(() => null);
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool
    .query({
      text: `INSERT INTO users(name, email, password)
            VALUES ($1, $2, $3) RETURNING *`,
      values: [`${user.name}`, `${user.email}`, `${user.password}`]
    })
    .then((res) => res.rows[0])
    .catch(() => null);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query({
      text: `
      SELECT
  p.*,
  r.*,
  temp_avg.average AS average_rating
FROM
  reservations r
  JOIN properties p ON p.id = r.property_id
  JOIN (
    SELECT
      p_r.property_id AS property_id,
      avg(p_r.rating) AS average
    FROM
      property_reviews p_r
    GROUP BY
      p_r.property_id) temp_avg ON temp_avg.property_id = p.id
WHERE
  r.guest_id = $1
  AND r.end_date < now()::date
ORDER BY
  start_date
LIMIT $2;
      `,
      values: [`${guest_id}`, `${limit}`]
    })
    .then((res) => res.rows);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT
    p.*,
    avg(p_r.rating) AS average_rating
  FROM
    properties p
    JOIN property_reviews p_r ON p.id = p_r.property_id `;

  //WHERE
  let count = 0;
  for (const whereOption in options) {
    if (
      (whereOption === 'city' ||
				whereOption === 'owner_id' ||
				whereOption === 'minimum_price_per_night' ||
				whereOption === 'maximum_price_per_night') &&
			options[whereOption].length > 0
    ) {
      count++;
    }
  }

  if (count > 0) {
    queryString += `WHERE `;
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `p.city LIKE $${queryParams.length} `;
      count--;
      if (count > 0) {
        queryString += `AND `;
      }
    }
    if (options.owner_id && count > 0) {
      queryParams.push(options.owner_id);
      queryString += `p.owner_id = $${queryParams.length} `;
      count--;
      if (count > 0) {
        queryString += `AND `;
      }
    }
    if (options.minimum_price_per_night && count > 0) {
      queryParams.push(options.minimum_price_per_night * 100);
      queryString += `p.cost_per_night >= $${queryParams.length} `;
      count--;
      if (count > 0) {
        queryString += `AND `;
      }
    }
    if (options.maximum_price_per_night && count > 0) {
      queryParams.push(options.maximum_price_per_night * 100);
      queryString += `p.cost_per_night <= $${queryParams.length} `;
    }
  }

  //GROUP and HAVING
  queryString += `GROUP BY p.id `;
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(p_r.rating) >= $${queryParams.length} `;
  }

  //LIMIT
  queryParams.push(limit);
  queryString += `
    ORDER BY p.cost_per_night
    LIMIT $${queryParams.length};`;
  return pool
    .query({
      text: queryString,
      values: queryParams
    })
    .then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryParams = [];
  let queryString = `
  INSERT INTO
      properties (owner_id,title,description,thumbnail_photo_url,cover_photo_url,cost_per_night,street,city,province,post_code,country,parking_spaces,number_of_bathrooms,number_of_bedrooms)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;
  let property_attributes = [
    'owner_id',
    'title',
    'description',
    'thumbnail_photo_url',
    'cover_photo_url',
    'cost_per_night',
    'street',
    'city',
    'provence', //incorrect name
    'post_code',
    'country',
    'parking_spaces',
    'number_of_bathrooms',
    'number_of_bedrooms'
  ];
  for (const prop of property_attributes) {
    if (
      prop === 'owner_id' ||
			prop === 'parking_spaces' ||
			prop === 'number_of_bathrooms' ||
			prop === 'number_of_bedrooms'
    ) {
      queryParams.push(property[prop]);
    } else {
      queryParams.push(`${property[prop]}`);
    }
  }

  return pool
    .query({
      text: queryString,
      values: queryParams
    })
    .then((res) => res.rows[0]);
};
exports.addProperty = addProperty;
