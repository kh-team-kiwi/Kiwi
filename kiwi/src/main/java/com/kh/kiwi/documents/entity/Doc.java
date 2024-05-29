package documents.entity;

@Entity
public class Doc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long docNum;
    private String creComEmpNum;
    private String docTitle;
    private LocalDate docDate;
    private String docSecurity;
    private String docType;

    // 생성자, getter, setter 등은 생략
}