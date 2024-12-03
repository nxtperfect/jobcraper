import { useEffect, useState } from "react";
import JobOffers from "./components/JobOffers"
import Filters from "./components/Filters";
import Pagination from "./components/Pagination";

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
  is_applied: number;
};

export type ActiveFilter = {
  title: string,
  companiesToInclude: Array<string>,
  citiesToInclude: Array<string>,
  technologiesToInclude: Array<string>,
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
  const [offersForStatusChange, setOffersForStatusChange] = useState<Array<{ id: string, isApplied: boolean }>>([]);

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
      activeFilters.citiesToInclude = includedCities;
      activeFilters.companiesToInclude = includedCompanies;
      activeFilters.technologiesToInclude = includedTechnologies;
      return activeFilters;
    }
    )
    console.log("Updating filters...", activeFilters)
    setFilteredOffers(() => offers.filter((offer) => offer.title === activeFilters?.title && activeFilters?.companiesToInclude.includes(offer.by_company) && activeFilters?.citiesToInclude.includes(offer.city) && activeFilters?.technologiesToInclude.includes(offer.technologies)))
  }

  function debounce(func: () => void, timeout = 3000) {
    let timer: NodeJS.Timeout;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  function changeOfferStatus(id: string, isApplied: boolean) {
    console.log("Editing offer", id, isApplied);
    if (offersForStatusChange.some(offer => { return offer.id === id })) {
      setOffersForStatusChange(cur => cur.filter((offer) => offer.id !== id));
      return;
    }
    setOffersForStatusChange(cur => [...cur, { id, isApplied }]);
    console.log(offersForStatusChange);
  }

  async function handleDebounceOfferStatus(id: string, isApplied: boolean) {
    console.log("Handling debounce fr");
    changeOfferStatus(id, isApplied);
    // send post request
    await fetch("http://localhost:8000/update_offers", {
      method: "POST",
      body: JSON.stringify({ offers: offersForStatusChange }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    setOffersForStatusChange([]);
  }


  return (
    <main className="bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      {process.env.REACT_APP_FEATURE_FLAG_FILTERS === "true" ? <Filters cities={cities} companies={companies} technologies={technologies} handleUpdatingFilters={handleUpdatingFilters} /> : null}
      <Pagination maxPages={Math.ceil(filteredOffers.length / offersPerPage)} pageIndex={pageIndex} setPageIndex={setPageIndex} offersPerPage={offersPerPage} setOffersPerPage={setOffersPerPage} />
      {
        // <JobOffers offers={filteredOffers.slice((pageIndex - 1) * offersPerPage, (pageIndex) * offersPerPage)} changeOfferStatus={changeOfferStatus} />
      }
      <JobOffers offers={filteredOffers.slice((pageIndex - 1) * offersPerPage, (pageIndex) * offersPerPage)} changeOfferStatus={(id, isApplied) => debounce(await handleDebounceOfferStatus(id, isApplied))} />
      <Pagination maxPages={Math.ceil(filteredOffers.length / offersPerPage)} pageIndex={pageIndex} setPageIndex={setPageIndex} offersPerPage={offersPerPage} setOffersPerPage={setOffersPerPage} />
    </main>
  )
}
