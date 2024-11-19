import React, { useState } from 'react'

type FiltersProps = {
  cities: Array<string> | undefined,
  companies: Array<string> | undefined,
  technologies: Array<string> | undefined,
};

export default function Filters({ cities, companies, technologies }: FiltersProps) {
  const [includedCities, setIncludedCities] = useState<Array<string>>([]);
  const [includedCompanies, setIncludedCompanies] = useState<Array<string>>([]);
  const [includedTechnologies, setIncludedTechnologies] = useState<Array<string>>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  function handleAddingIncludedCity(city: string) {
    if (includedCities.includes(city)) {
      setIncludedCities(prev => prev.filter((i) => i !== city));
    }
    setIncludedCities(prev => { prev.push(city); return prev; });
  }

  function handleAddingIncludedCompany(company: string) {
    if (includedCompanies.includes(company)) {
      setIncludedCompanies(prev => prev.filter((i) => i !== company));
    }
    setIncludedCompanies(prev => { prev.push(company); return prev; });
  }

  function handleAddingIncludedTechnologies(technology: string) {
    if (includedTechnologies.includes(technology)) {
      setIncludedTechnologies(prev => prev.filter((i) => i !== technology));
    }
    setIncludedTechnologies(prev => { prev.push(technology); return prev; });
  }

  if (isCollapsed) {
    return (
      <div className="flex flex-col gap-4 items-center justify-items-center mb-6">
        <button className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-neutral-300 rounded-md px-1 mt-4 mb-4" onClick={() => setIsCollapsed(!isCollapsed)}>Expand Filters {'>'}</button>
        <div className="bg-neutral-800 text-white rounded-md px-1 py-1">
          <input className="bg-neutral-800 focus:outline-none pl-2" type="text" name="search" placeholder="Search job title or city" />
          <button className="h-full bg-neutral-700 hover:bg-neutral-500" type="button" onClick={() => console.log("Searching...")}>Search</button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-items-center mb-12">
      <button className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-neutral-300 rounded-md px-1 mt-4 mb-4" onClick={() => setIsCollapsed(!isCollapsed)}>Collapse V</button>
      <div className="bg-neutral-800 text-white rounded-md px-1 py-1">
        <input className="bg-neutral-800 focus:outline-none pl-2" type="text" name="search" placeholder="Search job title or city" />
        <button className="h-full bg-neutral-700 hover:bg-neutral-500" type="button" onClick={() => console.log("Searching...")}>Search</button>
      </div>
      <ul className="flex flex-row flex-wrap gap-4 items-center justify-items-center">
        Cities:
        {cities?.map((city) => {
          if (includedCities.includes(city)) {
            return (
              <li>
                <button className="bg-neutral-700 text-white hover:bg-neutral-500 rounded-md px-2 py-1" onClick={() => handleAddingIncludedCity(city)}>{city}</button>
              </li>
            )
          }
          return (
            <li>
              <button className="bg-neutral-300 hover:bg-neutral-500 hover:text-white rounded-md px-2 py-1" onClick={() => handleAddingIncludedCity(city)}>{city}</button>
            </li>
          )
        }) || "No cities found"}
      </ul>
      <ul className="flex flex-row flex-wrap gap-4 items-center justify-items-center">
        Companies:
        {companies?.map((company) => {
          return (
            <li>
              <button onClick={() => handleAddingIncludedCompany(company)}>{company}</button>
            </li>
          )
        }) || "No companies found"}
      </ul>
      <ul className="flex flex-row flex-wrap gap-4 items-center justify-items-center">
        Technologies:
        {technologies?.map((technology) => {
          return (
            <li>
              <button onClick={() => handleAddingIncludedTechnologies(technology)}>{technology}</button>
            </li>
          )

        })}
      </ul>
    </div>
  )
}

