const Models = {}

Models['users'] = {
  id: {
    key: 'primary',
    type: 'int',
    increments: true,
    required: true,
  },
  name: {
    type: 'string',
    required: true,
  },
  cart: {
    type: 'array',
    required: false,
  },
}

Models['items'] = {
  id: {
    key: 'primary',
    type: 'int',
    increments: true,
    required: true,
  },
  name: {
    type: 'string',
    required: true,
  },
  description: {
    type: 'string',
    required: false,
  },
  quantity: {
    type: 'int',
    required: true,
  },
}

export default Models
