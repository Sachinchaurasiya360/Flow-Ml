"""Create or refresh the demo student shown on the sign-in page.

Run from the ``server`` directory:
    python -m scripts.seed_demo_account
"""

from datetime import datetime, timezone
from pathlib import Path

from dotenv import dotenv_values
from passlib.context import CryptContext
from sqlalchemy import create_engine, text


DEMO_EMAIL = "demo@flowml.com"
DEMO_PASSWORD = "Demo@12345"
password_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


def get_database_url() -> str:
    """Read the server database URL without loading all application settings."""
    environment = dotenv_values(Path(__file__).resolve().parents[1] / ".env")
    database_url = environment.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not set in server/.env")
    return database_url


def seed_demo_account() -> None:
    """Ensure the sign-in page's demo credentials can authenticate."""
    engine = create_engine(get_database_url(), pool_pre_ping=True)
    try:
        now = datetime.now(timezone.utc)
        with engine.begin() as connection:
            connection.execute(
                text(
                    '''
                    INSERT INTO students (
                        "emailId", "fullName", password, role, "authProvider",
                        "isPremium", "isActive", "isEmailVerified",
                        "verificationOTP", "otpExpiresAt", xp, level,
                        "createdAt", "updatedAt"
                    ) VALUES (
                        :email, :full_name, :password, 'STUDENT', 'LOCAL',
                        false, true, true, NULL, NULL, 0, 1, :now, :now
                    )
                    ON CONFLICT ("emailId") DO UPDATE SET
                        password = EXCLUDED.password,
                        "authProvider" = 'LOCAL',
                        "googleId" = NULL,
                        "isActive" = true,
                        "isEmailVerified" = true,
                        "verificationOTP" = NULL,
                        "otpExpiresAt" = NULL,
                        "updatedAt" = EXCLUDED."updatedAt"
                    '''
                ),
                {
                    "email": DEMO_EMAIL,
                    "full_name": "Visual ML Demo",
                    "password": password_context.hash(DEMO_PASSWORD),
                    "now": now,
                },
            )
            demo_account = connection.execute(
                text(
                    '''
                    SELECT "isActive", "isEmailVerified", "authProvider", password
                    FROM students
                    WHERE "emailId" = :email
                    '''
                ),
                {"email": DEMO_EMAIL},
            ).mappings().one()

        password_is_valid = password_context.verify(
            DEMO_PASSWORD, demo_account["password"]
        )
        if not (
            demo_account["isActive"]
            and demo_account["isEmailVerified"]
            and demo_account["authProvider"] == "LOCAL"
            and password_is_valid
        ):
            raise RuntimeError("Demo account could not be verified after seeding")

        print(f"Demo account ready: {DEMO_EMAIL}")
    finally:
        engine.dispose()


if __name__ == "__main__":
    seed_demo_account()
