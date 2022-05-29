import helpers from '../helpers/helpers.js'

export default class modelManager {
  constructor(databaseType, modelName, connectionName, model, additionalConfig) {
    this.databaseType = databaseType
    this.modelName = modelName
    this.connectionName = connectionName
    this.additionalConfig = additionalConfig

    try {
      const v = this.validateModel(model)
      if (v === true) {
        this.model = model
      } else {
        throw new Error('Invalid model')
      }
    } catch (err) {
      return false
    }
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

  // createModifyTable = async (dbConn, modelName, callBack) => {
  // console.log(this)
  // if (dbConn && modelName && callBack) {
  //   try {
  //     const result = await connectionManager.createModifyTable(
  //       dbConn.databaseType,
  //       dbConn,
  //       modelName
  //     )
  //     if (result.err) {
  //       callBack(result)
  //     } else {
  //       callBack(null, dbConn.models[modelName])
  //     }
  //   } catch (err) {
  //     callBack(err)
  //   }
  // } else {
  //   callBack({ err: 'Invalid arguments' })
  // }
  // }

  // Validate the model
  // Ensures basic model structure
  // Needs to be fleshed out
  validateModel = model => {
    if (model) {
      const genericTypes = Object.keys(helpers.genericTypes)
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

              for (let i = 0; i < innerKeysLength; i++) {
                const innerKey = innerKeys[i]
                const innerKeyType = typeof model[modelKey][innerKey]

                if (!genericTypes.includes(innerKeyType)) {
                  throw new Error(`Invalid type for ${innerKey}`)
                }
              }

              modelKeysIndex++
              if (modelKeysIndex < modelKeysLength) {
                validateModel()
              } else {
                return true
              }
            } else {
              throw new Error(`${modelKey} is empty`)
            }
          } else {
            throw new Error(`${modelKey} is not a object`)
          }
        }

        validateModel()
      } else {
        throw new Error('Model is empty')
      }
    } else {
      throw new Error('Invalid arguments')
    }
    return true
  }

  getDefaultValue = (type, modelKey) => {
    try {
      return modelKey.defaultValue ? modelKey.defaultValue : helpers.genericTypes[type]
    } catch (error) {
      throw new Error(`Unknown type: ${modelKey}`)
    }
  }

  getModel = () => {
    return this.model
  }
}
