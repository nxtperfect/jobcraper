import { useState } from 'react'

type FiltersProps = {
  cities: Array<string> | undefined,
  companies: Array<string> | undefined,
  technologies: Array<string> | undefined,
  handleUpdatingFilters: (searchTitle: string, includedCities: Array<string>, includedCompanies: Array<string>, includedTechnologies: Array<string>) => void,
};

export default function Filters({ cities, companies, technologies, handleUpdatingFilters }: FiltersProps) {
  const [includedCities, setIncludedCities] = useState<Array<string>>([]);
  const [includedCompanies, setIncludedCompanies] = useState<Array<string>>([]);
  const [includedTechnologies, setIncludedTechnologies] = useState<Array<string>>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [searchTitle, setSearchTitle] = useState<string>("");

  function handleAddingIncludedCity(city: string) {
    if (includedCities.includes(city)) {
      setIncludedCities(prev => prev.filter((i) => i !== city));
      return;
    }
    setIncludedCities(prev => [...prev, city]);
  }

  function handleAddingIncludedCompany(company: string) {
    if (includedCompanies.includes(company)) {
      setIncludedCompanies(prev => prev.filter((i) => i !== company));
      return;
    }
    setIncludedCompanies(prev => [...prev, company]);
  }

  function handleAddingIncludedTechnologies(technology: string) {
    if (includedTechnologies.includes(technology)) {
      setIncludedTechnologies(prev => prev.filter((i) => i !== technology));
      return;
    }
    setIncludedTechnologies(prev => [...prev, technology]);
  }

  if (isCollapsed) {
    return (
      <div className="flex flex-col gap-4 items-center justify-items-center mb-6">
        <button className="bg-neutral-800 text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800 hover:bg-neutral-700 hover:text-neutral-300 rounded-md px-1 mt-4 mb-4" onClick={() => setIsCollapsed(!isCollapsed)}>Expand Filters {'>'}</button>
        <div className="bg-neutral-800 text-white rounded-md px-1 py-1">
          <input className="bg-neutral-800 focus:outline-none pl-2" type="text" name="search" placeholder="Search job title or city" onChange={(e) => setSearchTitle(e.target.value)} />
          <button className="h-full bg-neutral-700 hover:bg-neutral-500" type="button" onClick={() => handleUpdatingFilters(searchTitle, includedCities, includedCompanies, includedTechnologies)}>Search</button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-items-center mb-12">
      <button className="bg-neutral-800 text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800 hover:bg-neutral-700 hover:text-neutral-300 rounded-md px-1 mt-4 mb-4" onClick={() => setIsCollapsed(!isCollapsed)}>Collapse V</button>
      <div className="bg-neutral-800 text-white rounded-md px-1 py-1">
        <input className="bg-neutral-800 focus:outline-none pl-2" type="text" name="search" placeholder="Search job title or city" onChange={(e) => setSearchTitle(e.target.value)} />
        <button className="h-full bg-neutral-700 hover:bg-neutral-500" type="button" onClick={() => handleUpdatingFilters(searchTitle, includedCities, includedCompanies, includedTechnologies)}>Search</button>
      </div>
      <ul className="flex flex-row flex-wrap gap-4 items-center justify-items-center">
        Cities:
        {cities?.map((city) => {
          return (
            <li>
              <button className={`${includedCities.includes(city) ? "bg-blue-500 text-neutral-700 dark:bg-blue-700 dark:text-neutral-200 hover:bg-blue-600" : "bg-neutral-700 text-neutral-300 dark:bg-neutral-300 dark:text-neutral-700 hover:bg-neutral-500"} rounded-md px-2 py-1`} onClick={() => handleAddingIncludedCity(city)}>{city}</button>
            </li>
          )
        }) || "No cities found"}
      </ul>
      <ul className="flex flex-row flex-wrap gap-4 items-center justify-items-center">
        Companies:
        {companies?.map((company) => {
          return (
            <li>
              <button className={`${includedCompanies.includes(company) ? "bg-blue-500 text-neutral-700 dark:bg-blue-700 dark:text-neutral-200 hover:bg-blue-600" : "bg-neutral-700 text-neutral-300 dark:bg-neutral-300 dark:text-neutral-700 hover:bg-neutral-500"} rounded-md px-2 py-1`} onClick={() => handleAddingIncludedCompany(company)}>{company}</button>
            </li>
          )
        }) || "No companies found"}
      </ul>
      <ul className="flex flex-row flex-wrap gap-4 items-center justify-items-center">
        Technologies:
        {technologies?.map((technology) => {
          return (
            <li>
              <button className={`${includedTechnologies.includes(technology) ? "bg-blue-500 text-neutral-700 dark:bg-blue-700 dark:text-neutral-200 hover:bg-blue-600" : "bg-neutral-700 text-neutral-300 dark:bg-neutral-300 dark:text-neutral-700 hover:bg-neutral-500"} rounded-md px-2 py-1`} onClick={() => handleAddingIncludedTechnologies(technology)}>{technology}</button>
            </li>
          )

        })}
      </ul>
    </div>
  )
}

