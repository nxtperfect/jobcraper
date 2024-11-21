import Offer from "./Offer"

type OfferType = {
  title: string,
  by_company: string,
  city: string,
  technologies: string,
  link: string
};

type JobOffersProps = {
  offers: Array<OfferType>,
};

export default function JobOffers({ offers }: JobOffersProps) {

  return (
    <>
      <ul className={`flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6`}>
        {offers.map((offer: OfferType) => {
          return (
            <li>
              <Offer {...offer} />
            </li>
          )
        })}
      </ul>
    </>
  )
}
