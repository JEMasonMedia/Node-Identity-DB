import supportedDBs from '../supportedDBs/supportedDBs.js'

const modelManager = class {
  model = {}

  constructor(model) {
    this.model = model
  }

  // C R U D
  read = (data, callBack) => {}
  create = (data, callBack) => {}
  update = (data, callBack) => {}
  delete = (data, callBack) => {}

  // Validate the model
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
                console.log(innerKeyType)
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

  getModel = () => {
    return this.model
  }
}

export default modelManager
