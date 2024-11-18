interface OfferProps {
    title: string;
    company: string;
    city: string;
    description: string;
    link: string;
}

export default function Offer({ title, company, city, description, link }: OfferProps) {
    return (
        <>
            <article className="bg-neutral-800 text-neutral-100 p-4 rounded-lg">
                <header>
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <div className="flex flex-row gap-4 my-2" role="list" aria-label="Job details">
                        <span className="text-neutral-200" role="listitem">{company}</span>
                        <span className="text-neutral-200" role="listitem">{city}</span>
                    </div>
                </header>
                <p className="text-neutral-300 mb-4">{description}</p>
                <footer>
                    <a href={link} className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md shadow-md transition-colors duration-200 hover:bg-blue-500" aria-label="View job offer details">Check offer</a>
                </footer>
            </article>
        </>
    )
}