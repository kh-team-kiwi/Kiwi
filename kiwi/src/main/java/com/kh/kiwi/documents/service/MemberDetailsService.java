package com.kh.kiwi.documents.service;

import com.kh.kiwi.documents.entity.MemberDetails;
import com.kh.kiwi.documents.repository.MemberDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberDetailsService {

    @Autowired
    private MemberDetailsRepository repository;

    public MemberDetails save(MemberDetails memberDetails) {
        return repository.save(memberDetails);
    }

    public List<MemberDetails> getAll() {
        return repository.findAll();
    }

    public MemberDetails getById(String employeeNo) {
        return repository.findById(employeeNo).orElse(null);
    }

    public void delete(String employeeNo) {
        repository.deleteById(employeeNo);
    }
}