import { useEffect, useMemo, useState } from "react";
import JobOffers from "./components/JobOffers"
import Filters from "./components/Filters";
import Pagination from "./components/Pagination";

type OfferType = {
  title: string,
  by_company: string,
  city: string,
  technologies: string,
  link: string
};

function App() {
  const [offers, setOffers] = useState<Array<OfferType>>([]);
  const [cities, setCities] = useState<Array<string>>();
  const [companies, setCompanies] = useState<Array<string>>();
  const [technologies, setTechnologies] = useState<Array<string>>();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [offersPerPage, setOffersPerPage] = useState<number>(10);
  const gridColumns = useMemo(() => {
    Math.floor(window.innerWidth / 300);
  }, [window.innerWidth]);

  useEffect(() => {
    fetch("http://localhost:8000/offers")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setOffers(data);
      })
  }, []);

  useEffect(() => {
    setCities(() => Array.from(new Set(offers.map((offer) => offer.city))).sort());
    setCompanies(() => Array.from(new Set(offers.map((offer) => offer.by_company))).sort());
    setTechnologies(() => Array.from(new Set(offers.map((offer) => offer.technologies.split(",")).flat())).sort());
  }, [offers])

  return (
    <>
      <Filters cities={cities} companies={companies} technologies={technologies} />
      <Pagination maxPages={Math.floor(offers.length / offersPerPage)} pageIndex={pageIndex} setPageIndex={setPageIndex} offersPerPage={offersPerPage} setOffersPerPage={setOffersPerPage} />
      <JobOffers offers={offers.slice((pageIndex - 1) * offersPerPage, (pageIndex) * offersPerPage)} />
      <Pagination maxPages={Math.floor(offers.length / offersPerPage)} pageIndex={pageIndex} setPageIndex={setPageIndex} offersPerPage={offersPerPage} setOffersPerPage={setOffersPerPage} />
    </>
  )
}

export default App
