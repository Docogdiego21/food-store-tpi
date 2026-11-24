from datetime import datetime
from typing import Optional, Sequence

from sqlalchemy.orm import selectinload
from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import DetallePedido, Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Pedido)

    def add_detalle(self, detalle: DetallePedido) -> DetallePedido:
        self.session.add(detalle)
        self.session.flush()
        return detalle

    def refresh(self, pedido: Pedido) -> None:
        self.session.refresh(pedido)

    def _listar(
        self, usuario_id: Optional[int], estado: Optional[str], skip: int, limit: int
    ) -> tuple[int, Sequence[Pedido]]:
        stmt = select(Pedido)
        if usuario_id is not None:
            stmt = stmt.where(Pedido.usuario_id == usuario_id)
        if estado is not None:
            stmt = stmt.where(Pedido.estado == estado)
        total = self.session.exec(select(func.count()).select_from(stmt.subquery())).one()
        items = self.session.exec(
            stmt.options(selectinload(Pedido.items))  # type: ignore[arg-type]
            .order_by(col(Pedido.created_at).desc(), col(Pedido.id).desc())
            .offset(skip)
            .limit(limit)
        ).all()
        return total, items

    def list_by_usuario(
        self, usuario_id: int, estado: Optional[str], skip: int, limit: int
    ) -> tuple[int, Sequence[Pedido]]:
        return self._listar(usuario_id, estado, skip, limit)

    def list_all(
        self, estado: Optional[str], skip: int, limit: int
    ) -> tuple[int, Sequence[Pedido]]:
        return self._listar(None, estado, skip, limit)

    def count_by_estado(self) -> dict[str, int]:
        filas = self.session.exec(select(Pedido.estado, func.count()).group_by(Pedido.estado)).all()
        return {estado: cantidad for estado, cantidad in filas}

    def count_desde(self, desde: datetime) -> int:
        stmt = select(func.count()).select_from(Pedido).where(Pedido.created_at >= desde)
        return self.session.exec(stmt).one()

    def sum_total_por_estado(self, estado: str) -> float:
        stmt = select(func.coalesce(func.sum(Pedido.total), 0.0)).where(Pedido.estado == estado)
        return float(self.session.exec(stmt).one())
