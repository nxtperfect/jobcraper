import { OfferType } from "../App";
import Offer from "./Offer"

type JobOffersProps = {
  offers: Array<OfferType>,
  debounce: () => void,
};

export default function JobOffers({ offers, debounce }: JobOffersProps) {

  return (
    <>
      <ul className={`flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6`}>
        {offers.map((offer: OfferType) => {
          return (
            <li>
              <Offer {...offer} debounce={debounce} />
            </li>
          )
        })}
      </ul>
    </>
  )
}
