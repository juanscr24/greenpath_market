# Instrucciones para Probar el Login sin JWT

## Opción 1: Versión Simplificada sin JWT

Si prefieres una versión más simple sin autenticación JWT, puedes modificar el endpoint de login así:

### Backend (`backend/api/login.py`):
```python
# Cambiar el endpoint POST a:
@router.post("/", response_model=dict)
async def login_user(user_login: UserLogin, db: Session = Depends(get_db)):
    try:
        user = get_user_by_email(db, email=user_login.email)
        if not user:
            raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
        
        if not verify_password(user_login.password, user.user_password):
            raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
        
        return {
            "message": "Login exitoso",
            "user_id": user.id_user,
            "user_name": user.full_name,
            "email": user.email,
            "role_id": user.id_rol
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
```

### Frontend (`frontend/src/assets/js/login.js`):
Mantener los cambios ya realizados (POST en lugar de GET).

## Opción 2: Probar con Usuario Existente

Para probar con un usuario real de la base de datos:

1. **Ver usuarios existentes:**
```bash
cd backend && python -c "
from db.database import SessionLocal
from crud.user_crud import get_users
db = SessionLocal()
users = get_users(db)
for user in users:
    print(f'ID: {user.id_user}, Email: {user.email}, Nombre: {user.full_name}')
"
```

2. **Probar login con curl:**
```bash
curl -X POST http://127.0.0.1:8000/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario_existente@ejemplo.com", "password": "contraseña_real"}'
```

## Opción 3: Crear Usuario de Prueba

Si no hay usuarios, crear uno:

1. **Ejecutar script de creación:**
```bash
cd backend && python -c "
from db.database import SessionLocal
from crud.user_crud import create_user, get_user_by_email
from schemas.user_schemas import UserCreate
from datetime import date

db = SessionLocal()

# Verificar si ya existe
if not get_user_by_email(db, 'test@example.com'):
    user_data = UserCreate(
        full_name='Usuario Test',
        birthdate=date(1990, 1, 1),
        email='test@example.com',
        phone='123456789',
        id_document_type=1,
        document_number='12345678',
        user_password='testpassword',
        id_rol=1,
        user_address='Calle Test 123'
    )
    create_user(db, user_data)
    print('Usuario de prueba creado')
else:
    print('Usuario ya existe')
"
```

2. **Probar login:**
```bash
curl -X POST http://127.0.0.1:8000/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpassword"}'
```

## Solución de Problemas Comunes

- **Error 401:** Credenciales incorrectas
- **Error 500:** Problema de conexión a base de datos
- **CORS:** Asegurar que el frontend tenga permisos para hacer POST

¿Qué opción prefieres implementar?
