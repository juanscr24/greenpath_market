from fastapi import APIRouter
from pydantic import BaseModel
import requests

router = APIRouter()

class payments(BaseModel):
    name_customer:str
    phone_customer:str
    amount:str
    name_seller: str
    
class selle_phone(BaseModel):
    payments:payments
    phone_seller:str
    
@router.post("/send/payments")
async def sendpayment(send:selle_phone):
    
    url_whatsapp = ""
    
    data={
        "name_customer":send.payments.name_customer,
        "phone_customer":send.payments.phone_customer,
        "amount":send.payments.amount,
        "name_seller":send.payments.name_seller,
        "phone_seller":send.phone_seller
    }
    
    response = requests.post(url_whatsapp,json=data)
    
    if response.status_code == 200:
        return {"status": "ok", "message": "Pedido enviado a WhatsApp"}
    else:
        return {"status": "error", "message": "Fallo al enviar a n8n"}
    
    