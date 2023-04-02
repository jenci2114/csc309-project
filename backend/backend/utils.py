from datetime import datetime


def datetime_check(date: str) -> bool:
    """Check if a string is a valid date"""
    try:
        reconstruction = datetime.strptime(date, '%Y-%m-%d').strftime('%Y-%m-%d')
        return reconstruction == date
    except ValueError:
        return False
