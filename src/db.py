import sqlite3
from os import environ
from typing import LiteralString
from dotenv import load_dotenv 
import hashlib

load_dotenv()

class Offer:
    def __init__(self, offer) -> None:
        self.hashId: str = ""
        self.title: str = ""
        self.date_added: str = ""
        self.by_company: str = ""
        self.city: str = ""
        self.additional_info: list = []
        self.technologies: list = []
        self.link: str = ""

    def calculateAndAssignHash(self) -> None:
        hash_str = ' '.join([self.title, self.by_company, self.city, self.date_added])
        md5 = hashlib.md5()
        md5.update(bytes(hash_str, encoding="utf-8"))
        self.hashId = str(md5.hexdigest())

    def formatToDatabase(self) -> tuple[str, str, str, str, str, LiteralString, LiteralString, str]:
        return (self.hashId, self.title, self.date_added, self.by_company, self.city, ','.join(self.additional_info), ','.join(self.technologies), self.link)

CREATE_TABLE_STATEMENT = """
                        CREATE TABLE IF NOT EXISTS offers (
                            id text PRIMARY KEY, 
                            title text NOT NULL, 
                            date_added DATE, 
                            by_company text,
                            city text,
                            additional_info text,
                            technologies text NOT NULL,
                            link text NOT NULL
                        );"""

class Database:
    def connect(self):
        self.conn = sqlite3.connect(str(environ.get("DATABASE_PATH")))
    def __init__(self):
        print(environ.get("DATABASE_PATH"))
        self.connect()
        try:
            with self.conn:
                print("Connected")
                # self.removeTable()
                cursor = self.conn.cursor()
                cursor.execute(CREATE_TABLE_STATEMENT)
                self.conn.commit()
                print("Table created successfully")
        except Exception as e:
            print(f"Failed to create database {e}")

    def insertNewOffer(self, offer: Offer):
        print(f"Inserting new offer with hash {offer.hashId}")
        insert_statement = "INSERT INTO offers VALUES(?, ?, ?, ?, ?, ?, ?, ?);"
        self.connect()
        try:
            with self.conn:
                cursor = self.conn.cursor()
                cursor.execute(insert_statement, offer.formatToDatabase())
                self.conn.commit()
                print("Finished inserting.")
            return cursor.lastrowid
        except Exception as e:
            print(f"Failed to insert new offer {e}")
            return -1

    def removeTable(self):
        self.connect()
        drop_statement = "DROP TABLE IF EXISTS offers;"
        try:
            with self.conn:
                print("Deleting table...")
                cursor = self.conn.cursor()
                cursor.execute(drop_statement)
                self.conn.commit()
                print("Successfully deleted table.")
        except Exception as e:
            print(f"Failed to delete table {e}")

    def selectAllOffers(self):
        self.connect()
        select_statement = "SELECT * FROM offers;"
        try:
            with self.conn:
                print("Selecting all offers...")
                cursor = self.conn.cursor()
                cursor.execute(select_statement)
                rows = cursor.fetchall()
                self.conn.commit()
                print("Successfully selected rows.")
                for row in rows:
                    print(row)
                print("Total number of rows:", len(rows))
        except Exception as e:
            print(f"Failed to delete table {e}")
