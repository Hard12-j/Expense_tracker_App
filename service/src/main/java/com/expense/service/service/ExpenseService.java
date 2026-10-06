package com.expense.service.service;

import com.expense.service.dto.ExpenseDto;
import com.expense.service.entity.Expense;
import com.expense.service.repository.ExpenseRepository;
import lombok.AllArgsConstructor;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ExpenseService {
    private ExpenseRepository expenseRepository;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public boolean createExpense(ExpenseDto expenseDto) {
        setCurrency(expenseDto);
        try{
            expenseRepository.save(objectMapper.convertValue(expenseDto, Expense.class));
            return true;
        }catch(Exception e) {
            return false;
        }
    }

    public boolean updateExpense(ExpenseDto expenseDto) {
        Optional<Expense> expenseFoundOpt = expenseRepository.findByUserIdAndExternalId(expenseDto.getUserId(), expenseDto.getExternalId());
        if(expenseFoundOpt.isEmpty()){
            return false;
        }
        Expense expenseFound = expenseFoundOpt.get();
        expenseFound.setCurrency(Strings.isNotBlank(expenseDto.getCurrency())? expenseDto.getCurrency() : expenseFound.getCurrency());
        expenseFound.setMerchant(Strings.isNotBlank(expenseDto.getMerchant())? expenseDto.getMerchant() : expenseFound.getMerchant());
        expenseFound.setAmount(expenseDto.getAmount());
        expenseRepository.save(expenseFound);
        return true;
    }

    public List<ExpenseDto> getExpense(String userId){
        List<Expense> expenseList = expenseRepository.findByUserId(userId);
        return objectMapper.convertValue(expenseList, new TypeReference<List<ExpenseDto>>(){});
    }

    private void setCurrency(ExpenseDto expenseDto){
        if(Objects.isNull(expenseDto.getCurrency())){
            expenseDto.setCurrency("inr");
        }
    }
}
