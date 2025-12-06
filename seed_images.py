"""
Script para pre-cargar (sembrar) la base de datos de imágenes.
Ejecutar desde la raíz con: pipenv run python seed_images.py
"""
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from app import app
from api.models import db, ImagenProducto

# --- LISTA DE REGALOS ---
COMMON_GIFTS = {
    "nintendo switch oled": "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=500",
    "playstation 5 slim": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=500"
}

def seed_images():
    print("🌱 Iniciando siembra inteligente de imágenes...")
    
    with app.app_context():
        count = 0
        for term, url in COMMON_GIFTS.items():
            # Limpiamos término
            clean_term = term.lower().strip()
            
            # AÑADIMOS " producto"
            term_for_db = f"{clean_term} producto"
            
            # Verificamos si ya existe
            existing = db.session.execute(
                db.select(ImagenProducto).where(ImagenProducto.termino_busqueda == term_for_db)
            ).scalar_one_or_none()
            
            if not existing:
                new_img = ImagenProducto(termino_busqueda=term_for_db, img_url=url)
                db.session.add(new_img)
                count += 1
                print(f"   + Añadido: '{term_for_db}'")
            else:
                print(f"   . Ya existe: '{term_for_db}'")
        
        try:
            db.session.commit()
            print(f"\n✅ Proceso terminado. Se añadieron {count} imágenes optimizadas.")
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Error al guardar en base de datos: {e}")

if __name__ == '__main__':
    seed_images()