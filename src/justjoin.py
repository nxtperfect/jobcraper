from time import localtime, strftime
from src.db import Database, Offer
from src.scrape_agent import (
    fetchWebsite,
    getCurrentTime,
    getRandomProxy,
    getRandomUserAgent,
    returnBeautifulSoupedHTML,
    setHeaders,
    setProxies,
    setSession,
)
from os import environ
from threading import Thread

ALL_OFFERS_CLASS = "virtuoso-item-list"  # data-test-id
OFFER_CLASS = "data-index"  # name of attribute
TITLE_CLASS = "css-1gehlh0"  # h3
ADDITIONAL_INFORMATION_CLASS = "mui-paoypy"  # div
TECHNOLOGIES_LIST_CLASS = "css-vzlxkq"  # div
TECHNOLOGY_CLASS = "skill-tag-"  # div skill-tag-{number}


class JustJoinOffer(Offer):
    def __init__(self, offer):
        super().__init__(offer)
        try:
            self.last_seen = getCurrentTime()
            self.title = offer.find_next("h3").get_text().strip()
            additional_info = [
                x
                for x in offer.select_one(f".{ADDITIONAL_INFORMATION_CLASS}")
                if not x.get_text().strip().startswith(".")
            ]
            self.by_company = additional_info[0].get_text().strip()
            self.city = additional_info[1].get_text().strip()
            self.technologies = [
                x.get_text().strip()
                for x in offer.select(f'div[class^="{TECHNOLOGY_CLASS}"]')
            ]
            self.link = "https://justjoin.it" + offer.find_next("a")["href"].strip()
            self.calculateAndAssignHash()
        except Exception as e:
            print(f"Failed to add new offer. {e}")


def runJustJoin():
    db = Database()
    userAgent = getRandomUserAgent()
    proxies = setProxies(getRandomProxy())
    headers = setHeaders(userAgent)
    session = setSession(headers, proxies)

    url = str(environ.get("JUSTJOIN_URL"))
    response = fetchWebsite(session, url)
    parsedResponse = returnBeautifulSoupedHTML(response)
    offers = parsedResponse.select(f"li[{OFFER_CLASS}]")

    Thread(
        target=insertNewOffersFromList,
        args=(
            offers,
            db,
        ),
    ).start()


def insertNewOffersFromList(offers, db):
    offersList: list[JustJoinOffer] = [0] * len(offers)
    print(f"OFFERS {offers}")
    for i, offer in enumerate(offers):
        newOffer = JustJoinOffer(offer)
        if not newOffer:
            print("Empty offer")
            continue
        offersList[i] = newOffer
        print(f"Inserted new offer {newOffer}")
    multipleLastRow = db.insertMultipleOffers(offersList)


if __name__ == "__main__":
    runJustJoin()
