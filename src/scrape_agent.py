from requests import Session
from random import choice
from bs4 import BeautifulSoup
import lxml

PROXIES = [
        "143.110.226.180:8888",
        "200.174.198.86:8888",
        "14.97.12.186:80",
        "176.9.239.181:80",
        "87.98.148.98:80",
        "51.210.54.186:80",
        "13.37.59.99:3128",
        "13.38.176.104:3128",
        "46.4.94.62:80",
        "85.215.64.49:80"
        ]

USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0"
        ]

def getRandomUserAgent():
    return choice(USER_AGENTS)

def getRandomProxy():
    return choice(PROXIES)

def setHeaders(userAgent: str):
    headers = {'User-Agent': userAgent}
    return headers

def setProxies(proxy: str):
    proxies = {'http': proxy}
    return proxies

def setSession(headers, proxies):
    print("Setting session...")
    session = Session()
    session.proxies.update(proxies)
    session.headers.update(headers)
    return session

def updateSessionUserAgentAndProxy(session):
    print("Updating to new session for next page...")
    session.proxies.update(setProxies(getRandomProxy()))
    session.headers.update(setHeaders(getRandomUserAgent()))
    return session

def fetchWebsite(session, url: str):
    response = session.get(url)
    return response

def returnBeautifulSoupedHTML(pageContent):
    parsed = BeautifulSoup(pageContent, 'lxml')
    return parsed
