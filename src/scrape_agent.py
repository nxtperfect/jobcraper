from collections.abc import MutableMapping
from time import localtime, strftime
from requests import Session
from random import choice
from bs4 import BeautifulSoup
import lxml
import cchardet
from toml import load
import nest_asyncio  # This is needed to use sync API in repl
from playwright.sync_api import sync_playwright


def getRandomUserAgent():
    return choice(USER_AGENTS)


def getRandomProxy() -> str:
    return choice(PROXIES)


def setHeaders(userAgent: str):
    headers = {"User-Agent": userAgent}
    return headers


def setProxies(proxy: str):
    proxies = {"http": proxy}
    return proxies


def setSession(headers: MutableMapping[str, str | bytes], proxies):
    print("Setting session...")
    session = Session()
    session.proxies.update(proxies)
    session.headers.update(headers)
    return session


def updateSessionUserAgentAndProxy(session: Session):
    print("Updating to new session for next page...")
    session.proxies.update(setProxies(getRandomProxy()))
    session.headers.update(setHeaders(getRandomUserAgent()))
    return session


def fetchWebsite(session: Session, url: str):
    with sync_playwright() as p:
        nest_asyncio.apply()
        chrome = p.chromium.launch(headless=True)
        context = chrome.new_context(
            user_agent=session.headers.get("USER_AGENT"),
            proxy={"server": session.proxies.get("http")},
            viewport={"width": 1920, "height": 1080},
            java_script_enabled=True,
        )
        page = chrome.new_page()
        page.goto(url)
        page.wait_for_timeout(2000)
        content = page.content()
        return content
    # response = session.get(url)
    # return response


def returnBeautifulSoupedHTML(pageContent: str):
    parsed = BeautifulSoup(pageContent, "lxml")
    return parsed


def loadProxiesFromConfig() -> list[str]:
    return CONFIG["Scraper"]["PROXIES"]


def loadUserAgentsFromConfig() -> list[str]:
    return CONFIG["Scraper"]["USER_AGENTS"]


def loadTechnologiesFromConfig() -> list[str]:
    return CONFIG["Offers"]["TECHNOLOGIES"]


def loadConfig(CONFIG_PATH: str):
    data = load(CONFIG_PATH)
    return data


def getCurrentTime():
    return strftime("%Y-%m-%d", localtime())


CONFIG_PATH = "./config.toml"
CONFIG: dict[str, list[str]] = loadConfig(CONFIG_PATH)
PROXIES: list[str] = loadProxiesFromConfig()
USER_AGENTS: list[str] = loadUserAgentsFromConfig()
TECHNOLOGIES: list[str] = loadTechnologiesFromConfig()
