const Models = {}

Models['users'] = {
  id: {
    key: 'primary',
    type: 'int',
    increments: true,
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

Models['items'] = {
  id: {
    key: 'primary',
    type: 'int',
    increments: true,
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

export default Models
