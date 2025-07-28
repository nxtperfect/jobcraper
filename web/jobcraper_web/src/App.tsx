import { useEffect, useState } from "react";
import JobOffers from "./components/JobOffers"
import Filters from "./components/Filters";
import Pagination from "./components/Pagination";
import LayoutToggle from "./components/LayoutToggle";

export type OfferType = {
  id: string;
  title: string;
  last_seen: string;
  by_company: string;
  city: string;
  technologies: string;
  additional_info?: string;
  link: string;
  matching: number;
  is_applied: string;
};

export type ActiveFilter = {
  title: string,
  companiesToInclude: Array<string> | undefined,
  citiesToInclude: Array<string> | undefined,
  technologiesToInclude: Array<string> | undefined,
};


export default function App() {
  const [offers, setOffers] = useState<Array<OfferType>>([]);
  const [filteredOffers, setFilteredOffers] = useState<Array<OfferType>>([]);
  const [cities, setCities] = useState<Array<string>>();
  const [companies, setCompanies] = useState<Array<string>>();
  const [technologies, setTechnologies] = useState<Array<string>>();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [offersPerPage, setOffersPerPage] = useState<number>(12);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter>({ title: "", companiesToInclude: [], citiesToInclude: [], technologiesToInclude: [] });

  useEffect(() => {
    fetch("http://localhost:8000/offers")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setOffers(data);
        setFilteredOffers(data);
      })
  }, []);

  useEffect(() => {
    setCities(() => Array.from(new Set(offers.map((offer) => offer.city))).sort());
    setCompanies(() => Array.from(new Set(offers.map((offer) => offer.by_company))).sort());
    setTechnologies(() => Array.from(new Set(offers.map((offer) => offer.technologies.split(",")).flat())).sort());
  }, [offers])

  function handleUpdatingFilters(searchTitle: string, includedCities: Array<string>, includedCompanies: Array<string>, includedTechnologies: Array<string>) {
    console.log("Handling filters...", activeFilters)
    setActiveFilters((activeFilters: ActiveFilter) => {
      if (!activeFilters) {
        return {
          title: searchTitle,
          citiesToInclude: includedCities,
          companiesToInclude: includedCompanies,
          technologiesToInclude: includedTechnologies,
        };
      }
      activeFilters.title = searchTitle;
      activeFilters.citiesToInclude = includedCities.length > 0 ? includedCities : cities;
      activeFilters.companiesToInclude = includedCompanies.length > 0 ? includedCompanies : companies;
      activeFilters.technologiesToInclude = includedTechnologies.length > 0 ? includedTechnologies : technologies;
      return activeFilters;
    }
    )
    setFilteredOffers(() => offers.filter((offer) => offer.title === activeFilters?.title && activeFilters?.companiesToInclude?.includes(offer.by_company) && activeFilters?.citiesToInclude?.includes(offer.city) && activeFilters?.technologiesToInclude?.includes(offer.technologies)))
  }

  function handleDebounceOfferStatus(id: string, isApplied: boolean) {
    const url = "http://localhost:8000/update/offers/is_applied";
    const data = { id: id, isApplied: isApplied };

    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then((response) => response.json())
      .then((data) => console.log(data));
  }


  return (
    <main className="bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      {process.env.REACT_APP_FEATURE_FLAG_DOOM_SCROLLING_LAYOUT === "true" ? <LayoutToggle /> : null}
      {process.env.REACT_APP_FEATURE_FLAG_FILTERS === "true" ? <Filters cities={cities} companies={companies} technologies={technologies} handleUpdatingFilters={handleUpdatingFilters} /> : null}
      <Pagination maxPages={Math.ceil(filteredOffers.length / offersPerPage)} pageIndex={pageIndex} setPageIndex={setPageIndex} offersPerPage={offersPerPage} setOffersPerPage={setOffersPerPage} />
      <JobOffers offers={filteredOffers.slice((pageIndex - 1) * offersPerPage, (pageIndex) * offersPerPage)} changeOfferStatus={handleDebounceOfferStatus} />
      <Pagination maxPages={Math.ceil(filteredOffers.length / offersPerPage)} pageIndex={pageIndex} setPageIndex={setPageIndex} offersPerPage={offersPerPage} setOffersPerPage={setOffersPerPage} />
    </main>
  )
}
