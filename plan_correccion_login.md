# Plan de Corrección del Endpoint de Login

## Problemas Identificados

1. **Método HTTP incorrecto**: El endpoint actual usa GET para autenticación, lo cual es inseguro
2. **Parámetros incorrectos**: El frontend envía `user_password` pero el backend espera `password`
3. **Formato de respuesta incompatible**: Frontend espera array pero backend devuelve dict
4. **Falta de autenticación JWT**: No se generan tokens para sesiones seguras
5. **Contraseñas en URL**: Las credenciales se envían en la query string (inseguro)

## Cambios Propuestos

### Backend (`backend/api/login.py`)

1. Cambiar de método GET a POST
2. Usar el schema UserLogin correctamente con request body
3. Implementar generación de tokens JWT
4. Actualizar formato de respuesta
5. Mejorar manejo de errores

### Frontend (`frontend/src/assets/js/login.js`)

1. Cambiar de axios.get() a axios.post()
2. Corregir nombres de parámetros
3. Manejar almacenamiento de token JWT
4. Actualizar manejo de respuesta

### Archivos Dependientes

1. **`backend/middleware/auth.py`**: Añadir soporte para JWT (si no existe)
2. **`backend/schemas/user_schemas.py`**: Añadir schemas para tokens
3. **`backend/config/config.py`**: Configurar secret key para JWT

## Implementación Detallada

### Backend Changes:
```python
# Cambiar de:
@router.get("/", response_model=dict)
async def login_user(user_login: UserLogin, db: Session = Depends(get_db)):

# A:
@router.post("/", response_model=dict)
async def login_user(user_login: UserLogin, db: Session = Depends(get_db)):
    # Implementar JWT token generation
```

### Frontend Changes:
```javascript
// Cambiar de:
const { data } = await axios.get(
    `${endpointLogin}?email=${email}&user_password=${password}`
);

// A:
const { data } = await axios.post(endpointLogin, {
    email: email,
    password: password
});
```

## Próximos Pasos

1. Implementar cambios en backend
2. Actualizar frontend para coincidir con nuevo endpoint
3. Añadir middleware de autenticación JWT
4. Probar funcionalidad completa
5. Verificar seguridad de contraseñas

## Beneficios de la Corrección

- ✅ Autenticación segura con POST + HTTPS
- ✅ Tokens JWT para sesiones seguras
- ✅ Eliminación de contraseñas en URLs
- ✅ Mejor manejo de errores
- ✅ Compatibilidad frontend-backend
