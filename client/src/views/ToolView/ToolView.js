import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';

// Custom components
import { withToolData } from '../../components/ToolDataContext';

// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import Skeleton from '@material-ui/lab/Skeleton';

// Styled components
const RootContainer = styled.div`
  margin: 40px;
  margin-top: 120px;
`;

const ToolViewContainer = styled.div`
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ToolImage = styled.img`
  width: 100%;
  object-fit: cover;
`;

const KeywordContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  margin: 20px 0px;
  flex-wrap: wrap;
`;

const BackButtonContainer = styled.div`
  position: fixed;
  top: 40px;
  left: 40px;
`;

const ToolView = ({ toolData }) => {
  const [tool, setTool] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetch = async () => {
      if (id !== null) {
        const res = await toolData.fetchTool(id);
        setTool(res);
      }
    };
    fetch();
  }, []);

  const goBack = () => history.goBack();

  const deleteTool = async () => {
    setIsDeleting(true);
    await toolData.deleteTool(id);
    setIsDeleting(false);
    goBack();
  };

  const renderImage = () => {
    if (tool === null) {
      return (
        <Skeleton
          variant='rect'
          width='100%'
          height={500}
          style={{ marginBottom: 20 }}
        />
      );
    } else {
      const src = `data:image/jpg;base64, ${tool.image.toString('base64')}`;
      return <ToolImage src={src} style={{ marginBottom: 20 }} />;
    }
  };

  const renderKeywords = () => {
    let comp = <React.Fragment />;
    if (tool === null) {
      comp = <Skeleton variant='rect' width='100%' height={100} />;
    } else {
      comp = tool.keywords.map((word, index) => (
        <Chip
          key={index}
          label={word}
          style={{ margin: 5 }}
          color='secondary'
        />
      ));
    }
    return <KeywordContainer>{comp}</KeywordContainer>;
  };

  const renderDeleteButton = () => {
    if (isDeleting) {
      return <CircularProgress />;
    } else {
      return (
        <Button
          variant='text'
          color='secondary'
          startIcon={<DeleteRoundedIcon />}
          onClick={deleteTool}
        >
          Delete
        </Button>
      );
    }
  };

  return (
    <RootContainer>
      <BackButtonContainer>
        <IconButton onClick={goBack}>
          <ArrowBackRoundedIcon />
        </IconButton>
      </BackButtonContainer>
      <Fab color='primary' style={{ position: 'fixed', right: 20, bottom: 20 }}>
        <EditRoundedIcon />
      </Fab>

      <Container maxWidth='md'>
        <ToolViewContainer>
          {renderImage()}
          <Typography variant='h6'>Keywords</Typography>
          {renderKeywords()}
          {renderDeleteButton()}
        </ToolViewContainer>
      </Container>
    </RootContainer>
  );
};

export default withToolData(ToolView);
