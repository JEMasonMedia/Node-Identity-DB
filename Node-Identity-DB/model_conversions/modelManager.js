// import supportedDBs from '../supportedDBs/supportedDBs.js'
// import NIDB from '../NIDB.js'
import connectionManager from '../db_connections/connectionManager.js'
import queryBuilder from '../query_builders/queryBuilder.js'

export default class modelManager {
  constructor(
    databaseType,
    modelName,
    connectionName,
    model,
    additionalConfig
  ) {
    this.databaseType = databaseType
    this.modelName = modelName
    this.connectionName = connectionName
    this.model = model
    this.additionalConfig = additionalConfig
  }

  // C R U D
  // create = (data, callBack) => {}
  // read = (data, callBack) => {}
  // update = (data, callBack) => {}
  // delete = (data, callBack) => {}

  // M A N A G E R
  // Ensures the model and the table in the database are in sync
  // Allows for runtime modifications of the table, especially significant for SQL databases
  //   - For a database manger interface for easy multi database manipulation
  //   - For runtime use such as adding and subtracting columns for both SQL and NoSQL databases
  // This can be a very dangerous function and should be used very carefully during runtime and potentially only be used for testing and development

  static createModifyTable = async (dbConn, modelName, callBack) => {
    if (dbConn && modelName && callBack) {
      try {
        const result = await connectionManager.createModifyTable(
          dbConn.databaseType,
          dbConn,
          modelName
        )
        if (result.err) {
          callBack(result)
        } else {
          callBack(null, dbConn.models[modelName])
        }
      } catch (err) {
        callBack(err)
      }
    } else {
      callBack({ err: 'Invalid arguments' })
    }
  }

  // Validate the model
  // Ensures basic model structure
  // Needs to be fleshed out
  static validateModel = (model, callBack) => {
    if (model && callBack) {
      const modelKeys = Object.keys(model)
      const modelKeysLength = modelKeys.length

      if (modelKeysLength > 0) {
        const modelKeysLength = modelKeys.length
        let modelKeysIndex = 0

        const validateModel = () => {
          const modelKey = modelKeys[modelKeysIndex]
          const modelKeyType = typeof model[modelKey]

          if (modelKeyType === 'object') {
            if (model[modelKey] !== null) {
              const innerKeys = Object.keys(model[modelKey])
              const innerKeysLength = innerKeys.length

              for (let i; i < innerKeysLength; i++) {
                const innerKey = innerKeys[i]
                const innerKeyType = typeof model[modelKey][innerKey]
                const innerKeyTypeValid = [
                  'string',
                  'number',
                  'boolean',
                  'array',
                  'object',
                ]

                if (!innerKeyTypeValid.contains(innerKeyType)) {
                  callBack(`Invalid type for ${innerKey}`, false)
                  return false
                }
              }

              modelKeysIndex++
              if (modelKeysIndex < modelKeysLength) {
                validateModel()
              } else {
                callBack(null, true)
              }
            } else {
              callBack(`${modelKey} is empty`)
            }
          } else {
            callBack(`${modelKey} is not a object`)
          }
        }

        validateModel()
      } else {
        callBack('Model is empty')
      }
    } else {
      callBack('Invalid arguments')
    }
  }

  static getDefaultValue = (type, modelKey) => {
    try {
      return modelKey.defaultValue
        ? modelKey.defaultValue
        : this.genericTypes[type]
    } catch (error) {
      throw new Error(`Unknown type: ${modelKey}`)
    }
  }

  genericTypes = {
    string: '',
    number: 0,
    boolean: false,
    array: [],
    object: {},
  }

  getModel = () => {
    return this.model
  }
}
