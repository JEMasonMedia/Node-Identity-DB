const models = {}
const modelConnections = {}

models['users'] = {
  id: {
    key: 'primary',
    type: 'string',
    unique: true,
    nullable: false,
  },
  name: {
    type: 'string',
    nullable: false,
  },
  cart: {
    type: 'array',
    nullable: true,
  },
}

models['items'] = {
  id: {
    key: 'primary',
    type: 'string',
    unique: true,
    nullable: false,
  },
  name: {
    type: 'string',
    nullable: false,
  },
  description: {
    type: 'string',
    nullable: true,
  },
  quantity: {
    type: 'int',
    nullable: false,
  },
}

modelConnections['users'] = {
  connectionName: 'users',
  modelName: 'users',
  model: models['users'],
  additionalConfig: {},
  callBack: (err, model) => {
    if (!err && model) {
      console.log(
        `The collection: '${model.modelName}', for connection: '${model.connectionName}', was created successfully!`
          .cyan
      )
    } else {
      console.log(err)
    }
  },
}

modelConnections['items'] = {
  connectionName: 'items',
  modelName: 'items',
  model: models['items'],
  additionalConfig: {},
  callBack: (err, model) => {
    if (!err && model) {
      console.log(
        `The collection: '${model.modelName}', for connection: '${model.connectionName}', was created successfully!`
          .cyan
      )
    } else {
      console.log(err)
    }
  },
}

export default modelConnections
