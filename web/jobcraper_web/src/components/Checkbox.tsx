import React, { useState } from 'react'

type CheckboxProps = {
  id: string,
  isApplied: boolean,
  onChange: (id: string, isApplied: boolean) => void
}

export default function Checkbox({ id, isApplied, onChange }: CheckboxProps) {
  const [isChecked, setIsChecked] = useState<boolean>(isApplied);

  function handleChange() {
    console.log("Handling change");
    setIsChecked(prev => !prev);
    onChange(id, isChecked);
  }

  return (
    <input className="self-center scale-150" type="checkbox" checked={isChecked} onChange={handleChange} />
  )
}
