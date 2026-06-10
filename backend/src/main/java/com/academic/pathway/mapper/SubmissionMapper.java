package com.academic.pathway.mapper;

import com.academic.pathway.dto.SubmissionRequest;
import com.academic.pathway.dto.SubmissionResponse;
import com.academic.pathway.entity.Submission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SubmissionMapper {
    SubmissionMapper INSTANCE = Mappers.getMapper(SubmissionMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "recommendation", ignore = true)
    @Mapping(target = "reason", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Submission requestToEntity(SubmissionRequest request);

    SubmissionResponse entityToResponse(Submission entity);

    List<SubmissionResponse> entitiesToResponses(List<Submission> entities);
}
