from sqlmodel import Session, select

from app.core.database import create_all_tables, engine
from app.core.security import hash_password
from app.modules.categorias.models import Categoria
from app.modules.pedidos import models as _pedidos  # noqa: F401
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario

CATEGORIAS = {
    "Hamburguesas": "Hamburguesas de carne y vegetarianas",
    "Pizzas": "Pizzas al horno de piedra",
    "Bebidas": "Gaseosas, aguas y cervezas",
    "Postres": "Dulces caseros",
}

# (nombre, descripcion, precio, stock, categoria)
PRODUCTOS = [
    ("Hamburguesa clásica", "Carne, lechuga, tomate y cheddar", 8500, 30, "Hamburguesas"),
    ("Hamburguesa doble queso", "Doble carne y doble cheddar", 10500, 25, "Hamburguesas"),
    ("Hamburguesa veggie", "Medallón de lentejas y vegetales", 9000, 20, "Hamburguesas"),
    ("Pizza muzzarella", "Salsa de tomate y muzzarella", 9500, 20, "Pizzas"),
    ("Pizza napolitana", "Muzzarella, tomate fresco y ajo", 11000, 20, "Pizzas"),
    ("Pizza fugazzeta", "Cebolla y muzzarella", 10500, 15, "Pizzas"),
    ("Coca-Cola 500 ml", "Gaseosa cola", 2500, 60, "Bebidas"),
    ("Agua mineral 500 ml", "Sin gas", 1800, 60, "Bebidas"),
    ("Cerveza artesanal", "Rubia, 473 ml", 4200, 40, "Bebidas"),
    ("Flan casero", "Con dulce de leche y crema", 3500, 25, "Postres"),
    ("Brownie", "Chocolate y nueces", 3800, 25, "Postres"),
    ("Tiramisú", "Receta clásica italiana", 4500, 15, "Postres"),
]


def imagen(nombre: str) -> str:
    return "https://placehold.co/400x300?text=" + nombre.replace(" ", "+")


def run() -> None:
    create_all_tables()
    with Session(engine) as session:
        if session.exec(select(Usuario).where(Usuario.username == "admin")).first() is None:
            session.add(
                Usuario(
                    username="admin",
                    full_name="Administrador",
                    email="admin@foodstore.com",
                    hashed_password=hash_password("Admin1234!"),
                    role="admin",
                )
            )

        categorias: dict[str, Categoria] = {}
        for nombre, descripcion in CATEGORIAS.items():
            categoria = session.exec(select(Categoria).where(Categoria.nombre == nombre)).first()
            if categoria is None:
                categoria = Categoria(nombre=nombre, descripcion=descripcion)
                session.add(categoria)
            categorias[nombre] = categoria
        session.flush()

        for nombre, descripcion, precio, stock, categoria in PRODUCTOS:
            existe = session.exec(select(Producto).where(Producto.nombre == nombre)).first()
            if existe is None:
                categoria_id = categorias[categoria].id
                assert categoria_id is not None
                session.add(
                    Producto(
                        nombre=nombre,
                        descripcion=descripcion,
                        precio_base=precio,
                        imagen_url=imagen(nombre),
                        stock=stock,
                        categoria_id=categoria_id,
                    )
                )
        session.commit()
    print("Seed completado: admin / Admin1234!")


if __name__ == "__main__":
    run()
