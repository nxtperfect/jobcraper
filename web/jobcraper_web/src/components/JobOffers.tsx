import { OfferType } from "../App";
import Offer from "./Offer"

type JobOffersProps = {
  offers: Array<OfferType>,
  changeOfferStatus: (id: string, isApplied: boolean) => void,
};

export default function JobOffers({ offers, changeOfferStatus }: JobOffersProps) {

  function debounce(func: () => void, timeout = 2000) {
    let timer: NodeJS.Timeout;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

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
