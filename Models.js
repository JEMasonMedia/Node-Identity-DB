const models = {
  users: {
    _id: {
      key: 'primary',
      type: 'int',
      unique: true,
      nullable: false,
      autoIncrement: true,
    },
    name: {
      type: 'string',
      size: 255,
      nullable: false,
    },
    city: {
      type: 'string',
      size: 255,
      nullable: true,
    },
    cart: {
      type: 'array',
      nullable: true,
    },
  },
  items: {
    _id: {
      key: 'primary',
      type: 'int',
      unique: true,
      nullable: false,
      autoIncrement: true,
    },
    name: {
      type: 'string',
      size: 255,
      nullable: false,
    },
    description: {
      type: 'string',
      size: 255,
      nullable: true,
    },
    price: {
      type: 'double',
      nullable: false,
    },
    quantity: {
      type: 'int',
      nullable: false,
    },
  },
}

export default {
  users: {
    connectionName: 'users',
    modelName: 'users',
    model: models['users'],
    additionalConfig: {},
  },
  items: {
    connectionName: 'items',
    modelName: 'items',
    model: models['items'],
    additionalConfig: {},
  },
  callBack: (err, model) => {
    if (!err && model) {
      console.log(
        `The collection: '${model.modelName}', on connection: '${model.connectionName}', was created successfully!`
          .cyan
      )
    } else {
      console.log(err)
    }
  },
}
