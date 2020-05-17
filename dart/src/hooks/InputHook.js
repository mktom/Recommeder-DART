import { useState } from 'react'

// An Input Hoop to update string values when DOM state changes
export const useInput = initialValue => {
  const [value, setValue] = useState(initialValue)

  return {
    value, setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: event => {
        setValue(event.target.value)
      }
    }
  }
}
