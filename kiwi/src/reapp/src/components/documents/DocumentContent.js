import React from 'react';

const DocumentContent = ({ document }) => {
    return (
        <div className="documentContent">
            <h3>문서 내용</h3>
            <div dangerouslySetInnerHTML={{ __html: document.docContents }} />
            {document.attachment && (
                <div className="attachments">
                    <h4>첨부 파일</h4>
                    <a href={document.attachment.url} download>
                        {document.attachment.name}
                    </a>
                </div>
            )}
        </div>
    );
};

export default DocumentContent;
