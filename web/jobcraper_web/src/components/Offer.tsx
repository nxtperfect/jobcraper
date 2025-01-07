import { OfferType } from "../App";
import Checkbox from "./Checkbox";

type OfferProps =
  OfferType &
  {
    changeOfferStatus: (id: string, isApplied: boolean) => void
  }

export default function Offer({ id, title, last_seen, by_company, city, technologies, additional_info, link, matching, is_applied, changeOfferStatus }: OfferProps) {

  function openInNewTab(url: string) {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  }

  function onClickUrl(url: string) {
    return () => openInNewTab(url)
  }

  function isStaleOffer(last_seen: string) {
    return last_seen !== getTodaysDate();
  }

  function getTodaysDate() {
    const date = new Date();
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear();
    if (Number.parseInt(day) < 10) day = "0" + day;
    if (Number.parseInt(month) < 10) month = "0" + month;
    console.log(year, month, day);
    return `${year}-${month}-${day}`;
  }

  function isWorthApplying(matching: number) {
    return matching >= 50;
  }

  return (
    <>
      <article key={id} className={`${isStaleOffer(last_seen) ? "opacity-25 cursor-not-allowed " : ""}flex flex-col min-h-[600px] bg-neutral-800 text-neutral-200 p-4 rounded-lg h-full px-4 text-pretty`}>
        <header className="leading-10">
          <div className="flex flex-row justify-between">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <Checkbox id={id} isApplied={is_applied} onChange={changeOfferStatus} />
          </div>
          <span className="tracking-wide text-sm">Last seen: {last_seen}</span>
          <div className="flex flex-row gap-4 mb-2" role="list" aria-label="Job details">
            <span className="text-neutral-200" role="listitem">🏛️ {by_company}</span>
            <span className="text-neutral-200" role="listitem">📍 {city}</span>
          </div>
        </header>
        <div className="flex-grow">
          <span className="text-neutral-300 mb-4">Additional information: <ul className="list-disc list-inside">{additional_info !== null && additional_info.length > 0 ? additional_info?.split(",").map((info) => <li>{info.trim()}</li>) : <p className="bg-neutral-300 text-neutral-700 rounded-md w-fit px-1">No information</p>}</ul></span>
          <span className="text-neutral-300 mt-6 flex flex-row flex-wrap gap-2">Technologies: {
            technologies.length > 1 ? technologies.split(",").map((tech) => <p className="bg-neutral-300 text-neutral-700 rounded-md px-1">{tech}</p>) : <p className="bg-neutral-300 text-neutral-700 rounded-md px-1">No information</p>
          }</span>
        </div>
        <footer className="flex flex-row items-center gap-4">
          <a onClick={onClickUrl(link)} className={`${isWorthApplying(matching) ? "animate-pulse" : ""} inline-block px-4 py-2 bg-cyan-600 text-white rounded-md shadow-md hover:bg-blue-500 cursor-pointer`} aria-label="View job offer details in new tab">Open in new tab</a>
          <span className={`${isWorthApplying(matching) ? "bg-green-600" : ""} flex px-1 h-full items-center rounded-md`} >Matches your known technologies in: {matching.toFixed(2)}%</span>
        </footer>
      </article>
    </>
  )
}
