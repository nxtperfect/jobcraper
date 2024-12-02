import React, { useState } from 'react'

type CheckboxProps = {
  onChange?: (isApplied) => void | null
  // isChecked: boolean
}

export default function Checkbox({ onChange }: CheckboxProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  function handleChange() {
    setIsChecked(prev => !prev);
    if (onChange !== null) {
      onChange(isChecked);
    }
  }

  return (
    <input className="self-center scale-150" type="checkbox" checked={isChecked} onChange={handleChange} />
  )
}
