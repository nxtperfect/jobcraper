from src.bulldogjob import runBulldogJob
from src.justjoin import runJustJoin
from src.nofluffjobs import runNoFluffJobs
from src.pracuj import runPracuj


if __name__ == "__main__":
    print("Running pracuj...")
    runPracuj()
    print("Running JustJoin...")
    runJustJoin()
    print("Running NoFluffJobs...")
    runNoFluffJobs()
    print("Running Bulldog...")
    runBulldogJob()
