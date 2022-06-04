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
