import { OfferType } from "../App";
import Offer from "./Offer"

type JobOffersProps = {
  offers: Array<OfferType>,
  changeOfferStatus: (id: string, isApplied: boolean) => void,
};

export default function JobOffers({ offers, changeOfferStatus }: JobOffersProps) {

  return (
    <>
      <ul className={`flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6`}>
        {offers.map((offer: OfferType) => {
          return (
            <li key={offer.id}>
              <Offer {...offer} changeOfferStatus={changeOfferStatus} />
            </li>
          )
        })}
      </ul>
    </>
  )
}
