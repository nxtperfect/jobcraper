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

ALL_OFFERS_CLASS = "list-container"  # div
TECHNOLOGIES_LIST_CLASS = "posting-tag"  # div


class NoFluffJobsOffer(Offer):
    def __init__(self, offer):
        super().__init__(offer)
        try:
            self.last_seen = getCurrentTime()
            if not offer.find_next("h3"):
                raise Exception("Couldn't find title.")
            self.title = offer.find_next("h3").get_text().replace("NOWA", "").strip()
            additional_info = offer.find_next("footer")

            self.by_company = additional_info.find("h4").get_text().strip()
            self.city = additional_info.find_next("span").get_text().strip()
            self.additional_info = []
            self.technologies = [
                x.get_text().strip()
                for x in offer.select(f'span[class^="{TECHNOLOGIES_LIST_CLASS}"]')
            ]
            self.link = "https://nofluffjobs.com" + offer["href"].strip()
            self.calculateAndAssignHash()
        except Exception as e:
            print(f"Failed to add new offer. {e}")


def runNoFluffJobs():
    db = Database()
    userAgent = getRandomUserAgent()
    proxies = setProxies(getRandomProxy())
    headers = setHeaders(userAgent)
    session = setSession(headers, proxies)

    url = str(environ.get("NOFLUFFJOBS_URL"))
    response = fetchWebsite(session, url)
    parsedResponse = returnBeautifulSoupedHTML(response)
    twoOffersLists = parsedResponse.select(f'div[class^="{ALL_OFFERS_CLASS}"]')
    offers = [
        y for x in twoOffersLists for y in x.find_all_next("a") if y.find_next("h3")
    ]

    Thread(
        target=insertNewOffersFromList,
        args=(
            offers,
            db,
        ),
    ).start()


def insertNewOffersFromList(offers, db):
    offersList = []
    for offer in offers:
        newOffer = NoFluffJobsOffer(offer)
        if not newOffer:
            continue
        offersList.append(newOffer)
    multipleLastRow = db.insertMultipleOffers(offersList)


if __name__ == "__main__":
    runNoFluffJobs()
