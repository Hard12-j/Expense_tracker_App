from pydantic import BaseModel, Field
from typing import Optional

class Expense(BaseModel):
    amount: Optional[str] = Field(title="expense", description="The amount of the expense")
    merchant: Optional[str] = Field(title="merchant", description="The merchant or vendor associated with the expense")
    currency: Optional[str] = Field(title="currency", description="The currency in which the expense was made")