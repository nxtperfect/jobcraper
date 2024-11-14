from src.db import Database, Offer
from src.scrape_agent import fetchWebsite, getRandomProxy, getRandomUserAgent, returnBeautifulSoupedHTML, setHeaders, setProxies, setSession, updateSessionUserAgentAndProxy
from os import environ
from dotenv import load_dotenv 
from threading import Thread

load_dotenv()

ALL_OFFERS_LIST_DATA = "offers-list"
ALL_OFFERS_LIST_CLASS = "listing_ohw4t83" # div LISTING_CLASS = "tiles_cjkyq1p" # div
OFFER_CLASS = "tiles_cobg3mp" # div
OFFER_TITLE_CLASS = "tiles_b2gkets" # h2 data-test=offer-title
OFFER_DETAILS_CLASS = "tiles_b2gkets" # div data-test=section-company
OFFER_TYPE_OF_OFFER = "tiles_bfrsaoj" # ul - job details li - full time, part time etc data-test=offer-additional-info-{number}
OFFER_DATE_ADDED = "date-added" # p data-tets
OFFER_TECHNOLOGIES = "tiles_bcjb265" # div with spans - each span is technology data-test=technologies-list
PAGINATION_MAX_OFFER_NUMBER = "top-pagination-max-page-number" # span data-test=

class PracujOffer(Offer):
    def __init__(self, offer):
        super().__init__(offer)
        try:
            self.date_added = offer.find_next('p').get_text().split(': ')[1].strip()
            self.title = offer.find_next('h2').get_text().strip()
            self.by_company = offer.find_next(class_="tiles_c639tii").get_text().strip()
            self.city = offer.select('h4[data-test="text-region"]')[0].get_text().strip()
            self.additional_info = [x.get_text().strip() for x in offer.select('li[data-test^=offer-additional-info-]')]
            self.technologies = [x.get_text().strip() for x in offer.select('span[data-test="technologies-item"]')]
            self.link = offer.select('a[data-test="link-offer"]')[0]['href'].strip()
            self.calculateAndAssignHash()
        except Exception as e:
            print(f"Failed to add new offer {e}")

def runPracuj():
    db = Database()
    userAgent = getRandomUserAgent()
    proxies = setProxies(getRandomProxy())
    headers = setHeaders(userAgent)
    session = setSession(headers, proxies)

    try:
        MAX_OFFERS = int(getMaxOffers(session))
    except Exception as e:
        print(f"Failed to get max number of offers, returning {e}")
        return

    for i in range(1, MAX_OFFERS):
        Thread(target=insertNewOfferFromList,args=(session, db, i,)).start()
    # db.selectAllOffers()

def getMaxOffers(session):
    url = str(environ.get("PRACUJ_URL"))
    response = fetchWebsite(session, url)
    parsedResponse = returnBeautifulSoupedHTML(response.content)
    max_offers = parsedResponse.select(f'span[data-test={PAGINATION_MAX_OFFER_NUMBER}]')[0].get_text()
    return max_offers

def insertNewOfferFromList(session, db, i):
    session = updateSessionUserAgentAndProxy(session)
    url = str(environ.get("PRACUJ_URL")) + str(environ.get("PRACUJ_PAGINATION")) + str(i)
    try:
        response = fetchWebsite(session, url)
    except Exception as e:
        print(f"Couldn't fetch url {url} with session {session}", e)
        return
    parsedResponse = returnBeautifulSoupedHTML(response.content)
    offers = parsedResponse.find_all(class_=OFFER_CLASS)
    for i, offer in enumerate(offers[:-1]):
        newOffer = PracujOffer(offer)
        lastRow = db.insertNewOffer(newOffer)
        # print("Last inserted row:", lastRow)


if __name__ == "__main__":
    runPracuj()
