import { OfferType } from "../App";

type OfferProps = 
  OfferType &
{ debounce: () => void
}

export default function Offer({hashId, title, last_seen, by_company, city, technologies, additional_info, link, matching, is_applied, debounce }: OfferProps) {

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
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return day + "-" + month + "-" + year;
  }

  function isWorthApplying(matching: number) {
    return matching >= 50;
  }

  return (
    <>
      <article key={hashId} className={`${isStaleOffer(last_seen) ? "opacity-25 cursor-not-allowed" : ""} flex flex-col min-h-[600px] bg-neutral-800 text-neutral-200 p-4 rounded-lg h-full px-4 text-pretty`}>
        <header className="leading-10">
          <div className="flex flex-row justify-between">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <input className="self-center scale-150 cursor-not-allowed" type="checkbox" value={is_applied} onClick={debounce} disabled />
          </div>
          <span className="tracking-wide text-sm">Last seen: {last_seen}</span>
          <div className="flex flex-row gap-4 mb-2" role="list" aria-label="Job details">
            <span className="text-neutral-200" role="listitem">🏛️ {by_company}</span>
            <span className="text-neutral-200" role="listitem">📍 {city}</span>
          </div>
        </header>
        <div className="flex-grow">
          <span className="text-neutral-300 mb-4">Additional information: <ul className="list-disc list-inside">{additional_info?.split(",").map((info) => <li>{info.trim()}</li>) || <p className="bg-neutral-300 text-neutral-700 rounded-md w-fit px-1">No information</p>}</ul></span>
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
