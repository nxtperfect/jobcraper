import React, { useState } from 'react'

type CheckboxProps = {
  id: string,
  isApplied: string,
  onChange: (id: string, isApplied: boolean) => void
}

export default function Checkbox({ id, isApplied, onChange }: CheckboxProps) {
  const [isChecked, setIsChecked] = useState<boolean>(isApplied === "true");

  function handleChange() {
    setIsChecked(prev => {
      onChange(id, !prev);
      return !prev;
    });
  }

  return (
    <input className="self-center scale-150" type="checkbox" checked={isChecked} onChange={handleChange} />
  )
}
