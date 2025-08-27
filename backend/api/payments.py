from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

router = APIRouter()

# Modelo del pago
class Payments(BaseModel):
    name_customer: str
    phone_customer: str
    amount: float  # mejor como número
    name_seller: str

# Modelo del request que llega al endpoint
class SellerPhone(BaseModel):
    payments: Payments
    phone_seller: str

@router.post("/send/payments")
async def send_payment(send: SellerPhone):
    url_whatsapp = "https://camiloparra.app.n8n.cloud/webhook-test/payments"

    # Armamos el body que va pa' n8n
    data = {
        "name_customer": send.payments.name_customer,
        "phone_customer": send.payments.phone_customer,
        "amount": send.payments.amount,
        "name_seller": send.payments.name_seller,
        "phone_seller": send.phone_seller
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url_whatsapp, json=data)

        # Verificamos respuesta
        if response.status_code == 200:
            return {
                "status": "ok",
                "message": "Pedido enviado a WhatsApp",
                "response": response.json()  # devolvemos lo que responde n8n
            }
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Error en n8n: {response.text}"
            )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=500,
            detail=f"No se pudo conectar con n8n: {str(e)}"
        )
