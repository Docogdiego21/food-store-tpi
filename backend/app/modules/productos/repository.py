from typing import Optional, Sequence

from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def get_by_id(self, id: int, for_update: bool = False) -> Optional[Producto]:
        stmt = select(Producto).where(Producto.id == id)
        if for_update:
            stmt = stmt.with_for_update()
        return self.session.exec(stmt).first()

    def search(
        self,
        search: Optional[str],
        categoria_id: Optional[int],
        disponible: Optional[bool],
        skip: int,
        limit: int,
    ) -> tuple[int, Sequence[Producto]]:
        stmt = select(Producto).where(col(Producto.activo).is_(True))
        if search:
            stmt = stmt.where(col(Producto.nombre).ilike(f"%{search}%"))
        if categoria_id is not None:
            stmt = stmt.where(Producto.categoria_id == categoria_id)
        if disponible is not None:
            stmt = stmt.where(Producto.disponible == disponible)
        total = self.session.exec(select(func.count()).select_from(stmt.subquery())).one()
        items = self.session.exec(stmt.order_by(Producto.id).offset(skip).limit(limit)).all()
        return total, items
