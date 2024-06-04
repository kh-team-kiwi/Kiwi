import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import '../../styles/components/common/TextEditor.css'


const TextEditor = () => {
  const quillModules = {
    toolbar: [
      
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <ReactQuill
      theme="snow" 
      modules={quillModules} 
      className="quill"
    />
  );
};

export default TextEditor;