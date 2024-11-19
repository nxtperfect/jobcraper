import Offer from "./Offer"

type OfferType = {
  title: string,
  by_company: string,
  city: string,
  technologies: string,
  link: string
};

export default function JobOffers({ offers }: any) {

  return (
    <>
      <ul className="grid grid-cols-5 gap-4 px-6">
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
