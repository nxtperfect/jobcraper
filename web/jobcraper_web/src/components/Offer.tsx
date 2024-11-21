interface OfferProps {
  title: string;
  by_company: string;
  city: string;
  technologies: string;
  additional_info?: string;
  link: string;
}

export default function Offer({ title, by_company, city, technologies, additional_info, link }: OfferProps) {

  function openInNewTab(url: string) {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  }

  function onClickUrl(url: string) {
    return () => openInNewTab(url)
  }

  return (
    <>
      <article className="flex flex-col min-h-[600px] bg-neutral-800 text-neutral-100 p-4 justify-items-end rounded-lg h-full px-4 text-pretty">
        <header className="leading-10">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <div className="flex flex-row gap-4 my-2" role="list" aria-label="Job details">
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
        <footer>
          <a onClick={onClickUrl(link)} className="inline-block px-4 py-2 bg-cyan-600 text-white rounded-md shadow-md hover:bg-blue-500 cursor-pointer" aria-label="View job offer details in new tab">Open in new tab</a>
        </footer>
      </article>
    </>
  )
}
