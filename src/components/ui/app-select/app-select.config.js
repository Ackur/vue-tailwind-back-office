export const sizeClasses = {
  sm: {
    default: {
      inputWrap: 'h-8',
      input: '',
      label:
        'text-sm -top-2.5 peer-placeholder-shown:text-sm peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-2.5 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-sm'
    },
    outline: {
      inputWrap: 'h-8',
      input: '',
      label:
        'text-sm -top-2.5 peer-placeholder-shown:text-sm peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-2.5 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-sm'
    },
    secondary: {
      inputWrap: 'h-8',
      input: '',
      label:
        'text-sm -top-2.5 peer-placeholder-shown:text-sm peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-2.5 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-sm'
    }
  },
  md: {
    default: {
      inputWrap: 'h-10',
      input: '',
      label:
        'text-sm -top-2.5 peer-placeholder-shown:text-sm peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-2.5 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-sm'
    },
    outline: {
      inputWrap: 'h-10',
      input: '',
      label:
        'text-xs -top-2.5 peer-placeholder-shown:text-sm peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-2.5 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-xs'
    },
    secondary: {
      inputWrap: 'h-10',
      input: '',
      label:
        'text-xs -top-3 peer-placeholder-shown:text-sm peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-3 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-xs'
    }
  },
  lg: {
    default: {
      inputWrap: 'h-12',
      input: 'text-lg !pb-0',
      label:
        'text-sm peer-placeholder-shown:text-base -top-3 peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-3 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-sm'
    },
    outline: {
      inputWrap: 'h-12',
      input: 'text-lg !pb-0',
      label:
        'text-sm peer-placeholder-shown:text-base -top-3 peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-3 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-sm'
    },
    secondary: {
      inputWrap: 'h-12',
      input: 'text-lg !pb-0',
      label:
        'text-sm peer-placeholder-shown:text-base -top-3 peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-3 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-sm'
    }
  }
}

export const themeClasses = (theme, error, isEmptyValue) => {
  const classes = {
    default: {
      select: 'bg-white',
      label: [
        isEmptyValue
          ? 'left-3 top-1/2 -translate-y-1/2 font-semibold text-gray-300'
          : 'left-2 -top-2 !font-medium !text-gray-500'
      ],
      dropdown: ['bg-white rounded-md border border-gray-100']
    },
    outline: {},
    secondary: {
      select: ['border', error ? '!bg-danger/5 border-danger/40' : 'bg-zinc-100 border-gray-300'],
      label: [
        isEmptyValue
          ? 'left-3 top-1/2 -translate-y-1/2 font-semibold text-dark/30'
          : [
              'left-2 -top-3',
              'bg-white',
              'rounded',
              'text-xs',
              'text-dark',
              'font-normal',
              'shadow-sm',
              'border',
              'px-1 pb-0.5'
            ],
        error ? 'border-danger/40 border-danger/40' : 'border-gray-300'
      ],
      dropdown: ['bg-zinc-100 rounded-md border border-gray-300']
    }
  }
  return classes[theme]
}
