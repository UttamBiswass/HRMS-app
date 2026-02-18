"""
Employee database model
"""
from sqlalchemy import Column, String, Integer
from ..database import Base


class Employee(Base):
    """Employee database model"""
    
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)
    
    def __repr__(self):
        return f"<Employee(id={self.id}, employee_id={self.employee_id}, name={self.full_name})>"
