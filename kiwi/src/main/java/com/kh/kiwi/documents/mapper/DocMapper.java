package com.kh.kiwi.documents.mapper;

import com.kh.kiwi.documents.dto.DocDto;
import com.kh.kiwi.documents.dto.DocListDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface DocMapper {
    @Select("SELECT * FROM DOC")
    List<DocListDto> selectAllList();

    @Select("SELECT * FROM DOC WHERE CRE_COM_EMP_NUM = #{creComEmpNum}")
    List<DocDto> selectByUser(String creComEmpNum);
}
