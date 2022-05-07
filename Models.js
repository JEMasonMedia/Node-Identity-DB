const models = {
  users: {
    _id: {
      key: 'primary',
      type: 'string',
      unique: true,
      nullable: false,
    },
    name: {
      type: 'string',
      nullable: false,
    },
    // city: {
    //   type: 'string',
    //   nullable: true,
    // },
    cart: {
      type: 'array',
      nullable: true,
    },
  },
  items: {
    _id: {
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
  },
}

const Models = {
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

export default Models
