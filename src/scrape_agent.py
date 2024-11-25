from requests import Session
from random import choice
from bs4 import BeautifulSoup
import lxml
import cchardet
from toml import load

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

def loadProxiesFromConfig():
    return CONFIG["Scraper"]["PROXIES"]

def loadUserAgentsFromConfig():
    return CONFIG["Scraper"]["USER_AGENTS"]

def loadTechnologiesFromConfig():
    return CONFIG["Offers"]["TECHNOLOGIES"]
    
def loadConfig(CONFIG_PATH: str):
    data = load(CONFIG_PATH)
    return data

CONFIG_PATH = "./config.toml"
CONFIG = loadConfig(CONFIG_PATH)
PROXIES = loadProxiesFromConfig()
USER_AGENTS = loadUserAgentsFromConfig()
TECHNOLOGIES = loadTechnologiesFromConfig()

