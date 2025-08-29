# Import required dependencies for FastAPI, Pydantic models, and HTTP requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

# Initialize API router for payment endpoints
router = APIRouter()

# Payment data model for customer and transaction details
class Payments(BaseModel):
    name_customer: str  # Customer's full name
    phone_customer: str  # Customer's phone number
    amount: float  # Transaction amount (better as number type)
    name_seller: str  # Seller's name

# Request model that includes payment data and seller phone
class SellerPhone(BaseModel):
    payments: Payments  # Payment details object
    phone_seller: str  # Seller's phone number

# POST endpoint to send payment notifications via WhatsApp
@router.post("/send/payments")
async def send_payment(send: SellerPhone):
    # External WhatsApp webhook URL for payment notifications
    url_whatsapp = "https://camiloparra.app.n8n.cloud/webhook-test/payments"

    # Construct the request payload for n8n webhook
    data = {
        "name_customer": send.payments.name_customer,
        "phone_customer": send.payments.phone_customer,
        "amount": send.payments.amount,
        "name_seller": send.payments.name_seller,
        "phone_seller": send.phone_seller
    }

    try:
        # Send asynchronous HTTP POST request to n8n webhook
        async with httpx.AsyncClient() as client:
            response = await client.post(url_whatsapp, json=data)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            return {
                "status": "ok",
                "message": "Payment request sent to WhatsApp",
                "response": response.json()  # Return the full n8n response
            }
        else:
            # Raise exception for non-200 responses from n8n
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Error from n8n service: {response.text}"
            )
    except httpx.RequestError as e:
        # Handle connection errors to external service
        raise HTTPException(
            status_code=500,
            detail=f"Could not connect to n8n service: {str(e)}"
        )
