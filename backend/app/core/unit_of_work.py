from types import TracebackType
from typing import Optional, Self, Type

from sqlmodel import Session

from app.core.database import session_factory


class UnitOfWork:
    session: Session

    def __enter__(self) -> Self:
        self.session = session_factory()
        self._init_repositories()
        return self

    def __exit__(
        self,
        exc_type: Optional[Type[BaseException]],
        exc: Optional[BaseException],
        tb: Optional[TracebackType],
    ) -> None:
        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        finally:
            self.session.close()

    def _init_repositories(self) -> None:
        pass
