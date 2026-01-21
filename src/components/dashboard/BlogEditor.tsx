'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Box } from '@mui/material';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div style={{ height: '300px', background: '#f8fafc', borderRadius: '8px' }} />
});

interface BlogEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function BlogEditor({ value, onChange, placeholder }: BlogEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'clean']
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'color', 'background',
    'link'
  ];

  return (
    <Box sx={{ 
      '& .ql-container': { 
        minHeight: '300px', 
        fontSize: '1rem',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
      },
      '& .ql-toolbar': {
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        background: '#f8fafc',
      }
    }}>
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Write your story here...'}
      />
    </Box>
  );
}
