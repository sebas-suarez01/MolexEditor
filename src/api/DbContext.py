import sqlite3

from utils import DB_PATH


class DbContext:
    def __init__(self):
        self.db_path = DB_PATH

    def create_table(self):
        connection = sqlite3.connect(self.db_path)

        cursor = connection.cursor()

        return cursor