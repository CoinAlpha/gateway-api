/* eslint-disable */

export interface Input {
    indexed?: boolean
    name: string
    type_: string
};

export interface ERC20 {
    anonymous?: boolean
    constant?: boolean
    inputs?: Array<Input>
    outputs?: Array<Input>
    name?: string
    payable?: boolean
    stateMutability?: string
    type_: string
};

export const ERC20Abi: Array<ERC20> = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type_: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type_: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type_: 'address'
      },
      {
        name: '_value',
        type_: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type_: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type_: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type_: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type_: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type_: 'address'
      },
      {
        name: '_to',
        type_: 'address'
      },
      {
        name: '_value',
        type_: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [
      {
        name: '',
        type_: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type_: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type_: 'uint8'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type_: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type_: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type_: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type_: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type_: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type_: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type_: 'address'
      },
      {
        name: '_value',
        type_: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type_: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type_: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type_: 'address'
      },
      {
        name: '_spender',
        type_: 'address'
      }
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type_: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type_: 'function'
  },
  {
    payable: true,
    stateMutability: 'payable',
    type_: 'fallback'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type_: 'address'
      },
      {
        indexed: true,
        name: 'spender',
        type_: 'address'
      },
      {
        indexed: false,
        name: 'value',
        type_: 'uint256'
      }
    ],
    name: 'Approval',
    type_: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type_: 'address'
      },
      {
        indexed: true,
        name: 'to',
        type_: 'address'
      },
      {
        indexed: false,
        name: 'value',
        type_: 'uint256'
      }
    ],
    name: 'Transfer',
    type_: 'event'
  }
];

export const KovanWETHAbi: Array<ERC20> = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type_: 'string' }],
    payable: false,
    stateMutability: 'view',
    type_: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'guy', type_: 'address' },
      { name: 'wad', type_: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type_: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type_: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type_: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type_: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'src', type_: 'address' },
      { name: 'dst', type_: 'address' },
      { name: 'wad', type_: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type_: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type_: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'wad', type_: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type_: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type_: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type_: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '', type_: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type_: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type_: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type_: 'string' }],
    payable: false,
    stateMutability: 'view',
    type_: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'dst', type_: 'address' },
      { name: 'wad', type_: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type_: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type_: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'deposit',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type_: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '', type_: 'address' },
      { name: '', type_: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type_: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type_: 'function'
  },
  { payable: true, stateMutability: 'payable', type_: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type_: 'address' },
      { indexed: true, name: 'guy', type_: 'address' },
      { indexed: false, name: 'wad', type_: 'uint256' }
    ],
    name: 'Approval',
    type_: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type_: 'address' },
      { indexed: true, name: 'dst', type_: 'address' },
      { indexed: false, name: 'wad', type_: 'uint256' }
    ],
    name: 'Transfer',
    type_: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'dst', type_: 'address' },
      { indexed: false, name: 'wad', type_: 'uint256' }
    ],
    name: 'Deposit',
    type_: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type_: 'address' },
      { indexed: false, name: 'wad', type_: 'uint256' }
    ],
    name: 'Withdrawal',
    type_: 'event'
  }
];

export const KovanFaucetAddress = '0xb48Cc42C45d262534e46d5965a9Ac496F1B7a830';
