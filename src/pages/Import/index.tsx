import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer, Error } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [fileError, setFileError] = useState('');
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();
    const { file, name } = uploadedFiles[0];

    if (!uploadedFiles.length) {
      return;
    }

    data.append('file', file, name);
    try {
      await api.post('/transactions/import', data);

      history.goBack();
    } catch (err) {
      // console.log(err.response.error);
      if (!err.response) {
        setFileError('Não foi possível fazer o upload no servidor');
      } else {
        setFileError(err.response.error);
      }
    }
  }

  function submitFile(files: File[]): void {
    setFileError('');
    const uploadFiles: FileProps[] = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles(uploadFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && !fileError && (
            <FileList files={uploadedFiles} />
          )}
          {fileError && <Error>fileError</Error>}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
