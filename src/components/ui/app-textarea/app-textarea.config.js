export const sizeClasses = {
  sm: {
    default: {
      inputWrap: '',
      input: '',
      label:
        'text-sm -top-2.5 peer-placeholder-shown:text-sm peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-2.5 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-sm'
    },
    outline: {
      inputWrap: '',
      input: '',
      label:
        'text-sm -top-2.5 peer-placeholder-shown:text-sm peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-2.5 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-sm'
    },
    secondary: {
      inputWrap: '',
      input: '',
      label:
        'text-sm -top-2.5 peer-placeholder-shown:text-sm peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-2.5 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-sm'
    }
  },
  md: {
    default: {
      inputWrap: '',
      input: '',
      label:
        'text-sm -top-2.5 peer-placeholder-shown:text-sm peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-2.5 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-sm'
    },
    outline: {
      inputWrap: '',
      input: '',
      label:
        'text-xs -top-2.5 peer-placeholder-shown:text-sm peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-2.5 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-xs'
    },
    secondary: {
      inputWrap: '',
      input: '',
      label: [
        'text-xs -top-3',
        'peer-placeholder-shown:text-sm',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-3',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:text-xs'
      ]
    }
  },
  lg: {
    default: {
      inputWrap: '',
      input: 'text-lg !pb-0',
      label:
        'text-sm peer-placeholder-shown:text-base -top-3 peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-3 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-sm'
    },
    outline: {
      inputWrap: '',
      input: 'text-lg !pb-0',
      label:
        'text-sm peer-placeholder-shown:text-base -top-3 peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-3 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-sm'
    },
    secondary: {
      inputWrap: '',
      input: 'text-lg !pb-0',
      label:
        'text-sm peer-placeholder-shown:text-base -top-3 peer-[:not(:read-only):placeholder-shown]:peer-focus:-top-3 peer-[:not(:read-only):placeholder-shown]:peer-focus:text-sm'
    }
  }
}

export const themeClasses = (theme, error) => {
  const classes = {
    default: {
      inputWrap: '',
      input: '',
      label: [
        'font-medium',
        'text-gray-500',
        'peer-placeholder-shown:text-gray-300',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:text-gray-500 peer-[:not(:read-only):placeholder-shown]:peer-focus:font-medium'
      ]
    },
    outline: {
      inputWrap: ['border-2', error ? 'border-danger' : 'border-primary'],
      input: '',
      label: [
        error ? 'bg-danger' : 'bg-primary',
        'rounded-md',
        'text-white',
        'font-normal',
        'shadow-sm',
        'px-1',
        error
          ? 'peer-[:not(:read-only):placeholder-shown]:peer-focus:bg-danger'
          : 'peer-[:not(:read-only):placeholder-shown]:peer-focus:bg-primary',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:rounded-md',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:text-white',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:font-normal',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:shadow-sm',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:px-1',
        'peer-[:not(:read-only)]:peer-autofill:rounded-md',
        'peer-[:not(:read-only)]:peer-autofill:text-white',
        'peer-[:not(:read-only)]:peer-autofill:font-normal',
        'peer-[:not(:read-only)]:peer-autofill:shadow-sm',
        'peer-[:not(:read-only)]:peer-autofill:px-1',
        'peer-placeholder-shown:bg-transparent',
        'peer-placeholder-shown:text-gray-300',
        'peer-placeholder-shown:shadow-none',
        'peer-placeholder-shown:p-0'
      ]
    },
    secondary: {
      inputWrap: [],
      input: ['border', error ? 'border-danger/40 !bg-danger/5' : 'bg-zinc-100 border-gray-300'],
      label: [
        error ? 'bg-white border-danger/40' : 'bg-white',
        'rounded',
        'text-dark',
        'font-normal',
        'shadow-sm',
        'border',
        'px-1 pb-0.5',
        error
          ? 'peer-[:not(:placeholder-shown)]:!border-danger/40 peer-[:not(:read-only):placeholder-shown]:peer-focus:!border-danger/40'
          : 'border-gray-300',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:rounded',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:text-dark',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:font-normal',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:!shadow-sm',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:border-gray-300',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:bg-white',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:px-1',
        'peer-[:not(:read-only):placeholder-shown]:peer-focus:pb-0.5',
        'peer-[:not(:read-only)]:peer-autofill:rounded',
        'peer-[:not(:read-only)]:peer-autofill:text-dark',
        'peer-[:not(:read-only)]:peer-autofill:font-normal',
        'peer-[:not(:read-only)]:peer-autofill:!shadow-sm',
        'peer-[:not(:read-only)]:peer-autofill:border-gray-300',
        'peer-[:not(:read-only)]:peer-autofill:bg-white',
        'peer-[:not(:read-only)]:peer-autofill:px-1',
        'peer-[:not(:read-only)]:peer-autofill:pb-0.5',
        'peer-placeholder-shown:bg-transparent',
        'peer-placeholder-shown:text-dark/30',
        'peer-placeholder-shown:shadow-none',
        'peer-placeholder-shown:border-transparent',
        'peer-placeholder-shown:bg-transparent',
        'peer-placeholder-shown:p-0'
      ]
    }
  }
  return classes[theme]
}

export const inputRightPaddingClass = (...args) => {
  const iconsCount = args.filter(Boolean).length
  const paddingClasses = { 1: 'pr-[40px]', 2: 'pr-[70px]', 3: 'pr-[100px]', 4: 'pr-[130px]' }
  return paddingClasses[iconsCount] || ''
}
