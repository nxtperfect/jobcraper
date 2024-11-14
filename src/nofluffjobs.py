from src.db import Database, Offer
from src.scrape_agent import fetchWebsite, getRandomProxy, getRandomUserAgent, returnBeautifulSoupedHTML, setHeaders, setProxies, setSession
from os import environ

ALL_OFFERS_CLASS = "list-container" # div
TECHNOLOGIES_LIST_CLASS = "tiles-container" # div

class NoFluffJobsOffer(Offer):
    def __init__(self, offer):
        super().__init__(offer)
        try:
            self.date_added = "01-01-1990"
            self.title = offer.find_next('h3').get_text().replace('NOWA', '').strip()
            additional_info = offer.find_next('footer')

            self.by_company = additional_info.find('h4').get_text().strip()
            self.city = additional_info.find_next('span').get_text().strip()
            self.additional_info = []
            self.technologies = [x.find_next('span').get_text().strip() for x in offer.select(f'div[class^="{TECHNOLOGIES_LIST_CLASS}"]')]
            self.link = offer['href'].strip()
            self.calculateAndAssignHash()
        except Exception as e:
            print(f"Failed to add new offer {e}")

def runNoFluffJobs():
    db = Database()
    userAgent = getRandomUserAgent()
    proxies = setProxies(getRandomProxy())
    headers = setHeaders(userAgent)
    session = setSession(headers, proxies)

    url = str(environ.get("NOFLUFFJOBS_URL"))
    response = fetchWebsite(session, url)
    parsedResponse = returnBeautifulSoupedHTML(response.content)
    twoOffersLists = parsedResponse.select(f'div[class^="{ALL_OFFERS_CLASS}"]')
    offers = [y for x in twoOffersLists for y in x.find_all_next('a')]

    for offer in offers:
        newOffer = NoFluffJobsOffer(offer)
        # print("New offer title:", newOffer.title)
        print("Last inserted row:", db.insertNewOffer(newOffer))
    # db.selectAllOffers()

if __name__ == "__main__":
    runNoFluffJobs()
