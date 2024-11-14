from src.db import Database, Offer
from src.scrape_agent import fetchWebsite, getRandomProxy, getRandomUserAgent, returnBeautifulSoupedHTML, setHeaders, setProxies, setSession
from os import environ
from threading import Thread

ALL_OFFERS_CLASS = "virtuoso-item-list" # data-test-id
OFFER_CLASS = "data-item-index" # name of attribute
TITLE_CLASS = "css-1gehlh0" # h3
ADDITIONAL_INFORMATION_CLASS = "css-paoypy" # div
TECHNOLOGIES_LIST_CLASS = "css-vzlxkq" # div
TECHNOLOGY_CLASS = "skill-tag-" # div skill-tag-{number}

class JustJoinOffer(Offer):
    def __init__(self, offer):
        super().__init__(offer)
        try:
            self.date_added = "01-01-1990"
            self.title = offer.find_next('h3').get_text().strip()
            additional_info = offer.find_next(class_=ADDITIONAL_INFORMATION_CLASS)

            self.by_company = additional_info[0].get_text().strip()
            self.city = additional_info[1].get_text().strip()
            self.additional_info = [x.get_text().strip() for x in additional_info[2:]]
            self.technologies = [x.find_next('div').find_next('div').get_text().strip() for x in offer.select(f'div[class^="{TECHNOLOGY_CLASS}"]')]
            self.link = offer.find_next('a')[0]['href'].strip()
            self.calculateAndAssignHash()
        except Exception as e:
            print(f"Failed to add new offer {e}")

def runJustJoin():
    db = Database()
    userAgent = getRandomUserAgent()
    proxies = setProxies(getRandomProxy())
    headers = setHeaders(userAgent)
    session = setSession(headers, proxies)

    url = str(environ.get("JUSTJOIN_URL"))
    response = fetchWebsite(session, url)
    parsedResponse = returnBeautifulSoupedHTML(response.content)
    offers = parsedResponse.select(f"div[{OFFER_CLASS}]")

    for offer in offers:
        Thread(target=insertNewOfferFromList,args=(offer, db,)).start()
    # db.selectAllOffers()

def insertNewOfferFromList(offer, db):
    newOffer = JustJoinOffer(offer)
    lastRow = db.insertNewOffer(newOffer)
    # print("Last inserted row:", lastRow)

if __name__ == "__main__":
    runJustJoin()
