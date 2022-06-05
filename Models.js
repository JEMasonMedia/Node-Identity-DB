const models = {
  users: {
    _id: {
      key: 'primary',
      type: 'int',
      unique: true,
      nullable: false,
      autoIncrement: true,
    },
    first_name: {
      type: 'string',
      size: 255,
      nullable: false,
    },
    email: {
      type: 'string',
      size: 255,
      nullable: false,
      defaultValue: 'example@example.com',
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
      type: 'long',
      unique: true,
      nullable: false,
      autoIncrement: true,
    },
    name: {
      type: 'string',
      size: 255,
      nullable: false,
    },
    brand: {
      type: 'string',
      size: 255,
      nullable: false,
      defaultValue: 'Company Example Inc.',
    },
    description: {
      type: 'string',
      size: 255,
      nullable: true,
    },
    // test_column: {
    //   type: 'string',
    //   size: 255,
    //   nullable: true,
    //   defaultValue: 'Test Value',
    // },
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
  // users_test: {
  //   connectionName: 'items',
  //   modelName: 'users_test',
  //   model: models['users'],
  //   additionalConfig: {},
  // },
  callBack: (err, model) => {
    if (!err && model) {
      console.log(`The collection: '${model.modelName}', on connection: '${model.connectionName}', was created successfully!`.cyan)
    } else {
      console.log(err)
    }
  },
}
