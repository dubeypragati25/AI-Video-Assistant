from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.sql import func

from backend.app.database.connection import Base


class Meeting(Base):
    __tablename__ = "meetings"

    meeting_id = Column(String, primary_key=True, index=True)

    source = Column(Text, nullable=False)

    language = Column(String, nullable=False)

    title = Column(String, nullable=False)

    transcript = Column(Text, nullable=False)

    summary = Column(Text, nullable=False)

    action_items = Column(Text, nullable=False)

    key_decisions = Column(Text, nullable=False)

    open_questions = Column(Text, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )