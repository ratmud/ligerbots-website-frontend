import 'dotenv/config'

import { createDirectus, rest, graphql, authentication } from '@directus/sdk'

/**
 * Backend Client functions.<br/>
 * <br/>
 * Reads the Directus API URL, username, and password from environment variables.
 *
 * @module lib/backend
 *
 * @exports isDirectusClient
 * @exports getBackendClient
 *
 * @requires {@link https://www.npmjs.com/package/dotenv|dotenv}
 * @requires {@link https://www.npmjs.com/package/@directus/sdk|@directus/sdk}
 *
 */

/** @type {string} */
const API_URL = process.env.API_URL || 'http://localhost:8055'

/** @type {string} */
const API_USERNAME = process.env.API_USERNAME || 'admin'

/** @type {string} */
const API_PASSWORD = process.env.API_PASSWORD || 'password'

/** @type {string[]} */
const CLIENT_PROPS = [
  // DirectusClient properties
  'globals',
  'url',
  'with',
  'refresh',
  'login',
  'logout',
  'stopRefreshing',
  'getToken',
  'setToken',
  'request',
  'query'
]

/**
 * @typedef {*}  DirectusClient - See {@link https://www.npmjs.com/package/@directus/sdk}
 *
 * @property {function} globals - get global settings
 * @property {function} login
 * @property {function} request - supports REST requests
 * @property {function} query - supports GraphQL queries
 */

/** @type {DirectusClient} */
let client

/**
 * Get a logged-in instance of the Directus SDK.
 *
 * @property {string} [apiUsername=API_USERNAME] - The username to use to log into the server.
 * @property {string} [apiPassword=API_PASSWORD] - The password to use to log into the server.
 * @property {string} [apiUrl=API_URL] - The URL of the Directus API.
 *
 * @returns {Promise<DirectusClient>}
 *
 * @throws {Error} If there is an error logging in.
 *
 * @example
 *  const client = await getBackendClient() // Uses environment variables for service url and login credentials.
 *
 *  const folders = await this._client.request(
 *    readFolders({
 *      fields: 'name'
 *    })
 *  )
 *  console.log(folders)
 */
export async function getBackendClient (
  apiUsername = API_USERNAME,
  apiPassword = API_PASSWORD,
  apiUrl = API_URL
) {
  if (!client) {
    client = createDirectus(API_URL)
      .with(authentication('json'))
      .with(rest())
      .with(graphql())

    try {
      await client.login(API_USERNAME, API_PASSWORD)
    } catch (err) {
      throw new Error(`Failed to log into backend: ${JSON.stringify(err)}`)
    }

    return client
  }

  return client
}

/**
 * Check to see if an object is a DirectusClient using duck-typing.
 *
 * @param {DirectusClient} client
 *
 * @returns {boolean} True if the object is a DirectusClient, false otherwise.
 */
export function isDirectusClient (client) {
  return (
    typeof client === 'object' && CLIENT_PROPS.every(prop => prop in client)
  )
}